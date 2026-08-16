'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECHNICIANS } from '@/lib/technicians';
import { downloadJobSheetPDF } from '@/lib/pdfGenerator';

const AC_CHECKLIST = [
  'Filter Cleaning & Sanitization',
  'Refrigerant Gas Pressure & Leak Check',
  'Cooling & Condenser Coil Jet Wash',
  'Compressor Performance Test',
  'Capacitor & Electrical Check',
  'Drainage Pipe Flush & Cleaning'
];

const FRIDGE_CHECKLIST = [
  'Thermostat & Temperature Calibration',
  'Defrost Heater & Timer Testing',
  'Door Gasket Magnetic Seal Check',
  'Compressor & Relay Inspection',
  'Refrigerant Gas Charging',
  'Internal Fan Motor Check'
];

const STATUS_FLOW = [
  'Technician Assigned',
  'On the Way',
  'Reached Location',
  'Work in Progress',
  'Completed'
];

const getWorkerStatusBadge = (status) => {
  if (status === 'Completed') return 'badge-completed';
  if (status === 'Pending') return 'badge-pending';
  if (status === 'Technician Assigned') return 'badge-assigned';
  return 'badge-progress';
};

export default function WorkerPortal() {
  const [currentTech, setCurrentTech] = useState(TECHNICIANS[0]);
  const [jobId, setJobId] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checklist, setChecklist] = useState({});
  const [techNotes, setTechNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [allBookings, setAllBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned', 'unassigned', 'all'
  
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [otp, setOtp] = useState('');

  // Load tech profile from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('coolfix_worker');
      if (saved) {
        const parsed = JSON.parse(saved);
        const matched = TECHNICIANS.find(t => 
          (parsed.email && t.email.toLowerCase() === parsed.email.toLowerCase()) || 
          (parsed.techId && t.id === parsed.techId)
        );
        if (matched) setCurrentTech(matched);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const switchTech = (tech) => {
    setCurrentTech(tech);
    localStorage.setItem('coolfix_worker', JSON.stringify({ email: tech.email, name: tech.name, role: 'worker', techId: tech.id, tech }));
    setBooking(null);
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setAllBookings(data);
        // Also refresh currently open booking if any
        setBooking(prev => {
          if (!prev) return null;
          return data.find(b => b.jobId === prev.jobId) || prev;
        });
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
        setOtp('');
      } else {
        setError('Job ID not found. Check the ID and try again.');
      }
    } catch (err) {
      setError('An error occurred while fetching the job.');
    } finally {
      setLoading(false);
    }
  };

  const [quoteItems, setQuoteItems] = useState([]);
  const [newPartName, setNewPartName] = useState('');
  const [newPartCost, setNewPartCost] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);

  const openJob = (job) => {
    setJobId(job.jobId);
    setBooking(job);
    setChecklist(job.checklist || {});
    setTechNotes(job.techNotes || '');
    if (job.quote?.items?.length) {
      setQuoteItems(job.quote.items);
    } else {
      setQuoteItems([
        { name: `${job.appliance || 'Appliance'} Diagnostic & Inspection Visit`, cost: job.price || (job.appliance === 'AC' ? 499 : 299) }
      ]);
    }
    setOtp('');
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addQuoteItem = () => {
    if (!newPartName.trim() || !newPartCost || isNaN(Number(newPartCost))) return;
    setQuoteItems(prev => [...prev, { name: newPartName.trim(), cost: Number(newPartCost) }]);
    setNewPartName('');
    setNewPartCost('');
  };

  const removeQuoteItem = (index) => {
    setQuoteItems(prev => prev.filter((_, i) => i !== index));
  };

  const addPresetPart = (name, cost) => {
    setQuoteItems(prev => [...prev, { name, cost }]);
  };

  const handleSendQuote = async () => {
    if (!booking) return;
    const total = quoteItems.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
    setSendingQuote(true);
    setError('');
    try {
      const quoteObj = {
        items: quoteItems,
        total,
        status: 'PENDING',
        sentAt: new Date().toISOString(),
        technicianName: currentTech.name,
      };
      const newStatus = booking.status === 'Pending' || booking.status === 'Technician Assigned' || booking.status === 'On the Way' || booking.status === 'Reached Location' ? 'Work in Progress' : booking.status;
      
      const newHistory = [
        ...(booking.statusHistory || []),
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: `On-site estimate for ₹${total} sent to customer for approval by ${currentTech.name}`
        }
      ];

      const targetId = booking.docId || booking.jobId;
      const res = await fetch(`/api/bookings/${encodeURIComponent(targetId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: quoteObj,
          price: total,
          status: newStatus,
          statusHistory: newHistory
        })
      });

      if (res.ok) {
        setBooking(prev => ({
          ...prev,
          quote: quoteObj,
          price: total,
          status: newStatus,
          statusHistory: newHistory
        }));
        setSuccess(`⚡ Official Quote for ₹${total} sent to Customer for live approval!`);
        fetchBookings();
      }
    } catch (e) {
      console.error(e);
      setError('Failed to send quote.');
    } finally {
      setSendingQuote(false);
    }
  };

  const [syncingChecklist, setSyncingChecklist] = useState(false);

  const handleToggle = async (item) => {
    const updated = {
      ...checklist,
      [item]: !checklist[item]
    };
    setChecklist(updated);

    if (booking?.docId) {
      setSyncingChecklist(true);
      try {
        await fetch(`/api/bookings/${encodeURIComponent(booking.docId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checklist: updated })
        });
        setBooking(prev => prev ? { ...prev, checklist: updated } : prev);
      } catch (err) {
        console.error('Failed to sync checklist update:', err);
      } finally {
        setTimeout(() => setSyncingChecklist(false), 600);
      }
    }
  };

  const handleTechNotesBlur = async () => {
    if (booking?.docId && techNotes !== (booking.techNotes || '')) {
      try {
        await fetch(`/api/bookings/${encodeURIComponent(booking.docId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ techNotes })
        });
        setBooking(prev => prev ? { ...prev, techNotes } : prev);
      } catch (err) {
        console.error('Failed to sync technician remarks:', err);
      }
    }
  };

  const assignToMyself = async () => {
    if (!booking) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const newStatus = booking.status === 'Pending' ? 'Technician Assigned' : booking.status;
      const targetId = booking.docId || booking.jobId;
      const newHistory = [
        ...(booking.statusHistory || []),
        { 
          status: newStatus, 
          timestamp: new Date().toISOString(),
          note: `Claimed by ${currentTech.name} (${currentTech.id})`
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
        const updated = await res.json();
        setBooking(prev => ({ 
          ...prev, 
          ...updated,
          assignedTech: currentTech, 
          status: newStatus, 
          statusHistory: newHistory 
        }));
        setSuccess(`⚡ Job ${booking.jobId} successfully claimed & assigned to you (${currentTech.name})!`);
        fetchBookings();
      } else {
        setError('Failed to claim job. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to claim job');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!booking) return;
    setSubmitting(true);
    setError('');
    try {
      const targetId = booking.docId || booking.jobId;
      const newHistory = [
        ...(booking.statusHistory || []),
        { 
          status: newStatus, 
          timestamp: new Date().toISOString(),
          note: `Updated to "${newStatus}" by ${currentTech.name}`
        }
      ];
      
      const payload = {
        status: newStatus,
        statusHistory: newHistory
      };

      // If job was unassigned, assign it to current tech automatically
      if (!booking.assignedTech) {
        payload.assignedTech = currentTech;
      }

      const res = await fetch(`/api/bookings/${encodeURIComponent(booking.docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setBooking(prev => ({ ...prev, ...payload }));
        fetchBookings();
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      alert('Error updating status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteJob = async () => {
    if (booking.status === 'Completed') return; 

    // Validate OTP strictly
    if (!otp || otp.trim() !== String(booking.otp || '')) {
      setError(`Incorrect OTP! Ask customer for their 4-digit verification code.`);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const newHistory = [
        ...(booking.statusHistory || []),
        { 
          status: 'Completed', 
          timestamp: new Date().toISOString(),
          note: `Completed by ${currentTech.name} with OTP verification`
        }
      ];

      const res = await fetch(`/api/bookings/${encodeURIComponent(booking.docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          checklist, 
          techNotes, 
          paymentMethod,
          assignedTech: booking.assignedTech || currentTech,
          status: 'Completed',
          statusHistory: newHistory
        })
      });

      if (res.ok) {
        const completedBooking = { 
          ...booking, 
          checklist, 
          techNotes, 
          paymentMethod, 
          assignedTech: booking.assignedTech || currentTech,
          status: 'Completed', 
          statusHistory: newHistory 
        };
        setSuccess('🎉 Job successfully verified & marked as Completed! Job sheet PDF downloaded.');
        setBooking(completedBooking);
        fetchBookings(); 
        
        // Automatically download Job Sheet PDF onto device
        try {
          downloadJobSheetPDF(completedBooking);
        } catch (pdfErr) {
          console.error('PDF auto-download error:', pdfErr);
        }
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (err) {
      setError('Could not complete job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getScheduleTime = (dateStr) => {
    const d = new Date(dateStr);
    const end = new Date(d.getTime() + 2 * 60 * 60 * 1000); 
    return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Filter queues
  const myAssignedJobs = allBookings.filter(b => 
    b.status !== 'Completed' && 
    (b.assignedTech?.id === currentTech.id || b.assignedTech?.email?.toLowerCase() === currentTech.email.toLowerCase())
  );

  const unassignedJobs = allBookings.filter(b => 
    b.status !== 'Completed' && !b.assignedTech
  );

  const allActiveJobs = allBookings.filter(b => b.status !== 'Completed');

  const displayedQueue = 
    activeTab === 'assigned' ? myAssignedJobs :
    activeTab === 'unassigned' ? unassignedJobs :
    allActiveJobs;

  return (
    <>
      <Navbar userRole="worker" workerInfo={currentTech} />
      <div className="worker-page">
        <div className="container" style={{ padding: '30px 16px', maxWidth: '840px', margin: '0 auto' }}>
          
          {/* Technician Profile Card & Switcher */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: 'white',
            borderRadius: 14,
            padding: '20px 24px',
            marginBottom: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: '2.5rem', background: 'rgba(255,255,255,0.1)', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
                {currentTech.avatar}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd' }}>
                  Authenticated Field Technician
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0', color: 'white' }}>
                  {currentTech.name} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#60a5fa' }}>({currentTech.id})</span>
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  📞 {currentTech.phone} • {currentTech.specialty}
                </div>
              </div>
            </div>

            {/* Quick Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Switch Technician:</label>
              <select
                value={currentTech.id}
                onChange={(e) => {
                  const t = TECHNICIANS.find(tech => tech.id === e.target.value);
                  if (t) switchTech(t);
                }}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {TECHNICIANS.map(t => (
                  <option key={t.id} value={t.id} style={{ color: '#0f172a', background: 'white' }}>
                    {t.avatar} {t.name} ({t.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!booking ? (
            <>
              {/* Search Bar */}
              <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder="Search by Job ID (e.g., AC-12345A)..." 
                    value={jobId}
                    onChange={e => setJobId(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, minWidth: '220px', height: 48, margin: 0 }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ height: 48, padding: '0 24px', flexShrink: 0 }} disabled={loading}>
                    {loading ? 'Searching...' : 'Find Job'}
                  </button>
                </form>
                {error && <p className="form-error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</p>}
              </div>

              {/* Symmetrical Queue Tabs */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                marginBottom: 20
              }}>
                <button
                  onClick={() => setActiveTab('assigned')}
                  className={`btn ${activeTab === 'assigned' ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    height: 46,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    borderRadius: 10,
                    background: activeTab === 'assigned' ? 'var(--primary)' : 'white',
                    color: activeTab === 'assigned' ? 'white' : 'var(--text)',
                    border: activeTab === 'assigned' ? 'none' : '1px solid var(--border)',
                    boxShadow: activeTab === 'assigned' ? '0 4px 12px rgba(220,38,38,0.25)' : 'none'
                  }}
                >
                  <span>👨‍🔧 Assigned to Me</span>
                  <span style={{
                    background: activeTab === 'assigned' ? 'rgba(255,255,255,0.25)' : '#DC2626',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {myAssignedJobs.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('unassigned')}
                  className={`btn ${activeTab === 'unassigned' ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    height: 46,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    borderRadius: 10,
                    background: activeTab === 'unassigned' ? '#F59E0B' : 'white',
                    color: activeTab === 'unassigned' ? 'white' : 'var(--text)',
                    border: activeTab === 'unassigned' ? 'none' : '1px solid var(--border)',
                    boxShadow: activeTab === 'unassigned' ? '0 4px 12px rgba(245,158,11,0.25)' : 'none'
                  }}
                >
                  <span>⏳ Unassigned / Open</span>
                  <span style={{
                    background: activeTab === 'unassigned' ? 'rgba(255,255,255,0.25)' : '#F59E0B',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {unassignedJobs.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('all')}
                  className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    height: 46,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    borderRadius: 10,
                    background: activeTab === 'all' ? '#1E293B' : 'white',
                    color: activeTab === 'all' ? 'white' : 'var(--text)',
                    border: activeTab === 'all' ? 'none' : '1px solid var(--border)',
                    boxShadow: activeTab === 'all' ? '0 4px 12px rgba(30,41,59,0.25)' : 'none'
                  }}
                >
                  <span>📋 All Active ({allActiveJobs.length})</span>
                </button>
              </div>

              {/* Job List / Empty State */}
              {displayedQueue.length === 0 ? (
                <div className="card text-center" style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12, lineHeight: 1 }}>
                    {activeTab === 'assigned' ? '🎉' : '🔍'}
                  </div>
                  <h3 style={{ marginBottom: 8, fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 800 }}>
                    {activeTab === 'assigned' ? 'No pending jobs assigned to you right now' : 'No matching jobs in this category'}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 460, margin: '0 0 20px', lineHeight: 1.5 }}>
                    {activeTab === 'assigned' ? 'You have completed all your tickets! You can claim open jobs from the queue or wait for admin assignment.' : 'All repairs in this category are completed.'}
                  </p>
                  {activeTab === 'assigned' && unassignedJobs.length > 0 && (
                    <button 
                      onClick={() => setActiveTab('unassigned')}
                      className="btn btn-primary"
                      style={{ height: 44, padding: '0 22px', display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 8, fontWeight: 700 }}
                    >
                      <span>⚡ Claim from {unassignedJobs.length} Unassigned Jobs</span>
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 14 }}>
                  {displayedQueue.map(job => (
                    <div 
                      key={job.docId} 
                      className="card hover-elevate" 
                      onClick={() => openJob(job)}
                      style={{ 
                        cursor: 'pointer', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderLeft: job.assignedTech?.id === currentTech.id ? '4px solid var(--primary)' : '1px solid var(--border)',
                        padding: '16px 20px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{job.jobId}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {job.appliance === 'AC' ? '❄️ AC Repair' : '🧊 Fridge Repair'}
                          </span>
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-dark)' }}>
                          <strong>{job.name}</strong> • 📞 {job.phone}
                        </div>
                        <div className="text-sm text-muted" style={{ marginTop: 2 }}>
                          📍 {job.address}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div className={`badge ${getWorkerStatusBadge(job.status)}`} style={{ marginBottom: 6 }}>
                          {job.status}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {job.assignedTech ? (
                            <span style={{ color: job.assignedTech.id === currentTech.id ? 'var(--primary)' : '#475569', fontWeight: 600 }}>
                              {job.assignedTech.id === currentTech.id ? '✓ You' : job.assignedTech.name.split(' ')[0]}
                            </span>
                          ) : (
                            <span style={{ color: '#D97706', fontWeight: 600 }}>⚡ Unassigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Selected Job Detail View */
            <div className="card anim-fade-up" style={{ padding: 24 }}>
              <button 
                onClick={() => setBooking(null)} 
                className="btn btn-outline" 
                style={{ padding: '6px 14px', marginBottom: 16, fontSize: '0.85rem' }}
              >
                ← Back to Jobs Queue
              </button>

              {success && (
                <div style={{
                  background: '#ECFDF5',
                  border: '1.5px solid #10B981',
                  color: '#065F46',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 18,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }} className="anim-fade-in">
                  <span>🎉</span> {success}
                </div>
              )}

              {error && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1.5px solid #EF4444',
                  color: '#991B1B',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 18,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }} className="anim-fade-in">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="job-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h2 style={{ marginBottom: 4, fontSize: '1.6rem' }}>{booking.jobId}</h2>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge ${getWorkerStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                    {booking.assignedTech && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Technician: <strong style={{ color: '#1e40af' }}>{booking.assignedTech.name} ({booking.assignedTech.id})</strong>
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{booking.price || (booking.appliance === 'AC' ? 499 : 299)}
                  </div>
                  <div className="text-sm text-muted">{booking.appliance} Service & Repair</div>
                </div>
              </div>

              {/* Claim Job Banner if unassigned */}
              {(!booking.assignedTech || booking.assignedTech.id !== currentTech.id) && booking.status !== 'Completed' && (
                <div style={{
                  margin: '18px 0',
                  background: '#FFFBEB',
                  border: '1.5px solid #FDE68A',
                  borderRadius: 10,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.9rem' }}>
                      {booking.assignedTech ? `Currently assigned to ${booking.assignedTech.name}` : '⚠️ Job is currently unassigned'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#B45309' }}>
                      Click to reassign/claim this job under your profile ({currentTech.name}).
                    </div>
                  </div>
                  <button 
                    onClick={assignToMyself}
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  >
                    ⚡ Claim / Assign to Me
                  </button>
                </div>
              )}

              <div className="divider" style={{ margin: '20px 0' }} />

              {/* Customer Details Box */}
              <div className="customer-details" style={{ background: 'var(--bg-soft)', padding: 18, borderRadius: 10, marginBottom: 24, border: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: 14, fontSize: '1rem', color: 'var(--text-dark)' }}>Customer & Location Info</h4>
                <div style={{ display: 'grid', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined text-primary">person</span>
                    <div>
                      <strong>{booking.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issue: {booking.issue}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined text-primary">phone</span>
                    <a href={`tel:${booking.phone}`} style={{ flex: 1, color: 'var(--text-dark)', textDecoration: 'none', fontWeight: 600 }}>{booking.phone}</a>
                    <a href={`tel:${booking.phone}`} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      📞 Call Customer
                    </a>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span className="material-symbols-outlined text-primary" style={{ marginTop: 2 }}>location_on</span>
                    <div style={{ flex: 1, color: 'var(--text-dark)' }}>{booking.address}</div>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '6px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      📍 Open Maps
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined text-primary">schedule</span>
                    <span>Scheduled Slot: <strong>{getScheduleTime(booking.createdAt)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Real-time Status Buttons */}
              <h4 style={{ marginBottom: 12 }}>Real-Time Live Status Workflow</h4>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 14 }}>
                Advance your progress live. The customer tracking dashboard and Admin table update automatically.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
                {STATUS_FLOW.map(s => {
                  const isCurrent = booking.status === s;
                  if (s === 'Completed') return null; // handled with OTP gate
                  return (
                    <button 
                      key={s}
                      onClick={() => updateStatus(s)}
                      disabled={isCurrent || booking.status === 'Completed' || submitting}
                      className={`btn ${isCurrent ? 'btn-primary' : 'btn-outline'}`}
                      style={{ 
                        flex: '1 1 auto', 
                        fontSize: '0.85rem',
                        padding: '10px 14px',
                        fontWeight: isCurrent ? 700 : 500
                      }}
                    >
                      {isCurrent ? `✓ ${s}` : s}
                    </button>
                  );
                })}
              </div>

              {/* Diagnostic Checklist */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                <h4 style={{ margin: 0 }}>Diagnostic & Repair Checklist</h4>
                {syncingChecklist ? (
                  <span style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span className="loader" style={{ width: 12, height: 12, borderWidth: 2 }} /> Syncing live...
                  </span>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                    ⚡ Real-time synced with Customer & Admin
                  </span>
                )}
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 14 }}>
                Check items as you inspect and complete tasks. Changes update the customer live tracking and admin portal in real time.
              </p>
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

              {/* Technician Remarks / Notes */}
              <h4 style={{ marginBottom: 8 }}>Technician Field Remarks</h4>
              <textarea 
                className="form-input" 
                rows={3} 
                placeholder="E.g., Cleared clogged drain, replaced 35uF capacitor, gas pressure optimal at 65 PSI."
                value={techNotes}
                onChange={e => setTechNotes(e.target.value)}
                onBlur={handleTechNotesBlur}
                disabled={booking.status === 'Completed'}
                style={{ width: '100%', marginBottom: 24, resize: 'vertical' }}
              />

              {/* On-Site Quotation & Parts Approval Builder */}
              <div style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>📋</span> On-Site Quotation & Extra Parts Builder
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0' }}>
                      Add required spare parts and labor. Sends an instant quote to the customer's phone for digital approval.
                    </p>
                  </div>

                  {booking.quote && (
                    <span className={`badge badge-${booking.quote.status === 'APPROVED' ? 'completed' : booking.quote.status === 'REJECTED' ? 'pending' : 'progress'}`} style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      {booking.quote.status === 'APPROVED' ? '✅ Customer Approved' : booking.quote.status === 'REJECTED' ? '❌ Customer Declined' : '⏳ Awaiting Customer Approval'}
                    </span>
                  )}
                </div>

                {/* Quick Presets */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                    + Quick Add Common Spare Parts:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(booking.appliance === 'AC' ? [
                      { name: '35µF Heavy Duty Capacitor', cost: 450 },
                      { name: 'Copper Pipe Section (1 Meter)', cost: 850 },
                      { name: 'R32/R410A Gas Top-up & Refill', cost: 1200 },
                      { name: 'Indoor Coil Jet Cleaning', cost: 500 },
                      { name: 'Drain Pipe Replacement', cost: 250 },
                      { name: 'Contactor / Relay Replacement', cost: 650 },
                    ] : [
                      { name: 'Defrost Thermostat / Bi-Metal', cost: 450 },
                      { name: 'PTC Starter Relay & OLP', cost: 550 },
                      { name: 'R134a/R600a Gas Charging', cost: 1100 },
                      { name: 'Door Gasket Magnetic Seal', cost: 750 },
                      { name: 'Evaporator Fan Motor', cost: 850 },
                    ]).map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addPresetPart(preset.name, preset.cost)}
                        disabled={booking.status === 'Completed'}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: 'white',
                          border: '1px solid #CBD5E1',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                      >
                        + {preset.name} (₹{preset.cost})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Item Adder */}
                {booking.status !== 'Completed' && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Custom Part or Labor description..."
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      className="form-input"
                      style={{ flex: 2, minWidth: '180px', margin: 0, height: 42, fontSize: '0.85rem' }}
                    />
                    <input
                      type="number"
                      placeholder="Amount (₹)"
                      value={newPartCost}
                      onChange={(e) => setNewPartCost(e.target.value)}
                      className="form-input"
                      style={{ width: '110px', margin: 0, height: 42, fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={addQuoteItem}
                      className="btn btn-outline"
                      style={{ height: 42, padding: '0 14px', fontSize: '0.85rem', fontWeight: 600, background: 'white' }}
                    >
                      + Add Item
                    </button>
                  </div>
                )}

                {/* Quote Table List */}
                <div style={{ background: 'white', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 14 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px' }}>Service / Part Description</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount</th>
                        {booking.status !== 'Completed' && <th style={{ padding: '8px 12px', width: 40 }}></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {quoteItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px 12px' }}>{item.name}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>₹{item.cost}</td>
                          {booking.status !== 'Completed' && (
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              {quoteItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeQuoteItem(idx)}
                                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
                        <td style={{ padding: '10px 12px' }}>Total Quotation Estimate:</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--primary)', fontSize: '1.05rem' }}>
                          ₹{quoteItems.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)}
                        </td>
                        {booking.status !== 'Completed' && <td></td>}
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {booking.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={handleSendQuote}
                    disabled={sendingQuote}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.88rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    {sendingQuote ? <span className="loader" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '⚡ Send Itemized Quote for Customer Live Approval'}
                  </button>
                )}
              </div>

              {/* Payment & OTP Completion Gate */}
              {booking.status !== 'Completed' ? (
                <div style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                  <h4 style={{ marginBottom: 6, color: '#0f172a' }}>💰 Payment & Secure OTP Verification</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
                    Collect the payment and ask the customer for their 4-digit verification code to seal the repair.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Payment Method</label>
                      <select 
                        className="form-input" 
                        value={paymentMethod} 
                        onChange={e => setPaymentMethod(e.target.value)}
                      >
                        <option value="Cash">💵 Cash Collection (₹{booking.price})</option>
                        <option value="UPI">📱 UPI / QR Scan (₹{booking.price})</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Customer 4-Digit OTP</label>
                      <input 
                        type="text" 
                        maxLength={4}
                        placeholder="••••"
                        className="form-input" 
                        value={otp}
                        onChange={e => { setOtp(e.target.value); setError(''); }}
                        style={{ letterSpacing: '8px', fontSize: '1.3rem', textAlign: 'center', fontWeight: 800, fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-muted" style={{ margin: '0 0 12px' }}>
                    💡 Customer can view their OTP live on their booking tracking screen.
                  </p>

                  {error && <p className="form-error" style={{ marginBottom: 16 }}>⚠️ {error}</p>}
                  {success && <p className="form-success" style={{ marginBottom: 16, color: '#059669', fontWeight: 600 }}>✅ {success}</p>}

                  <button 
                    onClick={handleCompleteJob} 
                    className="btn btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', height: 52, fontSize: '1.05rem', fontWeight: 700 }}
                    disabled={submitting}
                  >
                    {submitting ? 'Verifying & Completing...' : 'Verify OTP & Complete Job'}
                  </button>
                </div>
              ) : (
                <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>✅</div>
                  <h3 style={{ color: '#065f46', marginBottom: 4 }}>Job Completed & Verified</h3>
                  <p style={{ color: '#047857', fontSize: '0.9rem', margin: '0 0 16px' }}>
                    Payment ({paymentMethod || 'Cash'}) and diagnosis notes have been securely recorded in the backend.
                  </p>
                  <button 
                    onClick={() => downloadJobSheetPDF(booking)}
                    className="btn btn-primary"
                    style={{ background: '#059669', borderColor: '#047857', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontWeight: 700 }}
                  >
                    📥 Download Job Sheet (PDF)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
