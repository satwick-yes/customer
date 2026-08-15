'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobSheet from '@/components/JobSheet';

const ITEMS_PER_PAGE = 10;

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [applianceFilter, setApplianceFilter] = useState('All');
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
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (docId, newStatus) => {
    try {
      const booking = bookings.find(b => b.docId === docId);
      const newHistory = [...booking.statusHistory, { status: newStatus, timestamp: new Date().toISOString() }];
      
      // Optimistic update
      setBookings(prev => prev.map(b => b.docId === docId ? { ...b, status: newStatus, statusHistory: newHistory } : b));

      await fetch(`/api/bookings/${encodeURIComponent(docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, statusHistory: newHistory }),
      });
      // fetchBookings will catch any missed updates shortly
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'Pending': 'badge-pending',
      'Technician Assigned': 'badge-assigned',
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
  const totalRevenue = bookings
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  // --- Filtering & Searching ---
  let filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.jobId && b.jobId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.phone && b.phone.includes(searchQuery));
    
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesAppliance = applianceFilter === 'All' || b.appliance === applianceFilter;

    return matchesSearch && matchesStatus && matchesAppliance;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, applianceFilter]);

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
              <p style={{ color: 'var(--text-muted)' }}>Manage jobs, track performance, and assign technicians.</p>
            </div>
            <div className="live-indicator">
              <span className="rt-dot"></span> Live Updates
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
              <div className="ac-title">Pending Assignments</div>
              <div className="ac-value">{pendingCount}</div>
              <div className="ac-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>⏳</div>
            </div>
            <div className="analytic-card">
              <div className="ac-title">Total Revenue (Completed)</div>
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
                placeholder="Search by Job ID, Name, or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-selects">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input">
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Technician Assigned">Technician Assigned</option>
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
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((b) => (
                      <tr key={b.docId}>
                        <td className="font-mono text-sm text-muted">{b.jobId}</td>
                        <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="font-bold">{b.name}</div>
                          <div className="text-sm text-muted">{b.phone}</div>
                        </td>
                        <td>{b.appliance === 'AC' ? '❄️ AC' : '🧊 Fridge'}</td>
                        <td>
                          <select 
                            value={b.status}
                            onChange={(e) => updateStatus(b.docId, e.target.value)}
                            className={getStatusBadge(b.status)}
                            style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Technician Assigned">Technician Assigned</option>
                            <option value="Work in Progress">Work in Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                              onClick={() => setSelectedBooking(b)}
                            >
                              Job Sheet
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
        />
      )}

      <Footer />
</>
  );
}
