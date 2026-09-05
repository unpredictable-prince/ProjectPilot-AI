import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RubricScoreCard } from '../components/project/RubricScoreCard';
import type { ProjectIdea } from '../types/project';

const mockIdea: ProjectIdea = {
  id: 'test_idea_1',
  title: 'AI Smart Campus Energy Monitor',
  valueProposition: 'Optimize energy consumption in university buildings.',
  domain: 'AI & Smart Infrastructure',
  difficulty: 'Intermediate',
  estimatedDuration: '12 weeks',
  estimatedWeeklyEffort: 12,
  requiredSkills: ['React', 'TypeScript', 'Node.js', 'Python'],
  innovationScore: 8.5,
  feasibilityScore: 9.0,
  feasibilityBreakdown: {
    overallScore: 9.0,
    skillMatchScore: 9,
    timeAvailabilityScore: 9,
    scopeRealismScore: 9,
    teamCapacityScore: 9,
    budgetFeasibilityScore: 9,
    techFamiliarityScore: 9,
    explanation: 'High match',
  },
  whyItFits: 'Matches student experience level.',
  problemStatement: 'High energy wastage across campus.',
  targetUsers: ['Students', 'Campus Admin'],
  proposedSolution: 'Real-time telemetry dashboard.',
  uniqueDifferentiator: 'Sub-meter IoT data integration.',
  mvpFeatures: [
    { id: 'f1', title: 'Data Ingestion', description: 'Telemetry API', isCore: true },
  ],
  futureScope: [],
  recommendedStack: [
    { category: 'Frontend', technology: 'React', reason: 'Fast rendering' },
  ],
  architectureSummary: 'Microservices architecture.',
  dataHardwareRequirements: {
    primaryDataOrAPI: 'REST API',
    mockAlternative: 'JSON Feeds',
    hardwareNotes: 'None',
  },
  risks: [{ risk: 'API downtime', impact: 'Low', mitigation: 'Use fallback' }],
  milestones: [],
  tasks: [],
  blockers: [],
  createdAt: new Date().toISOString(),
  status: 'draft',
  progressPercentage: 0,
  mentorMessages: [],
  mentorNotes: [],
};

describe('RubricScoreCard Component', () => {
  it('renders academic rubric header and weighted score breakdown correctly', () => {
    render(<RubricScoreCard project={mockIdea} />);

    expect(screen.getByText('Academic Rubric & Jury Alignment')).toBeDefined();
    expect(screen.getByText('Technical Depth & Skill Match')).toBeDefined();
    expect(screen.getByText('Feasibility & Resource Constraints')).toBeDefined();
    expect(screen.getByText('Academic Innovation & Differentiator')).toBeDefined();
    expect(screen.getByText('Capstone Timeline & Scope Balance')).toBeDefined();
  });

  it('displays correct feasibility score match from project properties', () => {
    render(<RubricScoreCard project={mockIdea} />);

    // 9.0 feasibility score out of 10 maps to 90/100
    expect(screen.getByText('90')).toBeDefined();
  });
});
