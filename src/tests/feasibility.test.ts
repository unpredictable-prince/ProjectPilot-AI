import { describe, it, expect } from 'vitest';
import { FeasibilityEngine } from '../services/feasibilityEngine';
import type { StudentProfile } from '../types/profile';

describe('FeasibilityEngine', () => {
  const baseProfile: StudentProfile = {
    id: 'test_profile_1',
    degreeBranch: 'B.Tech Computer Science',
    skills: ['Python', 'React', 'FastAPI'],
    interests: ['Education', 'Healthcare'],
    preferredDomain: 'Education Tech',
    experienceLevel: 'intermediate',
    weeklyHours: 15,
    duration: '3-4 months',
    teamSize: 2,
    budget: '< $50 / Low',
    preferredTechStack: ['Python', 'React'],
    careerGoal: 'ML Engineer',
    updatedAt: new Date().toISOString(),
  };

  it('calculates a valid transparent Feasibility Breakdown with all 6 factors', () => {
    const breakdown = FeasibilityEngine.calculateFeasibilityBreakdown(
      baseProfile,
      ['Python', 'React', 'FastAPI'],
      'Intermediate',
      ['Python', 'React']
    );

    expect(breakdown.overallScore).toBeGreaterThanOrEqual(1.0);
    expect(breakdown.overallScore).toBeLessThanOrEqual(10.0);
    expect(breakdown.skillMatchScore).toBeGreaterThanOrEqual(1);
    expect(breakdown.timeAvailabilityScore).toBeGreaterThanOrEqual(1);
    expect(breakdown.scopeRealismScore).toBeGreaterThanOrEqual(1);
    expect(breakdown.teamCapacityScore).toBeGreaterThanOrEqual(1);
    expect(breakdown.budgetFeasibilityScore).toBeGreaterThanOrEqual(1);
    expect(breakdown.techFamiliarityScore).toBeGreaterThanOrEqual(1);
    expect(breakdown.explanation).toContain('Feasibility calculated at');
  });

  it('penalizes advanced projects with low time & beginner experience', () => {
    const beginnerProfile: StudentProfile = {
      ...baseProfile,
      weeklyHours: 5,
      duration: '1-2 months',
      experienceLevel: 'beginner',
    };
    const breakdown = FeasibilityEngine.calculateFeasibilityBreakdown(
      beginnerProfile,
      ['C++', 'CUDA', 'Distributed Systems'],
      'Advanced',
      ['CUDA']
    );

    expect(breakdown.overallScore).toBeLessThan(7.0);
    expect(breakdown.scopeRealismScore).toBeLessThanOrEqual(5);
  });
});
