'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatusTimeline from '@/components/StatusTimeline';
import FeedbackForm from '@/components/FeedbackForm';
import BookingComments from '@/components/BookingComments';
import { getBookingByPhone, getBookingByJobId, subscribeToBooking } from '@/lib/bookingService';
import Link from 'next/link';

const STATUS_BADGE = {
  'Pending':             'badge-pending',
  'Technician Assigned': 'badge-assigned',
  'Work in Progress':    'badge-progress',
  'Completed':           'badge-completed',
};

const STATUS_ICON = {
  'Pending':             '📋',
  'Technician Assigned': '👨‍🔧',
  'Work in Progress':    '🔧',
  'Completed':           '✅',
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const [searchType, setSearchType] = useState('jobId');
  const [query, setQuery] = useState(searchParams.get('job') || '');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [realtime, setRealtime] = useState(null);
  const [searched, setSearched] = useState(false);

  // Auto-search if job param is present
  useEffect(() => {
    if (searchParams.get('job')) {
      handleSearch(null, searchParams.get('job'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time listener when a booking is selected
  useEffect(() => {
    if (!selected) return;
    const unsub = subscribeToBooking(selected.jobId, (updated) => {
      setRealtime(updated);
    });
    return () => unsub();
  }, [selected?.jobId]);

  const activeBooking = realtime || selected;

  const handleSearch = async (e, overrideQuery) => {
    if (e) e.preventDefault();
    const q = overrideQuery ?? query;
    if (!q.trim()) { setError('Please enter a Job ID or phone number.'); return; }
    setLoading(true);
    setError('');
    setSelected(null);
    setRealtime(null);
    setSearched(true);
    try {
      let data;
      if (searchType === 'jobId' || overrideQuery) {
        const single = await getBookingByJobId(q.trim().toUpperCase());
        data = single ? [single] : [];
      } else {
        data = await getBookingByPhone(q.trim());
      }
      setResults(data);
      if (data.length === 1) setSelected(data[0]);
      if (data.length === 0) setError('No bookings found. Please check the details.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-hero">
        <div className="container dash-hero__inner">
          <div className="anim-fade-up">
            <h1 style={{ color: 'white' }}>Track Your <span style={{ opacity: 0.85 }}>Booking</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>
              Enter your Tracking ID or phone number to get instant updates.
            </p>
          </div>
        </div>
      </div>

      <div className="container dash-body">
        {/* Search Card */}
        <div className="search-card anim-fade-up">
          <div className="search-tabs">
            <button
              id="tab-jobid"
              className={`tab-btn${searchType === 'jobId' ? ' active' : ''}`}
              onClick={() => { setSearchType('jobId'); setQuery(''); setError(''); }}
            >
              🔍 Tracking ID
            </button>
            <button
              id="tab-phone"
              className={`tab-btn${searchType === 'phone' ? ' active' : ''}`}
              onClick={() => { setSearchType('phone'); setQuery(''); setError(''); }}
            >
              📞 Phone Number
            </button>
          </div>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrap">
              <input
                id="search-query"
                type={searchType === 'phone' ? 'tel' : 'text'}
                className="form-input search-input"
                placeholder={searchType === 'jobId' ? 'Enter Tracking ID, e.g. JOB-XY1234-ABCD' : 'Enter 10-digit phone number'}
                value={query}
                onChange={e => { setQuery(e.target.value); setError(''); }}
                maxLength={searchType === 'phone' ? 10 : 30}
              />
              <button id="track-booking" type="submit" className="btn btn-primary search-btn" disabled={loading}>
                {loading ? <span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Track →'}
              </button>
            </div>
            {error && <p className="form-error" style={{ marginTop: 8 }}>⚠️ {error}</p>}
          </form>
        </div>

        {/* Multiple Results (phone search) */}
        {results.length > 1 && !selected && (
          <div className="results-list anim-fade-up">
            <h3 style={{ marginBottom: 16 }}>Found {results.length} bookings</h3>
            {results.map((b) => (
              <button
                key={b.jobId}
                className="result-item"
                onClick={() => setSelected(b)}
                id={`select-booking-${b.jobId}`}
              >
                <div>
                  <strong>{b.jobId}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: 12 }}>
                    {b.appliance === 'AC' ? '❄️' : '🧊'} {b.appliance}
                  </span>
                </div>
                <span className={`badge ${STATUS_BADGE[b.status]}`}>{b.status}</span>
              </button>
            ))}
          </div>
        )}

        {/* Booking Detail */}
        {activeBooking && (
          <div className="booking-detail anim-fade-up">
            {/* Header */}
            <div className="booking-header">
              <div className="booking-header__left">
                <div className="booking-appliance">
                  <span className="appliance-emoji">
                    {activeBooking.appliance === 'AC' ? '❄️' : '🧊'}
                  </span>
                  <div>
                    <div className="appliance-name">{activeBooking.appliance} Repair</div>
                    <div className="job-id-text">{activeBooking.jobId}</div>
                  </div>
                </div>
              </div>
              <div className="booking-header__right">
                <span className={`badge ${STATUS_BADGE[activeBooking.status]}`} style={{ padding: '8px 16px' }}>
                  {STATUS_ICON[activeBooking.status]} {activeBooking.status}
                </span>
                <div className="realtime-indicator">
                  <span className="rt-dot" />
                  Live Updates
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="info-grid">
              <div className="info-item">
                <span className="info-key">Customer</span>
                <span className="info-val">{activeBooking.name}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Phone</span>
                <span className="info-val">{activeBooking.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Address</span>
                <span className="info-val">{activeBooking.address}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Service Charge</span>
                <span className="info-val price-val">₹{activeBooking.price}</span>
              </div>
              <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                <span className="info-key">Issue</span>
                <span className="info-val">{activeBooking.issue}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-section">
              <h3 className="section-title">Service Progress</h3>
              <StatusTimeline status={activeBooking.status} />
            </div>

            {/* Status History */}
            {activeBooking.statusHistory?.length > 0 && (
              <div className="history-section">
                <h3 className="section-title">Status History</h3>
                <div className="history-list">
                  {activeBooking.statusHistory.map((h, i) => (
                    <div key={i} className="history-item">
                      <div className="history-dot" />
                      <div className="history-content">
                        <strong>{h.status}</strong>
                        <span>{new Date(h.timestamp).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="comments-section">
              <h3 className="section-title">💬 Messages</h3>
              <BookingComments booking={activeBooking} />
            </div>

            {/* Feedback */}
            {activeBooking.status === 'Completed' && (
              <div className="feedback-section anim-fade-in">
                <h3 className="section-title">⭐ Your Feedback</h3>
                <FeedbackForm booking={activeBooking} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="sheet-link-row">
              <button
                className="btn btn-outline"
                id="search-again"
                onClick={() => { setSelected(null); setRealtime(null); setResults([]); setSearched(false); setQuery(''); }}
              >
                🔍 Search Again
              </button>
            </div>
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <div className="empty-state anim-fade-up">
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <h3>No bookings found</h3>
            <p>Please check your Tracking ID or phone number and try again.</p>
            <Link href="/booking" className="btn btn-primary">Book a Service</Link>
          </div>
        )}
      </div>
      <Footer />

      <style jsx>{`
        .dash-page { min-height: 100vh; background: var(--bg-soft); }
        .dash-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          padding: 120px 0 64px;
          text-align: center;
        }
        .dash-body {
          max-width: 760px;
          padding-top: 40px;
          padding-bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Search */
        .search-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 32px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border);
        }
        .search-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
        .tab-btn {
          padding: 10px 20px;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          background: var(--bg-soft);
          color: var(--text-muted);
          border: 2px solid transparent;
          transition: var(--transition);
        }
        .tab-btn.active { background: var(--primary-ultra-light); color: var(--primary); border-color: var(--primary); }
        .search-form {}
        .search-input-wrap { display: flex; gap: 12px; }
        .search-input { flex: 1; }
        .search-btn { white-space: nowrap; flex-shrink: 0; }

        /* Results */
        .results-list {
          background: white;
          border-radius: var(--radius-xl);
          padding: 28px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border);
        }
        .result-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: var(--bg-soft);
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          margin-bottom: 10px;
          cursor: pointer;
          transition: var(--transition);
        }
        .result-item:hover { border-color: var(--primary); background: var(--primary-ultra-light); }

        /* Booking Detail */
        .booking-detail {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border);
        }
        .booking-header {
          padding: 24px 28px;
          background: var(--bg-soft);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .booking-appliance { display: flex; align-items: center; gap: 16px; }
        .appliance-emoji { font-size: 2.5rem; }
        .appliance-name { font-size: 1.2rem; font-weight: 700; }
        .job-id-text { font-family: monospace; font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }
        .booking-header__right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .realtime-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #059669;
        }
        .rt-dot {
          width: 8px; height: 8px;
          background: #10B981;
          border-radius: 50%;
          animation: pulse 1.5s ease infinite;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          padding: 0 28px;
        }
        .info-item {
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .info-key { font-size: 0.78rem; font-weight: 600; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; }
        .info-val { font-size: 0.95rem; font-weight: 600; }
        .price-val { font-size: 1.3rem; font-weight: 800; color: var(--primary); }

        .section-title { font-size: 1rem; font-weight: 700; margin-bottom: 20px; }
        .timeline-section { padding: 28px; border-bottom: 1px solid var(--border); }
        .history-section { padding: 28px; border-bottom: 1px solid var(--border); }
        .comments-section { padding: 28px; border-bottom: 1px solid var(--border); }
        .feedback-section { padding: 28px; border-bottom: 1px solid var(--border); background: var(--bg-soft); }

        .history-list { display: flex; flex-direction: column; gap: 0; }
        .history-item { display: flex; align-items: flex-start; gap: 12px; position: relative; padding-bottom: 16px; }
        .history-item:last-child { padding-bottom: 0; }
        .history-item:not(:last-child) .history-dot::after {
          content: '';
          position: absolute;
          top: 10px; left: 4px;
          width: 2px; height: 100%;
          background: var(--border);
        }
        .history-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
          margin-top: 5px;
          position: relative;
        }
        .history-content { display: flex; flex-direction: column; gap: 2px; }
        .history-content strong { font-size: 0.9rem; color: var(--text); }
        .history-content span  { font-size: 0.78rem; color: var(--text-light); }

        .sheet-link-row {
          padding: 20px 28px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        .empty-state {
          background: white;
          border-radius: var(--radius-xl);
          padding: 60px 28px;
          text-align: center;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .empty-state h3 { font-size: 1.3rem; }
        .empty-state p  { color: var(--text-muted); }

        @media (max-width: 600px) {
          .info-grid { grid-template-columns: 1fr; }
          .booking-header { flex-direction: column; align-items: flex-start; }
          .booking-header__right { align-items: flex-start; }
          .search-input-wrap { flex-direction: column; }
          .search-btn { width: 100%; justify-content: center; }
          .sheet-link-row { justify-content: center; }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{display:'flex',justifyContent:'center',padding:'200px 0'}}><span className="loader" /></div>}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
