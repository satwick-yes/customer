'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

function ServiceCard({ appliance, price, icon, features, delay }) {
  return (
    <div className="svc-card anim-fade-up" style={{ animationDelay: delay }}>
      <div className="svc-card__icon-wrap">
        <span className="svc-card__icon">{icon}</span>
        <div className="svc-card__icon-bg" />
      </div>
      <h3 className="svc-card__name">{appliance} Repair</h3>
      <div className="svc-card__price">
        <span className="price-symbol">₹</span>
        <span className="price-amount">{price}</span>
        <span className="price-note">flat fee</span>
      </div>
      <ul className="svc-card__features">
        {features.map((f, i) => (
          <li key={i}><span className="check">✓</span> {f}</li>
        ))}
      </ul>
      <Link href={`/booking?appliance=${appliance}`} className="btn btn-primary svc-card__btn" id={`book-${appliance.toLowerCase()}`}>
        Book {appliance} Service
      </Link>
      <style jsx>{`
        .svc-card {
          background: white;
          border: 2px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          transition: var(--transition);
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .svc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
        }
        .svc-card:hover {
          border-color: var(--primary);
          box-shadow: 0 20px 60px rgba(227, 30, 36, 0.15);
          transform: translateY(-8px);
        }
        .svc-card__icon-wrap {
          position: relative;
          width: 96px; height: 96px;
          display: flex; align-items: center; justify-content: center;
        }
        .svc-card__icon {
          font-size: 3rem;
          position: relative;
          z-index: 1;
          animation: float 4s ease-in-out infinite;
        }
        .svc-card__icon-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--primary-ultra-light);
          transition: var(--transition);
        }
        .svc-card:hover .svc-card__icon-bg {
          background: linear-gradient(135deg, var(--primary-ultra-light) 0%, rgba(227,30,36,0.12) 100%);
          transform: scale(1.1);
        }
        .svc-card__name { font-size: 1.4rem; font-weight: 700; }
        .svc-card__price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          line-height: 1;
        }
        .price-symbol { font-size: 1.5rem; font-weight: 700; color: var(--primary); }
        .price-amount { font-size: 3rem; font-weight: 900; color: var(--primary); }
        .price-note { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; margin-left: 4px; }
        .svc-card__features { list-style: none; display: flex; flex-direction: column; gap: 8px; text-align: left; width: 100%; }
        .svc-card__features li { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 500; color: var(--text); }
        .check { color: var(--primary); font-weight: 700; font-size: 1rem; }
        .svc-card__btn { width: 100%; justify-content: center; }
      `}</style>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <section className="section">
          <div className="container">
            <div className="section-header text-center">
              <div className="section-eyebrow">Our Services</div>
              <h2>Choose Your <span className="gradient-text">Repair Service</span></h2>
              <p className="section-sub">Transparent, flat-rate pricing. No hidden charges. Ever.</p>
            </div>
            <div className="services-grid">
              <ServiceCard
                appliance="AC"
                price={499}
                icon="❄️"
                delay="0.1s"
                features={['Gas Refilling', 'Deep Cleaning', 'PCB Repair', 'Thermostat Check', '30-Day Service Warranty']}
              />
              <ServiceCard
                appliance="Fridge"
                price={299}
                icon="🧊"
                delay="0.2s"
                features={['Cooling Check', 'Gas Top-Up', 'Compressor Repair', 'Door Seal Fix', '30-Day Service Warranty']}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
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
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 800px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr; max-width: 400px; }
        }
      `}</style>
    </>
  );
}
