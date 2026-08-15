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

      <style jsx>{`
        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: -2;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%);
          z-index: -1;
        }
        .hero-text-block {
          max-width: 650px;
          color: white;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(220, 38, 38, 0.2);
          color: var(--primary-light);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          border: 1px solid rgba(220, 38, 38, 0.3);
          margin-bottom: 24px;
        }
        .hero-pulse {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          margin-right: 12px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .hero-title {
          font-size: 4.5rem;
          line-height: 1;
          margin-bottom: 24px;
          color: white;
        }
        .hero-desc {
          font-size: 1.15rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 500px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
        }
        .hero-btn-outline {
          color: white;
          border-color: rgba(255,255,255,0.3);
          height: 56px;
        }
        .hero-btn-outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: white;
        }
        .hero-stats {
          display: flex;
          gap: 48px;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 32px;
        }
        .stat-val {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }
        .stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
          font-weight: 700;
          margin-top: 4px;
        }

        /* Difference Section */
        .difference-section {
          padding: 100px 0;
          background-color: var(--surface-low);
        }
        .section-header {
          margin-bottom: 60px;
        }
        .section-eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          margin-bottom: 12px;
        }
        .section-title {
          font-size: 3rem;
          color: var(--text);
        }
        .diff-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .diff-card {
          background: white;
          padding: 40px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .diff-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }
        .diff-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
        }
        .diff-number {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--border);
          letter-spacing: 0.2em;
          margin-bottom: 12px;
        }
        .diff-card h3 {
          font-size: 1.5rem;
          margin-bottom: 16px;
        }
        .diff-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        /* Banner */
        .banner-wrap {
          margin-bottom: 80px;
          margin-top: 40px;
        }
        .dark-banner {
          background: #18181B; /* Zinc 900 */
          border-radius: 3rem;
          padding: 60px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .banner-glow-1 {
          position: absolute;
          top: -100px;
          right: -50px;
          width: 300px;
          height: 300px;
          background: var(--primary);
          filter: blur(120px);
          opacity: 0.3;
          border-radius: 50%;
        }
        .banner-glow-2 {
          position: absolute;
          bottom: -100px;
          left: -50px;
          width: 300px;
          height: 300px;
          background: var(--primary);
          filter: blur(100px);
          opacity: 0.15;
          border-radius: 50%;
        }
        .banner-content {
          position: relative;
          z-index: 10;
          max-width: 600px;
        }
        .banner-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(220, 38, 38, 0.15);
          color: var(--primary-light);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          border: 1px solid rgba(220, 38, 38, 0.2);
          margin-bottom: 24px;
        }
        .banner-title {
          font-size: 3.5rem;
          color: white;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .banner-desc {
          color: rgba(255,255,255,0.6);
          font-size: 1.1rem;
        }
        .banner-action {
          position: relative;
          z-index: 10;
          text-align: right;
        }
        .banner-btn {
          height: 64px;
          padding: 0 40px;
          border-radius: 20px;
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .banner-note {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 16px;
          font-weight: 700;
        }

        /* Services Catalog */
        .services-section {
          padding: 80px 0 120px;
          background: var(--bg-main);
        }
        .title-dash {
          height: 3px;
          width: 60px;
          background: var(--primary);
          border-radius: 2px;
          margin: 24px auto 0;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 900px;
          margin: 60px auto 0;
        }
        .service-col {
          display: flex;
          flex-direction: column;
        }
        .service-card {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 2rem;
          overflow: hidden;
          display: block;
          text-decoration: none;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .service-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .service-card:hover .service-img {
          transform: scale(1.08);
        }
        .service-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        .service-card:hover .service-overlay {
          opacity: 0.9;
        }
        .service-card-content {
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          z-index: 10;
        }
        .service-price-label {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .service-price {
          font-size: 1.5rem;
          color: white;
        }
        .service-action-btn {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text);
          transition: all 0.3s;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .service-card:hover .service-action-btn {
          background: var(--primary);
          color: white;
          transform: scale(1.1);
        }
        .service-meta {
          margin-top: 20px;
          padding: 0 8px;
        }
        .service-meta h3 {
          font-size: 1.5rem;
          margin-bottom: 4px;
          transition: color 0.2s;
        }
        .service-card:hover + .service-meta h3 {
          color: var(--primary);
        }
        .service-meta p {
          font-size: 0.7rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        /* Mobile Responsiveness */
        @media (max-width: 1024px) {
          .hero-title { font-size: 3.5rem; }
          .banner-title { font-size: 2.5rem; }
          .dark-banner { padding: 40px; flex-direction: column; text-align: center; gap: 32px; border-radius: 2rem; }
          .banner-action { text-align: center; }
        }

        @media (max-width: 768px) {
          .hero-section { padding-top: 60px; min-height: 85vh; }
          .hero-overlay { background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 100%); }
          .hero-text-block { text-align: center; margin: 0 auto; }
          .hero-title { font-size: 2.5rem; }
          .hero-actions { flex-direction: column; width: 100%; }
          .hero-btn-outline { width: 100%; }
          .hero-stats { justify-content: center; gap: 24px; }
          
          .section-title { font-size: 2.2rem; }
          .diff-grid { grid-template-columns: 1fr; gap: 16px; }
          .diff-card { padding: 32px; text-align: center; display: flex; flex-direction: column; align-items: center; }
          
          .dark-banner { padding: 32px 24px; border-radius: 1.5rem; }
          .banner-title { font-size: 2rem; }
          
          .services-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </>
  );
}
