'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function HowItStep({ step, icon, title, desc, delay }) {
  return (
    <div className="how-step anim-fade-up" style={{ animationDelay: delay }}>
      <div className="how-step__num">{step}</div>
      <div className="how-step__icon">{icon}</div>
      <h3 className="how-step__title">{title}</h3>
      <p className="how-step__desc">{desc}</p>
      <style jsx>{`
        .how-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          position: relative;
        }
        .how-step__num {
          position: absolute;
          top: -12px; left: 50%;
          transform: translateX(-50%);
          width: 28px; height: 28px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          z-index: 1;
        }
        .how-step__icon {
          font-size: 2.5rem;
          width: 80px; height: 80px;
          background: white;
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 12px;
          transition: var(--transition);
          box-shadow: var(--card-shadow);
        }
        .how-step:hover .how-step__icon {
          border-color: var(--primary);
          box-shadow: 0 8px 32px rgba(227,30,36,0.15);
          transform: translateY(-4px);
        }
        .how-step__title { font-size: 1.1rem; font-weight: 700; }
        .how-step__desc { font-size: 0.875rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <section className="section how-section">
          <div className="container">
            <div className="section-header text-center">
              <div className="section-eyebrow">Process</div>
              <h2>How It <span className="gradient-text">Works</span></h2>
              <p className="section-sub">Get your appliance repaired in 4 simple steps.</p>
            </div>
            <div className="how-grid">
              <HowItStep step="1" icon="📋" title="Book Online"     desc="Fill in the quick booking form with your details and issue." delay="0.1s" />
              <HowItStep step="2" icon="👨‍🔧" title="Tech Assigned"  desc="A certified technician is assigned to your booking within hours." delay="0.2s" />
              <HowItStep step="3" icon="🔧" title="Repair Done"    desc="Your appliance is repaired at your location, same day." delay="0.3s" />
              <HowItStep step="4" icon="⭐" title="Rate & Review" desc="Share your experience and help us improve." delay="0.4s" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .how-section { background: var(--bg-soft); border-radius: var(--radius-xl); margin: 20px; padding: 60px 0; }
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
        .how-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        @media (max-width: 1024px) {
          .how-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .how-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .how-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
