'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobSheet from '@/components/JobSheet';
import { TECHNICIANS } from '@/lib/technicians';
import { downloadJobSheetPDF } from '@/lib/pdfGenerator';

const ITEMS_PER_PAGE = 10;

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Real-time notification & live activity state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const prevBookingsRef = useRef(null);

  // Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [applianceFilter, setApplianceFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-dismiss toast after 6s
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        // Sort by newest first
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Real-time field event detection
        if (prevBookingsRef.current) {
          const prevMap = new Map(prevBookingsRef.current.map(b => [b.jobId, b]));
          const newEvents = [];

          sorted.forEach(curr => {
            const prev = prevMap.get(curr.jobId);
            if (prev) {
              // 1. Technician Claimed / Assigned
              if (!prev.assignedTech && curr.assignedTech) {
                newEvents.push({
                  id: Date.now() + Math.random(),
                  type: 'claim',
                  icon: '⚡',
                  title: 'Job Claimed by Technician',
                  message: `👨‍🔧 ${curr.assignedTech.name} (${curr.assignedTech.id}) claimed Job ${curr.jobId}`,
                  time: new Date(),
                  job: curr
                });
              } else if (prev.assignedTech?.id !== curr.assignedTech?.id && curr.assignedTech) {
                newEvents.push({
                  id: Date.now() + Math.random(),
                  type: 'reassign',
                  icon: '👨‍🔧',
                  title: 'Technician Assigned',
                  message: `Job ${curr.jobId} assigned to ${curr.assignedTech.name} (${curr.assignedTech.id})`,
                  time: new Date(),
                  job: curr
                });
              }

              // 2. Status Changed
              if (prev.status !== curr.status) {
                newEvents.push({
                  id: Date.now() + Math.random(),
                  type: 'status',
                  icon: curr.status === 'On the Way' ? '🛵' : curr.status === 'Reached Location' ? '📍' : curr.status === 'Completed' ? '🎉' : '🔧',
                  title: `Status: ${curr.status}`,
                  message: `Job ${curr.jobId} updated to "${curr.status}" by ${curr.assignedTech?.name || 'Technician'}`,
                  time: new Date(),
                  job: curr
                });
              }

              // 3. Checklist Progress Changed
              const prevCheckCount = prev.checklist ? Object.values(prev.checklist).filter(Boolean).length : 0;
              const currCheckCount = curr.checklist ? Object.values(curr.checklist).filter(Boolean).length : 0;
              if (currCheckCount > prevCheckCount) {
                newEvents.push({
                  id: Date.now() + Math.random(),
                  type: 'checklist',
                  icon: '✅',
                  title: 'Checklist Progress',
                  message: `Diagnostic & repair tasks completed (${currCheckCount} checks) on ${curr.jobId}`,
                  time: new Date(),
                  job: curr
                });
              }
            } else {
              // Brand new booking created
              newEvents.push({
                id: Date.now() + Math.random(),
                type: 'new_booking',
                icon: '📋',
                title: 'New Booking Received',
                message: `New ${curr.appliance} service booking ${curr.jobId} for ${curr.name}`,
                time: new Date(),
                job: curr
              });
            }
          });

          if (newEvents.length > 0) {
            setNotifications(prev => [...newEvents, ...prev].slice(0, 30));
            setActiveToast(newEvents[0]);
          }
        }

        prevBookingsRef.current = sorted;
        setBookings(sorted);
        setSelectedBooking(prev => {
          if (!prev) return null;
          return sorted.find(b => b.jobId === prev.jobId) || prev;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Real-time polling
    const interval = setInterval(() => {
      fetchBookings();
    }, 2500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assignTechnician = async (docId, techId) => {
    const booking = bookings.find(b => b.docId === docId);
    if (!booking) return;

    const tech = TECHNICIANS.find(t => t.id === techId) || null;
    const newStatus = tech ? (booking.status === 'Pending' ? 'Technician Assigned' : booking.status) : 'Pending';
    const newHistory = [
      ...(booking.statusHistory || []),
      { 
        status: newStatus, 
        timestamp: new Date().toISOString(),
        note: tech ? `Assigned to ${tech.name} (${tech.id})` : 'Unassigned technician'
      }
    ];

    // Optimistic update
    setBookings(prev => prev.map(b => b.docId === docId ? { 
      ...b, 
      assignedTech: tech, 
      status: newStatus, 
      statusHistory: newHistory 
    } : b));

    try {
      await fetch(`/api/bookings/${encodeURIComponent(docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assignedTech: tech, 
          status: newStatus, 
          statusHistory: newHistory 
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (docId, newStatus) => {
    if (newStatus === 'Completed') {
      if (!window.confirm('Are you sure you want to mark this job as Completed? This will automatically generate and download the official Job Sheet PDF.')) {
        return;
      }
    }
    
    try {
      const booking = bookings.find(b => b.docId === docId);
      const newHistory = [...(booking.statusHistory || []), { status: newStatus, timestamp: new Date().toISOString() }];
      const updatedBooking = { ...booking, status: newStatus, statusHistory: newHistory };
      
      // Optimistic update
      setBookings(prev => prev.map(b => b.docId === docId ? updatedBooking : b));

      if (newStatus === 'Completed') {
        try {
          downloadJobSheetPDF(updatedBooking);
        } catch (pdfErr) {
          console.error('Admin PDF auto-download error:', pdfErr);
        }
      }

      await fetch(`/api/bookings/${encodeURIComponent(docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, statusHistory: newHistory }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const downloadAllCompleted = () => {
    const completedList = bookings.filter(b => b.status === 'Completed');
    if (completedList.length === 0) {
      alert('No completed jobs found to download.');
      return;
    }
    let count = 0;
    completedList.forEach((b, index) => {
      setTimeout(() => {
        downloadJobSheetPDF(b);
      }, index * 400); // slight stagger so browser doesn't block multi-download
      count++;
    });
    alert(`Downloading ${count} completed Job Sheet PDFs to your computer.`);
  };

  const getStatusBadge = (status) => {
    const map = {
      'Pending': 'badge-pending',
      'Technician Assigned': 'badge-assigned',
      'On the Way': 'badge-progress',
      'Reached Location': 'badge-progress',
      'Work in Progress': 'badge-progress',
      'Completed': 'badge-completed'
    };
    return `badge ${map[status] || 'badge-pending'}`;
  };

  // --- Derived Analytics ---
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const totalToday = bookings.filter(b => new Date(b.createdAt) >= todayStart).length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const assignedCount = bookings.filter(b => b.assignedTech && b.status !== 'Completed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  // --- Filtering & Searching ---
  let filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.jobId && b.jobId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.phone && b.phone.includes(searchQuery)) ||
      (b.assignedTech?.name && b.assignedTech.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesAppliance = applianceFilter === 'All' || b.appliance === applianceFilter;
    const matchesTech = 
      techFilter === 'All' ? true :
      techFilter === 'Unassigned' ? !b.assignedTech :
      b.assignedTech?.id === techFilter;

    return matchesSearch && matchesStatus && matchesAppliance && matchesTech;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, applianceFilter, techFilter]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const currentData = filteredBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1>Admin Portal</h1>
              <p style={{ color: 'var(--text-muted)' }}>Manage jobs, track performance, and dispatch 5 master technicians in real-time.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
              {/* Notification Bell with Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="btn btn-outline"
                  style={{
                    background: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    position: 'relative'
                  }}
                  title="Real-Time Field Notifications"
                >
                  <span>🔔</span> Notifications
                  {notifications.length > 0 && (
                    <span style={{
                      background: 'var(--primary)',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '10px',
                      marginLeft: 2
                    }}>
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '340px',
                    maxHeight: '400px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                    border: '1px solid var(--border)',
                    zIndex: 999,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      background: 'var(--bg-soft)',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <strong style={{ fontSize: '0.88rem' }}>🔔 Live Activity Feed</strong>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => setNotifications([])}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div style={{ overflowY: 'auto', maxHeight: '320px', padding: '6px 0' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          No recent activity. Live field technician events will pop up here!
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (n.job) {
                                setSelectedBooking(n.job);
                                setShowNotifications(false);
                              }
                            }}
                            style={{
                              padding: '10px 16px',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              display: 'flex',
                              gap: 10,
                              alignItems: 'flex-start',
                              transition: 'background 0.2s'
                            }}
                          >
                            <span style={{ fontSize: '1.2rem', marginTop: 2 }}>{n.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-dark)' }}>{n.title}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text)', marginTop: 2 }}>{n.message}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>
                                {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={downloadAllCompleted}
                className="btn btn-outline"
                style={{ background: 'white', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600 }}
                title="Download all completed Job Sheets as PDF"
              >
                📥 Export Completed PDFs
              </button>
              <div className="live-indicator">
                <span className="rt-dot"></span> Live Updates
              </div>
            </div>
          </div>

          {/* ANALYTICS CARDS */}
          <div className="analytics-grid">
            <div className="analytic-card">
              <div className="ac-title">Total Jobs Today</div>
              <div className="ac-value">{totalToday}</div>
              <div className="ac-icon">📅</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Active Dispatched</div>
              <div className="ac-value">{assignedCount}</div>
              <div className="ac-icon" style={{ background: '#E0E7FF', color: '#4338CA' }}>👨‍🔧</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Pending Assignment</div>
              <div className="ac-value">{pendingCount}</div>
              <div className="ac-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>⏳</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Total Revenue</div>
              <div className="ac-value">₹{totalRevenue.toLocaleString()}</div>
              <div className="ac-icon" style={{ background: '#D1FAE5', color: '#059669' }}>📈</div>
            </div>
          </div>

          {/* SEARCH AND FILTERS */}
          <div className="filters-card">
            <div className="search-box">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder="Search by Job ID, Name, Phone, or Technician..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-selects">
              <select value={techFilter} onChange={e => setTechFilter(e.target.value)} className="form-input">
                <option value="All">All Technicians</option>
                <option value="Unassigned">⚠️ Unassigned Only</option>
                {TECHNICIANS.map(t => (
                  <option key={t.id} value={t.id}>{t.avatar} {t.name} ({t.id})</option>
                ))}
              </select>

              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input">
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Technician Assigned">Technician Assigned</option>
                <option value="On the Way">On the Way</option>
                <option value="Reached Location">Reached Location</option>
                <option value="Work in Progress">Work in Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select value={applianceFilter} onChange={e => setApplianceFilter(e.target.value)} className="form-input">
                <option value="All">All Appliances</option>
                <option value="AC">AC</option>
                <option value="Fridge">Fridge</option>
              </select>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="admin-card">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><span className="loader" /></div>
            ) : currentData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No jobs match your current filters.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Appliance</th>
                      <th>Assigned Technician</th>
                      <th>OTP</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((b) => (
                      <tr key={b.docId}>
                        <td className="font-mono text-sm text-muted"><strong>{b.jobId}</strong></td>
                        <td>{new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>
                          <div className="font-bold">{b.name}</div>
                          <div className="text-sm text-muted">{b.phone}</div>
                        </td>
                        <td>
                          <div>{b.appliance === 'AC' ? '❄️ AC' : '🧊 Fridge'}</div>
                          {b.checklist && Object.values(b.checklist).filter(Boolean).length > 0 && (
                            <div style={{ marginTop: 4, fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, background: '#D1FAE5', padding: '2px 6px', borderRadius: 4 }}>
                              <span>✓</span> {Object.values(b.checklist).filter(Boolean).length} checks
                            </div>
                          )}
                        </td>
                        <td>
                          <select 
                            value={b.assignedTech?.id || ''}
                            onChange={(e) => assignTechnician(b.docId, e.target.value)}
                            className="form-input"
                            style={{
                              fontSize: '0.85rem',
                              padding: '6px 10px',
                              background: b.assignedTech ? '#EFF6FF' : '#FFFBEB',
                              borderColor: b.assignedTech ? '#3B82F6' : '#F59E0B',
                              fontWeight: b.assignedTech ? 600 : 400,
                              color: b.assignedTech ? '#1E40AF' : '#92400E',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">⚡ Assign Tech...</option>
                            {TECHNICIANS.map(t => (
                              <option key={t.id} value={t.id}>
                                {t.avatar} {t.name} ({t.id})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {b.otp ? (
                            <span style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: 6 }}>{b.otp}</span>
                          ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                        <td>
                          <select 
                            value={b.status}
                            onChange={(e) => updateStatus(b.docId, e.target.value)}
                            className={getStatusBadge(b.status)}
                            style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Technician Assigned">Technician Assigned</option>
                            <option value="On the Way">On the Way</option>
                            <option value="Reached Location">Reached Location</option>
                            <option value="Work in Progress">Work in Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                              onClick={() => setSelectedBooking(b)}
                            >
                              Job Sheet
                            </button>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 10px', fontSize: '0.82rem', background: 'white' }}
                              onClick={() => downloadJobSheetPDF(b)}
                              title="Download PDF"
                            >
                              📄 PDF
                            </button>
                            <a 
                              href={`tel:${b.phone}`} 
                              className="btn-call"
                              title="Call Customer"
                            >
                              📞
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="page-btn"
                >
                  &larr; Prev
                </button>
                <div className="page-info">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="page-btn"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBooking && (
        <JobSheet
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onAssignTech={(techId) => {
            assignTechnician(selectedBooking.docId, techId);
          }}
        />
      )}

      {/* Real-time Field Notification Toast */}
      {activeToast && (
        <div 
          className="anim-fade-up" 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0F172A',
            color: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            maxWidth: '420px',
            border: '1.5px solid rgba(255,255,255,0.2)'
          }}
        >
          <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{activeToast.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#93C5FD' }}>{activeToast.title}</div>
            <div style={{ fontSize: '0.82rem', color: '#E2E8F0', marginTop: 2 }}>{activeToast.message}</div>
          </div>
          {activeToast.job && (
            <button
              onClick={() => {
                setSelectedBooking(activeToast.job);
                setActiveToast(null);
              }}
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', flexShrink: 0 }}
            >
              View Job
            </button>
          )}
          <button
            onClick={() => setActiveToast(null)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.1rem', cursor: 'pointer', padding: 4 }}
          >
            ✕
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
