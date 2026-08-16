'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FrameSequenceHero from '@/components/FrameSequenceHero';
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

  return (
    <>
      <Navbar />
      <main style={{ background: '#FFFFFF', color: '#18181B' }}>
        {/* Frame-by-Frame Scroll Sequence Hero */}
        <FrameSequenceHero />

        {/* SECTION 2: THE COOLFIX RED & WHITE STANDARD */}
        <section className="difference-section" style={{ padding: '90px 0', background: '#FFFFFF', borderTop: '2px solid #FEE2E2', borderBottom: '1px solid #F4F4F5' }}>
          <div className="container">
            <div className="section-header text-center" style={{ marginBottom: 52 }}>
              <div className="anim-float" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                color: '#DC2626',
                padding: '6px 20px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16,
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.08)'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} className="anim-pulse" />
                ✦ Why 12,000+ neighbors choose us
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3rem)', fontWeight: 900, color: '#0F172A' }}>
                The <span style={{ color: '#DC2626' }}>CoolFix</span> Master Standard
              </h2>
            </div>

            <div className="diff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
              <div className="diff-card interactive-card" style={{ background: '#FFFFFF', border: '2px solid #FEE2E2', borderRadius: 20, padding: '36px 28px', boxShadow: '0 4px 24px rgba(220, 38, 38, 0.06)' }}>
                <div className="diff-icon-wrap" style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', color: '#DC2626', width: 60, height: 60, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 4px 12px rgba(220,38,38,0.12)' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '34px' }}>verified_user</span>
                </div>
                <span className="diff-number" style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.25rem', fontFamily: 'monospace' }}>01</span>
                <h3 className="font-headline" style={{ color: '#0F172A', fontSize: '1.3rem', fontWeight: 800, margin: '8px 0 12px' }}>Background-Verified Pros</h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  Every technician is certified, background-checked, and brings 6 to 10+ years of technical field expertise in AC & refrigeration.
                </p>
              </div>

              <div className="diff-card interactive-card" style={{ background: '#FFFFFF', border: '2px solid #FEE2E2', borderRadius: 20, padding: '36px 28px', boxShadow: '0 4px 24px rgba(220, 38, 38, 0.06)' }}>
                <div className="diff-icon-wrap" style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', color: '#DC2626', width: 60, height: 60, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 4px 12px rgba(220,38,38,0.12)' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '34px' }}>security</span>
                </div>
                <span className="diff-number" style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.25rem', fontFamily: 'monospace' }}>02</span>
                <h3 className="font-headline" style={{ color: '#0F172A', fontSize: '1.3rem', fontWeight: 800, margin: '8px 0 12px' }}>Digital Quote Approval</h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  Zero surprise bills. Review itemized spare parts quotes directly on your screen and approve with one tap before work begins.
                </p>
              </div>

              <div className="diff-card interactive-card" style={{ background: '#FFFFFF', border: '2px solid #FEE2E2', borderRadius: 20, padding: '36px 28px', boxShadow: '0 4px 24px rgba(220, 38, 38, 0.06)' }}>
                <div className="diff-icon-wrap" style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', color: '#DC2626', width: 60, height: 60, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 4px 12px rgba(220,38,38,0.12)' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '34px' }}>workspace_premium</span>
                </div>
                <span className="diff-number" style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.25rem', fontFamily: 'monospace' }}>03</span>
                <h3 className="font-headline" style={{ color: '#0F172A', fontSize: '1.3rem', fontWeight: 800, margin: '8px 0 12px' }}>60-Day Master Warranty</h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  Complete peace of mind with 60-day service warranty and 30-day parts protection on all completed repairs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SERVICES CATALOG IN CRISP WHITE & BOLD RED */}
        <section id="services" className="services-section" style={{ padding: '90px 0', background: '#FAFAFA' }}>
          <div className="container">
            <div className="section-header text-center" style={{ marginBottom: 52 }}>
              <div className="anim-float" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                color: '#DC2626',
                padding: '6px 20px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16,
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.08)'
              }}>
                ⚡ Transparent Diagnostic Pricing
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3rem)', fontWeight: 900, color: '#0F172A' }}>
                Professional Repair for <span style={{ color: '#DC2626' }}>Every Appliance</span>
              </h2>
            </div>

            <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
              {/* AC Card */}
              <div className="service-col">
                <Link href="/booking?appliance=AC" className="service-card group interactive-card" style={{
                  display: 'block',
                  position: 'relative',
                  height: '340px',
                  borderRadius: 22,
                  overflow: 'hidden',
                  boxShadow: '0 12px 36px rgba(220, 38, 38, 0.12)',
                  border: '2px solid #FEE2E2',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <div className="service-img" style={{
                    backgroundImage: 'url(/ac_premium.jpg)',
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}></div>
                  <div className="service-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.25) 60%, transparent 100%)'
                  }}></div>
                  <div className="service-card-content" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '28px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <div>
                      <p style={{ color: '#FCA5A5', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection & Diagnostic Visit</p>
                      <p style={{ color: 'white', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>₹499</p>
                    </div>
                    <span className="btn-primary anim-pulse" style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      boxShadow: '0 6px 20px rgba(220,38,38,0.55)',
                      padding: 0
                    }}>
                      ⚡
                    </span>
                  </div>
                </Link>
                <div className="service-meta" style={{ marginTop: 18 }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>Air Conditioner Service & Repair</h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: 4, lineHeight: 1.5 }}>Split & Window AC • Jet Cleaning • Gas Refill • Inverter PCB • 60-Day Warranty</p>
                </div>
              </div>

              {/* Fridge Card */}
              <div className="service-col">
                <Link href="/booking?appliance=Fridge" className="service-card group interactive-card" style={{
                  display: 'block',
                  position: 'relative',
                  height: '340px',
                  borderRadius: 22,
                  overflow: 'hidden',
                  boxShadow: '0 12px 36px rgba(220, 38, 38, 0.12)',
                  border: '2px solid #FEE2E2',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <div className="service-img" style={{
                    backgroundImage: 'url(/fridge_premium.jpg)',
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}></div>
                  <div className="service-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.25) 60%, transparent 100%)'
                  }}></div>
                  <div className="service-card-content" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '28px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <div>
                      <p style={{ color: '#FCA5A5', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection & Diagnostic Visit</p>
                      <p style={{ color: 'white', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>₹299</p>
                    </div>
                    <span className="btn-primary anim-pulse" style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      boxShadow: '0 6px 20px rgba(220,38,38,0.55)',
                      padding: 0
                    }}>
                      ⚡
                    </span>
                  </div>
                </Link>
                <div className="service-meta" style={{ marginTop: 18 }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>Refrigerator Service & Repair</h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: 4, lineHeight: 1.5 }}>Single & Double Door • Smart Inverter Fridges • Compressor & Gas • 60-Day Warranty</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: MEET OUR MASTER TECHNICIANS */}
        <section style={{ padding: '90px 16px', background: '#FFFFFF', borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="section-header text-center" style={{ marginBottom: 48 }}>
              <div className="anim-float" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                color: '#DC2626',
                padding: '6px 20px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16
              }}>
                👨‍🔧 Master Field Specialists
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#0F172A' }}>
                Who Will Arrive at <span style={{ color: '#DC2626' }}>Your Home?</span>
              </h2>
              <p style={{ color: '#64748B', maxWidth: '600px', margin: '10px auto 0', fontSize: '0.95rem' }}>
                Every CoolFix technician is background-verified, company-certified, and carries genuine diagnostic equipment.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              {TECHNICIANS.map((tech) => (
                <div 
                  key={tech.id}
                  className="interactive-card"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    border: '2px solid #FEE2E2',
                    padding: '28px 20px',
                    textAlign: 'center',
                    boxShadow: '0 6px 20px rgba(220,38,38,0.05)',
                    cursor: 'default'
                  }}
                >
                  <div style={{ fontSize: '3.4rem', marginBottom: 12, transition: 'transform 0.3s ease' }}>{tech.avatar}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FEF2F2', color: '#DC2626', fontSize: '0.74rem', fontWeight: 800, padding: '3px 10px', borderRadius: 12, marginBottom: 10, border: '1px solid #FECACA' }}>
                    <span>🛡️</span> Verified Pro
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{tech.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 3 }}>{tech.specialty}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTop: '1px solid #F4F4F5', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 800, color: '#DC2626' }}>⭐ {tech.rating}</span>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>{tech.experience} exp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: REAL CUSTOMER TESTIMONIALS */}
        <section style={{ padding: '90px 16px', background: '#FAFAFA' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="section-header text-center" style={{ marginBottom: 48 }}>
              <div className="anim-float" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                color: '#DC2626',
                padding: '6px 20px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16
              }}>
                ⭐ Verified Reviews
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#0F172A' }}>
                Real Feedback from <span style={{ color: '#DC2626' }}>Tricity Homes</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
              {REVIEWS.map((rev, i) => (
                <div 
                  key={i}
                  className="interactive-card"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    border: '1.5px solid #FEE2E2',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ color: '#DC2626', fontSize: '1.15rem', letterSpacing: '2px' }}>{'★'.repeat(rev.rating)}</span>
                    <span style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 600 }}>{rev.date}</span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#18181B', lineHeight: 1.6, flex: 1, marginBottom: 18 }}>
                    "{rev.text}"
                  </p>

                  <div style={{ borderTop: '1px solid #F4F4F5', paddingTop: 14 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>{rev.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#71717A' }}>📍 {rev.location}</div>
                    <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 700, marginTop: 3 }}>{rev.appliance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
        <section style={{ padding: '90px 16px', background: '#FFFFFF', borderTop: '1px solid #E4E4E7' }}>
          <div className="container" style={{ maxWidth: '820px' }}>
            <div className="section-header text-center" style={{ marginBottom: 48 }}>
              <div className="anim-float" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                color: '#DC2626',
                padding: '6px 20px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16
              }}>
                ❓ Got Questions?
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#0F172A' }}>
                Frequently Asked <span style={{ color: '#DC2626' }}>Questions</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {FAQS.map((faq, i) => (
                <div 
                  key={i}
                  className="interactive-card"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    border: openFaq === i ? '2px solid #DC2626' : '1.5px solid #FEE2E2',
                    boxShadow: openFaq === i ? '0 8px 24px rgba(220,38,38,0.1)' : '0 2px 10px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: openFaq === i ? '#FEF2F2' : 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '1.02rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ 
                      fontSize: '1.4rem', 
                      color: '#DC2626', 
                      fontWeight: 900, 
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      display: 'inline-block'
                    }}>
                      {openFaq === i ? '▲' : '▼'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="anim-fade-up" style={{ padding: '16px 24px 22px', fontSize: '0.92rem', color: '#4B5563', lineHeight: 1.65, borderTop: '1px solid #FEE2E2' }}>
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
