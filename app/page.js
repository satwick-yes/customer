'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function AnimatedParticles() {
  return (
    <div className="particles" aria-hidden="true">
      {[...Array(14)].map((_, i) => (
        <div key={i} className={`particle particle--${i % 4}`} style={{
          left: `${(i * 7 + 5) % 100}%`,
          animationDelay: `${i * 0.9}s`,
          animationDuration: `${8 + (i % 5)}s`,
          width: `${6 + (i % 8)}px`,
          height: `${6 + (i % 8)}px`,
          opacity: 0.15 + (i % 3) * 0.05,
        }} />
      ))}
      <style jsx>{`
        .particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: white;
          animation: particleFloat linear infinite;
        }
      `}</style>
    </div>
  );
}


function FeatureItem({ icon, title, desc, delay }) {
  return (
    <div className="feat anim-fade-up" style={{ animationDelay: delay }}>
      <div className="feat__icon">{icon}</div>
      <div>
        <h4 className="feat__title">{title}</h4>
        <p className="feat__desc">{desc}</p>
      </div>
      <style jsx>{`
        .feat {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background: white;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          transition: var(--transition);
        }
        .feat:hover { box-shadow: var(--card-shadow-hover); transform: translateY(-3px); border-color: var(--border-strong); }
        .feat__icon {
          font-size: 1.8rem;
          width: 52px; height: 52px;
          background: var(--primary-ultra-light);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--transition);
        }
        .feat:hover .feat__icon { background: var(--primary); font-size: 2rem; }
        .feat__title { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
        .feat__desc { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; }
      `}</style>
    </div>
  );
}


function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ───── HERO ───── */}
        <section className="hero">
          <AnimatedParticles />
          <div className="container hero__content">
            <div className="hero__badge anim-fade-up">
              🏆 Trusted by 10,000+ customers across India
            </div>
            <h1 className="hero__heading anim-fade-up delay-100">
              Expert Appliance<br />
              <span className="hero__highlight">Repair at Your Doorstep</span>
            </h1>
            <p className="hero__sub anim-fade-up delay-200">
              Certified technicians, same-day service, and guaranteed repairs.<br />
              Book in under 2 minutes — we do the rest.
            </p>
            <div className="hero__ctas anim-fade-up delay-300">
              <Link href="/booking" id="hero-book-now" className="btn btn-white">
                📋 Book Now
              </Link>
              <Link href="/dashboard" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                📍 Track My Booking
              </Link>
            </div>
            <div className="hero__prices anim-fade-up delay-400">
              <div className="hero__price-badge">❄️ AC Repair — ₹499</div>
              <div className="hero__price-badge">🧊 Fridge Repair — ₹299</div>
            </div>
          </div>
          <div className="hero__wave">
            <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,60 C360,100 1080,0 1440,60 L1440,100 L0,100 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* ───── STATS ───── */}
        <section className="stats-section section-sm">
          <div className="container">
            <div className="stats-grid">
              {[
                { value: 10000, suffix: '+', label: 'Happy Customers' },
                { value: 500,   suffix: '+', label: 'Cities Covered' },
                { value: 98,    suffix: '%', label: 'Satisfaction Rate' },
                { value: 2,     suffix: 'h', label: 'Avg Response Time' },
              ].map((s, i) => (
                <div key={i} className="stat-card anim-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="stat-value">
                    <CountUp target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ───── FEATURES ───── */}
        <section className="section">
          <div className="container">
            <div className="section-header text-center">
              <div className="section-eyebrow">Why CoolFix</div>
              <h2>Why Choose <span className="gradient-text">Us?</span></h2>
            </div>
            <div className="features-grid">
              <FeatureItem icon="⚡" title="Same-Day Service"       desc="Book before noon and get same-day repair at your home." delay="0.1s" />
              <FeatureItem icon="🛡️" title="30-Day Guarantee"       desc="All repairs come with a 30-day service warranty." delay="0.15s" />
              <FeatureItem icon="👨‍🔧" title="Certified Technicians"  desc="All our technicians are trained and background-verified." delay="0.2s" />
              <FeatureItem icon="💳" title="Transparent Pricing"    desc="Fixed, flat-rate pricing — no surprises on your bill." delay="0.25s" />
              <FeatureItem icon="📍" title="Real-Time Tracking"     desc="Track your technician and job status live from our dashboard." delay="0.3s" />
              <FeatureItem icon="📞" title="24/7 Support"           desc="Our customer care team is always available to assist you." delay="0.35s" />
            </div>
          </div>
        </section>

        {/* ───── CTA BANNER ───── */}
        <section className="cta-banner section">
          <div className="container">
            <div className="cta-inner anim-fade-up">
              <div className="cta-content">
                <h2>Ready to get your appliance fixed?</h2>
                <p>Book now and a technician will be at your door in no time.</p>
              </div>
              <Link href="/booking" id="cta-book-now" className="btn btn-white">
                Book Service Now →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        /* HERO */
        .hero {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 40%, #7B0000 100%);
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
          display: flex;
          align-items: center;
          position: relative;
          padding-top: calc(var(--nav-height) + 60px);
          padding-bottom: 100px;
          overflow: hidden;
        }
        .hero__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          color: white;
          gap: 28px;
          position: relative;
          z-index: 1;
        }
        .hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          padding: 8px 20px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .hero__heading {
          color: white;
          text-shadow: 0 2px 24px rgba(0,0,0,0.2);
        }
        .hero__highlight {
          position: relative;
          display: inline-block;
        }
        .hero__highlight::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0; right: 0;
          height: 4px;
          background: rgba(255,255,255,0.5);
          border-radius: 2px;
        }
        .hero__sub {
          font-size: 1.15rem;
          opacity: 0.88;
          max-width: 560px;
          line-height: 1.7;
        }
        .hero__ctas {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hero__prices {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hero__price-badge {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          padding: 8px 20px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }
        .hero__wave {
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          line-height: 0;
        }
        .hero__wave svg { width: 100%; height: 80px; }

        /* STATS */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .stat-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px 20px;
          text-align: center;
          box-shadow: var(--card-shadow);
          transition: var(--transition);
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: var(--card-shadow-hover); }
        .stat-value { font-size: 2.4rem; font-weight: 900; color: var(--primary); }
        .stat-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; margin-top: 4px; }

        /* SECTION SHARED */
        .section-header { margin-bottom: 56px; }
        .section-eyebrow {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary);
          background: var(--primary-ultra-light);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          margin-bottom: 16px;
        }
        .section-sub {
          color: var(--text-muted);
          margin-top: 12px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        /* FEATURES */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* CTA */
        .cta-banner { background: var(--bg-soft); }
        .cta-inner {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border-radius: var(--radius-xl);
          padding: 56px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          color: white;
          box-shadow: 0 20px 60px rgba(227, 30, 36, 0.3);
          overflow: hidden;
          position: relative;
        }
        .cta-inner::before {
          content: '';
          position: absolute;
          right: -80px; top: -80px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .cta-content h2 { color: white; margin-bottom: 8px; }
        .cta-content p { opacity: 0.85; font-size: 1.05rem; }

        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .features-grid { grid-template-columns: 1fr; }
          .cta-inner { flex-direction: column; text-align: center; padding: 40px 24px; }
          .hero__ctas { flex-direction: column; align-items: center; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
