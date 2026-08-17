'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECHNICIANS } from '@/lib/technicians';
import Link from 'next/link';

export default function WorkerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('rajesh@coolfix.in');
  const [password, setPassword] = useState('worker123');
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
        setError(data.error || 'Invalid technician credentials.');
        setLoading(false);
      }
    } catch (err) {
      const matchedTech = TECHNICIANS.find(t => t.email.toLowerCase() === email.trim().toLowerCase());
      if (matchedTech && password === 'worker123') {
        localStorage.setItem('coolfix_worker', JSON.stringify({ 
          email: matchedTech.email, 
          name: matchedTech.name, 
          role: 'worker', 
          techId: matchedTech.id, 
          tech: matchedTech 
        }));
        router.push('/worker');
      } else {
        setError('Invalid technician credentials. (Default: worker123)');
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar userRole="auth" />
      <div className="login-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '60px 16px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="form-card anim-scale-in" style={{ width: '100%', maxWidth: '480px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>🛠️</div>
              <h1 className="form-card__title">Technician Field Login</h1>
              <p className="form-card__sub" style={{ marginTop: 8 }}>
                Sign in with your master technician profile to view jobs, checklist inspections, and manage real-time job updates.
              </p>
            </div>

            {/* Quick Demo Selectors for Master Technicians */}
            <div style={{ marginBottom: 20, padding: '14px 16px', background: 'var(--bg-soft)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⚡ Quick Demo: Select Certified Tech
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {TECHNICIANS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectTech(t)}
                    style={{
                      padding: '8px 10px',
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
                      gap: 6
                    }}
                  >
                    <span>{t.avatar}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Technician Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="tech@coolfix.in"
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

              {error && <p className="form-error" style={{ marginBottom: 16 }}>⚠️ {error}</p>}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ height: 48, fontSize: '1rem', fontWeight: 700 }}>
                {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In to Field Dashboard →'}
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                Looking for Customer Booking? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Customer Sign In</Link>
              </div>
              <div>
                Are you an Administrator? <Link href="/admin/login" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Admin Operations Login →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
