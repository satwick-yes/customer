'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          {/* Background Image */}
          <div className="hero-bg" style={{ backgroundImage: 'url(/hero_bg.jpg)' }}></div>
          <div className="hero-overlay"></div>
          
          <div className="container hero-content">
            <div className="hero-text-block anim-fade-up">
              <span className="hero-badge">
                <span className="hero-pulse"></span>
                25 Years of Technical Mastery
              </span>
              
              <h1 className="hero-title font-headline">
                Your <span className="text-primary italic">CoolFix</span><br />
                for Master<br />
                Repairs.
              </h1>
              
              <p className="hero-desc">
                India's trusted platform for appliance repair and genuine spare parts. 
                <strong style={{ color: 'white' }}> 60-day warranty</strong> & 
                <strong style={{ color: 'white' }}> Appliance Insurance</strong> included — 
                free service for a year.
              </p>
              
              <div className="hero-actions">
                <Link href="/booking" className="btn btn-primary" style={{ height: '56px', fontSize: '1.05rem', padding: '0 32px' }}>
                  <span className="material-symbols-outlined icon-filled">build</span>
                  Book Master Service
                </Link>
                <Link href="#services" className="btn btn-outline hero-btn-outline">
                  <span className="material-symbols-outlined">storefront</span>
                  Explore Services
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <p className="stat-val font-headline">4.9/5</p>
                  <p className="stat-label">Top Rated</p>
                </div>
                <div className="stat-item">
                  <p className="stat-val font-headline">30m</p>
                  <p className="stat-label">Avg. Arrival</p>
                </div>
                <div className="stat-item">
                  <p className="stat-val font-headline">12k+</p>
                  <p className="stat-label">Happy Clients</p>
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
              <h2 className="font-headline section-title">The <span className="text-primary italic">CoolFix</span> Difference</h2>
            </div>

            <div className="diff-grid">
              <div className="diff-card">
                <div className="diff-icon-wrap" style={{ background: 'var(--primary-container)', color: 'var(--primary)' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>verified_user</span>
                </div>
                <span className="diff-number">01</span>
                <h3 className="font-headline">25 Years Experience</h3>
                <p>Two decades of technical mastery. Every CoolFix pro is background-checked and highly trained for your complete peace of mind.</p>
              </div>

              <div className="diff-card">
                <div className="diff-icon-wrap" style={{ background: '#E0E7FF', color: '#4338CA' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>security</span>
                </div>
                <span className="diff-number">02</span>
                <h3 className="font-headline">Appliance Insurance</h3>
                <p>Free service charge for a full year and up to 50% off on every spare part. Ultimate protection for your home essentials.</p>
              </div>

              <div className="diff-card">
                <div className="diff-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>workspace_premium</span>
                </div>
                <span className="diff-number">03</span>
                <h3 className="font-headline">60-Day Warranty</h3>
                <p>We stand by our mastery. All repairs come with a rock-solid 60-day service warranty and up to 30 days on parts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DARK BANNER SECTION */}
        <section className="container banner-wrap">
          <div className="dark-banner">
            <div className="banner-glow-1"></div>
            <div className="banner-glow-2"></div>
            
            <div className="banner-content">
              <div className="banner-badge">
                <span className="material-symbols-outlined icon-filled text-primary" style={{ fontSize: '14px' }}>security</span>
                Exclusive Protection
              </div>
              <h2 className="font-headline banner-title">
                Free Service Charge <br />
                <span className="italic text-primary">for a full year.</span>
              </h2>
              <p className="banner-desc">
                Introducing <strong style={{ color: 'white' }}>CoolFix Appliance Insurance</strong>. Get zero service charges for 12 months and up to <strong className="text-primary">50% OFF</strong> on every spare part.
              </p>
            </div>
            
            <div className="banner-action">
              <Link href="/booking" className="btn btn-primary banner-btn">
                <span className="material-symbols-outlined icon-filled">bolt</span>
                Get Protected
              </Link>
              <p className="banner-note">*Available on AC and Fridge</p>
            </div>
          </div>
        </section>

        {/* SERVICES CATALOG */}
        <section id="services" className="services-section">
          <div className="container">
            <div className="section-header text-center">
              <p className="section-eyebrow text-primary">Repair Services</p>
              <h2 className="font-headline section-title">Professional repair for <br /><span className="text-primary italic">every</span> appliance</h2>
              <div className="title-dash"></div>
            </div>

            <div className="services-grid">
              {/* AC Card */}
              <div className="service-col">
                <Link href="/booking" className="service-card group">
                  <div className="service-img" style={{ backgroundImage: 'url(/ac_premium.jpg)' }}></div>
                  <div className="service-overlay"></div>
                  <div className="service-card-content">
                    <div>
                      <p className="service-price-label">Fixed Price</p>
                      <p className="service-price font-headline">₹499</p>
                    </div>
                    <button className="service-action-btn">
                      <span className="material-symbols-outlined icon-filled">bolt</span>
                    </button>
                  </div>
                </Link>
                <div className="service-meta">
                  <h3 className="font-headline">Air Conditioner</h3>
                  <p>Split & Window AC • Installation • Service</p>
                </div>
              </div>

              {/* Fridge Card */}
              <div className="service-col">
                <Link href="/booking" className="service-card group">
                  <div className="service-img" style={{ backgroundImage: 'url(/fridge_premium.jpg)' }}></div>
                  <div className="service-overlay"></div>
                  <div className="service-card-content">
                    <div>
                      <p className="service-price-label">Fixed Price</p>
                      <p className="service-price font-headline">₹299</p>
                    </div>
                    <button className="service-action-btn">
                      <span className="material-symbols-outlined icon-filled">bolt</span>
                    </button>
                  </div>
                </Link>
                <div className="service-meta">
                  <h3 className="font-headline">Refrigerator</h3>
                  <p>Single & Double Door • Smart Fridges • Gas Refill</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
</>
  );
}
