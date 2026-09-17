import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@crios.io');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: 'Executive Admin',
      email: email,
      role: 'Chief Revenue Officer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
  };

  const handleDemoBypass = () => {
    onLoginSuccess({
      name: 'Executive Admin',
      email: 'demo.admin@crios.io',
      role: 'Chief Revenue Officer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 100%)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem',
      color: '#ffffff'
    }}>
      <div className="crios-card animate-fade-in" style={{
        width: '420px',
        background: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '1.25rem',
        padding: '2.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '1rem',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
          }}>
            <Zap size={30} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            CRIOS
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Customer Revenue Intelligence & Optimization
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              Corporate Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '0.6rem',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              Account Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '0.6rem',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}>
            Sign In to Terminal <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Fast Track Bypass */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.65rem' }}>
            Fast-Track Evaluation Access
          </span>
          <button
            type="button"
            onClick={handleDemoBypass}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.6rem',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={16} /> Sign In as Executive Admin (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
