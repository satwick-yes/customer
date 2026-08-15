'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">❄️ Cool<span>Fix</span></div>
            <p className="footer__tagline">Your trusted home appliance repair partner. Fast, reliable, and affordable.</p>
            <div className="footer__socials">
              <a href="#" aria-label="Facebook" className="social-icon">f</a>
              <a href="#" aria-label="Instagram" className="social-icon">ig</a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Services</h4>
            <ul>
              <li><Link href="/booking?appliance=AC">AC Repair — ₹499</Link></li>
              <li><Link href="/booking?appliance=Fridge">Fridge Repair — ₹299</Link></li>
              <li><Link href="/booking">Book Service</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/dashboard">Track Booking</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li>📞 +91 8250297411</li>
              <li>✉️ satwick1234509@gmail.com</li>
              <li>🕐 Mon–Sat, 8AM–8PM</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} CoolFix. All rights reserved.</p>
          <p className="footer__made">Made with ❤️ in India</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #18181B;
          color: rgba(255,255,255,0.8);
          padding: 64px 0 24px;
          margin-top: 80px;
        }
        .footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .footer__logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 12px;
        }
        .footer__logo span { color: var(--primary-light); }
        .footer__tagline {
          color: rgba(255,255,255,0.55);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .footer__socials { display: flex; gap: 10px; }
        .social-icon {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.08);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          transition: all 0.3s;
          text-transform: uppercase;
        }
        .social-icon:hover {
          background: var(--primary);
          transform: translateY(-2px);
        }
        .footer__col h4 {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: white;
          margin-bottom: 16px;
        }
        .footer__col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer__col ul li, .footer__col ul li a {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.55);
          transition: color 0.3s;
        }
        .footer__col ul li a:hover { color: var(--primary-light); }
        .footer__bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
        }
        .footer__made { color: rgba(255,255,255,0.4); }
        @media (max-width: 768px) {
          .footer__grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .footer__brand { grid-column: 1 / -1; }
          .footer__bottom { flex-direction: column; gap: 8px; text-align: center; }
        }
        @media (max-width: 480px) {
          .footer__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
