'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (loginMethod === 'phone' && (!phone || phone.length < 10)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep(true);
      setSuccess(`OTP sent to ${loginMethod === 'phone' ? '+91 ' + phone : email}. (Demo OTP: 1234)`);
    }, 600);
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otpStep) {
      if (otp.trim() === '1234' || otp.trim().length === 4) {
        const userObj = {
          name: phone ? `Customer (${phone.slice(-4)})` : email.split('@')[0],
          phone: phone || '',
          email: email || '',
          role: 'customer'
        };
        localStorage.setItem('coolfix_user', JSON.stringify(userObj));
        router.push('/dashboard');
      } else {
        setError('Invalid OTP code. Enter 1234 for demo.');
        setLoading(false);
      }
      return;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || phone + '@customer.in', password, role: 'customer' }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('coolfix_user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '60px 16px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="form-card anim-scale-in" style={{ width: '100%', maxWidth: '460px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>👤</div>
              <h1 className="form-card__title">Customer Sign In</h1>
              <p className="form-card__sub" style={{ marginTop: 8 }}>
                Sign in to view your active repair requests, track technicians, and access warranty job sheets.
              </p>
            </div>

            {!otpStep ? (
              <>
                <div className="login-tabs" style={{ marginBottom: 20 }}>
                  <button 
                    type="button"
                    className={`tab-btn ${loginMethod === 'phone' ? 'active' : ''}`}
                    onClick={() => { setLoginMethod('phone'); setError(''); }}
                  >
                    📱 Mobile Number (OTP)
                  </button>
                  <button 
                    type="button"
                    className={`tab-btn ${loginMethod === 'email' ? 'active' : ''}`}
                    onClick={() => { setLoginMethod('email'); setError(''); }}
                  >
                    ✉️ Email
                  </button>
                </div>

                <form onSubmit={loginMethod === 'phone' ? handleSendOtp : handleVerifyLogin}>
                  {loginMethod === 'phone' ? (
                    <div className="form-group">
                      <label className="form-label">10-Digit Mobile Number</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ padding: '0 12px', height: 48, background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>+91</span>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="98765 43210"
                          value={phone}
                          maxLength={10}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          style={{ margin: 0, flex: 1 }}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  {error && <p className="form-error" style={{ marginBottom: 16 }}>⚠️ {error}</p>}

                  <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ height: 48, fontSize: '1rem' }}>
                    {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : loginMethod === 'phone' ? 'Get Verification OTP →' : 'Sign In →'}
                  </button>
                </form>
              </>
            ) : (
              <form onSubmit={handleVerifyLogin}>
                {success && (
                  <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
                    {success}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1 2 3 4"
                    value={otp}
                    maxLength={4}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.3em', fontWeight: 800 }}
                    required
                  />
                </div>

                {error && <p className="form-error" style={{ marginBottom: 16 }}>⚠️ {error}</p>}

                <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ height: 48, fontSize: '1rem' }}>
                  {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Verify & Continue →'}
                </button>

                <button 
                  type="button" 
                  onClick={() => { setOtpStep(false); setOtp(''); setError(''); }}
                  className="btn btn-outline btn-block" 
                  style={{ marginTop: 10 }}
                >
                  ← Change Number
                </button>
              </form>
            )}

            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                Just need to check repair status?
              </div>
              <Link href="/dashboard" className="btn btn-outline btn-block" style={{ fontSize: '0.85rem' }}>
                🔍 Track Booking with Job ID
              </Link>
            </div>

            <div style={{ marginTop: 18, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Link href="/worker/login" style={{ color: 'var(--text-muted)' }}>Field Technician Login</Link>
              <span>•</span>
              <Link href="/admin/login" style={{ color: 'var(--text-muted)' }}>Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
