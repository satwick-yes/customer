'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar({ userRole = 'public', workerInfo = null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [techStatus, setTechStatus] = useState('Available');
  const [activeWorker, setActiveWorker] = useState(workerInfo);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [activeAdmin, setActiveAdmin] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    try {
      if (userRole === 'worker') {
        if (workerInfo) {
          setActiveWorker(workerInfo);
        } else {
          const savedWorker = localStorage.getItem('coolfix_worker');
          if (savedWorker) {
            const parsed = JSON.parse(savedWorker);
            setActiveWorker(parsed.tech || parsed);
          }
        }
      } else if (userRole === 'admin') {
        const savedAdmin = localStorage.getItem('coolfix_admin');
        if (savedAdmin) {
          setActiveAdmin(JSON.parse(savedAdmin));
        }
      } else if (userRole === 'public') {
        const savedUser = localStorage.getItem('coolfix_user');
        if (savedUser) {
          setActiveCustomer(JSON.parse(savedUser));
        }
      }
    } catch (e) {
      console.error(e);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [userRole, workerInfo]);

  const handleWorkerLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('coolfix_worker');
    setActiveWorker(null);
    router.push('/worker/login');
  };

  const handleAdminLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('coolfix_admin');
    setActiveAdmin(null);
    router.push('/admin/login');
  };

  const handleCustomerLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('coolfix_user');
    setActiveCustomer(null);
    router.push('/login');
  };

  const current = workerInfo || activeWorker;
  const displayName = current?.name ? `${current.name.split(' ')[0]} (${current.techId || current.id || 'Tech'})` : 'Tech Pro';

  return (
    <>
      <header className={`glass-header ${scrolled ? 'scrolled' : ''}`}>
        <nav className="container nav-content">
          {/* Logo with Role-specific Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link 
              href={userRole === 'admin' ? '/admin' : userRole === 'worker' ? '/worker' : '/'} 
              className="logo font-headline"
            >
              Cool<span className="text-primary">Fix</span>
            </Link>
            
            {userRole === 'admin' && (
              <span className="badge" style={{ background: '#DC2626', color: '#FFFFFF', fontSize: '0.72rem', padding: '2px 8px', letterSpacing: '0.05em' }}>
                ADMIN
              </span>
            )}
            {userRole === 'worker' && (
              <span className="badge" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', fontSize: '0.72rem', padding: '2px 8px' }}>
                FIELD PRO
              </span>
            )}
          </div>

          {/* Desktop Nav Links - Strictly Role segregated with active indicator */}
          <ul className="desktop-links">
            {userRole === 'admin' ? (
              <>
                <li>
                  <Link 
                    href="/admin" 
                    className="nav-link" 
                    style={{ 
                      color: pathname === '/admin' ? '#DC2626' : undefined, 
                      fontWeight: pathname === '/admin' ? 800 : 600,
                      borderBottom: pathname === '/admin' ? '2px solid #DC2626' : 'none'
                    }}
                  >
                    📋 Dispatch Board
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/technicians" 
                    className="nav-link"
                    style={{ 
                      color: pathname === '/admin/technicians' ? '#DC2626' : undefined, 
                      fontWeight: pathname === '/admin/technicians' ? 800 : 600,
                      borderBottom: pathname === '/admin/technicians' ? '2px solid #DC2626' : 'none'
                    }}
                  >
                    👨‍🔧 Technicians
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/analytics" 
                    className="nav-link"
                    style={{ 
                      color: pathname === '/admin/analytics' ? '#DC2626' : undefined, 
                      fontWeight: pathname === '/admin/analytics' ? 800 : 600,
                      borderBottom: pathname === '/admin/analytics' ? '2px solid #DC2626' : 'none'
                    }}
                  >
                    📊 Operational Stats
                  </Link>
                </li>
              </>
            ) : userRole === 'worker' ? (
              <>
                <li>
                  <Link 
                    href="/worker" 
                    className="nav-link" 
                    style={{ 
                      color: pathname === '/worker' ? '#DC2626' : undefined, 
                      fontWeight: pathname === '/worker' ? 800 : 600,
                      borderBottom: pathname === '/worker' ? '2px solid #DC2626' : 'none'
                    }}
                  >
                    ⚡ My Field Jobs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/worker/queue" 
                    className="nav-link"
                    style={{ 
                      color: pathname === '/worker/queue' ? '#DC2626' : undefined, 
                      fontWeight: pathname === '/worker/queue' ? 800 : 600,
                      borderBottom: pathname === '/worker/queue' ? '2px solid #DC2626' : 'none'
                    }}
                  >
                    📥 Open Queue
                  </Link>
                </li>
              </>
            ) : userRole === 'auth' ? (
              <>
                <li>
                  <Link href="/" className="nav-link">← Back to Customer Site</Link>
                </li>
                <li>
                  <Link href="/login" className="nav-link">Customer Sign In</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/services" className="nav-link">Services</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="nav-link">My Bookings</Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="nav-link">How it Works</Link>
                </li>
              </>
            )}
          </ul>

          {/* Right Action Bar */}
          {userRole === 'admin' ? (
            <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                className="badge" 
                style={{ 
                  height: '38px', 
                  fontSize: '0.84rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  fontWeight: 700,
                  padding: '0 14px',
                  borderRadius: '20px',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FECACA'
                }}
              >
                <span>🛡️</span>
                <span>{activeAdmin?.email || 'admin@coolfix.in'}</span>
              </div>
              <button 
                type="button"
                onClick={handleAdminLogout} 
                className="btn btn-outline" 
                style={{ 
                  height: '38px', 
                  padding: '0 16px', 
                  fontSize: '0.85rem', 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  borderRadius: '8px'
                }}
              >
                Logout
              </button>
            </div>
          ) : userRole === 'worker' ? (
            <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                className="badge badge-assigned" 
                style={{ 
                  height: '38px', 
                  fontSize: '0.85rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  fontWeight: 700,
                  padding: '0 14px',
                  borderRadius: '20px'
                }}
              >
                <span>{current?.avatar || '👨‍🔧'}</span>
                <span>{displayName}</span>
              </div>
              <button 
                type="button"
                className={`badge badge-${techStatus === 'Available' ? 'completed' : 'pending'}`} 
                onClick={() => setTechStatus(techStatus === 'Available' ? 'On Job' : 'Available')}
                style={{ 
                  height: '38px', 
                  cursor: 'pointer', 
                  border: 'none', 
                  padding: '0 14px', 
                  fontWeight: 600, 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  borderRadius: '20px',
                  fontSize: '0.85rem'
                }}
              >
                ● {techStatus}
              </button>
              <button 
                type="button"
                onClick={handleWorkerLogout} 
                className="btn btn-outline" 
                style={{ 
                  height: '38px', 
                  padding: '0 16px', 
                  fontSize: '0.85rem', 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  borderRadius: '8px'
                }}
              >
                Logout
              </button>
            </div>
          ) : userRole === 'auth' ? (
            <div className="desktop-actions">
              <Link href="/login" className="btn btn-outline" style={{ height: 40, fontSize: '0.88rem' }}>
                Customer Login
              </Link>
            </div>
          ) : (
            <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {activeCustomer ? (
                <>
                  <Link href="/dashboard" className="nav-link" style={{ fontWeight: 700, color: '#0F172A' }}>
                    👤 {activeCustomer.name ? activeCustomer.name.split(' ')[0] : 'My Profile'}
                  </Link>
                  <button 
                    type="button" 
                    onClick={handleCustomerLogout}
                    className="btn btn-outline" 
                    style={{ height: 38, padding: '0 12px', fontSize: '0.82rem' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="login-link">Login</Link>
              )}
              <Link href="/booking" className="btn btn-primary" style={{ height: 44, padding: '0 20px' }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '1.1rem' }}>calendar_add_on</span>
                Book Repair
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="drawer-content">
          {userRole === 'admin' ? (
            <>
              <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
                <span className="badge" style={{ background: '#DC2626', color: '#FFFFFF' }}>🛡️ Admin Operations</span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>{activeAdmin?.email || 'admin@coolfix.in'}</p>
              </div>
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined text-primary">dashboard</span> Dispatch Board
              </Link>
              <Link href="/admin/technicians" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined">engineering</span> Technicians
              </Link>
              <Link href="/admin/analytics" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined">analytics</span> Operational Stats
              </Link>
              <button 
                type="button"
                onClick={handleAdminLogout} 
                className="btn btn-outline" 
                style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                Logout Admin
              </button>
            </>
          ) : userRole === 'worker' ? (
            <>
              <div className="drawer-link" style={{ padding: '12px 0' }}>
                <span className="badge badge-assigned">👨‍🔧 {displayName}</span>
              </div>
              <Link href="/worker" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined text-primary">handyman</span> My Field Jobs
              </Link>
              <Link href="/worker/queue" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined">inbox</span> Open Queue
              </Link>
              <button 
                type="button"
                onClick={() => setTechStatus(techStatus === 'Available' ? 'On Job' : 'Available')} 
                className="drawer-link" 
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined" style={{ color: techStatus === 'Available' ? '#10B981' : '#F59E0B' }}>
                  {techStatus === 'Available' ? 'check_circle' : 'pending_actions'}
                </span>
                Status: {techStatus}
              </button>
              <button 
                type="button"
                onClick={handleWorkerLogout} 
                className="btn btn-outline" 
                style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                Logout Technician
              </button>
            </>
          ) : (
            <>
              <Link href="/" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined icon-filled text-primary">home</span> Home
              </Link>
              <Link href="/services" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined">handyman</span> Services
              </Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined">event_note</span> My Bookings
              </Link>
              <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined">help</span> How it Works
              </Link>
              
              <div className="drawer-divider"></div>
              
              {activeCustomer ? (
                <>
                  <div style={{ padding: '8px 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    👤 {activeCustomer.name || activeCustomer.phone || activeCustomer.email}
                  </div>
                  <button 
                    type="button"
                    onClick={handleCustomerLogout} 
                    className="btn btn-outline" 
                    style={{ marginTop: '12px', width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="drawer-link">
                  <span className="material-symbols-outlined">login</span> Customer Login
                </Link>
              )}
              
              <Link href="/booking" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
                Book Repair
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
