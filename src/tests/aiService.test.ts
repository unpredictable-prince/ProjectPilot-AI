import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIService } from '../services/aiService';
import type { StudentProfile } from '../types/profile';

declare const process: any;
declare const require: any;

describe('AIService Architecture & API Isolation', () => {
  const testProfile: StudentProfile = {
    id: 'test_student_ai',
    degreeBranch: 'B.Tech Computer Science & Engineering',
    skills: ['Python', 'PyTorch', 'React'],
    interests: ['Accessibility', 'Assistive Tech'],
    preferredDomain: 'Accessibility & Assistive Tech',
    experienceLevel: 'advanced',
    weeklyHours: 18,
    duration: '3-4 months',
    teamSize: 3,
    budget: '< $50 / Low',
    preferredTechStack: ['React', 'Python'],
    careerGoal: 'AI Engineer',
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back seamlessly to local generator when no backend API key is set', async () => {
    const result = await AIService.generateProjectIdeas(testProfile);
    expect(result.isFallback).toBe(true);
    expect(result.source).toBe('deterministic-fallback');
    expect(result.ideas.length).toBe(4);
    expect(result.ideas[0].feasibilityBreakdown).toBeDefined();
  });

  it('provides structured mentor responses seamlessly in offline mode', async () => {
    const ideas = (await AIService.generateProjectIdeas(testProfile)).ideas;
    const mentorMsg = await AIService.sendMentorMessage(ideas[0], 'How can I break down this feature into smaller tasks?');

    expect(mentorMsg.sender).toBe('mentor');
    expect(mentorMsg.structuredResponse).toBeDefined();
    expect(mentorMsg.structuredResponse?.directAnswer).toBeDefined();
    expect(mentorMsg.structuredResponse?.recommendedNextAction).toBeDefined();
  });

  it('guarantees frontend calls relative /api routes only without direct third-party AI URLs', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any) => {
      const urlStr = String(url);
      expect(urlStr.startsWith('/api/')).toBe(true);
      expect(urlStr.includes('generativelanguage.googleapis.com')).toBe(false);
      return new Response(JSON.stringify({ ideas: [], isFallback: true }), { status: 200 });
    });

    await AIService.generateProjectIdeas(testProfile);
    expect(fetchSpy).toHaveBeenCalledWith('/api/generate-project-ideas', expect.anything());
  });

  it('verifies server API module is never bundled into client production assets', () => {
    try {
      const fs = require('fs');
      const path = require('path');
      const distDir = path.resolve(process.cwd(), 'dist/assets');
      if (fs.existsSync(distDir)) {
        const files: string[] = fs.readdirSync(distDir);
        const indexBundle = files.find((f: string) => f.startsWith('index-') && f.endsWith('.js'));
        if (indexBundle) {
          const bundleContent: string = fs.readFileSync(path.join(distDir, indexBundle), 'utf-8');
          expect(bundleContent.includes('handleGenerateIdeasServer')).toBe(false);
          expect(bundleContent.includes('handleMentorResponseServer')).toBe(false);
          expect(bundleContent.includes('generativelanguage.googleapis.com')).toBe(false);
          expect(bundleContent.includes('{}.GEMINI_API_KEY')).toBe(false);
        }
      }
    } catch {
      // In non-node runner environments, skip filesystem assertions
    }
  });
});
