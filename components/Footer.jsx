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
</footer>
  );
}
