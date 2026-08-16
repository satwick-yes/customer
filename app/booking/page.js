'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createBooking } from '@/lib/bookingService';
import Link from 'next/link';

const INSPECTION_PRICES = { AC: 499, Fridge: 299 };

const APPLIANCE_SUBTYPES = {
  AC: ['Split AC', 'Window AC', 'Inverter Split AC', 'Cassette / Tower AC', 'Commercial Duct AC'],
  Fridge: ['Single Door Direct Cool', 'Double Door Frost Free', 'Side-by-Side Inverter', 'Triple Door', 'Deep Freezer / Commercial']
};

const POPULAR_BRANDS = [
  'Voltas', 'Daikin', 'LG', 'Samsung', 'Whirlpool', 'Godrej', 
  'Hitachi', 'Blue Star', 'Panasonic', 'Haier', 'Lloyd', 'Carrier', 'Other Brand'
];

const COMMON_ISSUES = {
  AC: [
    'No Cooling / Warm Air Blowing',
    'Low / Inadequate Cooling',
    'Water Dripping / Leaking from Indoor Unit',
    'Refrigerant Gas Leakage & Refill',
    'Strange Grinding Noise or Vibration',
    'AC Power Tripping / PCB Not Turning On',
    'Periodic Deep Jet Service & Cleaning'
  ],
  Fridge: [
    'Refrigeration Not Cooling (Deep Freezer OK)',
    'Neither Freezer nor Fridge Cooling',
    'Compressor Starting and Clicking Off',
    'Excess Ice / Frost Buildup on Coils',
    'Water Pooling at Bottom / Vegetable Tray',
    'Door Gasket / Rubber Seal Loose',
    'Thermostat & Gas Pressure Charging'
  ]
};

const TIME_SLOTS = [
  '⚡ Express Slot (Within 45 - 60 Mins)',
  '🌅 Morning (9:00 AM - 12:00 PM)',
  '☀️ Afternoon (12:00 PM - 3:00 PM)',
  '🌇 Evening (3:00 PM - 6:00 PM)',
  '🌙 Late Evening (6:00 PM - 8:30 PM)'
];

