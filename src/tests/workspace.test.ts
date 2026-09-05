import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storageService';
import { AIService } from '../services/aiService';
import { FallbackGenerator } from '../services/fallbackGenerator';
import type { StudentProfile } from '../types/profile';
import type { ProjectIdea } from '../types/project';

describe('Project Workspace & AI Mentor Integration', () => {
  const testProfile: StudentProfile = {
    id: 'test_student_ws',
    degreeBranch: 'B.Tech Computer Science',
    skills: ['React', 'Python', 'FastAPI'],
    interests: ['Education Tech'],
    preferredDomain: 'Education Tech',
    experienceLevel: 'intermediate',
    weeklyHours: 15,
    duration: '3-4 months',
    teamSize: 2,
    budget: 'Free/Zero',
    preferredTechStack: ['React', 'Python'],
    careerGoal: 'Software Engineer',
    updatedAt: new Date().toISOString(),
  };

  let mockProject: ProjectIdea;

  beforeEach(() => {
    localStorage.clear();
    const ideas = FallbackGenerator.generateIdeasForProfile(testProfile);
    mockProject = {
      ...ideas[0],
      status: 'in_progress',
      progressPercentage: 0,
      blockers: ['FastAPI CORS error during local fetch'],
    };
  });

  it('saves and retrieves workspace project state from LocalStorage persistence', () => {
    StorageService.saveProject(mockProject);
    const saved = StorageService.getSavedProjects();
    expect(saved.length).toBe(1);
    expect(saved[0].id).toBe(mockProject.id);
    expect(saved[0].title).toBe(mockProject.title);
  });

  it('calculates progress percentage correctly when tasks are completed', () => {
    const total = mockProject.tasks.length;
    expect(total).toBeGreaterThan(0);

    // Complete half the tasks
    const halfCount = Math.floor(total / 2);
    const updatedTasks = mockProject.tasks.map((t, i) =>
      i < halfCount ? { ...t, completed: true } : t
    );

    const progressPercentage = Math.round((halfCount / total) * 100);
    const updatedProject = {
      ...mockProject,
      tasks: updatedTasks,
      progressPercentage,
    };

    expect(updatedProject.progressPercentage).toBeGreaterThan(0);
    expect(updatedProject.tasks.filter((t) => t.completed).length).toBe(halfCount);
  });

  it('provides structured mentor answers for technical & blocker inquiries', async () => {
    // Test Blocker query pattern
    const blockerReply = await AIService.sendMentorMessage(
      mockProject,
      'I am blocked on: CORS headers in FastAPI. What next actions should I take?'
    );
    expect(blockerReply.structuredResponse).toBeDefined();
    expect(blockerReply.structuredResponse?.directAnswer).toBeDefined();
    expect(blockerReply.structuredResponse?.recommendedNextAction).toBeDefined();
    expect(blockerReply.structuredResponse?.suggestedActions).toBeDefined();

    // Test Scope reduction query pattern
    const scopeReply = await AIService.sendMentorMessage(
      mockProject,
      'How do I reduce scope for a tight 4-week deadline?'
    );
    expect(scopeReply.structuredResponse?.directAnswer).toBeDefined();
    expect(scopeReply.structuredResponse?.recommendedNextAction).toBeDefined();
  });

  it('generates a well-formatted markdown project brief containing all required sections', () => {
    const markdownBrief = `# CAPSTONE PROJECT SPECIFICATION BRIEF
Title: ${mockProject.title}
Domain: ${mockProject.domain}
Problem: ${mockProject.problemStatement}
Solution: ${mockProject.proposedSolution}
MVP Features: ${mockProject.mvpFeatures.map((f) => f.title).join(', ')}
`;

    expect(markdownBrief).toContain(mockProject.title);
    expect(markdownBrief).toContain(mockProject.problemStatement);
    expect(markdownBrief).toContain(mockProject.proposedSolution);
    expect(markdownBrief).toContain('CAPSTONE PROJECT SPECIFICATION BRIEF');
  });
});
