'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname.startsWith('/login');

  const customerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Track Booking', href: '/dashboard' },
    { label: 'Login', href: '/login' },
  ];

  const adminLinks = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Logout', href: '/' },
  ];

  const loginLinks = [
    { label: 'Home', href: '/' }
  ];

  let navLinks = customerLinks;
  if (isAdmin) navLinks = adminLinks;
  if (isLogin) navLinks = loginLinks;

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          <Link href="/" className="navbar__logo">
            <span className="navbar__logo-icon">❄️</span>
            <span className="navbar__logo-text">
              Cool<span className="text-red">Fix</span>
            </span>
          </Link>

          <ul className="navbar__links hide-mobile">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`navbar__link${pathname === link.href ? ' navbar__link--active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            {(!isAdmin && !isLogin) && (
              <Link href="/booking" className="btn btn-primary hide-mobile">
                Book Now
              </Link>
            )}
            <button
              className="navbar__hamburger hide-desktop"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              id="menu-toggle"
            >
              <span className={`hamburger__line${menuOpen ? ' open' : ''}`} />
              <span className={`hamburger__line${menuOpen ? ' open' : ''}`} />
              <span className={`hamburger__line${menuOpen ? ' open' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}>
        <ul className="mobile-menu__links">
          {navLinks.map((link, i) => (
            <li key={link.href} style={{ animationDelay: `${i * 0.06}s` }}>
              <Link href={link.href} className="mobile-menu__link">
                {link.label}
              </Link>
            </li>
          ))}
          {(!isAdmin && !isLogin) && (
            <li style={{ animationDelay: '0.24s' }}>
              <Link href="/booking" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Book Now
              </Link>
            </li>
          )}
        </ul>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: var(--nav-height);
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
          transition: var(--transition);
        }
        .navbar--scrolled {
          background: rgba(255,255,255,0.97);
          border-bottom-color: var(--border);
          box-shadow: 0 4px 24px rgba(227, 30, 36, 0.06);
        }
        .navbar__inner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text);
        }
        .navbar__logo-icon { font-size: 1.4rem; }
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 24px;
        }
        .navbar__link {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-weight: 500;
          color: var(--text);
          transition: var(--transition);
          font-size: 0.95rem;
        }
        .navbar__link:hover,
        .navbar__link--active {
          color: var(--primary);
          background: var(--primary-ultra-light);
        }
        .navbar__actions { display: flex; align-items: center; gap: 12px; }
        .navbar__hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .hamburger__line {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: var(--transition);
          transform-origin: center;
        }
        .hamburger__line:nth-child(1).open { transform: translateY(7px) rotate(45deg); }
        .hamburger__line:nth-child(2).open { opacity: 0; }
        .hamburger__line:nth-child(3).open { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu {
          position: fixed;
          top: var(--nav-height);
          left: 0;
          right: 0;
          background: white;
          z-index: 999;
          padding: 16px;
          border-bottom: 1px solid var(--border);
          transform: translateY(-10px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.25s ease;
          box-shadow: 0 8px 32px rgba(227, 30, 36, 0.1);
        }
        .mobile-menu--open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .mobile-menu__links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mobile-menu__link {
          display: block;
          padding: 14px 16px;
          font-weight: 500;
          color: var(--text);
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .mobile-menu__link:hover {
          background: var(--primary-ultra-light);
          color: var(--primary);
        }
      `}</style>
    </>
  );
}
