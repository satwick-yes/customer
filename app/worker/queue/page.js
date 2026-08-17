'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECHNICIANS } from '@/lib/technicians';
import Link from 'next/link';

export default function WorkerQueuePage() {
  const router = useRouter();
  const [currentTech, setCurrentTech] = useState(TECHNICIANS[0]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load tech profile
  useEffect(() => {
    try {
      const saved = localStorage.getItem('coolfix_worker');
      if (!saved) {
        router.push('/worker/login');
        return;
      }
      const parsed = JSON.parse(saved);
      const matched = TECHNICIANS.find(t => 
        (parsed.email && t.email.toLowerCase() === parsed.email.toLowerCase()) || 
        (parsed.techId && t.id === parsed.techId)
      );
      if (matched) setCurrentTech(matched);
    } catch (e) {
      router.push('/worker/login');
    }
  }, [router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setAllBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 4000);
    return () => clearInterval(interval);
  }, []);

  const claimJob = async (job) => {
    setClaimingId(job.docId);
    try {
      const newStatus = 'Technician Assigned';
      const targetId = job.docId || job.jobId;
      const newHistory = [
        ...(job.statusHistory || []),
        { 
          status: newStatus, 
          timestamp: new Date().toISOString(),
          note: `Claimed from Open Queue by ${currentTech.name} (${currentTech.id})`
        }
      ];

      const res = await fetch(`/api/bookings/${encodeURIComponent(targetId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assignedTech: currentTech,
          status: newStatus,
          statusHistory: newHistory
        })
      });

      if (res.ok) {
        setSuccessMsg(`⚡ Successfully claimed Job ${job.jobId}! Redirecting to your active jobs...`);
        setTimeout(() => {
          router.push(`/worker`);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      alert('Could not claim job. Please try again.');
    } finally {
      setClaimingId(null);
    }
  };

  const unassignedJobs = allBookings.filter(b => 
    b.status !== 'Completed' && !b.assignedTech
  );

  const filteredJobs = unassignedJobs.filter(b => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.jobId && b.jobId.toLowerCase().includes(q)) ||
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.phone && b.phone.includes(q)) ||
      (b.appliance && b.appliance.toLowerCase().includes(q)) ||
      (b.address && b.address.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <Navbar userRole="worker" workerInfo={currentTech} />
      <div className="worker-page" style={{ minHeight: '85vh', background: '#F8FAFC', padding: '30px 16px' }}>
        <div className="container" style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          {/* Tech Profile Badge */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: 'white',
            borderRadius: 14,
            padding: '18px 24px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: '2.2rem', background: 'rgba(255,255,255,0.1)', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
                {currentTech.avatar}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd' }}>
                  Open Field Queue
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0', color: 'white' }}>
                  {currentTech.name} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#60a5fa' }}>({currentTech.id})</span>
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/worker" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
                ⚡ My Assigned Jobs
              </Link>
            </div>
          </div>

          {/* Header and Search */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 }}>
              📥 Available Open Jobs ({unassignedJobs.length})
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
              Unassigned service requests across your territory. Claim any task to add it to your daily field route.
            </p>

            <input 
              type="text"
              placeholder="Search available jobs by ID, customer name, phone, or address..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '100%', height: 48, background: 'white' }}
            />
          </div>

          {successMsg && (
            <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '12px 16px', borderRadius: 8, fontSize: '0.9rem', marginBottom: 20, textAlign: 'center', fontWeight: 700 }}>
              {successMsg}
            </div>
          )}

          {/* Job List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><span className="loader" /></div>
          ) : filteredJobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px', background: 'white' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No Open Tasks in Queue</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '8px auto 20px auto', fontSize: '0.9rem' }}>
                All current repair jobs have been assigned or claimed. New bookings will automatically appear here.
              </p>
              <Link href="/worker" className="btn btn-primary">
                Return to My Assigned Jobs →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredJobs.map((job) => (
                <div 
                  key={job.docId}
                  className="interactive-card"
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    border: '1.5px solid var(--border)',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: '1.1rem' }}>{job.appliance === 'AC' ? '❄️' : '🧊'}</span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>{job.jobId}</strong>
                        <span className="badge badge-pending" style={{ fontSize: '0.75rem' }}>Open for Claim</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                        {job.name} • 📞 {job.phone}
                      </div>
                    </div>

                    <button
                      onClick={() => claimJob(job)}
                      disabled={claimingId === job.docId}
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      {claimingId === job.docId ? <span className="loader" style={{ width: 16, height: 16, borderWidth: 2 }} /> : '⚡ Claim This Job'}
                    </button>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', color: '#475569' }}>
                    <div style={{ marginBottom: 4 }}>📍 <strong>Address:</strong> {job.address || 'Address provided upon acceptance'}</div>
                    <div>⚠️ <strong>Reported Issue:</strong> {job.issueDescription || `${job.appliance} service & diagnostic required`}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
