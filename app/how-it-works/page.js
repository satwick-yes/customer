'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const LIFECYCLE_STEPS = [
  {
    step: '01',
    icon: '📱',
    title: 'Book in 2 Minutes',
    desc: 'Select your AC or Refrigerator type, brand, observed issue, address and preferred time slot.',
    highlight: 'Instant Job ID'
  },
  {
    step: '02',
    icon: '⚡',
    title: 'Instant Confirmation',
    desc: 'Our dispatch engine registers your request and alerts the nearest certified field specialist.',
    highlight: 'Real-Time Sync'
  },
  {
    step: '03',
    icon: '👨‍🔧',
    title: 'Master Tech Assigned',
    desc: 'View your technician’s name, contact, verified badge, rating (4.8+), and live ETA countdown.',
    highlight: '30m Avg. Arrival'
  },
  {
    step: '04',
    icon: '🔍',
    title: 'On-Site Diagnostics',
    desc: 'Technician conducts a comprehensive multi-point inspection with digital checklist tracking.',
    highlight: '₹499/₹299 Inspection'
  },
  {
    step: '05',
    icon: '📋',
    title: 'Digital Quote Approval',
    desc: 'Technician builds an itemized quote for necessary spare parts. You approve it directly on your screen.',
    highlight: 'Zero Surprises'
  },
  {
    step: '06',
    icon: '🛠️',
    title: 'Precision Repair & Testing',
    desc: 'Technician replaces parts using 100% genuine components and runs live diagnostic tests.',
    highlight: 'Checklist Verified'
  },
  {
    step: '07',
    icon: '🔐',
    title: 'Secure OTP & Payment',
    desc: 'Inspect the repair, provide your 4-digit completion OTP, and pay conveniently via UPI or Cash.',
    highlight: 'Secure OTP Gate'
  },
  {
    step: '08',
    icon: '🛡️',
    title: '60-Day Warranty & Invoice',
    desc: 'Download your official PDF invoice with instant 60-day service and 30-day parts warranty certificate.',
    highlight: 'Full Protection'
  }
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '110px', minHeight: '80vh', background: 'var(--bg-soft)' }}>
        <section style={{ padding: '40px 16px 20px', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--primary-ultra-light)', color: 'var(--primary)', fontWeight: 700, borderRadius: 30, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Transparent Service Journey
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 14 }}>
              How CoolFix <span className="gradient-text">Delivers Excellence</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              From online booking to verified OTP completion and 60-day warranty protection — every step is tracked live for complete peace of mind.
            </p>
          </div>
        </section>

        {/* 8-Step Grid */}
        <section style={{ padding: '30px 16px 60px' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              {LIFECYCLE_STEPS.map((s, idx) => (
                <div 
                  key={idx}
                  className="anim-fade-up"
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    border: '1px solid var(--border)',
                    padding: '24px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      {s.step}
                    </span>
                    <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 8 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1, marginBottom: 16 }}>
                    {s.desc}
                  </p>

                  <div style={{ background: 'var(--bg-soft)', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-block', width: 'fit-content' }}>
                    ✦ {s.highlight}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action CTA */}
            <div style={{ marginTop: 48, textAlign: 'center', background: 'white', padding: '36px 20px', borderRadius: 16, border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 8 }}>
                Ready for hassle-free appliance repair?
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
                Get master technicians dispatched to your doorstep within 30 minutes.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/booking" className="btn btn-primary" style={{ padding: '12px 28px', fontWeight: 700 }}>
                  Book Master Technician Now →
                </Link>
                <Link href="/dashboard" className="btn btn-outline" style={{ padding: '12px 20px' }}>
                  Track Existing Booking
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
