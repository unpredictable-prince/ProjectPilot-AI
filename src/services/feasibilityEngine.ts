import type { StudentProfile } from '../types/profile';
import type { FeasibilityBreakdown, DifficultyLevel } from '../types/project';

export const FeasibilityEngine = {
  /**
   * Calculates a transparent, multi-factor Feasibility Score Breakdown (1-10 scale)
   * based on the student's actual profile metrics and project requirements.
   */
  calculateFeasibilityBreakdown(
    profile: StudentProfile,
    requiredSkills: string[],
    estimatedDifficulty: DifficultyLevel,
    recommendedStackTechs: string[]
  ): FeasibilityBreakdown {
    // 1. Skill Match Score (1-10)
    const studentSkills = Array.isArray(profile?.skills) ? profile.skills : Array.isArray((profile as any)?.technicalSkills) ? (profile as any).technicalSkills : [];
    const studentSkillsLower = studentSkills.map((s: any) => String(s).toLowerCase());
    const safeReqSkills = Array.isArray(requiredSkills) ? requiredSkills : [];
    const matchedSkills = safeReqSkills.filter((req: any) =>
      studentSkillsLower.some((s: any) => s.includes(String(req).toLowerCase()) || String(req).toLowerCase().includes(s))
    );
    const skillMatchRatio = safeReqSkills.length > 0 ? matchedSkills.length / safeReqSkills.length : 0.8;
    const skillMatchScore = Math.min(10, Math.max(2, Math.round(skillMatchRatio * 8 + 2)));

    // 2. Time Availability Score (1-10)
    const weeksMap: Record<string, number> = {
      '1-2 months': 6,
      '3-4 months': 14,
      '5-6 months': 22,
    };
    const durationWeeks = weeksMap[profile?.duration || '3-4 months'] || 10;
    const weeklyHours = profile?.weeklyHours || 15;
    const totalHoursAvailable = weeklyHours * durationWeeks;

    const minRequiredHoursMap: Record<DifficultyLevel, number> = {
      Beginner: 60,
      Intermediate: 140,
      Advanced: 240,
    };
    const minHoursNeeded = minRequiredHoursMap[estimatedDifficulty] || 120;
    const timeRatio = totalHoursAvailable / minHoursNeeded;
    let timeAvailabilityScore = 7;
    if (timeRatio >= 1.5) timeAvailabilityScore = 10;
    else if (timeRatio >= 1.1) timeAvailabilityScore = 8.5;
    else if (timeRatio >= 0.8) timeAvailabilityScore = 6;
    else timeAvailabilityScore = 3.5;

    // 3. Scope Realism Score (1-10)
    let scopeRealismScore = 8;
    if (profile?.experienceLevel === 'beginner' && estimatedDifficulty === 'Advanced') {
      scopeRealismScore = 4;
    } else if (profile?.experienceLevel === 'advanced') {
      scopeRealismScore = 9.5;
    } else if (estimatedDifficulty === 'Intermediate') {
      scopeRealismScore = 8.5;
    }

    // 4. Team Capacity Score (1-10)
    let teamCapacityScore = 7.5;
    const teamSize = profile?.teamSize || 1;
    if (teamSize >= 3) teamCapacityScore = 9.5;
    else if (teamSize === 2) teamCapacityScore = 8.5;
    else teamCapacityScore = 7.0;

    // 5. Budget Feasibility Score (1-10)
    let budgetFeasibilityScore = 9;
    if (profile?.budget === 'Free/Zero' && estimatedDifficulty === 'Advanced') {
      budgetFeasibilityScore = 6;
    }

    // 6. Technology Familiarity Score (1-10)
    const preferredStack = Array.isArray(profile?.preferredTechStack) ? profile.preferredTechStack : [];
    const preferredLower = preferredStack.map((t: any) => String(t).toLowerCase());
    const safeRecommendedTechs = Array.isArray(recommendedStackTechs) ? recommendedStackTechs : [];
    const familiarCount = safeRecommendedTechs.filter((tech: any) =>
      preferredLower.some((p: any) => p.includes(String(tech).toLowerCase()) || String(tech).toLowerCase().includes(p))
    ).length;
    const techFamiliarityRatio = safeRecommendedTechs.length > 0 ? familiarCount / safeRecommendedTechs.length : 0.7;
    const techFamiliarityScore = Math.min(10, Math.max(3, Math.round(techFamiliarityRatio * 7 + 3)));

    // Weighted Overall Score (1-10)
    const rawWeighted =
      skillMatchScore * 0.25 +
      timeAvailabilityScore * 0.25 +
      scopeRealismScore * 0.2 +
      techFamiliarityScore * 0.15 +
      teamCapacityScore * 0.1 +
      budgetFeasibilityScore * 0.05;

    const overallScore = Math.min(9.8, Math.max(4.0, Math.round(rawWeighted * 10) / 10));

    const explanation = `Feasibility calculated at ${overallScore}/10 based on ${weeklyHours}h/week commitment over ${durationWeeks} weeks, ${teamSize}-member team capacity, and a ${Math.round(skillMatchRatio * 100)}% skill match.`;

    return {
      overallScore,
      skillMatchScore,
      timeAvailabilityScore: Math.round(timeAvailabilityScore * 10) / 10,
      scopeRealismScore,
      teamCapacityScore,
      budgetFeasibilityScore,
      techFamiliarityScore,
      explanation,
    };
  },

  calculateInnovationScore(
    domain: string,
    interests: string[],
    difficulty: DifficultyLevel
  ): number {
    let score = 7.2;
    if (difficulty === 'Advanced') score += 1.5;
    if (difficulty === 'Intermediate') score += 0.8;

    const safeInterests = Array.isArray(interests) ? interests : [];
    const interestLower = safeInterests.map((i: any) => String(i).toLowerCase()).join(' ');
    if (interestLower.includes(String(domain || '').toLowerCase())) {
      score += 0.8;
    }
    return Math.min(9.8, Math.max(5.5, Math.round(score * 10) / 10));
  },
};
