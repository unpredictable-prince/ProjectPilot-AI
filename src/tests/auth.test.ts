import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../services/authService';
import type { ProjectIdea } from '../types/project';
import { calculateProjectStage } from '../pages/StudentDashboardPage';

describe('Role-Based Authentication & Security Layer', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('registers a new student account with default "student" role', async () => {
    const email = `test_student_${Date.now()}@college.edu`;
    const session = await AuthService.registerStudent('Test Student', email, 'student123', 'B.Tech IT', 'beginner');

    expect(session.user.email).toBe(email);
    expect(session.user.role).toBe('student');
    expect(session.token).toBeDefined();
  });

  it('authenticates valid credentials and rejects incorrect passwords', async () => {
    const email = `login_test_${Date.now()}@college.edu`;
    await AuthService.registerStudent('Login Test', email, 'correctpass123');

    const validSession = await AuthService.login(email, 'correctpass123');
    expect(validSession.user.email).toBe(email);

    await expect(AuthService.login(email, 'wrongpass')).rejects.toThrow('Invalid email or password');
  });

  it('clears active session upon logout', async () => {
    const session = await AuthService.login('student@college.edu', 'student123');
    expect(session.user.role).toBe('student');
    expect(AuthService.getCurrentSession()).not.toBeNull();

    AuthService.logout();
    expect(AuthService.getCurrentSession()).toBeNull();
  });

  it('enforces Student Data Isolation between accounts', () => {
    const student1Id = 'usr_student_isolation_1';
    const student2Id = 'usr_student_isolation_2';

    const project1: ProjectIdea = {
      id: 'proj_student_1',
      title: 'Student 1 Private Capstone',
      valueProposition: 'Private idea 1',
      domain: 'Education Tech',
      difficulty: 'Intermediate',
      estimatedDuration: '3-4 months',
      estimatedWeeklyEffort: 15,
      requiredSkills: ['React'],
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
      whyItFits: 'Fits profile',
      problemStatement: 'Problem 1',
      targetUsers: ['Students'],
      proposedSolution: 'Solution 1',
      uniqueDifferentiator: 'Diff 1',
      mvpFeatures: [],
      futureScope: [],
      recommendedStack: [],
      architectureSummary: 'Summary',
      dataHardwareRequirements: { primaryDataOrAPI: 'API', mockAlternative: 'Mock', hardwareNotes: 'PC' },
      risks: [],
      milestones: [],
      tasks: [],
      blockers: [],
      createdAt: new Date().toISOString(),
      status: 'in_progress',
      progressPercentage: 25,
    };

    AuthService.saveUserProject(student1Id, project1);

    const student1Projects = AuthService.getUserProjects(student1Id);
    const student2Projects = AuthService.getUserProjects(student2Id);

    expect(student1Projects.length).toBe(1);
    expect(student1Projects[0].title).toBe('Student 1 Private Capstone');

    // Student 2 must NEVER see Student 1's projects
    expect(student2Projects.length).toBe(0);
  });

  it('rejects non-admin users attempting to call Admin APIs (Backend Guard)', async () => {
    const studentSession = await AuthService.login('student@college.edu', 'student123');
    expect(studentSession.user.role).toBe('student');

    await expect(AuthService.getAdminAnalytics(studentSession.user)).rejects.toThrow(
      '403 Access Denied: Admin authorization required'
    );
  });

  it('grants admin analytics access to authenticated admin users', async () => {
    const adminSession = await AuthService.adminLogin('admin@projectpilot.edu', 'admin123');
    expect(adminSession.user.role).toBe('admin');

    const analytics = await AuthService.getAdminAnalytics(adminSession.user);
    expect(analytics.totalRegisteredUsers).toBeGreaterThan(0);
    expect(analytics.users.length).toBeGreaterThan(0);
  });

  it('guarantees Admin Analytics payload strictly hides all passwords, hashes, and secrets', async () => {
    const adminSession = await AuthService.adminLogin('admin@projectpilot.edu', 'admin123');
    const analytics = await AuthService.getAdminAnalytics(adminSession.user);

    analytics.users.forEach((u: any) => {
      expect(u.password).toBeUndefined();
      expect(u.passwordHash).toBeUndefined();
      expect(u.apiKey).toBeUndefined();
      expect(u.token).toBeUndefined();
    });
  });

  it('calculates real project execution stages correctly for dashboard display', () => {
    const mockProject: ProjectIdea = {
      id: 'proj_stage_test',
      title: 'Test Stage Project',
      valueProposition: 'Value prop',
      domain: 'Education Tech',
      difficulty: 'Intermediate',
      estimatedDuration: '3-4 months',
      estimatedWeeklyEffort: 15,
      requiredSkills: ['React'],
      innovationScore: 8,
      feasibilityScore: 9,
      feasibilityBreakdown: {
        overallScore: 9,
        skillMatchScore: 9,
        timeAvailabilityScore: 9,
        scopeRealismScore: 9,
        teamCapacityScore: 9,
        budgetFeasibilityScore: 9,
        techFamiliarityScore: 9,
        explanation: 'Good',
      },
      whyItFits: 'Fits',
      problemStatement: 'Problem',
      targetUsers: ['Students'],
      proposedSolution: 'Solution',
      uniqueDifferentiator: 'Diff',
      mvpFeatures: [],
      futureScope: [],
      recommendedStack: [],
      architectureSummary: 'Summary',
      dataHardwareRequirements: { primaryDataOrAPI: 'API', mockAlternative: 'Mock', hardwareNotes: 'PC' },
      risks: [],
      milestones: [],
      tasks: [],
      blockers: [],
      createdAt: new Date().toISOString(),
      status: 'in_progress',
      progressPercentage: 40,
    };

    const stage40 = calculateProjectStage(mockProject);
    expect(stage40.stageText).toContain('Stage 5: Development In Progress (40% complete)');
    expect(stage40.stageNumber).toBe(5);

    const stage0 = calculateProjectStage({ ...mockProject, progressPercentage: 0 });
    expect(stage0.stageText).toBe('Stage 3: Idea Selected');

    const stage100 = calculateProjectStage({ ...mockProject, progressPercentage: 100 });
    expect(stage100.stageText).toBe('Stage 7: Project Ready');
  });

  it('guarantees API key is absent from client AIService configuration', () => {
    expect((import.meta as any).env.VITE_GEMINI_API_KEY).toBeUndefined();
  });

  it('validates input length and format during registration', async () => {
    await expect(
      AuthService.registerStudent('Test User', 'invalid-email', 'password123')
    ).rejects.toThrow('Please enter a valid college email address.');

    await expect(
      AuthService.registerStudent('Test User', 'valid@college.edu', '123')
    ).rejects.toThrow('Password must be at least 6 characters long.');
  });
});

