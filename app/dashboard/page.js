'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatusTimeline from '@/components/StatusTimeline';
import FeedbackForm from '@/components/FeedbackForm';
import BookingComments from '@/components/BookingComments';
import { getBookingByPhone, getBookingByJobId, subscribeToBooking } from '@/lib/bookingService';
import { downloadJobSheetPDF } from '@/lib/pdfGenerator';
import Link from 'next/link';

const STATUS_BADGE = {
  'Pending':             'badge-pending',
  'Technician Assigned': 'badge-assigned',
  'On the Way':          'badge-progress',
  'Reached Location':    'badge-progress',
  'Work in Progress':    'badge-progress',
  'Completed':           'badge-completed',
};

const STATUS_ICON = {
  'Pending':             '📋',
  'Technician Assigned': '👨‍🔧',
  'On the Way':          '🛵',
  'Reached Location':    '📍',
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

  const downloadedRef = useRef(new Set());

  // Real-time listener when a booking is selected
  useEffect(() => {
    if (!selected) return;
    const unsub = subscribeToBooking(selected.jobId, (updated) => {
      setRealtime(updated);
      if (updated?.status === 'Completed' && !downloadedRef.current.has(updated.jobId)) {
        downloadedRef.current.add(updated.jobId);
        try {
          downloadJobSheetPDF(updated);
        } catch (e) {
          console.error('PDF auto download error on dashboard:', e);
        }
      }
    });
    return () => unsub();
  }, [selected?.jobId]);

  const activeBooking = realtime || selected;
  const [approvingQuote, setApprovingQuote] = useState(false);

  const handleApproveQuote = async (approve = true) => {
    if (!activeBooking) return;
    setApprovingQuote(true);
    try {
      const quoteObj = {
        ...activeBooking.quote,
        status: approve ? 'APPROVED' : 'REJECTED',
        decidedAt: new Date().toISOString()
      };
      const updatedPrice = approve ? (activeBooking.quote.total || activeBooking.price) : activeBooking.price;
      const targetId = activeBooking.docId || activeBooking.jobId;

      const newHistory = [
        ...(activeBooking.statusHistory || []),
        {
          status: activeBooking.status,
          timestamp: new Date().toISOString(),
          note: approve ? `Quote of ₹${quoteObj.total} approved by customer` : 'Quote declined by customer'
        }
      ];

      const res = await fetch(`/api/bookings/${encodeURIComponent(targetId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: quoteObj,
          price: updatedPrice,
          statusHistory: newHistory
        })
      });

      if (res.ok) {
        setRealtime(prev => ({
          ...prev,
          quote: quoteObj,
          price: updatedPrice,
          statusHistory: newHistory
        }));
      }
    } catch (e) {
      console.error('Quote decision error:', e);
    } finally {
      setApprovingQuote(false);
    }
  };

  const getWarrantyDate = (dateStr) => {
    const d = new Date(dateStr || Date.now());
    d.setDate(d.getDate() + 60); // 60 days service warranty
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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

            {/* Assigned Technician Banner */}
            {activeBooking.assignedTech && (
              <div style={{
                margin: '16px 0 0',
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                border: '1.5px solid #bfdbfe',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: '2.2rem' }}>{activeBooking.assignedTech.avatar || '👨‍🔧'}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#1e40af', letterSpacing: '0.05em' }}>
                      Assigned Master Technician
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a' }}>
                      {activeBooking.assignedTech.name} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6' }}>({activeBooking.assignedTech.id})</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      ⭐ {activeBooking.assignedTech.rating || 4.9} Rating • {activeBooking.assignedTech.specialty || 'CoolFix Certified Pro'}
                    </div>
                  </div>
                </div>
                {activeBooking.assignedTech.phone && (
                  <a 
                    href={`tel:${activeBooking.assignedTech.phone}`}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    📞 Call Technician
                  </a>
                )}
              </div>
            )}

            {/* OTP Card */}
            {activeBooking.otp && activeBooking.status !== 'Completed' && (
              <div style={{
                margin: '16px 0 0',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: '2px solid #f59e0b',
                borderRadius: 12,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}>
                <div style={{ fontSize: '2rem' }}>🔐</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Your Verification OTP</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.3em', color: 'white' }}>{activeBooking.otp}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 4 }}>Give this 4-digit PIN to the technician when the job is finished to confirm completion.</div>
                </div>
              </div>
            )}

            {/* On-Site Diagnostic Quote & Spare Parts Approval */}
            {activeBooking.quote && (
              <div style={{
                margin: '20px 0 0',
                background: activeBooking.quote.status === 'APPROVED' ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' : activeBooking.quote.status === 'REJECTED' ? '#FEF2F2' : 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                border: `2px solid ${activeBooking.quote.status === 'APPROVED' ? '#10B981' : activeBooking.quote.status === 'REJECTED' ? '#EF4444' : '#F59E0B'}`,
                borderRadius: 14,
                padding: '20px 24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
              }} className="anim-fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: activeBooking.quote.status === 'APPROVED' ? '#065F46' : '#92400E' }}>
                      📋 On-Site Diagnostic Estimate & Parts Quote
                    </div>
                    <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', color: '#0F172A' }}>
                      {activeBooking.quote.status === 'APPROVED' ? '✅ Repair Quote Approved' : activeBooking.quote.status === 'REJECTED' ? '❌ Quote Declined' : '⚠️ Action Required: Approve Technician Estimate'}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                      ₹{activeBooking.quote.total || activeBooking.price}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Total Repair Amount</div>
                  </div>
                </div>

                {/* Itemized list */}
                <div style={{ background: 'white', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 16 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '10px 14px' }}>Item / Component Description</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right' }}>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBooking.quote.items?.map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 14px' }}>{it.name}</td>
                          <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700 }}>₹{it.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {activeBooking.quote.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleApproveQuote(true)}
                      disabled={approvingQuote}
                      className="btn btn-primary"
                      style={{ padding: '10px 22px', fontSize: '0.92rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      {approvingQuote ? <span className="loader" style={{ width: 16, height: 16, borderWidth: 2 }} /> : `✓ Approve Estimate (₹${activeBooking.quote.total}) & Start Repair`}
                    </button>
                    <button
                      onClick={() => handleApproveQuote(false)}
                      disabled={approvingQuote}
                      className="btn btn-outline"
                      style={{ background: 'white', borderColor: '#EF4444', color: '#DC2626', padding: '10px 18px', fontSize: '0.9rem' }}
                    >
                      Decline Extra Parts
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: activeBooking.quote.status === 'APPROVED' ? '#065F46' : '#991B1B' }}>
                    {activeBooking.quote.status === 'APPROVED' 
                      ? `✓ Authorized by customer. Master technician is executing repairs.` 
                      : `You declined the additional parts. Only base inspection fee applies.`}
                  </div>
                )}
              </div>
            )}

            {/* Checklist / Live Diagnostic & Repairs */}
            {activeBooking.checklist && Object.keys(activeBooking.checklist).some(k => activeBooking.checklist[k]) && (
              <div className="repairs-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  <h3 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🔧</span> Live Diagnostic & Repair Checklist
                  </h3>
                  <span className="badge badge-progress" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    ⚡ {Object.values(activeBooking.checklist).filter(Boolean).length} Tasks Completed Live
                  </span>
                </div>
                <div className="repairs-list">
                  {Object.entries(activeBooking.checklist).map(([item, checked], i) => checked && (
                    <div key={i} className="repair-item anim-fade-in">
                      <span className="repair-icon">✓</span>
                      <span className="repair-text">{item}</span>
                    </div>
                  ))}
                </div>

                {activeBooking.techNotes && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--border)', fontSize: '0.88rem' }}>
                    <strong style={{ color: 'var(--text-dark)' }}>📝 Technician Field Notes: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{activeBooking.techNotes}</span>
                  </div>
                )}
              </div>
            )}

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
                        {h.note && <span style={{ color: 'var(--text)', fontSize: '0.82rem' }}>{h.note}</span>}
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

            {/* Verified 60-Day Warranty Certificate Card & Download */}
            {activeBooking.status === 'Completed' && (
              <div style={{
                margin: '20px 0',
                background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
                border: '2px solid #10B981',
                borderRadius: 14,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                boxShadow: '0 8px 24px rgba(16,185,129,0.12)'
              }} className="anim-scale-in">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '1.6rem' }}>🛡️</span>
                    <div style={{ fontWeight: 900, color: '#065F46', fontSize: '1.15rem' }}>
                      Active 60-Day Master Warranty Certificate
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#047857', marginTop: 4 }}>
                    Your repair is certified & verified. Full protection valid until: <strong style={{ color: '#064E3B' }}>{getWarrantyDate(activeBooking.createdAt)}</strong> (60-day service / 30-day parts).
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    onClick={() => downloadJobSheetPDF(activeBooking)}
                    className="btn btn-primary"
                    style={{ background: '#059669', borderColor: '#047857', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    📥 Download PDF Invoice & Warranty
                  </button>
                  <Link 
                    href={`/job/${activeBooking.jobId}`} 
                    target="_blank"
                    className="btn btn-outline"
                    style={{ background: 'white', borderColor: '#059669', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: '0.9rem', fontWeight: 600 }}
                  >
                    👁️ View Job Sheet
                  </Link>
                </div>
              </div>
            )}

            {/* Feedback */}
            {activeBooking.status === 'Completed' && (
              <div className="feedback-section anim-fade-in">
                <h3 className="section-title">⭐ Your Feedback</h3>
                <FeedbackForm booking={activeBooking} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="sheet-link-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => downloadJobSheetPDF(activeBooking)}
              >
                📥 Download Job Sheet (PDF)
              </button>
              <Link 
                href={`/job/${activeBooking.jobId}`} 
                target="_blank" 
                className="btn btn-outline"
              >
                📄 Full Job Sheet
              </Link>
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