const CITIES = [
  'Chandigarh', 'Mohali', 'Panchkula', 'Zirakpur', 'Kharar', 'Other Tricity'
];

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login' for non-logged-in customers
  const [accountPassword, setAccountPassword] = useState('');

  const [form, setForm] = useState({
    appliance: searchParams.get('appliance') === 'Fridge' ? 'Fridge' : 'AC',
    applianceType: 'Split AC',
    brand: 'LG',
    issue: 'No Cooling / Warm Air Blowing',
    issueDetails: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chandigarh',
    landmark: '',
    pincode: '160022',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredSlot: '⚡ Express Slot (Within 45 - 60 Mins)'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  // Check if customer is already logged in
  useEffect(() => {
    try {
      const saved = localStorage.getItem('coolfix_user');
      if (saved) {
        const user = JSON.parse(saved);
        if (user && (user.email || user.phone)) {
          setCurrentUser(user);
          setForm(prev => ({
            ...prev,
            name: prev.name || user.name || '',
            phone: prev.phone || user.phone || '',
            email: prev.email || user.email || ''
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync appliance type default when appliance switches
  const handleApplianceChange = (ap) => {
    setForm(prev => ({
      ...prev,
      appliance: ap,
      applianceType: APPLIANCE_SUBTYPES[ap][0],
      issue: COMMON_ISSUES[ap][0]
    }));
  };

  const update = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.appliance) errs.appliance = 'Select an appliance category.';
    if (!form.applianceType) errs.applianceType = 'Select appliance configuration.';
    if (!form.brand) errs.brand = 'Select appliance brand.';
    if (!form.issue) errs.issue = 'Select primary symptom.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full Name is required.';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Valid 10-digit mobile number required.';
    if (!currentUser && (!accountPassword || accountPassword.length < 4)) {
      errs.password = 'Password (min 4 characters) is required to create your account.';
    }
    if (!form.address.trim()) errs.address = 'Service Address is required.';
    if (!form.pincode.trim() || form.pincode.length < 6) errs.pincode = 'Valid 6-digit Pincode required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setErrors({});

    try {
      // If customer is not logged in yet, create their account or sign them in first
      if (!currentUser) {
        const authRes = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: authMode === 'signup' ? 'signup' : 'login',
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: accountPassword,
            role: 'customer'
          })
        });

        const authData = await authRes.json();

        if (!authRes.ok) {
          // If already registered and tried signup, prompt to login
          if (authRes.status === 409) {
            setErrors({ submit: 'An account with this phone/email already exists. Switch to "Sign In" below or enter correct password.' });
            setAuthMode('login');
            setLoading(false);
            return;
          }
          setErrors({ submit: authData.error || 'Account registration failed.' });
          setLoading(false);
          return;
        }

        if (authData.user) {
          localStorage.setItem('coolfix_user', JSON.stringify(authData.user));
          setCurrentUser(authData.user);
        }
      }

      const fullIssue = form.issueDetails.trim() 
        ? `${form.issue} (${form.issueDetails.trim()})`
        : form.issue;

      const payload = {
        ...form,
        issue: fullIssue,
      };

      const result = await createBooking(payload);
      setBooking(result);
      setStep(3);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('coolfix_user');
    setCurrentUser(null);
    setAccountPassword('');
  };

  return (
    <>
      <div className="booking-page">
        {/* Hero Banner */}
        <div className="booking-hero">
          <div className="container booking-hero__inner">
            <div className="booking-hero__text anim-fade-up">
              <h1>Book Certified <span className="gradient-text">Master Technician</span></h1>
              <p>Transparent ₹{INSPECTION_PRICES[form.appliance]} inspection fee • 60-day service warranty • Same-day 30m dispatch in Chandigarh & Tricity</p>
            </div>
          </div>
        </div>

        <div className="container form-wrap" style={{ maxWidth: '780px', margin: '0 auto 60px' }}>
          {/* Step Indicator */}
          <div className="steps-indicator anim-fade-up">
            {['1. Appliance & Issue', '2. Account & Address', '3. Confirmation'].map((label, i) => (
              <div key={i} className={`si-step${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
                <div className="si-dot">{step > i + 1 ? '✓' : i + 1}</div>
                <span className="si-label">{label}</span>
                {i < 2 && <div className={`si-line${step > i + 1 ? ' filled' : ''}`} />}
              </div>
            ))}
          </div>

          {/* STEP 1: APPLIANCE, BRAND & ISSUE */}
          {step === 1 && (
            <div className="form-card anim-scale-in" style={{ padding: '32px' }}>
              <h2 className="form-card__title">1. What appliance needs service?</h2>
              <p className="form-card__sub" style={{ marginBottom: 20 }}>
                Choose your appliance category and specific symptoms for accurate master technician matching.
              </p>

              {/* Category Picker */}
              <div className="appliance-options" style={{ marginBottom: 24 }}>
                {['AC', 'Fridge'].map((ap) => (
                  <button
                    key={ap}
                    type="button"
                    className={`appliance-btn${form.appliance === ap ? ' selected' : ''}`}
                    onClick={() => handleApplianceChange(ap)}
                    style={{ padding: '16px 20px' }}
                  >
                    <span className="ap-icon" style={{ fontSize: '2.2rem' }}>{ap === 'AC' ? '❄️' : '🧊'}</span>
                    <span className="ap-name" style={{ fontSize: '1.1rem', fontWeight: 800 }}>{ap === 'AC' ? 'Air Conditioner' : 'Refrigerator'}</span>
                    <span className="ap-price" style={{ fontSize: '0.85rem' }}>Inspection: ₹{INSPECTION_PRICES[ap]}</span>
                    {form.appliance === ap && <span className="ap-check">✓</span>}
                  </button>
                ))}
              </div>

              {/* Sub-type / Configuration */}
              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Appliance Type / Model Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
                  {APPLIANCE_SUBTYPES[form.appliance].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update('applianceType', type)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: form.applianceType === type ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: form.applianceType === type ? 'var(--primary-ultra-light)' : 'white',
                        color: form.applianceType === type ? 'var(--primary)' : 'var(--text)',
                        fontWeight: form.applianceType === type ? 700 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {form.applianceType === type ? '✓ ' : ''}{type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Selector */}
              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Appliance Brand</label>
                <select
                  className="form-input"
                  value={form.brand}
                  onChange={(e) => update('brand', e.target.value)}
                  style={{ height: 48, fontWeight: 600 }}
                >
                  {POPULAR_BRANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Issue / Problem */}
              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Primary Issue / Symptom Observed</label>
                <select
                  className="form-input"
                  value={form.issue}
                  onChange={(e) => update('issue', e.target.value)}
                  style={{ height: 48, fontWeight: 600 }}
                >
                  {COMMON_ISSUES[form.appliance].map(iss => (
                    <option key={iss} value={iss}>{iss}</option>
                  ))}
                </select>
              </div>

              {/* Additional notes */}
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Additional Observations (Optional)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="E.g., Burning smell since yesterday, outdoor fan making rattling noise."
                  value={form.issueDetails}
                  onChange={(e) => update('issueDetails', e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Transparent pricing summary card */}
              <div style={{
                background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                border: '1.5px solid #BFDBFE',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#1E40AF', fontSize: '0.95rem' }}>
                    Transparent Inspection Charge: ₹{INSPECTION_PRICES[form.appliance]}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#3B82F6', marginTop: 2 }}>
                    Includes visit, full diagnostics, minor tuning & 60-day service warranty. Any spare parts quoted before repair.
                  </div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E40AF' }}>
                  ₹{INSPECTION_PRICES[form.appliance]}
                </div>
              </div>

              <button type="button" className="btn btn-primary btn-block" onClick={handleNext} style={{ height: 50, fontSize: '1rem', fontWeight: 700 }}>
                Proceed to Account & Address →
              </button>
            </div>
          )}

          {/* STEP 2: ACCOUNT, SCHEDULE & ADDRESS */}
          {step === 2 && (
            <div className="form-card anim-scale-in" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  ← Back to Appliance
                </button>
                <span className="badge badge-progress" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  {form.brand} • {form.applianceType}
                </span>
              </div>

              <h2 className="form-card__title">2. Customer Account & Service Address</h2>
              <p className="form-card__sub" style={{ marginBottom: 22 }}>
                Sign in or create your customer account to confirm your service appointment.
              </p>

              {/* Logged in state or Sign Up requirement banner */}
              {currentUser ? (
                <div style={{
                  background: '#ECFDF5',
                  border: '1.5px solid #10B981',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.4rem' }}>👤</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#065F46', fontSize: '0.9rem' }}>
                        Logged in as: {currentUser.name || 'Customer'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                        {currentUser.phone || currentUser.email} • Booking linked to your dashboard
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Switch Account
                  </button>
                </div>
              ) : (
                <div style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #FEE2E2',
                  borderRadius: 14,
                  padding: '18px 20px',
                  marginBottom: 24,
                  boxShadow: '0 4px 16px rgba(220, 38, 38, 0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>🔐</span> {authMode === 'signup' ? 'Create Customer Account for this Booking' : 'Sign in to Your Account'}
                    </div>
                    <div style={{ display: 'flex', gap: 6, background: '#F4F4F5', padding: 3, borderRadius: 8 }}>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: authMode === 'signup' ? '#DC2626' : 'transparent',
                          color: authMode === 'signup' ? '#FFFFFF' : '#4B5563',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: authMode === 'signup' ? '0 2px 8px rgba(220, 38, 38, 0.3)' : 'none'
                        }}
                      >
                        Sign Up
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: authMode === 'login' ? '#DC2626' : 'transparent',
                          color: authMode === 'login' ? '#FFFFFF' : '#4B5563',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: authMode === 'login' ? '0 2px 8px rgba(220, 38, 38, 0.3)' : 'none'
                        }}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                    {authMode === 'signup'
                      ? 'Creating an account allows you to track technicians live, approve on-site quotes, and download 60-day warranty job sheets.'
                      : 'Enter your registered mobile or email with password to link this service booking directly to your account.'}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Schedule Picker */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Preferred Service Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={form.preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => update('preferredDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Time Slot *</label>
                    <select
                      className="form-input"
                      value={form.preferredSlot}
                      onChange={(e) => update('preferredSlot', e.target.value)}
                    >
                      {TIME_SLOTS.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer Contact & Password */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Full Name *</label>
                    <input
                      type="text"
                      className={`form-input${errors.name ? ' error' : ''}`}
                      placeholder="e.g. Gurpreet Singh"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      required
                    />
                    {errors.name && <p className="form-error">⚠️ {errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Mobile Number *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      className={`form-input${errors.phone ? ' error' : ''}`}
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    {errors.phone && <p className="form-error">⚠️ {errors.phone}</p>}
                  </div>
                </div>

                {/* Optional Email & Password (when not logged in) */}
                {!currentUser && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Email Address (Optional)</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        {authMode === 'signup' ? 'Create Account Password *' : 'Account Password *'}
                      </label>
                      <input
                        type="password"
                        className={`form-input${errors.password ? ' error' : ''}`}
                        placeholder="••••••••"
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        required
                      />
                      {errors.password && <p className="form-error">⚠️ {errors.password}</p>}
                    </div>
                  </div>
                )}

                {/* Location Details */}
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>House / Flat No. & Street Address *</label>
                  <input
                    type="text"
                    className={`form-input${errors.address ? ' error' : ''}`}
                    placeholder="e.g. Flat 302, Tower B, Palm Residency or House #1420"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    required
                  />
                  {errors.address && <p className="form-error">⚠️ {errors.address}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
                  <div className="form-group">
                    <label className="form-label">City / Region *</label>
                    <select
                      className="form-input"
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                    >
                      {CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nearby Landmark</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Near Govt Hospital"
                      value={form.landmark}
                      onChange={(e) => update('landmark', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      maxLength={6}
                      className={`form-input${errors.pincode ? ' error' : ''}`}
                      placeholder="160022"
                      value={form.pincode}
                      onChange={(e) => update('pincode', e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    {errors.pincode && <p className="form-error">⚠️ {errors.pincode}</p>}
                  </div>
                </div>

                {/* Order Summary Confirmation Block */}
                <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: 18, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{form.brand} {form.applianceType} Inspection & Visit</span>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>₹{INSPECTION_PRICES[form.appliance]}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    🛡️ Protected by <strong>CoolFix 60-Day Service Warranty</strong> & 30-Day Spare Parts Guarantee. Pay safely after inspection via Cash or UPI.
                  </div>
                </div>

                {errors.submit && <p className="form-error" style={{ marginBottom: 16 }}>⚠️ {errors.submit}</p>}

                <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ height: 54, fontSize: '1.05rem', fontWeight: 800 }}>
                  {loading ? (
                    <span className="loader" style={{ width: 22, height: 22, borderWidth: 2 }} />
                  ) : !currentUser ? (
                    authMode === 'login' ? '⚡ Sign In & Confirm Service Booking →' : '⚡ Create Account & Confirm Service Booking →'
                  ) : (
                    '⚡ Confirm Service Booking →'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 3 && booking && (
            <div className="form-card anim-scale-in text-center" style={{ padding: '40px 28px' }}>
              <div style={{ fontSize: '3.8rem', marginBottom: 12 }}>🎉</div>
              <h2 className="form-card__title">Booking Registered Successfully!</h2>
              <p className="form-card__sub" style={{ marginTop: 6, fontSize: '0.95rem' }}>
                Your service request has been confirmed and linked to your customer account.
              </p>

              <div style={{
                background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                color: 'white',
                padding: '24px',
                borderRadius: 14,
                margin: '24px auto',
                maxWidth: '520px',
                textAlign: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.18)'
              }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', marginBottom: 6 }}>
                  Your Official Tracking ID
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '3px' }}>
                  {booking.jobId}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: 10 }}>
                  📍 {booking.address}, {booking.city || 'Chandigarh'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: 4 }}>
                  Slot: {booking.preferredSlot} • Date: {booking.preferredDate}
                </div>
              </div>

              {/* OTP Security Notice */}
              {booking.otp && (
                <div style={{
                  background: '#FEF3C7',
                  border: '1.5px solid #F59E0B',
                  borderRadius: 10,
                  padding: '12px 18px',
                  marginBottom: 24,
                  maxWidth: '520px',
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left'
                }}>
                  <span style={{ fontSize: '1.6rem' }}>🔐</span>
                  <div>
                    <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.85rem' }}>
                      Completion OTP: <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#B45309', marginLeft: 4 }}>{booking.otp}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#92400E' }}>
                      Share this OTP with the technician only when the service is fully completed to your satisfaction.
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push(`/dashboard?job=${booking.jobId}`)}
                  style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 700 }}
                >
                  📍 Track Technician Live Now →
                </button>
                <Link
                  href={`/job/${booking.jobId}`}
                  target="_blank"
                  className="btn btn-outline"
                  style={{ padding: '12px 20px', background: 'white' }}
                >
                  📄 View Official Job Sheet
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '200px 0' }}><span className="loader" /></div>}>
        <BookingFormContent />
      </Suspense>
    </>
  );
}
