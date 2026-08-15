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
</>
  );
}
