'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECHNICIANS } from '@/lib/technicians';

const REVIEWS = [
  {
    name: 'Amanpreet Singh',
    location: 'Sector 35, Chandigarh',
    appliance: 'Daikin 1.5 Ton Inverter AC',
    rating: 5,
    date: '2 days ago',
    text: 'Rajesh arrived in under 25 minutes! Diagnosed a faulty capacitor immediately and replaced it with genuine part. Real-time quote on screen was super transparent.'
  },
  {
    name: 'Priya Sharma',
    location: 'Phase 7, Mohali',
    appliance: 'Samsung Frost Free Refrigerator',
    rating: 5,
    date: '3 days ago',
    text: 'Great service! Cooling had completely stopped in the lower compartment. The technician cleared the ice blockage and refilled gas. Received official invoice on WhatsApp.'
  },
  {
    name: 'Vikram Mehta',
    location: 'Sector 20, Panchkula',
    appliance: 'Voltas Split AC',
    rating: 5,
    date: '1 week ago',
    text: 'Water was dripping inside our bedroom. Booked at 10 AM, tech arrived by 10:40 AM with full jet cleaning gear. 60-day warranty gives complete peace of mind.'
  },
  {
    name: 'Dr. Sunita Kapur',
    location: 'VIP Road, Zirakpur',
    appliance: 'LG Double Door Fridge',
    rating: 5,
    date: '1 week ago',
    text: 'Extremely polite master technician. Used digital OTP confirmation before taking payment. Best appliance repair platform in the Tricity area!'
  }
];

