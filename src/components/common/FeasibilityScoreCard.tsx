import React, { useState } from 'react';
import type { FeasibilityBreakdown } from '../../types/project';
import { Target, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface FeasibilityScoreCardProps {
  breakdown: FeasibilityBreakdown;
  compact?: boolean;
}

export const FeasibilityScoreCard: React.FC<FeasibilityScoreCardProps> = ({ breakdown, compact = false }) => {
  const [expanded, setExpanded] = useState<boolean>(!compact);

  if (!breakdown) return null;

  const scoreColor =
    breakdown.overallScore >= 8.0 ? '#0D9488' : breakdown.overallScore >= 6.5 ? '#4F46E5' : '#D97706';

  const factors = [
    { label: 'Skill Match', score: breakdown.skillMatchScore, weight: '25%' },
    { label: 'Time Availability', score: breakdown.timeAvailabilityScore, weight: '25%' },
    { label: 'Scope Realism', score: breakdown.scopeRealismScore, weight: '20%' },
    { label: 'Tech Familiarity', score: breakdown.techFamiliarityScore, weight: '15%' },
    { label: 'Team Capacity', score: breakdown.teamCapacityScore, weight: '10%' },
    { label: 'Budget Realism', score: breakdown.budgetFeasibilityScore, weight: '5%' },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C7D2FE',
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: '0 2px 4px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              backgroundColor: '#EEF2FF',
              color: scoreColor,
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Target size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
              Transparent Feasibility Rating
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              {breakdown.overallScore} <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>/ 10</span>
            </div>
          </div>
        </div>

        {compact && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          >
            {expanded ? <>Hide Breakdown <ChevronUp size={14} /></> : <>Score Breakdown <ChevronDown size={14} /></>}
          </button>
        )}
      </div>

      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
            {factors.map((factor) => (
              <div key={factor.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 500, color: '#334155', marginBottom: '0.2rem' }}>
                  <span>{factor.label} ({factor.weight})</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{factor.score}/10</span>
                </div>
                <div style={{ backgroundColor: '#F1F5F9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      backgroundColor: factor.score >= 7.5 ? '#0D9488' : factor.score >= 5.5 ? '#4F46E5' : '#D97706',
                      height: '100%',
                      width: `${(factor.score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #4F46E5', fontSize: '0.825rem', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <Info size={16} style={{ color: '#4F46E5', flexShrink: 0, marginTop: '2px' }} />
            <span>{breakdown.explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
