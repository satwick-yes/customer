'use client';

import { useState, useEffect } from 'react';
import { getBookingByJobId, subscribeToBooking } from '@/lib/bookingService';
import { downloadJobSheetPDF } from '@/lib/pdfGenerator';
import Link from 'next/link';

export default function JobSheetStatic({ jobId }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let unsub;
    const init = async () => {
      try {
        const b = await getBookingByJobId(jobId);
        if (!b) { setError('Job not found.'); setLoading(false); return; }
        setBooking(b);
        setLoading(false);
        // Subscribe to real-time updates
        unsub = subscribeToBooking(jobId, (updated) => setBooking(updated));
      } catch (err) {
        setError('Failed to load job sheet.');
        setLoading(false);
      }
    };
    init();
    return () => { if (unsub) unsub(); };
  }, [jobId]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <span className="loader" />
    </div>
  );

  if (error) return (
    <div className="error-state anim-fade-up">
      <div style={{ fontSize: '3rem' }}>❌</div>
      <h3>Job not found</h3>
      <p>The Job ID <strong>{jobId}</strong> does not exist.</p>
      <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
</div>
  );

  const STATUS_BADGE = {
    'Pending':             'badge-pending',
    'Technician Assigned': 'badge-assigned',
    'On the Way':          'badge-progress',
    'Reached Location':    'badge-progress',
    'Work in Progress':    'badge-progress',
    'Completed':           'badge-completed',
  };

  const date = booking?.createdAt?.toDate
    ? booking.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div className="jss anim-scale-in">
      {/* Print header */}
      <div className="jss__header">
        <div className="jss__brand">❄️ CoolFix</div>
        <div className="jss__header-sub">Service Job Sheet</div>
        <div className="jss__jobid-wrap">
          <span className="jss__jobid-label">JOB ID</span>
          <span className="jss__jobid">{booking.jobId}</span>
        </div>
      </div>

      <div className="jss__body">
        {/* Customer */}
        <div className="jss__section">
          <div className="jss__section-title">Customer Information</div>
          <div className="jss__rows">
            <div className="jss__row"><span>Name</span><span>{booking.name}</span></div>
            <div className="jss__row"><span>Phone</span><span>{booking.phone}</span></div>
            <div className="jss__row"><span>Address</span><span>{booking.address}</span></div>
            <div className="jss__row"><span>Booking Date</span><span>{date}</span></div>
          </div>
        </div>

        <div className="jss__divider" />

        {/* Technician */}
        {booking.assignedTech && (
          <>
            <div className="jss__section">
              <div className="jss__section-title">Assigned Technician</div>
              <div className="jss__rows">
                <div className="jss__row">
                  <span>Technician</span>
                  <span style={{ color: '#1E40AF', fontWeight: 700 }}>
                    {booking.assignedTech.name} ({booking.assignedTech.id})
                  </span>
                </div>
                <div className="jss__row">
                  <span>Contact</span>
                  <span>{booking.assignedTech.phone}</span>
                </div>
                <div className="jss__row">
                  <span>Specialty</span>
                  <span>{booking.assignedTech.specialty || 'Master Cooling Tech'}</span>
                </div>
              </div>
            </div>
            <div className="jss__divider" />
          </>
        )}

        {/* Service */}
        <div className="jss__section">
          <div className="jss__section-title">Service Details</div>
          <div className="jss__rows">
            <div className="jss__row">
              <span>Appliance</span>
              <span className="red-text">{booking.appliance === 'AC' ? '❄️' : '🧊'} {booking.appliance}</span>
            </div>
            <div className="jss__row"><span>Issue</span><span>{booking.issue}</span></div>
            <div className="jss__row">
              <span>Status</span>
              <span className={`badge ${STATUS_BADGE[booking.status] || 'badge-pending'}`}>{booking.status}</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Checklist */}
        {booking.checklist && Object.keys(booking.checklist).some(k => booking.checklist[k]) && (
          <>
            <div className="jss__divider" />
            <div className="jss__section">
              <div className="jss__section-title">✅ Diagnostic & Repair Checklist</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: 8 }}>
                {Object.entries(booking.checklist).map(([item, checked], i) => checked && (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text)' }}>
                    <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span> {item}
                  </div>
                ))}
              </div>
              {booking.techNotes && (
                <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-soft)', padding: '10px 14px', borderRadius: 8 }}>
                  <strong>Technician Notes:</strong> {booking.techNotes}
                </div>
              )}
            </div>
          </>
        )}

        <div className="jss__divider" />

        {/* Price */}
        <div className="jss__price-block">
          <span className="jss__price-label">Service Charge</span>
          <span className="jss__price">₹{booking.price}</span>
        </div>

        {/* Feedback */}
        {booking.feedback && (
          <>
            <div className="jss__divider" />
            <div className="jss__section">
              <div className="jss__section-title">Customer Feedback</div>
              <div className="stars-row">
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ fontSize: '1.3rem', color: i <= booking.feedback.rating ? '#F59E0B' : '#E5E7EB' }}>★</span>
                ))}
                <span style={{ fontWeight: 700, color: 'var(--primary)', marginLeft: 8 }}>{booking.feedback.rating}/5</span>
              </div>
              {booking.feedback.review && <p className="jss__review">"{booking.feedback.review}"</p>}
            </div>
          </>
        )}
      </div>

        <div className="jss__footer">
          <p>📞 +91 8250297411 &nbsp;|&nbsp; support@coolfix.in</p>
          <p>Thank you for choosing CoolFix!</p>
        </div>

      {/* Actions */}
      <div className="jss__actions">
        <button id="download-pdf-sheet" className="btn btn-outline" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', fontWeight: 600 }} onClick={() => downloadJobSheetPDF(booking)}>📥 Download PDF</button>
        <button id="print-sheet" className="btn btn-outline" onClick={() => window.print()}>🖨️ Print</button>
        <button
          id="copy-share-link"
          className="btn btn-outline"
          onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
        >
          🔗 Share Link
        </button>
        <Link href={`/dashboard?job=${booking.jobId}`} id="track-this-job" className="btn btn-primary">
          📍 Track This Job
        </Link>
      </div>

      <style jsx>{`
        .jss {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 8px 48px rgba(227,30,36,0.12);
          border: 1px solid var(--border);
        }
        .jss__header {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 32px 32px 24px;
          text-align: center;
        }
        .jss__brand { font-size: 1.6rem; font-weight: 800; margin-bottom: 4px; }
        .jss__header-sub { opacity: 0.8; margin-bottom: 16px; }
        .jss__jobid-wrap {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: var(--radius-md);
          padding: 10px 24px;
          gap: 4px;
        }
        .jss__jobid-label { font-size: 0.7rem; opacity: 0.7; letter-spacing: 0.1em; font-weight: 700; }
        .jss__jobid { font-family: monospace; font-size: 1.3rem; font-weight: 700; letter-spacing: 0.08em; }

        .jss__body { padding: 28px 32px; }
        .jss__section { margin-bottom: 0; }
        .jss__section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-light);
          margin-bottom: 12px;
        }
        .jss__rows { display: flex; flex-direction: column; gap: 10px; }
        .jss__row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          font-size: 0.9rem;
        }
        .jss__row > span:first-child { color: var(--text-muted); white-space: nowrap; flex-shrink: 0; }
        .jss__row > span:last-child  { font-weight: 600; text-align: right; }
        .red-text { color: var(--primary); }
        .jss__divider { height: 1px; background: var(--border); margin: 20px 0; }
        .jss__price-block {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--primary-ultra-light);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          padding: 16px 20px;
        }
        .jss__price-label { font-weight: 700; font-size: 1rem; }
        .jss__price { font-size: 2rem; font-weight: 900; color: var(--primary); }
        .stars-row { display: flex; align-items: center; gap: 2px; margin-bottom: 8px; }
        .jss__review { color: var(--text-muted); font-style: italic; font-size: 0.9rem; }

        .jss__footer {
          background: var(--bg-soft);
          padding: 16px 32px;
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .jss__actions {
          padding: 20px 32px;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        @media print {
          .jss__actions { display: none; }
        }
        @media (max-width: 480px) {
          .jss__body { padding: 20px 20px; }
          .jss__actions { justify-content: center; }
        }
      `}</style>
    </div>
  );
}
