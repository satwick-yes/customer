'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECHNICIANS } from '@/lib/technicians';
import Link from 'next/link';

export default function AdminTechniciansPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState(null);
  const [techStatuses, setTechStatuses] = useState({
    'TECH-101': 'Available',
    'TECH-102': 'Available',
    'TECH-103': 'Available',
    'TECH-104': 'Available',
    'TECH-105': 'Available',
  });

  // Auth Guard
  useEffect(() => {
    try {
      const saved = localStorage.getItem('coolfix_admin');
      if (!saved) {
        router.push('/admin/login');
        return;
      }
      setAdminUser(JSON.parse(saved));
    } catch (e) {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
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

  const toggleStatus = (techId) => {
    setTechStatuses(prev => ({
      ...prev,
      [techId]: prev[techId] === 'Available' ? 'On Job' : 'Available'
    }));
  };

  // Get active and completed jobs per technician
  const getTechJobs = (techId) => {
    return bookings.filter(b => b.assignedTech?.id === techId);
  };

  return (
    <>
      <Navbar userRole="admin" />
      <div className="admin-page" style={{ minHeight: '85vh', background: '#F8FAFC', padding: '40px 0' }}>
        <div className="container">
          
          {/* Header */}
          <div className="admin-header" style={{ marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Link href="/admin" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                  Admin Portal
                </Link>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>Technicians Directory</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Certified Master Technicians
              </h1>
              <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.95rem' }}>
                Monitor field technician availability, active workloads, job history, and dispatch assignments in real-time.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link href="/admin" className="btn btn-outline" style={{ background: 'white', fontSize: '0.88rem' }}>
                📋 View Dispatch Board
              </Link>
              <Link href="/admin/analytics" className="btn btn-outline" style={{ background: 'white', fontSize: '0.88rem' }}>
                📊 Operational Stats
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="analytics-grid" style={{ marginBottom: 32 }}>
            <div className="analytic-card">
              <div className="ac-title">Total Certified Technicians</div>
              <div className="ac-value">{TECHNICIANS.length}</div>
              <div className="ac-icon">👨‍🔧</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Available for Dispatch</div>
              <div className="ac-value">
                {Object.values(techStatuses).filter(s => s === 'Available').length}
              </div>
              <div className="ac-icon" style={{ background: '#D1FAE5', color: '#059669' }}>●</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Active Field Workloads</div>
              <div className="ac-value">
                {bookings.filter(b => b.assignedTech && b.status !== 'Completed').length}
              </div>
              <div className="ac-icon" style={{ background: '#E0E7FF', color: '#4338CA' }}>⚡</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Average Tech Rating</div>
              <div className="ac-value">4.9 ★</div>
              <div className="ac-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>⭐</div>
            </div>
          </div>

          {/* Technicians Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {TECHNICIANS.map((tech) => {
              const techJobs = getTechJobs(tech.id);
              const activeJobs = techJobs.filter(b => b.status !== 'Completed');
              const completedJobs = techJobs.filter(b => b.status === 'Completed');
              const status = techStatuses[tech.id] || 'Available';

              return (
                <div 
                  key={tech.id}
                  className="interactive-card"
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    border: '1px solid var(--border)',
                    padding: '24px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Top Row: Avatar & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div style={{ 
                          fontSize: '2.5rem', 
                          background: '#F1F5F9', 
                          width: 56, 
                          height: 56, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          borderRadius: 12 
                        }}>
                          {tech.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {tech.id}
                          </div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)', margin: '2px 0' }}>
                            {tech.name}
                          </h3>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            ⭐ 4.9 (120+ reviews) • 8+ Yrs Exp
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleStatus(tech.id)}
                        className={`badge badge-${status === 'Available' ? 'completed' : 'pending'}`}
                        style={{
                          cursor: 'pointer',
                          border: 'none',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          borderRadius: 20
                        }}
                        title="Click to toggle availability"
                      >
                        ● {status}
                      </button>
                    </div>

                    {/* Specialty & Contact */}
                    <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, marginBottom: 16, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        🛠️ {tech.specialty}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                        <span>📞 {tech.phone}</span>
                        <span>✉️ {tech.email}</span>
                      </div>
                    </div>

                    {/* Workload Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16, textAlign: 'center' }}>
                      <div style={{ background: activeJobs.length > 0 ? '#EFF6FF' : '#F8FAFC', padding: '10px', borderRadius: 8, border: activeJobs.length > 0 ? '1px solid #BFDBFE' : '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: activeJobs.length > 0 ? '#1E40AF' : '#64748B' }}>
                          {activeJobs.length}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: activeJobs.length > 0 ? '#2563EB' : '#94A3B8', textTransform: 'uppercase' }}>
                          Active Assigned
                        </div>
                      </div>
                      <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: 8, border: '1px solid #A7F3D0' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065F46' }}>
                          {completedJobs.length}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                          Completed Jobs
                        </div>
                      </div>
                    </div>

                    {/* Active Assigned Jobs List */}
                    {activeJobs.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                          Current Active Jobs:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {activeJobs.map(job => (
                            <div 
                              key={job.docId}
                              style={{
                                padding: '8px 10px',
                                background: '#F8FAFC',
                                borderRadius: 6,
                                border: '1px solid #E2E8F0',
                                fontSize: '0.8rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <div>
                                <strong style={{ color: 'var(--primary)' }}>{job.jobId}</strong> — {job.name} ({job.appliance})
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB' }}>
                                {job.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                    <Link 
                      href={`/admin?tech=${tech.id}`} 
                      className="btn btn-outline" 
                      style={{ flex: 1, fontSize: '0.82rem', padding: '8px', textAlign: 'center', justifyContent: 'center' }}
                    >
                      Filter Jobs ({techJobs.length})
                    </Link>
                    <a 
                      href={`tel:${tech.phone}`}
                      className="btn btn-primary" 
                      style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <span>📞 Call</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
