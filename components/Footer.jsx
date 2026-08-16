'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" style={{ background: '#0F172A', color: 'white', borderTop: '1px solid #1E293B', padding: '60px 0 30px' }}>
      <div className="container">
        <div className="footer__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12 }}>
              Cool<span style={{ color: 'var(--primary)' }}>Fix</span>
            </div>
            <p className="footer__tagline" style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>
              India's premier appliance repair platform. 25+ certified master technicians delivering transparent on-site repairs with 60-day warranty.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1E293B', padding: '6px 12px', borderRadius: 20, fontSize: '0.78rem', color: '#93C5FD', fontWeight: 700 }}>
              <span>🛡️</span> 60-Day Service Guarantee
            </div>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Appliance Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: '0.85rem' }}>
              <li><Link href="/booking?appliance=AC" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Air Conditioner Repair (₹499)</Link></li>
              <li><Link href="/booking?appliance=Fridge" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Refrigerator Repair (₹299)</Link></li>
              <li><Link href="/services" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Jet Deep Cleaning & Servicing</Link></li>
              <li><Link href="/services" style={{ color: '#CBD5E1', textDecoration: 'none' }}>R32/R410A Refrigerant Refill</Link></li>
              <li><Link href="/booking" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Same-Day Express Dispatch</Link></li>
            </ul>
          </div>

          {/* Customer & Operations */}
          <div className="footer__col">
            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Customer Hub</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: '0.85rem' }}>
              <li><Link href="/dashboard" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Track Live Booking</Link></li>
              <li><Link href="/how-it-works" style={{ color: '#CBD5E1', textDecoration: 'none' }}>8-Step Service Process</Link></li>
              <li><Link href="/login" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Customer Account Login</Link></li>
              <li><Link href="/services" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Transparent Pricing Policy</Link></li>
            </ul>
          </div>

          {/* Service Areas & Staff */}
          <div className="footer__col">
            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Coverage & Staff</h4>
            <div style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: 12 }}>
              📍 <strong>Primary Hubs:</strong> Chandigarh (All Sectors), Mohali (Phases 1-11), Panchkula, Zirakpur & Kharar.
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: '0.82rem' }}>
              <li><Link href="/worker/login" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>🛠️ Field Technician Login</Link></li>
              <li><Link href="/admin/login" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>🔒 Admin Operations Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom" style={{ borderTop: '1px solid #1E293B', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem', color: '#64748B' }}>
          <p>© {year} CoolFix Technologies Pvt Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>60-Day Service Warranty</span>
            <span>•</span>
            <span>Genuine Parts Guarantee</span>
            <span>•</span>
            <span>Verified Master Technicians</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
