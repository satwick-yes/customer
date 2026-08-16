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
      <main>
        {/* Frame-by-Frame Scroll Sequence Hero */}
        <FrameSequenceHero />

        {/* SECTION 2: THE COOLFIX RED & WHITE STANDARD */}
        <section className="difference-section carbon-texture" style={{ padding: '80px 0', background: '#09090B', color: 'white' }}>
          <div className="container">
            <div className="section-header text-center" style={{ marginBottom: 48 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(220, 38, 38, 0.18)',
                border: '1px solid #DC2626',
                color: '#F87171',
                padding: '6px 16px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 14
              }}>
                ✦ Why 12,000+ neighbors choose us
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: 'white' }}>
                The <span style={{ color: '#EF4444' }}>CoolFix</span> Master Standard
              </h2>
            </div>

            <div className="diff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div className="diff-card" style={{ background: '#18181B', border: '1.5px solid #27272A', borderRadius: 16, padding: '32px 24px' }}>
                <div className="diff-icon-wrap" style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#EF4444', width: 56, height: 56, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>verified_user</span>
                </div>
                <span className="diff-number" style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'monospace' }}>01</span>
                <h3 className="font-headline" style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 10px' }}>Background-Verified Pros</h3>
                <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Every technician is certified, background-checked, and brings 6 to 10+ years of technical field expertise in AC & refrigeration.
                </p>
              </div>

              <div className="diff-card" style={{ background: '#18181B', border: '1.5px solid #27272A', borderRadius: 16, padding: '32px 24px' }}>
                <div className="diff-icon-wrap" style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#EF4444', width: 56, height: 56, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>security</span>
                </div>
                <span className="diff-number" style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'monospace' }}>02</span>
                <h3 className="font-headline" style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 10px' }}>Digital Quote Approval</h3>
                <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Zero surprise bills. Review itemized spare parts quotes directly on your screen and approve with one tap before work begins.
                </p>
              </div>

              <div className="diff-card" style={{ background: '#18181B', border: '1.5px solid #27272A', borderRadius: 16, padding: '32px 24px' }}>
                <div className="diff-icon-wrap" style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#EF4444', width: 56, height: 56, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>workspace_premium</span>
                </div>
                <span className="diff-number" style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'monospace' }}>03</span>
                <h3 className="font-headline" style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 10px' }}>60-Day Master Warranty</h3>
                <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Complete peace of mind with 60-day service warranty and 30-day parts protection on all completed repairs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SERVICES CATALOG IN CRISP WHITE & BOLD RED */}
        <section id="services" className="services-section" style={{ padding: '80px 0', background: '#FFFFFF' }}>
          <div className="container">
            <div className="section-header text-center" style={{ marginBottom: 48 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#FEF2F2',
                border: '1px solid #FEE2E2',
                color: '#DC2626',
                padding: '6px 16px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 14
              }}>
                ⚡ Transparent Diagnostic Pricing
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#0F172A' }}>
                Professional Repair for <span style={{ color: '#DC2626' }}>Every Appliance</span>
              </h2>
            </div>

            <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
              {/* AC Card */}
              <div className="service-col">
                <Link href="/booking?appliance=AC" className="service-card group" style={{
                  display: 'block',
                  position: 'relative',
                  height: '320px',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 12px 32px rgba(220, 38, 38, 0.15)',
                  border: '2px solid #FEE2E2'
                }}>
                  <div className="service-img" style={{
                    backgroundImage: 'url(/ac_premium.jpg)',
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.4s ease'
                  }}></div>
                  <div className="service-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)'
                  }}></div>
                  <div className="service-card-content" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <div>
                      <p style={{ color: '#F87171', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection & Visit</p>
                      <p style={{ color: 'white', fontSize: '2.2rem', fontWeight: 900 }}>₹499</p>
                    </div>
                    <span style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: '#DC2626',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 4px 16px rgba(220,38,38,0.5)'
                    }}>
                      ⚡
                    </span>
                  </div>
                </Link>
                <div className="service-meta" style={{ marginTop: 16 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>Air Conditioner Service & Repair</h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: 4 }}>Split & Window AC • Jet Cleaning • Gas Refill • Inverter PCB • 60-Day Warranty</p>
                </div>
              </div>

              {/* Fridge Card */}
              <div className="service-col">
                <Link href="/booking?appliance=Fridge" className="service-card group" style={{
                  display: 'block',
                  position: 'relative',
                  height: '320px',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 12px 32px rgba(220, 38, 38, 0.15)',
                  border: '2px solid #FEE2E2'
                }}>
                  <div className="service-img" style={{
                    backgroundImage: 'url(/fridge_premium.jpg)',
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.4s ease'
                  }}></div>
                  <div className="service-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)'
                  }}></div>
                  <div className="service-card-content" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <div>
                      <p style={{ color: '#F87171', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection & Visit</p>
                      <p style={{ color: 'white', fontSize: '2.2rem', fontWeight: 900 }}>₹299</p>
                    </div>
                    <span style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: '#DC2626',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 4px 16px rgba(220,38,38,0.5)'
                    }}>
                      ⚡
                    </span>
                  </div>
                </Link>
                <div className="service-meta" style={{ marginTop: 16 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>Refrigerator Service & Repair</h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: 4 }}>Single & Double Door • Smart Inverter Fridges • Compressor & Gas • 60-Day Warranty</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: MEET OUR MASTER TECHNICIANS */}
        <section style={{ padding: '80px 16px', background: '#FAFAFA', borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="section-header text-center" style={{ marginBottom: 40 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#FEF2F2',
                border: '1px solid #FEE2E2',
                color: '#DC2626',
                padding: '6px 16px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 14
              }}>
                👨‍🔧 Master Field Specialists
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0F172A' }}>
                Who Will Arrive at <span style={{ color: '#DC2626' }}>Your Home?</span>
              </h2>
              <p style={{ color: '#64748B', maxWidth: '600px', margin: '10px auto 0' }}>
                Every CoolFix technician is background-verified, company-certified, and carries genuine diagnostic equipment.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {TECHNICIANS.map((tech) => (
                <div 
                  key={tech.id}
                  style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1.5px solid #FEE2E2',
                    padding: '24px 18px',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: 8 }}>{tech.avatar}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FEF2F2', color: '#DC2626', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10, marginBottom: 8 }}>
                    <span>🛡️</span> Verified Pro
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{tech.name}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>{tech.specialty}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid #F1F5F9', fontSize: '0.78rem' }}>
                    <span style={{ fontWeight: 700, color: '#D97706' }}>⭐ {tech.rating}</span>
                    <span style={{ color: '#64748B' }}>{tech.experience} exp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: REAL CUSTOMER TESTIMONIALS */}
        <section style={{ padding: '80px 16px', background: 'white' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div className="section-header text-center" style={{ marginBottom: 40 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#FEF2F2',
                border: '1px solid #FEE2E2',
                color: '#DC2626',
                padding: '6px 16px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 14
              }}>
                ⭐ Verified Reviews
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0F172A' }}>
                Real Feedback from <span style={{ color: '#DC2626' }}>Tricity Homes</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              {REVIEWS.map((rev, i) => (
                <div 
                  key={i}
                  style={{
                    background: '#FAFAFA',
                    borderRadius: 16,
                    border: '1px solid #E4E4E7',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ color: '#F59E0B', fontSize: '1.1rem' }}>{'★'.repeat(rev.rating)}</span>
                    <span style={{ fontSize: '0.75rem', color: '#71717A' }}>{rev.date}</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#18181B', lineHeight: 1.5, flex: 1, marginBottom: 16 }}>
                    "{rev.text}"
                  </p>

                  <div style={{ borderTop: '1px solid #E4E4E7', paddingTop: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{rev.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#71717A' }}>📍 {rev.location}</div>
                    <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600, marginTop: 2 }}>{rev.appliance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
        <section style={{ padding: '80px 16px', background: '#09090B', color: 'white' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="section-header text-center" style={{ marginBottom: 40 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(220, 38, 38, 0.2)',
                border: '1px solid #DC2626',
                color: '#F87171',
                padding: '6px 16px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 14
              }}>
                ❓ Got Questions?
              </div>
              <h2 className="font-headline section-title" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: 'white' }}>
                Frequently Asked <span style={{ color: '#EF4444' }}>Questions</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {FAQS.map((faq, i) => (
                <div 
                  key={i}
                  style={{
                    background: '#18181B',
                    borderRadius: 14,
                    border: '1px solid #27272A',
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
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.2rem', color: '#EF4444' }}>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 18px', fontSize: '0.88rem', color: '#A1A1AA', lineHeight: 1.6, borderTop: '1px solid #27272A' }}>
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
