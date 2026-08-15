'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar({ userRole = 'public', workerInfo = null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [techStatus, setTechStatus] = useState('Available');
  const [activeWorker, setActiveWorker] = useState(workerInfo);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    if (workerInfo) {
      setActiveWorker(workerInfo);
    } else if (userRole === 'worker') {
      try {
        const saved = localStorage.getItem('coolfix_worker');
        if (saved) {
          const parsed = JSON.parse(saved);
          setActiveWorker(parsed.tech || parsed);
        }
      } catch (e) {}
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [userRole, workerInfo]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('coolfix_worker');
    localStorage.removeItem('coolfix_admin');
    localStorage.removeItem('coolfix_user');
    router.push('/login');
  };

  const current = workerInfo || activeWorker;
  const displayName = current?.name ? `${current.name.split(' ')[0]} (${current.techId || current.id || 'Tech'})` : 'Worker: Tech';

  return (
    <>
      <header className={`glass-header ${scrolled ? 'scrolled' : ''}`}>
        <nav className="container nav-content">
          {/* Logo */}
          <Link href={userRole === 'worker' ? '/worker' : '/'} className="logo font-headline">
            Cool<span className="text-primary">Fix</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="desktop-links">
            {userRole === 'worker' ? (
              <>
                <li>
                  <Link href="/worker" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 700 }}>Field Portal</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="nav-link">Customer View</Link>
                </li>
                <li>
                  <Link href="/admin" className="nav-link">Admin Dispatch</Link>
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

          {userRole === 'worker' ? (
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
                onClick={handleLogout} 
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
          ) : (
            <div className="desktop-actions">
              <Link href="/login" className="login-link">Login</Link>
              <Link href="/booking" className="btn btn-primary">
                <span className="material-symbols-outlined icon-filled">calendar_add_on</span>
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
          
          {userRole === 'worker' ? (
            <>
              <div className="drawer-link" style={{ padding: '12px 24px' }}>
                <span className="badge badge-assigned">👨‍🔧 {displayName}</span>
              </div>
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
                onClick={handleLogout} 
                className="btn btn-outline" 
                style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="drawer-link">
                <span className="material-symbols-outlined">login</span> Login / Staff
              </Link>
              
              <Link href="/booking" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                Book Repair
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
