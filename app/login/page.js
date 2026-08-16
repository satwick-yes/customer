'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [identifier, setIdentifier] = useState(''); // Email or Phone for login
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = mode === 'signup' 
        ? { action: 'signup', name, email, phone, password, role: 'customer' }
        : { action: 'login', email: identifier, phone: identifier, password, role: 'customer' };

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem('coolfix_user', JSON.stringify(data.user));
        setSuccess(mode === 'signup' ? '🎉 Account created successfully! Redirecting...' : '✓ Logged in successfully! Redirecting...');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      } else {
        setError(data.error || 'Authentication failed. Please check your details.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '60px 16px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="form-card anim-scale-in" style={{ width: '100%', maxWidth: '460px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>{mode === 'signup' ? '✨' : '👤'}</div>
            <h1 className="form-card__title">
              {mode === 'signup' ? 'Create Customer Account' : 'Customer Sign In'}
            </h1>
            <p className="form-card__sub" style={{ marginTop: 6, fontSize: '0.9rem' }}>
              {mode === 'signup' 
                ? 'Sign up in 30 seconds to book repairs & track master technicians.' 
                : 'Sign in with your Email or Mobile Number to access your bookings.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="login-tabs" style={{ marginBottom: 24 }}>
            <button 
              type="button"
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button 
              type="button"
              className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            >
              New User? Sign Up
            </button>
          </div>

          {success && (
            <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '10px 14px', borderRadius: 8, fontSize: '0.88rem', marginBottom: 16, textAlign: 'center' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">10-Digit Mobile Number *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    className="form-input"
                    placeholder="e.g. 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Create Password *</label>
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
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Email Address or 10-Digit Mobile Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter email or 10-digit phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
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

            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ height: 48, fontSize: '1rem', fontWeight: 700 }}>
              {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : mode === 'signup' ? '⚡ Create Account & Proceed →' : 'Sign In →'}
            </button>
          </form>

          {/* Alternative Quick Tracking */}
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              Just want to check repair status?
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
  );
}

export default function CustomerLoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '200px 0' }}><span className="loader" /></div>}>
        <LoginFormContent />
      </Suspense>
      <Footer />
    </>
  );
}
