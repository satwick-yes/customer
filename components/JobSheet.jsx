import { useEffect, useRef } from 'react';
import BookingComments from './BookingComments';
import { TECHNICIANS } from '@/lib/technicians';
import { downloadJobSheetPDF } from '@/lib/pdfGenerator';

export default function JobSheet({ booking, onClose, onAssignTech }) {
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

          {/* Assigned Technician Section */}
          <div className="sheet__section">
            <div className="sheet__row" style={{ alignItems: 'center' }}>
              <span className="sheet__key">Assigned Technician</span>
              <span className="sheet__val">
                {onAssignTech ? (
                  <select
                    value={booking.assignedTech?.id || ''}
                    onChange={(e) => onAssignTech(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid #3B82F6',
                      background: '#EFF6FF',
                      color: '#1E40AF',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">⚡ Select Technician...</option>
                    {TECHNICIANS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.avatar} {t.name} ({t.id} - {t.phone})
                      </option>
                    ))}
                  </select>
                ) : (
                  booking.assignedTech ? (
                    <strong style={{ color: '#1E40AF' }}>
                      {booking.assignedTech.name} ({booking.assignedTech.id}) - {booking.assignedTech.phone}
                    </strong>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Pending assignment</span>
                  )
                )}
              </span>
            </div>
            {booking.assignedTech && (
              <div style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Specialty: {booking.assignedTech.specialty || 'Cooling Expert'} | Email: {booking.assignedTech.email}
              </div>
            )}
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
            <span className={`badge ${booking.status === 'Completed' ? 'badge-completed' : booking.status === 'Pending' ? 'badge-pending' : booking.status === 'Technician Assigned' ? 'badge-assigned' : 'badge-progress'}`}>
              {booking.status}
            </span>
          </div>

          {/* OTP display — visible to admin, to be relayed to customer */}
          {booking.otp && (
            <div style={{
              margin: '16px 0',
              background: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
              border: '2px dashed #f59e0b',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#92400e', marginBottom: 4 }}>🔐 Job Completion OTP</div>
                <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.2em', color: '#b45309' }}>{booking.otp}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#92400e', maxWidth: 120, textAlign: 'right' }}>
                Share with customer to authorize job completion
              </div>
            </div>
          )}

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
          <p>📞 +91 8250297411 &nbsp;|&nbsp; support@coolfix.in</p>
          <p>Thank you for choosing CoolFix!</p>
        </div>

        {onClose && (
          <div className="sheet__actions">
            <button id="download-pdf-job-sheet" className="btn btn-outline" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', fontWeight: 600 }} onClick={() => downloadJobSheetPDF(booking)}>📥 Download PDF</button>
            <button id="print-job-sheet" className="btn btn-outline" onClick={handlePrint}>🖨️ Print</button>
            <button id="copy-job-link" className="btn btn-outline" onClick={handleCopy}>🔗 Copy Link</button>
            <button id="close-job-sheet" className="btn btn-primary" onClick={onClose}>✓ Done</button>
          </div>
        )}
      </div>
</div>
  );
}
