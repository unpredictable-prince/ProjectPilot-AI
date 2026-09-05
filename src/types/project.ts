export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface MVPFeature {
  id: string;
  title: string;
  description: string;
  isCore: boolean;
}

export interface FutureFeature {
  id: string;
  title: string;
  description: string;
}

export interface RecommendedStackItem {
  category: string;
  technology: string;
  reason: string;
}

export interface RiskFactor {
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface Milestone {
  week: number;
  phaseTitle: string;
  deliverable: string;
  tasks: string[];
}

export interface SprintTask {
  id: string;
  milestoneWeek: number;
  title: string;
  category: 'Setup' | 'Core' | 'Integration' | 'Testing' | 'Documentation';
  completed: boolean;
  estimatedHours?: number;
  dependencies?: string[];
  notes?: string;
}

export interface StructuredMentorResponse {
  directAnswer: string;
  recommendedNextAction: string;
  riskFlag?: string;
  rationale: string;
  suggestedActions?: string[];
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  structuredResponse?: StructuredMentorResponse;
  timestamp: string;
  suggestedActions?: string[];
}

export interface FeasibilityBreakdown {
  overallScore: number;
  skillMatchScore: number;
  timeAvailabilityScore: number;
  scopeRealismScore: number;
  teamCapacityScore: number;
  budgetFeasibilityScore: number;
  techFamiliarityScore: number;
  explanation: string;
}

export interface ProjectImprovementProposal {
  id: string;
  instruction: string;
  proposedTitle?: string;
  proposedValueProp?: string;
  newMVPFeatures: MVPFeature[];
  newFutureScope: FutureFeature[];
  suggestedStackChanges?: RecommendedStackItem[];
  rationale: string;
  feasibilityImpact: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  valueProposition: string;
  domain: string;
  difficulty: DifficultyLevel;
  estimatedDuration: string;
  estimatedWeeklyEffort: number;
  requiredSkills: string[];
  innovationScore: number;
  feasibilityScore: number;
  feasibilityBreakdown: FeasibilityBreakdown;
  whyItFits: string;
  problemStatement: string;
  targetUsers: string[];
  proposedSolution: string;
  uniqueDifferentiator: string;
  mvpFeatures: MVPFeature[];
  futureScope: FutureFeature[];
  recommendedStack: RecommendedStackItem[];
  architectureSummary: string;
  dataHardwareRequirements: {
    primaryDataOrAPI: string;
    mockAlternative: string;
    hardwareNotes: string;
  };
  risks: RiskFactor[];
  milestones: Milestone[];
  tasks: SprintTask[];
  blockers: string[];
  pendingImprovement?: ProjectImprovementProposal | null;
  createdAt: string;
  status: 'draft' | 'saved' | 'in_progress' | 'completed';
  progressPercentage: number;
  mentorMessages?: MentorMessage[];
  mentorNotes?: string[];
}
