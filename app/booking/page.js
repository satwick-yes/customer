'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createBooking } from '@/lib/bookingService';
import { downloadJobSheetPDF } from '@/lib/pdfGenerator';
import Link from 'next/link';

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
      // Automatically generate and download official invoice PDF
      try {
        downloadJobSheetPDF(result);
      } catch (pdfErr) {
        console.error('Invoice PDF auto-download error:', pdfErr);
      }
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
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>Your Tracking & Invoice ID</p>
                <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px' }}>
                  {booking.jobId}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Official Tax Invoice & Service Job Sheet has been generated.</p>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px' }}
                  onClick={() => downloadJobSheetPDF(booking)}
                >
                  📥 Download Invoice (PDF)
                </button>
                <button className="btn btn-primary" onClick={() => router.push(`/dashboard?job=${booking.jobId}`)}>
                  📍 Track My Booking Live →
                </button>
                <Link 
                  href={`/job/${booking.jobId}`} 
                  target="_blank"
                  className="btn btn-outline"
                  style={{ background: 'white', padding: '10px 18px' }}
                >
                  👁️ View Invoice Online
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
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
