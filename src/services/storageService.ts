import type { StudentProfile, PresetProfile } from '../types/profile.ts';
import type { ProjectIdea } from '../types/project.ts';

const STORAGE_KEYS = {
  PROFILE_DRAFT: 'projectpilot_profile_draft',
  SAVED_PROJECTS: 'projectpilot_saved_projects',
  ACTIVE_PROJECT_ID: 'projectpilot_active_project_id',
};

export const DEFAULT_PROFILE: StudentProfile = {
  id: 'draft_profile_1',
  degreeBranch: 'B.Tech Computer Science & Engineering',
  skills: ['Python', 'React', 'TypeScript', 'Node.js'],
  interests: ['Education', 'AI & Machine Learning'],
  preferredDomain: 'Education Tech',
  experienceLevel: 'intermediate',
  weeklyHours: 15,
  duration: '3-4 months',
  teamSize: 2,
  budget: '< $50 / Low',
  preferredTechStack: ['React', 'Python', 'FastAPI', 'PostgreSQL'],
  careerGoal: 'Full-stack Software Engineer at a product tech company',
  updatedAt: new Date().toISOString(),
};

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'preset_beginner_cse',
    name: 'Priya Sharma',
    role: 'Beginner CSE (6 Weeks • Web Basics)',
    avatar: '🌱',
    profile: {
      id: 'preset_beginner_cse_profile',
      degreeBranch: 'B.Tech Computer Science & Engineering',
      skills: ['HTML5', 'CSS3', 'JavaScript (ES6)', 'Git'],
      interests: ['Education', 'Interactive Learning', 'Campus Life'],
      preferredDomain: 'Education Tech',
      experienceLevel: 'beginner',
      weeklyHours: 12,
      duration: '1-2 months',
      teamSize: 1,
      budget: 'Free/Zero',
      preferredTechStack: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
      careerGoal: 'Frontend Web Developer & UI Engineer',
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'preset_intermediate_sustainability',
    name: 'Arjun Mehta',
    role: 'Intermediate CS (8 Weeks • React/Python)',
    avatar: '⚡',
    profile: {
      id: 'preset_intermediate_sustainability_profile',
      degreeBranch: 'B.Tech Information Technology',
      skills: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Chart.js'],
      interests: ['Sustainability', 'Smart Energy', 'Data Visualization'],
      preferredDomain: 'Sustainability & Green Tech',
      experienceLevel: 'intermediate',
      weeklyHours: 16,
      duration: '3-4 months',
      teamSize: 2,
      budget: '< $50 / Low',
      preferredTechStack: ['React', 'Python', 'FastAPI', 'PostgreSQL'],
      careerGoal: 'Full-Stack Developer / Climate-Tech Systems Engineer',
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'preset_team_accessibility',
    name: 'Kavya & Team',
    role: 'Team of 3 (10 Weeks • Mobile/ML)',
    avatar: '♿',
    profile: {
      id: 'preset_team_accessibility_profile',
      degreeBranch: 'B.Tech Computer Science & AI',
      skills: ['React Native', 'Python', 'PyTorch', 'OpenCV', 'TensorFlow Lite'],
      interests: ['Accessibility', 'Assistive AI', 'Computer Vision'],
      preferredDomain: 'Accessibility & Assistive Tech',
      experienceLevel: 'advanced',
      weeklyHours: 20,
      duration: '3-4 months',
      teamSize: 3,
      budget: '$50-$200 / Moderate',
      preferredTechStack: ['React Native', 'Python', 'PyTorch', 'FastAPI'],
      careerGoal: 'Mobile AI Engineer & Computer Vision Researcher',
      updatedAt: new Date().toISOString(),
    },
  },
];

export const StorageService = {
  getProfileDraft(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE_DRAFT);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load profile draft from storage:', e);
    }
    return DEFAULT_PROFILE;
  },

  saveProfileDraft(profile: StudentProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE_DRAFT, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile draft to storage:', e);
    }
  },

  getSavedProjects(): ProjectIdea[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_PROJECTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load saved projects from storage:', e);
    }
    return [];
  },

  saveProject(project: ProjectIdea): ProjectIdea[] {
    const projects = this.getSavedProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    let updated: ProjectIdea[];

    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = { ...project, status: 'saved' };
    } else {
      updated = [{ ...project, status: 'saved' }, ...projects];
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save project:', e);
    }
    return updated;
  },

  deleteProject(id: string): ProjectIdea[] {
    const projects = this.getSavedProjects().filter((p) => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(projects));
      if (this.getActiveProjectId() === id) {
        this.setActiveProjectId(projects[0]?.id || null);
      }
    } catch (e) {
      console.error('Failed to delete project:', e);
    }
    return projects;
  },

  duplicateProject(id: string): ProjectIdea[] {
    const projects = this.getSavedProjects();
    const original = projects.find((p) => p.id === id);
    if (!original) return projects;

    const copy: ProjectIdea = {
      ...original,
      id: `proj_copy_${Date.now()}`,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };

    const updated = [copy, ...projects];
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to duplicate project:', e);
    }
    return updated;
  },

  getActiveProjectId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
    } catch {
      return null;
    }
  },

  setActiveProjectId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
      }
    } catch (e) {
      console.error('Failed to set active project id:', e);
    }
  },
};
