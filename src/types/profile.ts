export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type DurationOption = '1-2 months' | '3-4 months' | '5-6 months';
export type TeamSizeOption = 1 | 2 | 3 | 4;
export type BudgetOption = 'Free/Zero' | '< $50 / Low' | '$50-$200 / Moderate' | '> $200 / Flexible';

export interface StudentProfile {
  id: string;
  degreeBranch: string;
  skills: string[];
  interests: string[];
  preferredDomain: string;
  experienceLevel: ExperienceLevel;
  weeklyHours: number;
  duration: DurationOption;
  teamSize: TeamSizeOption;
  budget: BudgetOption;
  preferredTechStack: string[];
  careerGoal: string;
  updatedAt: string;
}

export interface PresetProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  profile: StudentProfile;
}
