'use client';

import { useState, useEffect } from 'react';
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

  // Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [applianceFilter, setApplianceFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        // Sort by newest first
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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

      <Footer />
    </>
  );
}
