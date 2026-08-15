'use client';

import { useEffect, useRef } from 'react';
import BookingComments from './BookingComments';

export default function JobSheet({ booking, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (onClose) {
      const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [onClose]);

  const handlePrint = () => window.print();
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + `/job/${booking.jobId}`);
    alert('Job Sheet link copied!');
  };

  const date = booking?.createdAt?.toDate
    ? booking.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div className="sheet anim-scale-in" ref={ref}>
        <div className="sheet__header">
          <div className="sheet__brand">❄️ CoolFix</div>
          <div className="sheet__title">Job Sheet</div>
          <div className="sheet__jobid">{booking.jobId}</div>
        </div>

        <div className="sheet__body">
          <div className="sheet__section">
            <div className="sheet__row">
              <span className="sheet__key">Customer Name</span>
              <span className="sheet__val">{booking.name}</span>
            </div>
            <div className="sheet__row">
              <span className="sheet__key">Phone Number</span>
              <span className="sheet__val">{booking.phone}</span>
            </div>
            <div className="sheet__row">
              <span className="sheet__key">Address</span>
              <span className="sheet__val">{booking.address}</span>
            </div>
          </div>

          <div className="sheet__divider" />

          <div className="sheet__section">
            <div className="sheet__row">
              <span className="sheet__key">Appliance</span>
              <span className="sheet__val appliance">{booking.appliance === 'AC' ? '❄️ AC' : '🧊 Fridge'}</span>
            </div>
            <div className="sheet__row">
              <span className="sheet__key">Issue Described</span>
              <span className="sheet__val">{booking.issue}</span>
            </div>
            <div className="sheet__row">
              <span className="sheet__key">Service Date</span>
              <span className="sheet__val">{date}</span>
            </div>
          </div>

          <div className="sheet__divider" />

          <div className="sheet__price-row">
            <span className="sheet__price-label">Service Charge</span>
            <span className="sheet__price">₹{booking.price}</span>
          </div>

          <div className="sheet__status-row">
            <span>Current Status:</span>
            <span className={`badge badge-${booking.status === 'Pending' ? 'pending' : booking.status === 'Technician Assigned' ? 'assigned' : booking.status === 'Work in Progress' ? 'progress' : 'completed'}`}>
              {booking.status}
            </span>
          </div>

          <div className="sheet__divider" />

          {booking.checklist && Object.keys(booking.checklist).length > 0 && (
            <>
              <div className="sheet__section" style={{ marginTop: '12px' }}>
                <div className="sheet__key" style={{ marginBottom: '12px' }}>✅ Technician Diagnosis & Repairs</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {Object.entries(booking.checklist).map(([item, checked], i) => checked && (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text)' }}>
                      <span style={{ color: '#10B981' }}>✔️</span> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sheet__divider" />
            </>
          )}

          <div className="sheet__row" style={{ marginTop: '12px' }}>
            <span className="sheet__key">Feedback / Rating</span>
            <span className="sheet__val">
              {booking.feedback ? (
                <>
                  <span style={{ color: '#F59E0B' }}>{'★'.repeat(booking.feedback.rating)}</span>
                  <span style={{ color: 'var(--text-light)' }}>{'★'.repeat(5 - booking.feedback.rating)}</span>
                  {booking.feedback.review && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>"{booking.feedback.review}"</div>}
                </>
              ) : (
                <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Pending completion</span>
              )}
            </span>
          </div>
          <div className="sheet__divider" />

          <div className="sheet__row" style={{ marginTop: '12px', display: 'block' }}>
            <div className="sheet__key" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>💬 Messages / Notes</div>
            <div style={{ textAlign: 'left' }}>
              <BookingComments booking={booking} isAdmin={true} />
            </div>
          </div>
        </div>

        <div className="sheet__footer">
          <p>📞 +91 8250297411 &nbsp;|&nbsp; satwick1234509@gmail.com</p>
          <p>Thank you for choosing CoolFix!</p>
        </div>

        {onClose && (
          <div className="sheet__actions">
            <button id="print-job-sheet" className="btn btn-outline" onClick={handlePrint}>🖨️ Print</button>
            <button id="copy-job-link" className="btn btn-outline" onClick={handleCopy}>🔗 Copy Link</button>
            <button id="close-job-sheet" className="btn btn-primary" onClick={onClose}>✓ Done</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .sheet {
          background: white;
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 520px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.3);
        }
        .sheet__header {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 28px 28px 20px;
          text-align: center;
        }
        .sheet__brand { font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; }
        .sheet__title { font-size: 1rem; opacity: 0.85; margin-bottom: 8px; }
        .sheet__jobid {
          font-size: 1.2rem;
          font-weight: 700;
          font-family: monospace;
          background: rgba(255,255,255,0.15);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          display: inline-block;
          letter-spacing: 0.1em;
        }
        .sheet__body { padding: 24px 28px; }
        .sheet__section { display: flex; flex-direction: column; gap: 12px; }
        .sheet__row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .sheet__key {
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .sheet__val {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
          text-align: right;
        }
        .sheet__val.appliance { color: var(--primary); }
        .sheet__divider { height: 1px; background: var(--border); margin: 16px 0; }
        .sheet__price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .sheet__price-label { font-weight: 600; }
        .sheet__price {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary);
        }
        .sheet__status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .sheet__footer {
          background: var(--bg-soft);
          padding: 16px 28px;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sheet__actions {
          padding: 20px 28px;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          border-top: 1px solid var(--border);
        }
        @media (max-width: 480px) {
          .sheet__actions { flex-wrap: wrap; }
          .sheet__actions .btn { flex: 1; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
