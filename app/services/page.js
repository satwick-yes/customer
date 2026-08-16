'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const DETAILED_SERVICES = [
  {
    id: 'AC',
    name: 'Air Conditioner Service & Repair',
    icon: '❄️',
    basePrice: 499,
    priceSub: 'Comprehensive Diagnostic Visit & Inspection',
    tag: 'Same-Day 30m Dispatch',
    warranty: '60-Day Service Warranty + 30-Day Parts Guarantee',
    description: 'Expert diagnostics for Split, Window & Inverter ACs. Includes multi-point inspection, filter cleaning, and transparent on-site parts estimation.',
    subServices: [
      { title: 'Standard Jet Deep Cleaning', price: '₹499' },
      { title: 'Gas Leakage Detection & R32/R410A Refill', price: 'Quoted on-site' },
      { title: 'PCB Repair & Capacitor Replacement', price: 'Quoted on-site' },
      { title: 'Drainage & Water Dripping Fix', price: 'Included/Parts Extra' },
      { title: 'AC Uninstallation & Installation', price: 'From ₹799' }
    ]
  },
  {
    id: 'Fridge',
    name: 'Refrigerator Service & Repair',
    icon: '🧊',
    basePrice: 299,
    priceSub: 'Complete Diagnostic Inspection & Testing',
    tag: 'Certified Refrigeration Pros',
    warranty: '60-Day Service Warranty + 30-Day Parts Guarantee',
    description: 'Specialized repair for Single Door, Double Door Frost Free, and Inverter Side-by-Side refrigerators across all major brands.',
    subServices: [
      { title: 'Cooling & Thermostat Diagnosis', price: '₹299' },
      { title: 'Compressor Relay & Overload Protector', price: 'Quoted on-site' },
      { title: 'R134a/R600a Gas Pressure Charging', price: 'Quoted on-site' },
      { title: 'Defrost Heater & Bi-Metal Sensor Fix', price: 'Quoted on-site' },
      { title: 'Door Gasket & Magnetic Seal Alignment', price: 'Quoted on-site' }
    ]
  }
];

const UPCOMING_SERVICES = [
  { name: 'Washing Machine', icon: '🧺', desc: 'Front & Top Load Repairs' },
  { name: 'Microwave Oven', icon: '🍲', desc: 'Heating & Magnetron Fixes' },
  { name: 'RO Water Purifier', icon: '💧', desc: 'Filter & Membrane Service' },
  { name: 'Geyser & Water Heater', icon: '♨️', desc: 'Element & Thermostat' },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '110px', minHeight: '80vh', background: 'var(--bg-soft)' }}>
        {/* Header */}
        <section style={{ padding: '40px 16px 20px', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--primary-ultra-light)', color: 'var(--primary)', fontWeight: 700, borderRadius: 30, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Transparent Repair Pricing
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 14 }}>
              Certified Appliance Repairs with <span className="gradient-text">60-Day Warranty</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              No hidden costs or surprise bills. Pay an upfront diagnostic inspection fee; any replacement spare parts or major repairs are quoted on-site before work begins.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{ padding: '30px 16px 60px' }}>
          <div className="container" style={{ maxWidth: '1000px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
              {DETAILED_SERVICES.map((s) => (
                <div 
                  key={s.id}
                  className="anim-fade-up"
                  style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1.5px solid var(--border)',
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: '2.8rem' }}>{s.icon}</span>
                    <span style={{ background: '#ECFDF5', color: '#065F46', fontSize: '0.78rem', fontWeight: 800, padding: '4px 10px', borderRadius: 20 }}>
                      {s.tag}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 8 }}>
                    {s.name}
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
                    {s.description}
                  </p>

                  {/* Pricing Banner */}
                  <div style={{ background: 'var(--bg-soft)', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Diagnostic Inspection Fee
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>₹{s.basePrice}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+ spare parts if required</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                      🛡️ {s.warranty}
                    </div>
                  </div>

                  {/* Included & Common Sub-services */}
                  <div style={{ marginBottom: 24, flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Service Coverage & Quotations:
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {s.subServices.map((sub, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                          <span style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span> {sub.title}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>{sub.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link 
                    href={`/booking?appliance=${s.id}`} 
                    className="btn btn-primary btn-block"
                    style={{ height: 50, fontSize: '1rem', fontWeight: 700 }}
                  >
                    Book {s.id === 'AC' ? 'Air Conditioner' : 'Refrigerator'} Repair →
                  </Link>
                </div>
              ))}
            </div>

            {/* Upcoming Services Expansion Architecture */}
            <div style={{ marginTop: 60, padding: '36px', background: 'white', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Platform Expansion
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: 4 }}>
                  More Home Appliance Services Launching Soon
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Our master technician network is expanding across all major household electronics.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {UPCOMING_SERVICES.map((u, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: 10, background: 'var(--bg-soft)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 6 }}>{u.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{u.desc}</div>
                    <span style={{ display: 'inline-block', marginTop: 8, fontSize: '0.7rem', fontWeight: 700, color: '#3B82F6', background: '#DBEAFE', padding: '2px 8px', borderRadius: 10 }}>
                      Coming Soon
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Areas */}
            <div style={{ marginTop: 32, padding: '24px', background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderRadius: 14, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  📍 Active Service Coverage
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: 4 }}>
                  Chandigarh, Mohali, Panchkula, Zirakpur & Kharar
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: 2 }}>
                  30-Minute average technician arrival with same-day emergency slots.
                </div>
              </div>
              <Link href="/booking" className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 700 }}>
                Schedule Service Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
