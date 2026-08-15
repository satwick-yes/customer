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