const FAQS = [
  {
    q: 'What is included in the ₹499 / ₹299 inspection fee?',
    a: 'The inspection fee covers the technician visiting your location, complete multi-point diagnostic check, testing electrical components, minor adjustments/cleaning, and providing an upfront itemized estimate before any repair commences.'
  },
  {
    q: 'How are spare parts and major repairs quoted?',
    a: 'If any replacement component is required (e.g. capacitor, fan motor, copper pipe, or refrigerant gas), our technician provides an exact digital quote on your screen. Work only begins after you click Approve on your device.'
  },
  {
    q: 'How does the 60-Day Service Warranty work?',
    a: 'All completed repairs carry an official 60-Day Service Warranty and up to 30-Day warranty on replacement spare parts. If the same issue recurs during the warranty period, we re-service your appliance free of charge.'
  },
  {
    q: 'How fast can a master technician arrive at my home?',
    a: 'Our average arrival time in Chandigarh, Mohali, Panchkula, and Zirakpur is 30 to 45 minutes for same-day express bookings.'
  },
  {
    q: 'What if I decide not to proceed with the repair after inspection?',
    a: 'You only pay the standard diagnostic inspection fee (₹499 for AC / ₹299 for Fridge). There is zero obligation to proceed with major repairs.'
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    // Load Spline viewer dynamically
    if (!document.querySelector('script[src="https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js';
      document.head.appendChild(script);
    }

    // Permanently remove "Built with Spline" watermark from shadow DOM
    const removeSplineLogo = () => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        if (!viewer.shadowRoot.querySelector('#hide-spline-logo-style')) {
          const style = document.createElement('style');
          style.id = 'hide-spline-logo-style';
          style.textContent = `
            #logo, a#logo, a[href*="spline.design"], .spline-watermark {
              display: none !important;
              opacity: 0 !important;
              visibility: hidden !important;
              pointer-events: none !important;
              transform: scale(0) !important;
            }
          `;
          viewer.shadowRoot.appendChild(style);
        }

        const logo = viewer.shadowRoot.querySelector('#logo') || viewer.shadowRoot.querySelector('a[href*="spline.design"]');
        if (logo) {
          logo.style.display = 'none';
          logo.style.opacity = '0';
          logo.style.visibility = 'hidden';
          logo.remove();
        }
      }
    };

    const interval = setInterval(removeSplineLogo, 100);
    const timeout = setTimeout(() => clearInterval(interval), 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-bg" style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
            <spline-viewer url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" style={{ width: '100%', height: '100%' }}></spline-viewer>
          </div>
          <div className="hero-overlay" style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.75) 50%, rgba(15,23,42,0.25) 100%)' }}></div>
          
          <div className="container hero-content">
            <div className="hero-text-block anim-fade-up">
              <span className="hero-badge">
                <span className="hero-pulse"></span>
                📍 Serving Chandigarh, Mohali, Panchkula & Tricity
              </span>
              
              <h1 className="hero-title font-headline">
                AC & Refrigerator<br />
                Repair at Your<br />
                <span className="text-primary italic">Doorstep.</span>
              </h1>
              
              <p className="hero-desc">
                Certified master technicians • Transparent pricing from ₹299 • Same-day 30m dispatch • 
                <strong style={{ color: 'white' }}> 60-day service warranty</strong> included.
              </p>
              
              <div className="hero-actions">
                <Link href="/booking" className="btn btn-primary" style={{ height: '56px', fontSize: '1.05rem', padding: '0 32px' }}>
                  <span className="material-symbols-outlined icon-filled">bolt</span>
                  Book Master Service Now
                </Link>
                <Link href="/dashboard" className="btn btn-outline hero-btn-outline" style={{ height: '56px' }}>
                  <span className="material-symbols-outlined">radar</span>
                  Track Live Booking
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <p className="stat-val font-headline">4.9/5</p>
                  <p className="stat-label">Verified Ratings</p>
                </div>
                <div className="stat-item">
                  <p className="stat-val font-headline">30m</p>
                  <p className="stat-label">Avg. Arrival</p>
                </div>
                <div className="stat-item">
                  <p className="stat-val font-headline">12k+</p>
                  <p className="stat-label">Homes Serviced</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE DIFFERENCE SECTION */}
        <section className="difference-section carbon-texture">
          <div className="container">
            <div className="section-header text-center">
              <p className="section-eyebrow text-primary">Why 12,000+ neighbors choose us</p>
              <h2 className="font-headline section-title">The <span className="text-primary italic">CoolFix</span> Standard</h2>
            </div>

            <div className="diff-grid">
              <div className="diff-card">
                <div className="diff-icon-wrap" style={{ background: 'var(--primary-container)', color: 'var(--primary)' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>verified_user</span>
                </div>
                <span className="diff-number">01</span>
                <h3 className="font-headline">Background-Verified Pros</h3>
                <p>Every technician is certified, background-checked, and brings 6 to 10+ years of technical field expertise.</p>
              </div>

              <div className="diff-card">
                <div className="diff-icon-wrap" style={{ background: '#E0E7FF', color: '#4338CA' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>security</span>
                </div>
                <span className="diff-number">02</span>
                <h3 className="font-headline">Digital Quote Approval</h3>
                <p>No surprise bills. Review itemized spare parts quotes directly on your screen and approve with one tap before work begins.</p>
              </div>

              <div className="diff-card">
                <div className="diff-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>workspace_premium</span>
                </div>
                <span className="diff-number">03</span>
                <h3 className="font-headline">60-Day Master Warranty</h3>
                <p>Complete peace of mind with 60-day service warranty and 30-day parts protection on all completed repairs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES CATALOG */}
        <section id="services" className="services-section">
          <div className="container">
            <div className="section-header text-center">
              <p className="section-eyebrow text-primary">Transparent Pricing</p>
              <h2 className="font-headline section-title">Diagnostic Inspection & <br /><span className="text-primary italic">Repair Services</span></h2>
              <div className="title-dash"></div>
            </div>

            <div className="services-grid">
              {/* AC Card */}
              <div className="service-col">
                <Link href="/booking?appliance=AC" className="service-card group">
                  <div className="service-img" style={{ backgroundImage: 'url(/ac_premium.jpg)' }}></div>
                  <div className="service-overlay"></div>
                  <div className="service-card-content">
                    <div>
                      <p className="service-price-label">Inspection from</p>
                      <p className="service-price font-headline">₹499</p>
                    </div>
                    <button className="service-action-btn">
                      <span className="material-symbols-outlined icon-filled">bolt</span>
                    </button>
                  </div>
                </Link>
                <div className="service-meta">
                  <h3 className="font-headline">Air Conditioner Service</h3>
                  <p>Split & Window AC • Jet Cleaning • Gas Refill • 60-Day Warranty</p>
                </div>
              </div>

              {/* Fridge Card */}
              <div className="service-col">
                <Link href="/booking?appliance=Fridge" className="service-card group">
                  <div className="service-img" style={{ backgroundImage: 'url(/fridge_premium.jpg)' }}></div>
                  <div className="service-overlay"></div>
                  <div className="service-card-content">
                    <div>
                      <p className="service-price-label">Inspection from</p>
                      <p className="service-price font-headline">₹299</p>
                    </div>
                    <button className="service-action-btn">
                      <span className="material-symbols-outlined icon-filled">bolt</span>
                    </button>
                  </div>
                </Link>
                <div className="service-meta">
                  <h3 className="font-headline">Refrigerator Service</h3>
                  <p>Single & Double Door • Compressor Repair • Thermostats • Gas Charging</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MEET OUR MASTER TECHNICIANS SECTION */}
        <section style={{ padding: '70px 16px', background: '#F8FAFC', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="section-header text-center" style={{ marginBottom: 40 }}>
              <p className="section-eyebrow text-primary">Master Field Specialists</p>
              <h2 className="font-headline section-title">Who Will Arrive at <span className="text-primary italic">Your Home?</span></h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '10px auto 0' }}>
                Every CoolFix technician is background-verified, company-certified, and carries genuine diagnostic equipment.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {TECHNICIANS.map((tech) => (
                <div 
                  key={tech.id}
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    border: '1.5px solid var(--border)',
                    padding: '24px 18px',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: 8 }}>{tech.avatar}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#EFF6FF', color: '#1E40AF', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10, marginBottom: 8 }}>
                    <span>🛡️</span> Verified Pro
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)' }}>{tech.name}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{tech.specialty}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid #F1F5F9', fontSize: '0.78rem' }}>
                    <span style={{ fontWeight: 700, color: '#D97706' }}>⭐ {tech.rating}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{tech.experience} exp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VERIFIED CUSTOMER REVIEWS */}
        <section style={{ padding: '70px 16px' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="section-header text-center" style={{ marginBottom: 40 }}>
              <p className="section-eyebrow text-primary">Customer Testimonials</p>
              <h2 className="font-headline section-title">Real Feedback from <span className="text-primary italic">Local Homes</span></h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              {REVIEWS.map((rev, i) => (
                <div 
                  key={i}
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    border: '1px solid var(--border)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ color: '#F59E0B', fontSize: '1.1rem' }}>{'★'.repeat(rev.rating)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5, flex: 1, marginBottom: 16 }}>
                    "{rev.text}"
                  </p>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{rev.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {rev.location}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>{rev.appliance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section style={{ padding: '70px 16px', background: 'var(--bg-soft)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="section-header text-center" style={{ marginBottom: 40 }}>
              <p className="section-eyebrow text-primary">Got Questions?</p>
              <h2 className="font-headline section-title">Frequently Asked <span className="text-primary italic">Questions</span></h2>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {FAQS.map((faq, i) => (
                <div 
                  key={i}
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 18px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid #F1F5F9' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
