import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService, PRESET_PROFILES } from '../services/storageService';
import { AIService } from '../services/aiService';
import type { StudentProfile } from '../types/profile';
import type { ProjectIdea } from '../types/project';

describe('End-to-End User Flow (Onboarding -> Results -> Workspace -> Saved)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('executes full end-to-end student flow successfully', async () => {
    // 1. Onboarding: Select preset profile
    const preset = PRESET_PROFILES[0]; // Priya Sharma (Beginner CSE)
    expect(preset).toBeDefined();
    const profile: StudentProfile = preset.profile;
    StorageService.saveProfileDraft(profile);

    // 2. Generate Tailored Ideas
    const genResult = await AIService.generateProjectIdeas(profile);
    expect(genResult.ideas.length).toBeGreaterThanOrEqual(3);
    const selectedIdea: ProjectIdea = genResult.ideas[0];

    // 3. Select Project for Execution
    const activeProject: ProjectIdea = {
      ...selectedIdea,
      status: 'in_progress',
      progressPercentage: 0,
      blockers: ['Setup local server environment'],
    };
    StorageService.saveProject(activeProject);
    StorageService.setActiveProjectId(activeProject.id);

    // Verify workspace saved state
    const savedList = StorageService.getSavedProjects();
    expect(savedList.length).toBe(1);
    expect(StorageService.getActiveProjectId()).toBe(activeProject.id);

    // 4. Update Task Progress
    const updatedTasks = activeProject.tasks.map((t, idx) =>
      idx === 0 ? { ...t, completed: true } : t
    );
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const progressPercentage = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedProject: ProjectIdea = {
      ...activeProject,
      tasks: updatedTasks,
      progressPercentage,
    };
    StorageService.saveProject(updatedProject);

    // 5. Verify persistence across page refresh
    const refreshedSavedList = StorageService.getSavedProjects();
    expect(refreshedSavedList[0].progressPercentage).toBe(progressPercentage);
    expect(refreshedSavedList[0].tasks[0].completed).toBe(true);

    // 6. Mentor Check-in & Review
    const reviewResult = await AIService.conductProgressReview(
      updatedProject,
      [updatedProject.tasks[0].id],
      'Setup local server environment'
    );
    expect(reviewResult.mentorFeedback).toContain('Great progress!');
    expect(reviewResult.revisedPriorities.length).toBeGreaterThan(0);

    // 7. Duplicate & Clean Up
    const duplicatedList = StorageService.duplicateProject(activeProject.id);
    expect(duplicatedList.length).toBe(2);

    const deletedList = StorageService.deleteProject(activeProject.id);
    expect(deletedList.length).toBe(1);
  });
});
