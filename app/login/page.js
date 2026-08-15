'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState('customer'); // 'customer' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (tab === 'admin') {
      // Admin Login Mock
      setTimeout(() => {
        if (password === 'admin123') {
          router.push('/admin');
        } else {
          setError('Invalid admin credentials.');
          setLoading(false);
        }
      }, 600);
    } else if (tab === 'worker') {
      setTimeout(() => {
        if (password === 'worker123') {
          router.push('/worker');
        } else {
          setError('Invalid worker credentials.');
          setLoading(false);
        }
      }, 600);
    } else {
      // Customer Login
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
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
          <div className="form-card anim-scale-in" style={{ width: '100%', maxWidth: '440px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>{tab === 'admin' ? '🔒' : tab === 'worker' ? '🛠️' : '👤'}</div>
              <h1 className="form-card__title">
                {tab === 'admin' ? 'Admin Login' : tab === 'worker' ? 'Worker Login' : 'Customer Login'}
              </h1>
              <p className="form-card__sub" style={{ marginTop: 8 }}>
                {tab === 'admin' ? 'Enter credentials to manage bookings.' : tab === 'worker' ? 'Log in to view assigned tasks.' : 'Log in or auto-register to track your repairs.'}
              </p>
            </div>

            <div className="login-tabs">
              <button 
                className={`login-tab ${tab === 'customer' ? 'active' : ''}`}
                onClick={() => { setTab('customer'); setError(''); setEmail(''); setPassword(''); }}
              >
                Customer
              </button>
              <button 
                className={`login-tab ${tab === 'worker' ? 'active' : ''}`}
                onClick={() => { setTab('worker'); setError(''); setEmail(''); setPassword(''); }}
              >
                Worker
              </button>
              <button 
                className={`login-tab ${tab === 'admin' ? 'active' : ''}`}
                onClick={() => { setTab('admin'); setError(''); setEmail(''); setPassword(''); }}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder={tab !== 'customer' ? "staff@coolfix.com" : "you@example.com"}
                  value={tab !== 'customer' ? "staff@coolfix.com" : email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={tab !== 'customer'}
                  style={tab !== 'customer' ? { background: 'var(--bg-soft)', color: 'var(--text-light)' } : {}}
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
                {tab === 'customer' && <p style={{ fontSize: '0.8rem', marginTop: 5 }}>New here? We'll create an account for you automatically.</p>}
                {tab === 'worker' && <p style={{ fontSize: '0.8rem', marginTop: 5 }}>Authorized technicians only.</p>}
                {tab === 'admin' && <p style={{ fontSize: '0.8rem', marginTop: 5 }}>Authorized personnel only.</p>}
              </div>

              {error && <p className="form-error">⚠️ {error}</p>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} disabled={loading}>
                {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : (tab === 'customer' ? 'Login / Sign Up' : 'Login')}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: var(--bg-soft);
          padding: 120px 0 80px;
        }
        .login-tabs {
          display: flex;
          background: var(--bg-soft);
          border-radius: var(--radius-full);
          padding: 4px;
        }
        .tab-btn {
          flex: 1;
          padding: 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-muted);
          background: transparent;
          transition: var(--transition);
        }
        .tab-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: var(--card-shadow);
        }
      `}</style>
    </>
  );
}
