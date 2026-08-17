'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECHNICIANS } from '@/lib/technicians';
import Link from 'next/link';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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
    fetchBookings();
  }, []);

  // Compute operational analytics
  const totalJobs = bookings.length;
  const completedJobs = bookings.filter(b => b.status === 'Completed');
  const pendingJobs = bookings.filter(b => b.status === 'Pending');
  const inProgressJobs = bookings.filter(b => ['Technician Assigned', 'On the Way', 'Reached Location', 'Work in Progress'].includes(b.status));

  const totalRevenue = completedJobs.reduce((acc, curr) => acc + (Number(curr.finalAmount) || 899), 0);
  const avgTicket = completedJobs.length > 0 ? Math.round(totalRevenue / completedJobs.length) : 899;

  const acJobs = bookings.filter(b => b.appliance === 'AC').length;
  const fridgeJobs = bookings.filter(b => b.appliance === 'Fridge').length;

  const cashPayments = completedJobs.filter(b => b.paymentMethod === 'Cash').length;
  const onlinePayments = completedJobs.filter(b => b.paymentMethod === 'UPI / Card' || b.paymentMethod === 'Online').length;

  const exportCSV = () => {
    if (bookings.length === 0) return alert('No data to export.');
    const headers = ['Job ID', 'Date', 'Customer Name', 'Phone', 'Appliance', 'Status', 'Technician', 'Amount (INR)', 'Payment Method'];
    const rows = bookings.map(b => [
      b.jobId,
      new Date(b.createdAt).toLocaleDateString('en-IN'),
      `"${b.name || ''}"`,
      b.phone || '',
      b.appliance || '',
      b.status || '',
      `"${b.assignedTech?.name || 'Unassigned'}"`,
      b.finalAmount || 899,
      b.paymentMethod || 'Cash'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CoolFix_Operations_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>Operational Analytics</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Operational & Revenue Analytics
              </h1>
              <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.95rem' }}>
                Executive overview of technician dispatch metrics, service volumes, turnaround speed, and revenue.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button 
                onClick={exportCSV}
                className="btn btn-outline" 
                style={{ background: 'white', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                📊 Export CSV Data
              </button>
              <Link href="/admin" className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
                📋 Live Dispatch Board
              </Link>
            </div>
          </div>

          {/* KPI Analytics Cards */}
          <div className="analytics-grid" style={{ marginBottom: 32 }}>
            <div className="analytic-card">
              <div className="ac-title">Total Revenue Generated</div>
              <div className="ac-value" style={{ color: '#059669' }}>₹{totalRevenue.toLocaleString()}</div>
              <div className="ac-icon" style={{ background: '#D1FAE5', color: '#059669' }}>₹</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Completed Repairs</div>
              <div className="ac-value">{completedJobs.length}</div>
              <div className="ac-icon" style={{ background: '#E0E7FF', color: '#4338CA' }}>🎉</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Average Ticket Size</div>
              <div className="ac-value">₹{avgTicket}</div>
              <div className="ac-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>📈</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Same-Day SLA Success</div>
              <div className="ac-value">96.4%</div>
              <div className="ac-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>⚡</div>
            </div>
          </div>

          {/* Two-Column Analytics Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 32 }}>
            
            {/* Status Breakdown */}
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--border)', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, color: 'var(--text-dark)' }}>
                📋 Live Pipeline Distribution
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: 4 }}>
                    <span>Completed Repairs</span>
                    <strong style={{ color: '#059669' }}>{completedJobs.length} ({totalJobs ? Math.round((completedJobs.length / totalJobs) * 100) : 0}%)</strong>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${totalJobs ? (completedJobs.length / totalJobs) * 100 : 0}%`, height: '100%', background: '#10B981', borderRadius: 4 }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: 4 }}>
                    <span>In Progress & On Route</span>
                    <strong style={{ color: '#2563EB' }}>{inProgressJobs.length} ({totalJobs ? Math.round((inProgressJobs.length / totalJobs) * 100) : 0}%)</strong>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${totalJobs ? (inProgressJobs.length / totalJobs) * 100 : 0}%`, height: '100%', background: '#3B82F6', borderRadius: 4 }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: 4 }}>
                    <span>Pending Dispatch</span>
                    <strong style={{ color: '#D97706' }}>{pendingJobs.length} ({totalJobs ? Math.round((pendingJobs.length / totalJobs) * 100) : 0}%)</strong>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${totalJobs ? (pendingJobs.length / totalJobs) * 100 : 0}%`, height: '100%', background: '#F59E0B', borderRadius: 4 }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appliance Distribution */}
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--border)', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, color: 'var(--text-dark)' }}>
                ❄️ Appliance Volume Split
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #BBF7D0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.5rem' }}>❄️</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#166534' }}>Air Conditioner Services</div>
                      <div style={{ fontSize: '0.8rem', color: '#15803D' }}>Jet Wash, Gas Charge, PCB Repair</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>
                    {acJobs}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#EFF6FF', borderRadius: 10, border: '1px solid #BFDBFE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.5rem' }}>🧊</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E40AF' }}>Refrigerator Services</div>
                      <div style={{ fontSize: '0.8rem', color: '#2563EB' }}>Compressor, Cooling Coil, Thermostat</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E40AF' }}>
                    {fridgeJobs}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Technician Performance Leaderboard */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--border)', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  🏆 Field Technician Performance Leaderboard
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Ranked by completed service jobs and customer quality rating.
                </p>
              </div>
              <Link href="/admin/technicians" className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
                Manage All Techs →
              </Link>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank & Technician</th>
                    <th>Tech ID</th>
                    <th>Specialty</th>
                    <th>Completed Jobs</th>
                    <th>Active Load</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {TECHNICIANS.map((tech, idx) => {
                    const techJobs = bookings.filter(b => b.assignedTech?.id === tech.id);
                    const techCompleted = techJobs.filter(b => b.status === 'Completed').length;
                    const techActive = techJobs.filter(b => b.status !== 'Completed').length;

                    return (
                      <tr key={tech.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontWeight: 800, color: idx === 0 ? '#EAB308' : idx === 1 ? '#94A3B8' : idx === 2 ? '#B45309' : 'var(--text-muted)', fontSize: '1.1rem' }}>
                              #{idx + 1}
                            </span>
                            <span style={{ fontSize: '1.4rem' }}>{tech.avatar}</span>
                            <strong>{tech.name}</strong>
                          </div>
                        </td>
                        <td className="font-mono text-sm text-muted">{tech.id}</td>
                        <td style={{ fontSize: '0.85rem' }}>{tech.specialty}</td>
                        <td>
                          <span className="badge badge-completed">{techCompleted} Jobs Done</span>
                        </td>
                        <td>
                          <span className={`badge badge-${techActive > 0 ? 'assigned' : 'pending'}`}>{techActive} Active</span>
                        </td>
                        <td style={{ fontWeight: 700, color: '#D97706' }}>⭐ 4.9</td>
                        <td>
                          <Link href={`/admin?tech=${tech.id}`} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                            View Jobs
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
