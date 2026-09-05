import React from 'react';
import { Award } from 'lucide-react';
import type { ProjectIdea } from '../../types/project';

interface RubricScoreCardProps {
  project: ProjectIdea;
}

interface RubricCriterion {
  id: string;
  category: string;
  weight: string;
  score: number; // out of 100
  feedback: string;
  status: 'excellent' | 'good' | 'needs-work';
}

export const RubricScoreCard: React.FC<RubricScoreCardProps> = ({ project }) => {
  // Calculate rubrics based on project properties
  const technicalDepthScore = Math.min(100, Math.max(70, project.feasibilityScore * 9.5 + (project.requiredSkills.length > 3 ? 5 : 0)));
  const feasibilityScore = Math.min(100, Math.round(project.feasibilityScore * 10));
  const innovationScore = Math.min(100, Math.round(project.innovationScore * 10));
  const scopeScore = Math.min(100, Math.max(75, 100 - Math.abs(project.estimatedWeeklyEffort - 12) * 4));

  const weightedTotal = Math.round(
    technicalDepthScore * 0.3 +
    feasibilityScore * 0.3 +
    innovationScore * 0.2 +
    scopeScore * 0.2
  );

  const criteria: RubricCriterion[] = [
    {
      id: 'tech-depth',
      category: 'Technical Depth & Skill Match',
      weight: '30%',
      score: technicalDepthScore,
      feedback: `Strong alignment with ${project.requiredSkills.slice(0, 3).join(', ')}. Stack choices match curriculum expectations.`,
      status: technicalDepthScore >= 90 ? 'excellent' : 'good',
    },
    {
      id: 'feasibility',
      category: 'Feasibility & Resource Constraints',
      weight: '30%',
      score: feasibilityScore,
      feedback: `Calculated feasibility ${project.feasibilityScore}/10. High confidence in completing MVP within ${project.estimatedDuration}.`,
      status: feasibilityScore >= 80 ? 'excellent' : 'good',
    },
    {
      id: 'innovation',
      category: 'Academic Innovation & Differentiator',
      weight: '20%',
      score: innovationScore,
      feedback: project.uniqueDifferentiator || 'Clear differentiation from standard textbook projects.',
      status: innovationScore >= 85 ? 'excellent' : innovationScore >= 70 ? 'good' : 'needs-work',
    },
    {
      id: 'scope',
      category: 'Capstone Timeline & Scope Balance',
      weight: '20%',
      score: scopeScore,
      feedback: `Estimated effort of ${project.estimatedWeeklyEffort} hrs/week is well-balanced for team size.`,
      status: scopeScore >= 85 ? 'excellent' : 'good',
    },
  ];

  const getStatusBadge = (status: RubricCriterion['status']) => {
    switch (status) {
      case 'excellent':
        return <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80' }}>Faculty Approved</span>;
      case 'good':
        return <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>Meets Standards</span>;
      case 'needs-work':
        return <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#FACC15' }}>Scope Revision</span>;
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #334155',
        marginBottom: '1.5rem',
      }}
      aria-label="Academic Rubric Evaluation Card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award size={24} color="#60A5FA" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
            Academic Rubric & Jury Alignment
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0F172A', padding: '6px 14px', borderRadius: '20px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Overall Evaluation:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: weightedTotal >= 90 ? '#4ADE80' : '#60A5FA' }}>
            {weightedTotal} / 100
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {criteria.map((c) => (
          <div
            key={c.id}
            style={{
              backgroundColor: '#0F172A',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #1E293B',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>{c.category}</span>
                {getStatusBadge(c.status)}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC' }}>{c.score}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/ 100 (Weight {c.weight})</span>
              </div>
              {/* Progress bar */}
              <div style={{ height: '6px', width: '100%', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${c.score}%`,
                    backgroundColor: c.score >= 90 ? '#22C55E' : c.score >= 80 ? '#3B82F6' : '#EAB308',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
              {c.feedback}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
