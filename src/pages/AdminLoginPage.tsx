import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, LogIn, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, showToast, navigateToPath } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both admin email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(email, password);
      showToast('Admin authorization verified! Welcome to ProjectPilot Admin Panel.', 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Admin authentication failed. Authorization required.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@projectpilot.edu');
    setPassword('AdminPilot#2026!');
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem', maxWidth: '500px' }}>
      <button
        onClick={() => navigateToPath('/login')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Return to Student Login
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#0F172A', color: '#38BDF8', padding: '0.85rem', borderRadius: '14px', marginBottom: '1rem', border: '1px solid #334155' }}>
          <ShieldCheck size={36} />
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
          Faculty / Admin Sign In
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Restricted access for academic advisors and system administrators.
        </p>
      </div>

      {errorMsg && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Demo Admin Helper */}
      <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#3730A3' }}>
        <div>
          <strong>Demo Admin Account:</strong> <code>admin@projectpilot.edu</code>
        </div>
        <button type="button" onClick={handleFillDemoAdmin} style={{ background: '#4F46E5', color: '#FFFFFF', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.775rem', fontWeight: 600, cursor: 'cursor' }}>
          Auto-fill
        </button>
      </div>

      <div className="card" style={{ border: '2px solid #0F172A', backgroundColor: '#FFFFFF' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="adminEmail">Faculty / Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                id="adminEmail"
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="admin@projectpilot.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="adminPassword">Admin Secret Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                id="adminPassword"
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-block"
            style={{ backgroundColor: '#0F172A', borderColor: '#0F172A', marginTop: '1.25rem', padding: '0.75rem', fontSize: '1rem' }}
          >
            {isSubmitting ? 'Verifying Role Authorization...' : 'Authenticate as Admin'} <LogIn size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
