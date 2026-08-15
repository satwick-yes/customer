'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECHNICIANS } from '@/lib/technicians';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState('customer'); // 'customer', 'worker', or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectTech = (tech) => {
    setEmail(tech.email);
    setPassword('worker123');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (tab === 'admin') {
      // Admin Login
      if (password === 'admin123' && (!email || email.toLowerCase().includes('admin'))) {
        localStorage.setItem('coolfix_admin', JSON.stringify({ email: email || 'admin@coolfix.in', role: 'admin' }));
        router.push('/admin');
      } else {
        setError('Invalid admin credentials. (Password: admin123)');
        setLoading(false);
      }
    } else if (tab === 'worker') {
      // Worker Login - Check against 5 technicians
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: 'worker' }),
        });
        const data = await res.json();

        if (res.ok && data.user) {
          localStorage.setItem('coolfix_worker', JSON.stringify(data.user));
          router.push('/worker');
        } else {
          setError(data.error || 'Invalid technician credentials. Check your email or select a demo tech below.');
          setLoading(false);
        }
      } catch (err) {
        // Fallback local check
        const matchedTech = TECHNICIANS.find(t => t.email.toLowerCase() === email.trim().toLowerCase());
        if (matchedTech && password === 'worker123') {
          localStorage.setItem('coolfix_worker', JSON.stringify({ email: matchedTech.email, name: matchedTech.name, role: 'worker', techId: matchedTech.id, tech: matchedTech }));
          router.push('/worker');
        } else {
          setError('Invalid technician credentials. (Password: worker123)');
          setLoading(false);
        }
      }
    } else {
      // Customer Login
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: 'customer' }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('coolfix_user', JSON.stringify(data.user));
          router.push('/dashboard');
        } else {
          setError(data.error || 'Something went wrong');
          setLoading(false);
        }
      } catch (err) {
        setError('Network error. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
          <div className="form-card anim-scale-in" style={{ width: '100%', maxWidth: '480px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>{tab === 'admin' ? '🔒' : tab === 'worker' ? '🛠️' : '👤'}</div>
              <h1 className="form-card__title">
                {tab === 'admin' ? 'Admin Login' : tab === 'worker' ? 'Technician Login' : 'Customer Login'}
              </h1>
              <p className="form-card__sub" style={{ marginTop: 8 }}>
                {tab === 'admin' ? 'Enter credentials to manage bookings & assign technicians.' : tab === 'worker' ? 'Sign in with your technician email to view your assigned repair tasks.' : 'Log in or auto-register to track your repairs.'}
              </p>
            </div>

            <div className="login-tabs">
              <button 
                type="button"
                className={`tab-btn ${tab === 'customer' ? 'active' : ''}`}
                onClick={() => { setTab('customer'); setError(''); setEmail(''); setPassword(''); }}
              >
                Customer
              </button>
              <button 
                type="button"
                className={`tab-btn ${tab === 'worker' ? 'active' : ''}`}
                onClick={() => { setTab('worker'); setError(''); setEmail('rajesh@coolfix.in'); setPassword('worker123'); }}
              >
                Worker
              </button>
              <button 
                type="button"
                className={`tab-btn ${tab === 'admin' ? 'active' : ''}`}
                onClick={() => { setTab('admin'); setError(''); setEmail('admin@coolfix.in'); setPassword('admin123'); }}
              >
                Admin
              </button>
            </div>

            {/* Quick Demo Selectors for Workers */}
            {tab === 'worker' && (
              <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg-soft)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ Quick Demo: Select a Technician (Password: worker123)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                  {TECHNICIANS.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => selectTech(t)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        background: email === t.email ? 'var(--primary)' : '#ffffff',
                        color: email === t.email ? '#ffffff' : 'var(--text)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{t.avatar} {t.name.split(' ')[0]}</span>
                      <span style={{ opacity: 0.75, fontSize: '0.7rem' }}>{t.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label">
                  {tab === 'worker' ? 'Technician Email' : tab === 'admin' ? 'Admin Email' : 'Email Address'}
                </label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder={tab === 'worker' ? "e.g., rajesh@coolfix.in" : tab === 'admin' ? "admin@coolfix.in" : "you@example.com"}
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
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {tab === 'customer' && <p style={{ fontSize: '0.8rem', marginTop: 5, color: 'var(--text-muted)' }}>New here? We'll create an account for you automatically.</p>}
                {tab === 'worker' && <p style={{ fontSize: '0.8rem', marginTop: 5, color: 'var(--text-muted)' }}>Password for all demo technicians: <strong style={{ color: 'var(--primary)' }}>worker123</strong></p>}
                {tab === 'admin' && <p style={{ fontSize: '0.8rem', marginTop: 5, color: 'var(--text-muted)' }}>Demo Admin Password: <strong style={{ color: 'var(--primary)' }}>admin123</strong></p>}
              </div>

              {error && <p className="form-error">⚠️ {error}</p>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, height: 48 }} disabled={loading}>
                {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : (tab === 'customer' ? 'Login / Sign Up' : tab === 'worker' ? 'Sign In as Technician' : 'Admin Login')}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

