import type { StudentProfile } from './profile';
import type { ProjectIdea } from './project';

export interface GenerateIdeasRequest {
  profile: StudentProfile;
  apiKey?: string;
}

export interface GenerateIdeasResponse {
  ideas: ProjectIdea[];
  isFallback: boolean;
  source: 'gemini' | 'deterministic-fallback';
}

export interface RefineIdeaRequest {
  idea: ProjectIdea;
  refinementInstruction: string;
  profile: StudentProfile;
}

export interface ProgressReviewRequest {
  project: ProjectIdea;
  completedTaskIds: string[];
  blockers: string;
  weeklyProgressNotes: string;
}

export interface ProgressReviewResponse {
  mentorFeedback: string;
  revisedPriorities: string[];
  suggestedNextTasks: string[];
  updatedFeasibilityScore: number;
}

export interface ProjectPitchResponse {
  title: string;
  hook: string;
  problem: string;
  solution: string;
  keyFeatures: string[];
  techStack: string[];
  feasibilityScore: number;
  closingCallToAction: string;
  isFallback: boolean;
  source: 'gemini' | 'deterministic-fallback';
}

