'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AC_CHECKLIST = [
  'Filter Cleaning',
  'Refrigerant Gas Refill',
  'Cooling Coil Cleaning',
  'Compressor Check',
  'Capacitor Replacement'
];

const FRIDGE_CHECKLIST = [
  'Thermostat Testing',
  'Defrost Heater Check',
  'Door Gasket Seal',
  'Compressor Inspection',
  'Gas Charging'
];

const STATUS_FLOW = [
  'Assigned',
  'On the Way',
  'Reached Location',
  'Work in Progress',
  'Completed'
];

export default function WorkerPortal() {
  const [jobId, setJobId] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checklist, setChecklist] = useState({});
  const [techNotes, setTechNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [assignedQueue, setAssignedQueue] = useState([]);
  
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    fetchAssignedJobs();
  }, []);

  const fetchAssignedJobs = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setAssignedQueue(data.filter(b => b.status !== 'Completed'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!jobId.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    setBooking(null);

    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(jobId.trim().toUpperCase())}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
        setChecklist(data.checklist || {});
        setTechNotes(data.techNotes || '');
      } else {
        setError('Job ID not found.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const openJob = (job) => {
    setJobId(job.jobId);
    setBooking(job);
    setChecklist(job.checklist || {});
    setTechNotes(job.techNotes || '');
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = (item) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const updateStatus = async (newStatus) => {
    if (!booking) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(booking.docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBooking({ ...booking, status: newStatus });
        fetchAssignedJobs();
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      alert('Error updating status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (booking.status === 'Completed') return; 

    if (!otp || otp.length < 4) {
      setError('Please enter the 4-digit OTP provided by the customer to complete this job.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(booking.docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          checklist, 
          techNotes, 
          paymentMethod,
          status: 'Completed' 
        })
      });
      if (res.ok) {
        setSuccess('Job marked as Completed successfully!');
        setBooking({ ...booking, status: 'Completed' });
        fetchAssignedJobs(); 
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      setError('Could not submit.');
    } finally {
      setSubmitting(false);
    }
  };

  const getScheduleTime = (dateStr) => {
    const d = new Date(dateStr);
    const end = new Date(d.getTime() + 2 * 60 * 60 * 1000); 
    return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      <Navbar userRole="worker" />
      <div className="worker-page">
        <div className="container" style={{ padding: '40px 16px', maxWidth: '800px', margin: '0 auto' }}>
          
          {!booking ? (
            <>
              <div className="worker-header text-center" style={{ marginBottom: 40 }}>
                <h1>🛠️ Technician Portal</h1>
                <p className="text-muted">Search for a job or select from your assigned queue.</p>
              </div>

              <div className="card" style={{ marginBottom: 32 }}>
                <form onSubmit={handleSearch} className="search-box">
                  <input 
                    type="text" 
                    placeholder="Enter Job ID (e.g., AC-1234)" 
                    value={jobId}
                    onChange={e => setJobId(e.target.value)}
                    className="form-input"
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Find Job'}
                  </button>
                </form>
                {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
              </div>

              <h3 style={{ marginBottom: 16 }}>Your Assigned Jobs</h3>
              {assignedQueue.length === 0 ? (
                <div className="card text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>
                  No pending jobs assigned.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {assignedQueue.map(job => (
                    <div 
                      key={job.docId} 
                      className="card hover-elevate" 
                      onClick={() => openJob(job)}
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <h4 style={{ margin: 0 }}>{job.jobId}</h4>
                        <div className="text-sm text-muted">{job.name} • {job.appliance}</div>
                      </div>
                      <div className={`badge badge-${job.status === 'Completed' ? 'completed' : 'pending'}`}>
                        {job.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="card anim-fade-up">
              <button 
                onClick={() => setBooking(null)} 
                className="btn btn-outline" 
                style={{ padding: '6px 12px', marginBottom: 24, fontSize: '0.85rem' }}
              >
                ← Back to Queue
              </button>

              <div className="job-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h2 style={{ marginBottom: 4, fontSize: '1.5rem' }}>{booking.jobId}</h2>
                  <div className={`badge badge-${booking.status === 'Completed' ? 'completed' : 'pending'}`} style={{ marginBottom: 8 }}>
                    {booking.status}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{booking.price || (booking.appliance === 'AC' ? 499 : 299)}</div>
                  <div className="text-sm text-muted">{booking.appliance} Service</div>
                </div>
              </div>

              <div className="divider" style={{ margin: '20px 0' }} />

              <div className="customer-details" style={{ background: 'var(--bg-soft)', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                <h4 style={{ marginBottom: 12 }}>Customer Details</h4>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined text-primary">person</span>
                    <strong>{booking.name}</strong>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined text-primary">phone</span>
                    <a href={`tel:${booking.phone}`} style={{ flex: 1, color: 'var(--text-dark)', textDecoration: 'none' }}>{booking.phone}</a>
                    <a href={`tel:${booking.phone}`} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Call</a>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div style={{ flex: 1 }}>{booking.address}</div>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                    >
                      Map
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined text-primary">schedule</span>
                    <span>{getScheduleTime(booking.createdAt)}</span>
                  </div>
                </div>
              </div>

              <h4 style={{ marginBottom: 12 }}>Real-Time Status</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {STATUS_FLOW.map(s => {
                  const isCurrent = booking.status === s;
                  if (s === 'Completed') return null; 
                  return (
                    <button 
                      key={s}
                      onClick={() => updateStatus(s)}
                      disabled={isCurrent || booking.status === 'Completed'}
                      className={`btn ${isCurrent ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: '1 1 auto', fontSize: '0.85rem' }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <h4 style={{ marginBottom: 12 }}>Diagnostic Checklist</h4>
              <div className="checklist-grid" style={{ marginBottom: 24 }}>
                {(booking.appliance === 'AC' ? AC_CHECKLIST : FRIDGE_CHECKLIST).map((item, idx) => (
                  <label key={idx} className={`check-item ${checklist[item] ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={!!checklist[item]} 
                      onChange={() => handleToggle(item)}
                      disabled={booking.status === 'Completed'}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <h4 style={{ marginBottom: 12 }}>Technician Notes</h4>
              <textarea 
                className="form-input" 
                rows={3} 
                placeholder="E.g., Replaced 35uF capacitor..."
                value={techNotes}
                onChange={e => setTechNotes(e.target.value)}
                disabled={booking.status === 'Completed'}
                style={{ width: '100%', marginBottom: 24, resize: 'vertical' }}
              />

              {booking.status !== 'Completed' && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                  <h4 style={{ marginBottom: 16 }}>Payment & Completion</h4>
                  
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">Payment Method</label>
                    <select 
                      className="form-input" 
                      value={paymentMethod} 
                      onChange={e => setPaymentMethod(e.target.value)}
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI / QR Code</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Customer OTP Verification</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input 
                        type="text" 
                        maxLength={4}
                        placeholder="1234"
                        className="form-input" 
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        style={{ letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center' }}
                      />
                    </div>
                    <p className="text-sm text-muted" style={{ marginTop: 4 }}>Ask the customer for the 4-digit PIN.</p>
                  </div>
                </div>
              )}

              {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
              {success && <p className="form-success" style={{ marginBottom: 16, color: '#059669', fontWeight: 600 }}>✅ {success}</p>}

              <button 
                onClick={handleSubmit} 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', height: 56, fontSize: '1.1rem' }}
                disabled={submitting || booking.status === 'Completed'}
              >
                {booking.status === 'Completed' ? 'Job Completed' : 'Complete Job'}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
