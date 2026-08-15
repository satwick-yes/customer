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

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: var(--bg-soft);
          padding: 120px 0 80px;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
        }
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #D1FAE5;
          color: #065F46;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
          border: 1px solid #A7F3D0;
        }
        .rt-dot {
          width: 8px; height: 8px;
          background: #10B981;
          border-radius: 50%;
          animation: pulse 1.5s ease infinite;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        .analytic-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--card-shadow);
          position: relative;
          overflow: hidden;
        }
        .ac-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .ac-value {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--text);
        }
        .ac-icon {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--primary-ultra-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .filters-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 16px;
          box-shadow: var(--card-shadow);
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-soft);
          padding: 0 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          min-width: 250px;
        }
        .search-box input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 12px 0;
          font-size: 0.95rem;
        }
        .filter-selects {
          display: flex;
          gap: 12px;
        }

        .admin-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          padding: 12px 16px;
          border-bottom: 2px solid var(--border);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
        }
        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
          transition: var(--transition);
        }
        .admin-table tr {
          transition: background-color 0.2s;
        }
        .admin-table tr:hover {
          background-color: #f8fafc;
        }
        .admin-table tr:last-child td {
          border-bottom: none;
        }

        .btn-call {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #f1f5f9;
          border: 1px solid var(--border);
          text-decoration: none;
          font-size: 1.1rem;
          transition: all 0.2s;
        }
        .btn-call:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          margin-top: 8px;
          border-top: 1px solid var(--border);
        }
        .page-btn {
          background: white;
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
        }
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-info {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .font-mono { font-family: monospace; }
        .text-sm { font-size: 0.85rem; }
        .text-muted { color: var(--text-muted); }
        .font-bold { font-weight: 700; }
        
        select.badge {
          outline: none;
          appearance: none;
          padding-right: 24px;
          background-image: url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position-x: 100%;
          background-position-y: 50%;
        }

        @media (max-width: 900px) {
          .analytics-grid { grid-template-columns: 1fr; }
          .admin-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .filters-card { flex-direction: column; }
          .filter-selects { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </>
  );
}
