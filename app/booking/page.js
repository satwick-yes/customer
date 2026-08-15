'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createBooking } from '@/lib/bookingService';

const PRICES = { AC: 499, Fridge: 299 };

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    appliance: searchParams.get('appliance') || '',
    name: '', phone: '', address: '', issue: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  const update = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = () => {
    if (!form.appliance) {
      setErrors({ appliance: 'Please select an appliance.' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Name is required.';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number.';
    if (!form.address.trim()) errs.address = 'Address is required.';
    if (!form.issue.trim())   errs.issue   = 'Please describe the issue.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const result = await createBooking(form);
      setBooking(result);
      setStep(3);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="booking-page">
        {/* Header */}
        <div className="booking-hero">
          <div className="container booking-hero__inner">
            <div className="booking-hero__text anim-fade-up">
              <h1>Schedule Your <span className="gradient-text">Repair</span></h1>
              <p>Takes less than 2 minutes. We'll handle the rest.</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="container form-wrap">
          {/* Step Indicator */}
          <div className="steps-indicator anim-fade-up">
            {['Select Appliance', 'Your Details', 'Confirmed!'].map((label, i) => (
              <div key={i} className={`si-step${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
                <div className="si-dot">{step > i + 1 ? '✓' : i + 1}</div>
                <span className="si-label hide-mobile">{label}</span>
                {i < 2 && <div className={`si-line${step > i + 1 ? ' filled' : ''}`} />}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="form-card anim-scale-in">
              <h2 className="form-card__title">Which appliance needs repair?</h2>
              <p className="form-card__sub">Select the appliance below</p>
              <div className="appliance-options">
                {['AC', 'Fridge'].map((ap) => (
                  <button
                    key={ap}
                    id={`select-${ap.toLowerCase()}`}
                    type="button"
                    className={`appliance-btn${form.appliance === ap ? ' selected' : ''}`}
                    onClick={() => update('appliance', ap)}
                  >
                    <span className="ap-icon">{ap === 'AC' ? '❄️' : '🧊'}</span>
                    <span className="ap-name">{ap}</span>
                    <span className="ap-price">₹{PRICES[ap]}</span>
                    {form.appliance === ap && <span className="ap-check">✓</span>}
                  </button>
                ))}
              </div>
              {errors.appliance && <p className="form-error mt-8">⚠️ {errors.appliance}</p>}

              {form.appliance && (
                <div className="price-preview anim-fade-in">
                  <span>Service Charge:</span>
                  <span className="price-preview__val">₹{PRICES[form.appliance]}</span>
                </div>
              )}

              <button id="next-step" type="button" className="btn btn-primary w-full" onClick={handleNext}>
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="form-card anim-scale-in">
              <div className="form-card__top">
                <button className="back-btn" onClick={() => setStep(1)} id="go-back">
                  ← Back
                </button>
                <div className="selected-badge">
                  {form.appliance === 'AC' ? '❄️' : '🧊'} {form.appliance} — ₹{PRICES[form.appliance]}
                </div>
              </div>
              <h2 className="form-card__title">Tell us about you</h2>

              <form onSubmit={handleSubmit} className="detail-form" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cust-name" className="form-label">Full Name *</label>
                    <input
                      id="cust-name"
                      type="text"
                      className={`form-input${errors.name ? ' error' : ''}`}
                      placeholder="e.g. Ramesh Kumar"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                    />
                    {errors.name && <p className="form-error">⚠️ {errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cust-phone" className="form-label">Phone Number *</label>
                    <input
                      id="cust-phone"
                      type="tel"
                      className={`form-input${errors.phone ? ' error' : ''}`}
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      maxLength={10}
                      onChange={e => update('phone', e.target.value.replace(/\D/g,''))}
                    />
                    {errors.phone && <p className="form-error">⚠️ {errors.phone}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cust-address" className="form-label">Service Address *</label>
                  <input
                    id="cust-address"
                    type="text"
                    className={`form-input${errors.address ? ' error' : ''}`}
                    placeholder="Full address including area and city"
                    value={form.address}
                    onChange={e => update('address', e.target.value)}
                  />
                  {errors.address && <p className="form-error">⚠️ {errors.address}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="cust-issue" className="form-label">Describe the Issue *</label>
                  <textarea
                    id="cust-issue"
                    className={`form-input${errors.issue ? ' error' : ''}`}
                    placeholder="e.g. AC is not cooling, making a loud noise..."
                    rows={3}
                    value={form.issue}
                    onChange={e => update('issue', e.target.value)}
                  />
                  {errors.issue && <p className="form-error">⚠️ {errors.issue}</p>}
                </div>

                {errors.submit && <p className="form-error">⚠️ {errors.submit}</p>}

                <div className="form-summary">
                  <div className="summary-row"><span>Appliance</span><strong>{form.appliance}</strong></div>
                  <div className="summary-row"><span>Service Fee</span><strong className="text-red">₹{PRICES[form.appliance]}</strong></div>
                </div>

                <button id="submit-booking" type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading
                    ? <><span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> Processing...</>
                    : '✓ Confirm Booking'
                  }
                </button>
              </form>
            </div>
          )}
          {/* STEP 3 */}
          {step === 3 && booking && (
            <div className="form-card anim-scale-in" style={{ textAlign: 'center', alignItems: 'center', padding: '60px 20px' }}>
              <div className="success-icon" style={{ width: 80, height: 80, fontSize: '2.5rem', marginBottom: 16 }}>✓</div>
              <h2 className="form-card__title">Booking Confirmed!</h2>
              <p className="form-card__sub" style={{ marginTop: 8 }}>Your appliance repair service has been booked successfully.</p>
              
              <div style={{ background: 'var(--bg-soft)', padding: '24px', borderRadius: 'var(--radius-lg)', margin: '24px 0', width: '100%' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>Your Tracking ID</p>
                <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px' }}>
                  {booking.jobId}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Please save this ID to track your booking status.</p>
              </div>
              
              <button className="btn btn-primary" onClick={() => router.push(`/dashboard?job=${booking.jobId}`)}>
                Track My Booking →
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .booking-page { min-height: 100vh; background: var(--bg-soft); padding-bottom: 80px; }
        .booking-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          padding: calc(var(--nav-height) + 48px) 0 48px;
          text-align: center;
          color: white;
          margin-bottom: -32px;
        }
        .booking-hero h1 { color: white; }
        .booking-hero p { opacity: 0.85; margin-top: 8px; }
        .booking-hero .section-eyebrow { background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); }

        .form-wrap { max-width: 640px; padding-top: 48px; }

        .steps-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 32px;
        }
        .si-step { display: flex; align-items: center; gap: 8px; }
        .si-dot {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700;
          border: 2px solid var(--border);
          color: var(--text-light);
          background: white;
          transition: var(--transition);
          flex-shrink: 0;
        }
        .si-step.active .si-dot { border-color: var(--primary); color: white; background: var(--primary); }
        .si-step.done .si-dot   { border-color: var(--primary); color: white; background: var(--primary); }
        .si-label { font-size: 0.85rem; font-weight: 500; color: var(--text-muted); }
        .si-step.active .si-label { color: var(--primary); font-weight: 700; }
        .si-line {
          width: 48px; height: 2px;
          background: var(--border);
          margin: 0 8px;
          transition: var(--transition);
          flex-shrink: 0;
        }
        .si-line.filled { background: var(--primary); }

        .form-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 40px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-card__title { font-size: 1.5rem; }
        .form-card__sub   { color: var(--text-muted); margin-top: -16px; }
        .form-card__top   { display: flex; align-items: center; justify-content: space-between; }

        .appliance-options { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .appliance-btn {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 28px 20px;
          border-radius: var(--radius-lg);
          border: 2px solid var(--border);
          background: white;
          gap: 10px;
          transition: var(--transition);
          cursor: pointer;
        }
        .appliance-btn:hover { border-color: var(--primary-light); background: var(--primary-ultra-light); }
        .appliance-btn.selected { border-color: var(--primary); background: var(--primary-ultra-light); box-shadow: 0 0 0 4px rgba(227,30,36,0.08); }
        .ap-icon { font-size: 2.5rem; animation: float 4s ease-in-out infinite; }
        .ap-name { font-size: 1.2rem; font-weight: 700; }
        .ap-price { font-size: 1.4rem; font-weight: 800; color: var(--primary); }
        .ap-check {
          position: absolute; top: 12px; right: 12px;
          width: 24px; height: 24px;
          background: var(--primary); color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700;
        }

        .price-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--primary-ultra-light);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          padding: 14px 20px;
          font-weight: 600;
        }
        .price-preview__val { font-size: 1.4rem; font-weight: 800; color: var(--primary); }

        .back-btn {
          background: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: var(--transition);
        }
        .back-btn:hover { color: var(--primary); }

        .selected-badge {
          background: var(--primary-ultra-light);
          color: var(--primary);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 700;
          border: 1px solid var(--border-strong);
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .detail-form { display: flex; flex-direction: column; gap: 20px; }

        .form-summary {
          background: var(--bg-soft);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .summary-row { display: flex; justify-content: space-between; font-size: 0.9rem; }

        .w-full { width: 100%; justify-content: center; }
        .mt-8 { margin-top: -8px; }

        @media (max-width: 600px) {
          .form-card { padding: 24px 20px; }
          .form-row  { grid-template-columns: 1fr; }
          .si-label  { display: none; }
        }
      `}</style>
    </>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{display:'flex',justifyContent:'center',padding:'200px 0'}}><span className="loader" /></div>}>
        <BookingFormContent />
      </Suspense>
      <Footer />
    </>
  );
}
