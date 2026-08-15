'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AC_CHECKLIST = [
  'Filter Cleaning',
  'Gas Refill',
  'Compressor Check',
  'Capacitor Replacement',
  'PCB Repair',
  'Drainage Fix'
];

const FRIDGE_CHECKLIST = [
  'Compressor Check',
  'Gas Refill',
  'Thermostat Replacement',
  'Defrost System Repair',
  'Door Seal Fix'
];

export default function WorkerPortal() {
  const [jobId, setJobId] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checklist, setChecklist] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
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
      } else {
        setError('Job ID not found. Please check and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (item) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(booking.docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist })
      });
      if (res.ok) {
        setSuccess('Diagnosis & repairs successfully updated!');
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      setError('Could not submit checklist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="worker-page">
        <div className="container">
          <div className="worker-header">
            <h1>🛠️ Technician Portal</h1>
            <p>Enter the Job ID to access the diagnostic checklist for the appliance.</p>
          </div>

          <div className="card">
            <form onSubmit={handleSearch} className="search-box">
              <input 
                type="text" 
                placeholder="Enter Job ID (e.g., JOB-1234)" 
                value={jobId}
                onChange={e => setJobId(e.target.value)}
                className="form-input"
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : 'Find Job'}
              </button>
            </form>
            {error && !booking && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
          </div>

          {booking && (
            <div className="card anim-fade-up">
              <div className="job-info">
                <div>
                  <h3 style={{ marginBottom: 4 }}>Job: {booking.jobId}</h3>
                  <p className="text-muted">{booking.name} | {booking.phone}</p>
                </div>
                <div className={`badge badge-${booking.status === 'Completed' ? 'completed' : 'pending'}`}>
                  {booking.appliance === 'AC' ? '❄️ AC' : '🧊 Fridge'}
                </div>
              </div>

              <div className="divider" />

              <h3 style={{ marginBottom: 16 }}>Diagnostic Checklist</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 20 }}>
                Please check off all the issues found and repairs performed during this visit.
              </p>

              <div className="checklist-grid">
                {(booking.appliance === 'AC' ? AC_CHECKLIST : FRIDGE_CHECKLIST).map((item, idx) => (
                  <label key={idx} className={`check-item ${checklist[item] ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={!!checklist[item]} 
                      onChange={() => handleToggle(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {error && booking && <p className="form-error" style={{ marginTop: 16 }}>{error}</p>}
              {success && <p className="form-success" style={{ marginTop: 16, color: '#059669', fontWeight: 600 }}>✅ {success}</p>}

              <button 
                onClick={handleSubmit} 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Diagnosis'}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .worker-page {
          min-height: 100vh;
          background: var(--bg-soft);
          padding: 120px 0 80px;
        }
        .worker-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .worker-header p {
          color: var(--text-muted);
          margin-top: 8px;
        }
        .card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--card-shadow);
          max-width: 600px;
          margin: 0 auto 24px;
          border: 1px solid var(--border);
        }
        .search-box {
          display: flex;
          gap: 12px;
        }
        .search-box input { flex: 1; }
        .job-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .text-muted { color: var(--text-muted); }
        .divider {
          height: 1px;
          background: var(--border);
          margin: 20px 0;
        }
        .checklist-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
          background: var(--bg-soft);
        }
        .check-item:hover {
          border-color: var(--primary);
        }
        .check-item.checked {
          background: var(--primary-ultra-light);
          border-color: var(--primary);
        }
        .check-item input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: var(--primary);
        }
        .check-item span {
          font-weight: 500;
          font-size: 1.05rem;
        }
      `}</style>
    </>
  );
}
