import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, LogIn, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, KeyRound, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { User } from '../types/auth';

export const LoginPage: React.FC = () => {
  const { login, showToast, navigateToPath } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);

  // Transition Overlay State
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [progressWidth, setProgressWidth] = useState(15);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Refs for bulletproof redirect timer safety
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepTimer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepTimer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRedirectedRef = useRef<boolean>(false);

  // Perform replace navigation guaranteed exactly once
  const performRedirect = (user?: User | null) => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;

    // Clear all pending timers
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
    if (stepTimer1Ref.current) clearTimeout(stepTimer1Ref.current);
    if (stepTimer2Ref.current) clearTimeout(stepTimer2Ref.current);

    const targetUser = user || loggedInUser;
    const targetPath = targetUser?.role === 'admin' ? '/admin' : '/dashboard';

    // Replace navigation so browser back button never returns to animation screen
    window.history.replaceState({}, '', targetPath);
    navigateToPath(targetPath);
  };

  // Effect listening to loginSuccess for guaranteed 2000ms transition & 3000ms failsafe
  useEffect(() => {
    if (!loginSuccess || !loggedInUser) return;

    hasRedirectedRef.current = false;

    // Check accessibility prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setLoadingStep(3);
      setProgressWidth(100);
      performRedirect(loggedInUser);
      return;
    }

    setLoadingStep(1);
    setProgressWidth(25);

    // Step 2 at 600ms
    stepTimer1Ref.current = setTimeout(() => {
      setLoadingStep(2);
      setProgressWidth(65);
    }, 600);

    // Step 3 at 1350ms
    stepTimer2Ref.current = setTimeout(() => {
      setLoadingStep(3);
      setProgressWidth(100);
    }, 1350);

    // Primary 2000ms redirect timer
    redirectTimerRef.current = setTimeout(() => {
      performRedirect(loggedInUser);
    }, 2000);

    // Absolute independent 3000ms failsafe timer
    failsafeTimerRef.current = setTimeout(() => {
      performRedirect(loggedInUser);
    }, 3000);

    return () => {
      // Do NOT clear redirectTimerRef or failsafeTimerRef if loginSuccess is true
      // unless user leaves page or auth fails
    };
  }, [loginSuccess, loggedInUser]);

  // Handle Login Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsNetworkError(false);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Race auth with 8s timeout to prevent infinite loader on network hang
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('NETWORK_TIMEOUT')), 8000)
      );

      const authPromise = login(cleanEmail, password, false);
      const session = (await Promise.race([authPromise, timeoutPromise])) as any;

      if (!session || !session.user) {
        throw new Error('AUTH_FAILED');
      }

      setLoggedInUser(session.user);
      setShowSuccessOverlay(true);
      setLoginSuccess(true);
    } catch (err: any) {
      // Clear timers and hide animation on auth failure
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
      if (stepTimer1Ref.current) clearTimeout(stepTimer1Ref.current);
      if (stepTimer2Ref.current) clearTimeout(stepTimer2Ref.current);

      hasRedirectedRef.current = false;
      setLoginSuccess(false);
      setShowSuccessOverlay(false);
      setIsSubmitting(false);

      if (err.message === 'NETWORK_TIMEOUT' || err.name === 'TypeError') {
        setIsNetworkError(true);
        setErrorMsg('We could not connect right now. Please check your connection and try again.');
      } else {
        setIsNetworkError(false);
        setErrorMsg('We could not sign you in. Please check your email and password.');
      }
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast(`Password reset link sent to ${resetEmail}. Check your inbox!`, 'success');
    setShowForgotModal(false);
  };

  const handleFillDemoStudent = () => {
    setEmail('student@college.edu');
    setPassword('Pilot@2026Secure!');
    setErrorMsg('');
    setIsNetworkError(false);
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem', maxWidth: '520px' }}>
      {/* Full-Screen 2-Second Success Transition Overlay */}
      {showSuccessOverlay && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4F46E5, #0D9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
            }}
          >
            <Compass size={40} style={{ color: '#FFFFFF' }} className={loadingStep < 3 ? 'spin-icon' : ''} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            ProjectPilot AI
          </h2>

          {/* Sequential Status Messages */}
          <div style={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            {loadingStep === 1 && (
              <div style={{ color: '#94A3B8', fontSize: '1.05rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} className="spin-icon" style={{ color: '#818CF8' }} />
                <span>Verifying your account…</span>
              </div>
            )}
            {loadingStep === 2 && (
              <div style={{ color: '#94A3B8', fontSize: '1.05rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} className="spin-icon" style={{ color: '#2DD4BF' }} />
                <span>Preparing your project workspace…</span>
              </div>
            )}
            {loadingStep === 3 && (
              <div style={{ color: '#34D399', fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={22} style={{ color: '#34D399' }} />
                <span>Welcome back, {loggedInUser?.name || 'Student'}!</span>
              </div>
            )}
          </div>

          {/* Animated Progress Indicator */}
          <div
            style={{
              width: '280px',
              height: '6px',
              backgroundColor: '#334155',
              borderRadius: '9999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressWidth}%`,
                background: 'linear-gradient(90deg, #6366F1, #2DD4BF, #34D399)',
                borderRadius: '9999px',
                transition: 'width 300ms ease-out',
              }}
            />
          </div>
        </div>
      )}

      {/* Main Login Form */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
          Student Sign In
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Log in to access your tailored project proposals, execution roadmap, and AI mentor workspace.
        </p>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div
          role="alert"
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            display: 'flex',
            flexDirection: isNetworkError ? 'column' : 'row',
            alignItems: isNetworkError ? 'flex-start' : 'center',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, color: '#DC2626' }} />
            <div>{errorMsg}</div>
          </div>
          {isNetworkError && (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: '#FFFFFF',
                borderColor: '#FCA5A5',
                color: '#991B1B',
                marginTop: '0.25rem',
              }}
            >
              <RefreshCw size={14} /> Try Again
            </button>
          )}
        </div>
      )}

      {/* Quick Demo Login Pill */}
      <div
        style={{
          backgroundColor: '#F0FDFA',
          border: '1px solid #99F6E4',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: '#115E59',
        }}
      >
        <div>
          <strong>Demo Student Account:</strong> <code>student@college.edu</code>
        </div>
        <button
          type="button"
          onClick={handleFillDemoStudent}
          style={{
            background: '#0D9488',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.35rem 0.7rem',
            borderRadius: '6px',
            fontSize: '0.775rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Auto-fill
        </button>
      </div>

      <div className="card" style={{ border: '1px solid #CBD5E1' }}>
        <form onSubmit={handleSubmit} noValidate={false}>
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">
              College Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
              />
              <input
                id="loginEmail"
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" htmlFor="loginPassword" style={{ margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '0.825rem', fontWeight: 500, cursor: 'pointer' }}
                disabled={isSubmitting}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
              />
              <input
                id="loginPassword"
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-block"
            style={{ marginTop: '1.25rem', padding: '0.75rem', fontSize: '1rem' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin-icon" /> Signing in…
              </>
            ) : (
              <>
                Sign In to ProjectPilot <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #E2E8F0',
            fontSize: '0.9rem',
            color: '#475569',
          }}
        >
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigateToPath('/register')}
            style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            disabled={isSubmitting}
          >
            Register Student Profile <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={() => navigateToPath('/admin/login')}
          style={{
            background: 'none',
            border: '1px solid #CBD5E1',
            color: '#475569',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          disabled={isSubmitting}
        >
          <ShieldCheck size={14} style={{ color: '#4F46E5' }} /> Are you a Faculty / Admin? Log in here
        </button>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
                <KeyRound style={{ color: '#4F46E5' }} size={20} /> Reset Password
              </h3>
              <button onClick={() => setShowForgotModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
              Enter your college email address and we'll send you a password reset verification link.
            </p>
            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="resetEmailInput">
                  College Email
                </label>
                <input
                  id="resetEmailInput"
                  type="email"
                  className="form-control"
                  placeholder="student@college.edu"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForgotModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
