export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  degreeBranch?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  isDeactivated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  degreeBranch: string;
  experienceLevel: string;
  registrationDate: string;
  projectStatus: 'no_project' | 'draft' | 'saved' | 'in_progress' | 'completed';
  activeProjectTitle?: string;
  activeProjectProgress?: number;
  isDeactivated: boolean;
}

export interface AiMetrics {
  totalAiRequests: number;
  totalFallbackRequests: number;
  lastSuccessfulRequest: string | null;
}

export interface AdminAnalytics {
  totalRegisteredUsers: number;
  activeUsersCount: number;
  totalGeneratedIdeasCount: number;
  totalSelectedProjectsCount: number;
  domainDistribution: Record<string, number>;
  averageFeasibilityScore: number;
  aiMetrics: AiMetrics;
  users: UserSummary[];
}
