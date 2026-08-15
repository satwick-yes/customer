'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthRedirect = (e) => {
    e.preventDefault();
    router.push('/login');
    setMobileOpen(false);
  };

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

          <div className="desktop-actions">
            <Link href="/login" className="login-link">Login</Link>
            <Link href="/booking" className="btn btn-primary">
              <span className="material-symbols-outlined icon-filled">calendar_add_on</span>
              Book Repair
            </Link>
          </div>

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
          
          <button onClick={handleAuthRedirect} className="drawer-link auth-link">
            <span className="material-symbols-outlined">login</span> Login / Staff
          </button>
          
          <Link href="/booking" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
            Book Repair
          </Link>
        </div>
      </div>

      <style jsx>{`
        .glass-header {
          padding: 20px 0;
          transition: all 0.3s ease;
        }
        .glass-header.scrolled {
          padding: 12px 0;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.8rem;
          font-weight: 900;
          text-decoration: none;
          color: var(--text);
          letter-spacing: -0.05em;
        }
        
        .desktop-links {
          display: none;
          list-style: none;
          gap: 32px;
        }
        .nav-link {
          text-decoration: none;
          color: var(--text-muted);
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color 0.2s;
          position: relative;
        }
        .nav-link:hover {
          color: var(--text);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s;
          border-radius: 2px;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        .desktop-actions {
          display: none;
          align-items: center;
          gap: 20px;
        }
        .login-link {
          font-weight: 700;
          text-decoration: none;
          color: var(--text);
          font-family: 'Outfit', sans-serif;
        }
        .login-link:hover {
          color: var(--primary);
        }

        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 8px;
        }

        /* Mobile Drawer */
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: 80%;
          max-width: 400px;
          height: 100vh;
          background: white;
          z-index: 999;
          box-shadow: -10px 0 30px rgba(0,0,0,0.1);
          transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding-top: 80px;
        }
        .mobile-drawer.open {
          right: 0;
        }
        .drawer-content {
          display: flex;
          flex-direction: column;
          padding: 24px;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          text-decoration: none;
          color: var(--text);
          font-weight: 600;
          font-size: 1.1rem;
        }
        .drawer-divider {
          height: 1px;
          background: var(--border);
          margin: 16px 0;
        }
        .auth-link {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }

        @media (min-width: 768px) {
          .desktop-links { display: flex; }
          .desktop-actions { display: flex; }
          .mobile-toggle { display: none; }
          .mobile-drawer { display: none; }
        }
      `}</style>
    </>
  );
}
