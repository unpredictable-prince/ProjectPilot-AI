import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Compass, BookmarkCheck, Menu, X, Rocket, LogOut, ShieldCheck, User as UserIcon, LogIn, Edit, Save } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    navigateToPath,
    activeProject,
    savedProjects,
    currentUser,
    logout,
    updateUser,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDegree, setEditDegree] = useState('');
  const [editExp, setEditExp] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditDegree(currentUser.degreeBranch || 'Computer Science & Engineering');
      setEditExp(currentUser.experienceLevel || 'intermediate');
    }
  }, [currentUser, isProfileModalOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleNavClick = (screen: any) => {
    setScreen(screen);
    setIsMenuOpen(false);
  };

  const isAuthPage = currentScreen === 'login' || currentScreen === 'register' || currentScreen === 'admin-login';

  return (
    <header style={{ backgroundColor: '#0F172A', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand / Logo */}
        <button
          onClick={() => navigateToPath(currentUser ? (currentUser.role === 'admin' ? '/admin' : '/dashboard') : '/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            padding: 0,
          }}
          aria-label="ProjectPilot AI Home"
        >
          <div
            style={{
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={22} />
          </div>
          <span>
            ProjectPilot <span style={{ color: '#0D9488', fontSize: '0.85em', fontWeight: 600 }}>AI</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav" aria-label="Main Navigation">
          {currentUser ? (
            /* Logged-In Student / Admin Navbar */
            <>
              <button onClick={() => handleNavClick('dashboard')} style={navButtonStyle(currentScreen === 'dashboard')}>
                Home
              </button>
              <button onClick={() => handleNavClick('wizard')} style={navButtonStyle(currentScreen === 'wizard')}>
                Create Project
              </button>
              <button
                onClick={() => handleNavClick('results')}
                style={navButtonStyle(currentScreen === 'results' || currentScreen === 'details')}
              >
                Project Ideas
              </button>
              {activeProject && (
                <button
                  onClick={() => handleNavClick('workspace')}
                  style={navButtonStyle(currentScreen === 'workspace' || currentScreen === 'review')}
                >
                  <Rocket size={16} /> Active Workspace
                </button>
              )}
              <button onClick={() => handleNavClick('saved')} style={navButtonStyle(currentScreen === 'saved')}>
                <BookmarkCheck size={16} /> My Projects ({savedProjects.length})
              </button>

              {/* Faculty / Admin Panel link (Strictly for Admin Users) */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => navigateToPath('/admin')}
                  style={{
                    backgroundColor: '#38BDF8',
                    color: '#0F172A',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <ShieldCheck size={16} /> Admin Panel
                </button>
              )}

              {/* Logged-in User Info & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid #334155', paddingLeft: '0.85rem' }}>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  title={`View Account Information (${currentUser.name})`}
                  style={{
                    background: currentScreen === 'wizard' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    border: currentScreen === 'wizard' ? '1px solid #6366F1' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: currentScreen === 'wizard' ? '#818CF8' : '#F1F5F9',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease-in-out',
                  }}
                  className="user-profile-btn"
                >
                  <UserIcon size={15} style={{ color: '#38BDF8' }} />
                  <span>{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(248, 113, 113, 0.35)',
                    color: '#F87171',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s ease-in-out',
                  }}
                  title="Sign out of account"
                  className="logout-btn"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          ) : (
            /* Logged-Out Navbar: Hide buttons on /login and /register */
            !isAuthPage && (
              <>
                <button onClick={() => navigateToPath('/login')} style={navButtonStyle((currentScreen as string) === 'login')}>
                  <LogIn size={16} /> Sign In
                </button>
                <button
                  onClick={() => navigateToPath('/register')}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                >
                  Register
                </button>
              </>
            )
          )}
        </nav>

        {/* Mobile Hamburger Toggle Button (Hidden on /login and /register when logged out) */}
        {(currentUser || !isAuthPage) && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
            }}
            className="mobile-menu-btn"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-label="Mobile Navigation"
          style={{
            backgroundColor: '#1E293B',
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          }}
        >
          {currentUser ? (
            <>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#94A3B8',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <UserIcon size={14} style={{ color: '#0D9488' }} />
                <span>
                  Signed in as: <strong>{currentUser.name}</strong> ({currentUser.role})
                </span>
              </div>

              <button
                onClick={() => handleNavClick('dashboard')}
                style={{ ...navButtonStyle(currentScreen === 'dashboard'), justifyContent: 'flex-start', fontSize: '1rem' }}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('wizard')}
                style={{ ...navButtonStyle(currentScreen === 'wizard'), justifyContent: 'flex-start', fontSize: '1rem' }}
              >
                Create Project
              </button>
              <button
                onClick={() => handleNavClick('results')}
                style={{
                  ...navButtonStyle(currentScreen === 'results' || currentScreen === 'details'),
                  justifyContent: 'flex-start',
                  fontSize: '1rem',
                }}
              >
                Project Ideas
              </button>

              {activeProject && (
                <button
                  onClick={() => handleNavClick('workspace')}
                  style={{
                    ...navButtonStyle(currentScreen === 'workspace' || currentScreen === 'review'),
                    justifyContent: 'flex-start',
                    fontSize: '1rem',
                  }}
                >
                  <Rocket size={16} /> Active Workspace
                </button>
              )}

              <button
                onClick={() => handleNavClick('saved')}
                style={{ ...navButtonStyle(currentScreen === 'saved'), justifyContent: 'flex-start', fontSize: '1rem' }}
              >
                <BookmarkCheck size={16} /> My Projects ({savedProjects.length})
              </button>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    navigateToPath('/admin');
                    setIsMenuOpen(false);
                  }}
                  style={{
                    backgroundColor: '#38BDF8',
                    color: '#0F172A',
                    border: 'none',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    marginTop: '0.25rem',
                  }}
                >
                  <ShieldCheck size={18} /> Admin Panel
                </button>
              )}

              <button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setIsMenuOpen(false);
                }}
                style={{
                  ...navButtonStyle(currentScreen === 'wizard'),
                  justifyContent: 'flex-start',
                  fontSize: '1rem',
                }}
              >
                <UserIcon size={16} style={{ color: '#38BDF8' }} /> Profile ({currentUser.name})
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #F87171',
                  color: '#F87171',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  marginTop: '0.5rem',
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            !isAuthPage && (
              <>
                <button
                  onClick={() => {
                    navigateToPath('/login');
                    setIsMenuOpen(false);
                  }}
                  style={{ ...navButtonStyle((currentScreen as string) === 'login'), justifyContent: 'flex-start', fontSize: '1rem' }}
                >
                  <LogIn size={16} /> Sign In
                </button>
                <button
                  onClick={() => {
                    navigateToPath('/register');
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', fontSize: '0.95rem', width: '100%' }}
                >
                  Register Student Profile
                </button>
              </>
            )
          )}
        </div>
      )}

      {/* Logged-in User Account Details Modal */}
      {currentUser && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setIsEditingAccount(false);
          }}
          title={isEditingAccount ? 'Edit Account Details' : 'User Account Information'}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* User Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: currentUser.role === 'admin' ? '#0284C7' : '#4F46E5',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {currentUser.name ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0F172A', fontWeight: 700 }}>{currentUser.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: currentUser.role === 'admin' ? '#E0F2FE' : '#EEF2FF',
                      color: currentUser.role === 'admin' ? '#0369A1' : '#4338CA',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {currentUser.role} Account
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} /> Active Session
                  </span>
                </div>
              </div>
            </div>

            {isEditingAccount ? (
              /* Inline Edit Mode Form */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '0.9rem', cursor: 'not-allowed' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    Department / Degree Branch
                  </label>
                  <input
                    type="text"
                    value={editDegree}
                    onChange={(e) => setEditDegree(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    Technical Experience Level
                  </label>
                  <select
                    value={editExp}
                    onChange={(e) => setEditExp(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="beginner">Beginner (1st / 2nd Year Student)</option>
                    <option value="intermediate">Intermediate (3rd Year Capstone)</option>
                    <option value="advanced">Advanced (Final Year / Senior Developer)</option>
                  </select>
                </div>
              </div>
            ) : (
              /* Account Metadata Grid (View Mode) */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Email Address
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500, wordBreak: 'break-all' }}>
                    {currentUser.email}
                  </div>
                </div>

                <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Department / Degree Branch
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500 }}>
                    {currentUser.degreeBranch || 'Computer Science & Engineering'}
                  </div>
                </div>

                <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Technical Experience
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500, textTransform: 'capitalize' }}>
                    {currentUser.experienceLevel || 'Intermediate'}
                  </div>
                </div>

                <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Member Registration Date
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500 }}>
                    {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Demo Account'}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
              {isEditingAccount ? (
                <>
                  <button
                    onClick={() => {
                      setEditName(currentUser.name);
                      setEditDegree(currentUser.degreeBranch || 'Computer Science & Engineering');
                      setEditExp(currentUser.experienceLevel || 'intermediate');
                      setIsEditingAccount(false);
                    }}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateUser({
                        name: editName.trim() || currentUser.name,
                        degreeBranch: editDegree.trim() || currentUser.degreeBranch,
                        experienceLevel: editExp,
                      });
                      setIsEditingAccount(false);
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Save size={14} /> Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditingAccount(true)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Edit size={14} /> Edit Account Details
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setIsEditingAccount(false);
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
};

const navButtonStyle = (isActive: boolean): React.CSSProperties => ({
  background: 'none',
  border: 'none',
  color: isActive ? '#38BDF8' : '#CBD5E1',
  fontWeight: isActive ? 600 : 400,
  fontSize: '0.925rem',
  cursor: 'pointer',
  padding: '0.5rem 0',
  borderBottom: isActive ? '2px solid #38BDF8' : '2px solid transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
});

export default Navbar;
