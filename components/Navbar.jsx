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

    if (userRole === 'worker' && !activeWorker) {
      try {
        const saved = localStorage.getItem('coolfix_worker');
        if (saved) {
          const parsed = JSON.parse(saved);
          setActiveWorker(parsed.tech || parsed);
        }
      } catch (e) {}
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [userRole, workerInfo, activeWorker]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('coolfix_worker');
    localStorage.removeItem('coolfix_admin');
    localStorage.removeItem('coolfix_user');
    router.push('/login');
  };

  const displayName = activeWorker?.name ? `${activeWorker.name.split(' ')[0]} (${activeWorker.techId || activeWorker.id || 'Tech'})` : 'Worker: Tech #101';

  return (
    <>
      <header className={`glass-header ${scrolled ? 'scrolled' : ''}`}>
        <nav className="container nav-content">
          {/* Logo */}
          <Link href="/" className="logo font-headline">
            Cool<span className="text-primary">Fix</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="desktop-links">
            <li>
              <Link href="/services" className="nav-link">Services</Link>
            </li>
            <li>
              <Link href="/dashboard" className="nav-link">My Bookings</Link>
            </li>
            <li>
              <Link href="/how-it-works" className="nav-link">How it Works</Link>
            </li>
          </ul>

          {userRole === 'worker' ? (
            <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="badge badge-assigned" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>👨‍🔧</span>
                <span>{displayName}</span>
              </div>
              <button 
                type="button"
                className={`badge badge-${techStatus === 'Available' ? 'completed' : 'pending'}`} 
                onClick={() => setTechStatus(techStatus === 'Available' ? 'On Job' : 'Available')}
                style={{ cursor: 'pointer', border: 'none', padding: '6px 12px' }}
              >
                ● {techStatus}
              </button>
              <button 
                type="button"
                onClick={handleLogout} 
                className="btn btn-outline" 
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
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
