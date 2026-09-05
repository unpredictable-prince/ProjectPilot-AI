import { describe, it, expect } from 'vitest';
import { FallbackGenerator } from '../services/fallbackGenerator';
import type { StudentProfile } from '../types/profile';

describe('FallbackGenerator', () => {
  const sampleProfile: StudentProfile = {
    id: 'sample_student_1',
    degreeBranch: 'B.Tech Information Technology',
    skills: ['TypeScript', 'Node.js', 'React', 'MongoDB'],
    interests: ['Education', 'Campus Life'],
    preferredDomain: 'Education Tech',
    experienceLevel: 'intermediate',
    weeklyHours: 20,
    duration: '3-4 months',
    teamSize: 2,
    budget: 'Free/Zero',
    preferredTechStack: ['TypeScript', 'React'],
    careerGoal: 'Fullstack Developer',
    updatedAt: new Date().toISOString(),
  };

  it('generates exactly 4 distinct project ideas with complete structured data', () => {
    const ideas = FallbackGenerator.generateIdeasForProfile(sampleProfile);
    expect(ideas.length).toBe(4);
    expect(ideas[0].title).toBeDefined();
    expect(ideas[0].valueProposition).toBeDefined();
    expect(ideas[0].problemStatement).toBeDefined();
    expect(ideas[0].targetUsers.length).toBeGreaterThan(0);
    expect(ideas[0].proposedSolution).toBeDefined();
    expect(ideas[0].whyItFits).toBeDefined();
    expect(ideas[0].difficulty).toBeDefined();
    expect(ideas[0].estimatedDuration).toBeDefined();
    expect(ideas[0].requiredSkills.length).toBeGreaterThan(0);
    expect(ideas[0].recommendedStack[0].reason).toBeDefined();
    expect(ideas[0].mvpFeatures.length).toBeGreaterThanOrEqual(2);
    expect(ideas[0].mvpFeatures.length).toBeLessThanOrEqual(5);
    expect(ideas[0].futureScope.length).toBeGreaterThan(0);
    expect(ideas[0].risks[0].mitigation).toBeDefined();
    expect(ideas[0].feasibilityScore).toBeGreaterThanOrEqual(1.0);
    expect(ideas[0].innovationScore).toBeGreaterThanOrEqual(1.0);
  });

  it('supports generation across beginner, intermediate, and advanced student profiles', () => {
    const beginnerProfile: StudentProfile = { ...sampleProfile, experienceLevel: 'beginner', weeklyHours: 10 };
    const advancedProfile: StudentProfile = { ...sampleProfile, experienceLevel: 'advanced', weeklyHours: 30 };

    const beginnerIdeas = FallbackGenerator.generateIdeasForProfile(beginnerProfile);
    const advancedIdeas = FallbackGenerator.generateIdeasForProfile(advancedProfile);

    expect(beginnerIdeas.length).toBe(4);
    expect(advancedIdeas.length).toBe(4);
    expect(beginnerIdeas[0].feasibilityBreakdown.overallScore).toBeGreaterThanOrEqual(1.0);
    expect(advancedIdeas[0].feasibilityBreakdown.overallScore).toBeGreaterThanOrEqual(1.0);
  });

  it('customizes milestone durations based on profile duration', () => {
    const shortProfile: StudentProfile = { ...sampleProfile, duration: '1-2 months' };
    const shortIdeas = FallbackGenerator.generateIdeasForProfile(shortProfile);
    expect(shortIdeas[0].milestones[shortIdeas[0].milestones.length - 1].week).toBe(6);
  });
});

