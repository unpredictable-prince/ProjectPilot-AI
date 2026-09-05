import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StudentProfile } from '../types/profile';
import type { ProjectIdea, ProjectImprovementProposal, SprintTask } from '../types/project';
import type { User, AuthSession } from '../types/auth';
import { StorageService, PRESET_PROFILES } from '../services/storageService';
import { AIService } from '../services/aiService';
import { AuthService } from '../services/authService';

export type ScreenName =
  | 'landing'
  | 'login'
  | 'register'
  | 'admin-login'
  | 'admin-panel'
  | 'dashboard'
  | 'wizard'
  | 'results'
  | 'details'
  | 'workspace'
  | 'review'
  | 'saved';

interface AppContextType {
  currentScreen: ScreenName;
  setScreen: (screen: ScreenName) => void;
  currentPath: string;
  navigateToPath: (path: string) => void;
  currentUser: User | null;
  session: AuthSession | null;
  login: (email: string, password: string, autoRedirect?: boolean) => Promise<AuthSession>;
  registerStudent: (name: string, email: string, password: string, degreeBranch?: string, experienceLevel?: 'beginner' | 'intermediate' | 'advanced') => Promise<AuthSession>;

  adminLogin: (email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  updateProfileField: <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => void;
  loadPresetProfile: (presetId: string) => void;
  generatedIdeas: ProjectIdea[];
  selectedIdea: ProjectIdea | null;
  setSelectedIdea: (idea: ProjectIdea | null) => void;
  activeProject: ProjectIdea | null;
  setActiveProject: React.Dispatch<React.SetStateAction<ProjectIdea | null>>;
  savedProjects: ProjectIdea[];
  isGenerating: boolean;
  isFallback: boolean;
  toast: { id: string; text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  generateIdeas: () => Promise<void>;
  selectProjectToExecute: (idea: ProjectIdea) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addCustomTaskToWorkspace: (title: string, estimatedHours: number, milestoneWeek: number, category: SprintTask['category']) => void;
  updateActiveProjectTitleAndScope: (title: string, valueProposition: string) => void;
  addBlocker: (blockerText: string) => void;
  removeBlocker: (index: number) => void;
  acceptProjectImprovement: (proposal: ProjectImprovementProposal) => void;
  saveActiveProject: () => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  reopenSavedProject: (project: ProjectIdea) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => AuthService.getCurrentSession());
  const [currentUser, setCurrentUser] = useState<User | null>(() => session?.user || null);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const rawPath = window.location.pathname;
    if (session) {
      if (!rawPath || rawPath === '/' || rawPath === '/login' || rawPath === '/register') {
        return session.user.role === 'admin' ? '/admin' : '/dashboard';
      }
      return rawPath;
    }
    return rawPath && rawPath !== '/' ? rawPath : '/login';
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    switch (currentPath) {
      case '/login': return session ? (session.user.role === 'admin' ? 'admin-panel' : 'dashboard') : 'login';
      case '/register': return session ? (session.user.role === 'admin' ? 'admin-panel' : 'dashboard') : 'register';
      case '/admin/login': return session && session.user.role === 'admin' ? 'admin-panel' : 'admin-login';
      case '/admin': return 'admin-panel';
      case '/dashboard': return 'dashboard';
      case '/wizard': return 'wizard';
      case '/results': return 'results';
      case '/details': return 'details';
      case '/workspace': return 'workspace';
      case '/review': return 'review';
      case '/saved': return 'saved';
      default: return session ? (session.user.role === 'admin' ? 'admin-panel' : 'dashboard') : 'login';
    }
  });

  const [profile, setProfile] = useState<StudentProfile>(() => StorageService.getProfileDraft());
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);

  // User-Isolated Saved & Active Projects
  const [savedProjects, setSavedProjects] = useState<ProjectIdea[]>(() => {
    return currentUser ? AuthService.getUserProjects(currentUser.id) : [];
  });

  const [activeProject, setActiveProject] = useState<ProjectIdea | null>(() => {
    return savedProjects.find((p) => p.status === 'in_progress') || savedProjects[0] || null;
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [toast, setToast] = useState<{ id: string; text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync saved projects when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const userProjects = AuthService.getUserProjects(currentUser.id);
      setSavedProjects(userProjects);
      setActiveProject(userProjects.find((p) => p.status === 'in_progress') || userProjects[0] || null);
    } else {
      setSavedProjects([]);
      setActiveProject(null);
    }
  }, [currentUser]);

  useEffect(() => {
    StorageService.saveProfileDraft(profile);
  }, [profile]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const navigateToPath = (path: string, userOverride?: User | null) => {
    const activeUser = userOverride !== undefined ? userOverride : (currentUser || AuthService.getCurrentSession()?.user || null);

    window.history.pushState({}, '', path);
    setCurrentPath(path);

    switch (path) {
      case '/login':
        if (activeUser) {
          const target = activeUser.role === 'admin' ? '/admin' : '/dashboard';
          window.history.replaceState({}, '', target);
          setCurrentPath(target);
          setCurrentScreen(activeUser.role === 'admin' ? 'admin-panel' : 'dashboard');
          return;
        }
        setCurrentScreen('login');
        break;
      case '/register':
        if (activeUser) {
          const target = activeUser.role === 'admin' ? '/admin' : '/dashboard';
          window.history.replaceState({}, '', target);
          setCurrentPath(target);
          setCurrentScreen(activeUser.role === 'admin' ? 'admin-panel' : 'dashboard');
          return;
        }
        setCurrentScreen('register');
        break;
      case '/admin/login':
        if (activeUser && activeUser.role === 'admin') {
          window.history.replaceState({}, '', '/admin');
          setCurrentPath('/admin');
          setCurrentScreen('admin-panel');
          return;
        }
        setCurrentScreen('admin-login');
        break;
      case '/admin':
        if (!activeUser || activeUser.role !== 'admin') {
          showToast('403 Access Denied: Admin authorization required.', 'error');
          navigateToPath('/login', activeUser);
          return;
        }
        setCurrentScreen('admin-panel');
        break;
      case '/dashboard':
        if (!activeUser) {
          showToast('Please sign in to access your student dashboard.', 'info');
          navigateToPath('/login', activeUser);
          return;
        }
        setCurrentScreen('dashboard');
        break;
      case '/profile':
      case '/wizard':
        if (!activeUser) {
          showToast('Please sign in to access ProjectPilot AI.', 'info');
          navigateToPath('/login', activeUser);
          return;
        }
        setCurrentScreen('wizard');
        break;
      case '/results':
        if (!activeUser) {
          navigateToPath('/login', activeUser);
          return;
        }
        setCurrentScreen('results');
        break;
      case '/details':
        if (!activeUser) {
          navigateToPath('/login', activeUser);
          return;
        }
        setCurrentScreen('details');
        break;
      case '/workspace':
        if (!activeUser) {
          navigateToPath('/login', activeUser);
          return;
        }
        setCurrentScreen('workspace');
        break;
      case '/review':
        if (!activeUser) {
          navigateToPath('/login', activeUser);
          return;
        }
        setCurrentScreen('review');
        break;
      case '/saved':
        if (!activeUser) {
          navigateToPath('/login', activeUser);
          return;
        }
        setCurrentScreen('saved');
        break;
      case '/':
      default:
        if (activeUser) {
          if (activeUser.role === 'admin') {
            setCurrentScreen('admin-panel');
          } else {
            setCurrentScreen('dashboard');
          }
        } else {
          setCurrentScreen('login');
        }
        break;
    }
  };

  const setScreen = (screen: ScreenName) => {
    let path = '/login';
    switch (screen) {
      case 'landing': path = '/login'; break;
      case 'login': path = '/login'; break;
      case 'register': path = '/register'; break;
      case 'admin-login': path = '/admin/login'; break;
      case 'admin-panel': path = '/admin'; break;
      case 'dashboard': path = '/dashboard'; break;
      case 'wizard': path = '/wizard'; break;
      case 'results': path = '/results'; break;
      case 'details': path = '/details'; break;
      case 'workspace': path = '/workspace'; break;
      case 'review': path = '/review'; break;
      case 'saved': path = '/saved'; break;
    }
    navigateToPath(path);
  };

  const login = async (email: string, pass: string, autoRedirect: boolean = true): Promise<AuthSession> => {
    const s = await AuthService.login(email, pass);
    setSession(s);
    setCurrentUser(s.user);
    if (autoRedirect) {
      if (s.user.role === 'admin') {
        navigateToPath('/admin', s.user);
      } else {
        navigateToPath('/dashboard', s.user);
      }
    }
    return s;
  };

  const registerStudent = async (
    name: string,
    email: string,
    pass: string,
    degreeBranch?: string,
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<AuthSession> => {
    const s = await AuthService.registerStudent(name, email, pass, degreeBranch, experienceLevel);
    setSession(s);
    setCurrentUser(s.user);
    navigateToPath('/dashboard', s.user);
    return s;
  };

  const adminLogin = async (email: string, pass: string): Promise<AuthSession> => {
    const s = await AuthService.adminLogin(email, pass);
    setSession(s);
    setCurrentUser(s.user);
    navigateToPath('/admin', s.user);
    return s;
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/login';
      setCurrentPath(path);

      if (currentUser) {
        if (path === '/login' || path === '/register' || path === '/admin/login' || path === '/') {
          const target = currentUser.role === 'admin' ? '/admin' : '/dashboard';
          window.history.replaceState({}, '', target);
          setCurrentPath(target);
          setCurrentScreen(currentUser.role === 'admin' ? 'admin-panel' : 'dashboard');
          return;
        }
        if (path === '/admin' && currentUser.role !== 'admin') {
          showToast('403 Access Denied: Faculty / Admin authorization required.', 'error');
          window.history.replaceState({}, '', '/dashboard');
          setCurrentPath('/dashboard');
          setCurrentScreen('dashboard');
          return;
        }
      } else {
        const protectedPaths = ['/dashboard', '/wizard', '/results', '/details', '/workspace', '/review', '/saved', '/admin'];
        if (protectedPaths.includes(path)) {
          showToast('You have been logged out. Please sign in again.', 'info');
          window.history.replaceState({}, '', '/login');
          setCurrentPath('/login');
          setCurrentScreen('login');
          return;
        }
      }

      switch (path) {
        case '/login': setCurrentScreen('login'); break;
        case '/register': setCurrentScreen('register'); break;
        case '/admin/login': setCurrentScreen('admin-login'); break;
        case '/admin': setCurrentScreen('admin-panel'); break;
        case '/dashboard': setCurrentScreen('dashboard'); break;
        case '/wizard': setCurrentScreen('wizard'); break;
        case '/results': setCurrentScreen('results'); break;
        case '/details': setCurrentScreen('details'); break;
        case '/workspace': setCurrentScreen('workspace'); break;
        case '/review': setCurrentScreen('review'); break;
        case '/saved': setCurrentScreen('saved'); break;
        default: setCurrentScreen(currentUser ? (currentUser.role === 'admin' ? 'admin-panel' : 'dashboard') : 'login'); break;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  const logout = () => {
    AuthService.logout();
    setSession(null);
    setCurrentUser(null);
    setSavedProjects([]);
    setActiveProject(null);
    window.history.replaceState({}, '', '/login');
    setCurrentPath('/login');
    setCurrentScreen('login');
    showToast('You have been logged out successfully.', 'info');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    try {
      const updated = AuthService.updateUserProfile(currentUser.id, updates);
      setCurrentUser(updated);
      setProfile((prev) => ({
        ...prev,
        degreeBranch: updated.degreeBranch || prev.degreeBranch,
        experienceLevel: updated.experienceLevel || prev.experienceLevel,
        updatedAt: new Date().toISOString(),
      }));
      showToast('User account information updated successfully!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to update account details.', 'error');
    }
  };

  const updateProfileField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const loadPresetProfile = (presetId: string) => {
    const preset = PRESET_PROFILES.find((p) => p.id === presetId);
    if (preset) {
      setProfile(preset.profile);
      showToast(`Loaded preset profile: ${preset.name} (${preset.role})`, 'success');
    }
  };

  const generateIdeas = async () => {
    setIsGenerating(true);
    setGeneratedIdeas([]);
    setSelectedIdea(null);
    try {
      const result = await AIService.generateProjectIdeas(profile);
      setGeneratedIdeas(result.ideas);
      setIsFallback(result.isFallback);
      if (result.ideas.length > 0) {
        setSelectedIdea(result.ideas[0]);
      }
      navigateToPath('/results');
      if (result.isFallback) {
        showToast(`Generated ${result.ideas.length} tailored capstone proposals in Smart Recommendation Mode!`, 'success');
      } else {
        showToast(`Generated ${result.ideas.length} custom project proposals via Gemini AI!`, 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to generate project ideas. Switched to Smart Offline Mode.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectProjectToExecute = (idea: ProjectIdea) => {
    if (!currentUser) {
      showToast('Please log in to save and execute projects.', 'error');
      navigateToPath('/login');
      return;
    }

    const activated: ProjectIdea = {
      ...idea,
      status: 'in_progress',
      progressPercentage: 0,
      blockers: idea.blockers || [],
    };
    setActiveProject(activated);
    const updatedList = AuthService.saveUserProject(currentUser.id, activated);
    setSavedProjects(updatedList);
    navigateToPath('/workspace');
    showToast(`Started workspace for "${idea.title}"`, 'success');
  };

  const toggleTaskCompletion = (taskId: string) => {
    if (!activeProject || !currentUser) return;

    const updatedTasks = activeProject.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const progressPercentage = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedProject: ProjectIdea = {
      ...activeProject,
      tasks: updatedTasks,
      progressPercentage,
    };

    setActiveProject(updatedProject);
    const updatedList = AuthService.saveUserProject(currentUser.id, updatedProject);
    setSavedProjects(updatedList);
  };

  const addCustomTaskToWorkspace = (
    title: string,
    estimatedHours: number,
    milestoneWeek: number,
    category: SprintTask['category']
  ) => {
    if (!activeProject || !currentUser) return;

    const newTask: SprintTask = {
      id: `task_custom_${Date.now()}`,
      milestoneWeek,
      title: title.trim(),
      category,
      completed: false,
      estimatedHours,
    };

    const updatedTasks = [...activeProject.tasks, newTask];
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const progressPercentage = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedProject: ProjectIdea = {
      ...activeProject,
      tasks: updatedTasks,
      progressPercentage,
    };

    setActiveProject(updatedProject);
    const updatedList = AuthService.saveUserProject(currentUser.id, updatedProject);
    setSavedProjects(updatedList);
    showToast(`Added task "${title.slice(0, 25)}..." to sprint checklist!`, 'success');
  };

  const updateActiveProjectTitleAndScope = (title: string, valueProposition: string) => {
    if (!activeProject || !currentUser) return;
    const updated: ProjectIdea = {
      ...activeProject,
      title: title.trim(),
      valueProposition: valueProposition.trim(),
    };
    setActiveProject(updated);
    const updatedList = AuthService.saveUserProject(currentUser.id, updated);
    setSavedProjects(updatedList);
    showToast('Updated project title and scope!', 'success');
  };

  const addBlocker = (blockerText: string) => {
    if (!activeProject || !currentUser) return;
    const updated: ProjectIdea = {
      ...activeProject,
      blockers: [blockerText, ...(activeProject.blockers || [])],
    };
    setActiveProject(updated);
    const updatedList = AuthService.saveUserProject(currentUser.id, updated);
    setSavedProjects(updatedList);
    showToast('Blocker logged to project workspace.', 'info');
  };

  const removeBlocker = (index: number) => {
    if (!activeProject || !currentUser) return;
    const current = activeProject.blockers || [];
    const updatedBlockers = current.filter((_, i) => i !== index);
    const updated: ProjectIdea = {
      ...activeProject,
      blockers: updatedBlockers,
    };
    setActiveProject(updated);
    const updatedList = AuthService.saveUserProject(currentUser.id, updated);
    setSavedProjects(updatedList);
    showToast('Marked blocker as resolved!', 'success');
  };

  const acceptProjectImprovement = (proposal: ProjectImprovementProposal) => {
    if (!activeProject || !currentUser) return;
    const updated: ProjectIdea = {
      ...activeProject,
      title: proposal.proposedTitle || activeProject.title,
      valueProposition: proposal.proposedValueProp || activeProject.valueProposition,
      mvpFeatures: proposal.newMVPFeatures,
      futureScope: proposal.newFutureScope,
      recommendedStack: proposal.suggestedStackChanges || activeProject.recommendedStack,
    };
    setActiveProject(updated);
    const updatedList = AuthService.saveUserProject(currentUser.id, updated);
    setSavedProjects(updatedList);
    showToast('Accepted scope improvement proposal! Project plan updated.', 'success');
  };

  const saveActiveProject = () => {
    if (!activeProject || !currentUser) return;
    const updatedList = AuthService.saveUserProject(currentUser.id, activeProject);
    setSavedProjects(updatedList);
    showToast('Project progress saved under your student account!', 'success');
  };

  const duplicateProject = (id: string) => {
    if (!currentUser) return;
    const target = savedProjects.find((p) => p.id === id);
    if (!target) return;

    const dup: ProjectIdea = {
      ...target,
      id: `idea_copy_${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    const updatedList = AuthService.saveUserProject(currentUser.id, dup);
    setSavedProjects(updatedList);
    showToast('Project duplicated successfully!', 'success');
  };

  const deleteProject = (id: string) => {
    if (!currentUser) return;
    const updatedList = AuthService.deleteUserProject(currentUser.id, id);
    setSavedProjects(updatedList);
    if (activeProject?.id === id) {
      setActiveProject(updatedList[0] || null);
    }
    showToast('Project removed from saved list.', 'info');
  };

  const reopenSavedProject = (project: ProjectIdea) => {
    setActiveProject(project);
    navigateToPath('/workspace');
    showToast(`Reopened "${project.title}"`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setScreen,
        currentPath,
        navigateToPath,
        currentUser,
        session,
        login,
        registerStudent,
        adminLogin,
        logout,
        updateUser,
        profile,
        setProfile,
        updateProfileField,
        loadPresetProfile,
        generatedIdeas,
        selectedIdea,
        setSelectedIdea,
        activeProject,
        setActiveProject,
        savedProjects,
        isGenerating,
        isFallback,
        toast,
        showToast,
        generateIdeas,
        selectProjectToExecute,
        toggleTaskCompletion,
        addCustomTaskToWorkspace,
        updateActiveProjectTitleAndScope,
        addBlocker,
        removeBlocker,
        acceptProjectImprovement,
        saveActiveProject,
        duplicateProject,
        deleteProject,
        reopenSavedProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
