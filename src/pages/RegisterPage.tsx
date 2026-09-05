import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, UserPlus, Mail, Lock, User, GraduationCap, AlertCircle, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerStudent, showToast, navigateToPath } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [degreeBranch, setDegreeBranch] = useState('B.Tech Computer Science & Engineering');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStudent(name, email, password, degreeBranch, experienceLevel);
      showToast('Registration successful! Welcome to ProjectPilot AI.', 'success');
      navigateToPath('/wizard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem', maxWidth: '560px' }}>
      <button
        onClick={() => navigateToPath('/login')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to Sign In
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
          Create Student Account
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Join ProjectPilot AI to discover tailored capstone ideas and build your execution roadmap.
        </p>
      </div>

      {errorMsg && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="card" style={{ border: '1px solid #CBD5E1' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="regName">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                id="regName"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regEmail">College Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                id="regEmail"
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="priya@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="regDegree">Degree / Branch</label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <select
                  id="regDegree"
                  className="form-select"
                  style={{ paddingLeft: '2.4rem' }}
                  value={degreeBranch}
                  onChange={(e) => setDegreeBranch(e.target.value)}
                >
                  <option value="B.Tech Computer Science & Engineering">B.Tech CSE</option>
                  <option value="B.Tech Information Technology">B.Tech IT</option>
                  <option value="B.Tech AI & Data Science">B.Tech AI & Data Science</option>
                  <option value="B.Tech Electronics & Communication">B.Tech ECE</option>
                  <option value="MCA / M.Tech Computer Science">MCA / M.Tech CS</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regLevel">Skill Level</label>
              <select
                id="regLevel"
                className="form-select"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
              >
                <option value="beginner">Beginner (Building Foundations)</option>
                <option value="intermediate">Intermediate (Hands-on Projects)</option>
                <option value="advanced">Advanced (Complex Systems)</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="regPassword">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  id="regPassword"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regConfirm">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  id="regConfirm"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.8rem', color: '#475569', margin: '0.75rem 0 1.25rem' }}>
            🔒 All accounts registered here receive standard <strong>Student</strong> access.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-block"
            style={{ padding: '0.75rem', fontSize: '1rem' }}
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Registration'} <UserPlus size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', fontSize: '0.9rem', color: '#475569' }}>
          Already have an account?{' '}
          <button
            onClick={() => navigateToPath('/login')}
            style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
