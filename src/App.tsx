import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';

// Performance optimization: Lazy-load screen views
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage').then((m) => ({ default: m.AdminPanelPage })));
const StudentDashboardPage = lazy(() => import('./pages/StudentDashboardPage').then((m) => ({ default: m.StudentDashboardPage })));
const ProfileWizardPage = lazy(() => import('./pages/ProfileWizardPage').then((m) => ({ default: m.ProfileWizardPage })));
const IdeaResultsPage = lazy(() => import('./pages/IdeaResultsPage').then((m) => ({ default: m.IdeaResultsPage })));
const IdeaDetailPage = lazy(() => import('./pages/IdeaDetailPage').then((m) => ({ default: m.IdeaDetailPage })));
const ProjectWorkspacePage = lazy(() => import('./pages/ProjectWorkspacePage').then((m) => ({ default: m.ProjectWorkspacePage })));
const ProgressReviewPage = lazy(() => import('./pages/ProgressReviewPage').then((m) => ({ default: m.ProgressReviewPage })));
const SavedProjectsPage = lazy(() => import('./pages/SavedProjectsPage').then((m) => ({ default: m.SavedProjectsPage })));

const LoadingFallback: React.FC = () => (
  <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }} role="status">
    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#4F46E5' }}>Loading ProjectPilot View...</div>
  </div>
);

const ScreenRenderer: React.FC = () => {
  const { currentScreen } = useApp();

  return (
    <Suspense fallback={<LoadingFallback />}>
      {(() => {
        switch (currentScreen) {
          case 'landing':
            return <LandingPage />;
          case 'login':
            return <LoginPage />;
          case 'register':
            return <RegisterPage />;
          case 'admin-login':
            return <AdminLoginPage />;
          case 'admin-panel':
            return <AdminPanelPage />;
          case 'dashboard':
            return <StudentDashboardPage />;
          case 'wizard':
            return <ProfileWizardPage />;
          case 'results':
            return <IdeaResultsPage />;
          case 'details':
            return <IdeaDetailPage />;
          case 'workspace':
            return <ProjectWorkspacePage />;
          case 'review':
            return <ProgressReviewPage />;
          case 'saved':
            return <SavedProjectsPage />;
          default:
            return <LoginPage />;
        }
      })()}
    </Suspense>
  );
};

export const AppContent: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <ScreenRenderer />
        </ErrorBoundary>
      </main>
      <Footer />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
