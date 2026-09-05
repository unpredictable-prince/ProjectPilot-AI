import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ProjectIdea } from '../types/project';
import { FeasibilityScoreCard } from '../components/common/FeasibilityScoreCard';
import { Sparkles, Clock, Wrench, ChevronRight, SlidersHorizontal, Lightbulb, RefreshCw, Edit3, Rocket, Target, Users, DollarSign } from 'lucide-react';

export const IdeaResultsPage: React.FC = () => {
  const { generatedIdeas, setScreen, setSelectedIdea, selectProjectToExecute, isFallback, profile, generateIdeas, isGenerating } = useApp();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'feasibility' | 'innovation'>('feasibility');

  const filteredIdeas = generatedIdeas
    .filter((idea) => filterDifficulty === 'all' || idea.difficulty.toLowerCase() === filterDifficulty.toLowerCase())
    .sort((a, b) => (sortBy === 'feasibility' ? b.feasibilityScore - a.feasibilityScore : b.innovationScore - a.innovationScore));

  const handleViewFullPlan = (idea: ProjectIdea) => {
    setSelectedIdea(idea);
    setScreen('details');
  };

  const handleSelectThisIdea = (idea: ProjectIdea) => {
    selectProjectToExecute(idea);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', paddingBottom: '5rem' }}>
      {/* Professional Status Banner */}
      {isFallback ? (
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.925rem', color: '#0F172A', marginBottom: '0.15rem' }}>Smart capstone recommendation engine active</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                ProjectPilot intelligent engine active. Custom capstone proposals tailored for your academic profile.
              </p>
            </div>
          </div>
          <span style={{ backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', color: '#0D9488', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.775rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0D9488' }} />
            Offline Smart Mode
          </span>
        </div>
      ) : (
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ backgroundColor: '#DCFCE7', color: '#16A34A', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.925rem', color: '#14532D', marginBottom: '0.15rem' }}>Gemini AI personalized recommendations active</h4>
              <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0 }}>
                Generating real-time, personalized capstone project ideas powered by Gemini AI.
              </p>
            </div>
          </div>
          <span style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.775rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A', boxShadow: '0 0 6px #16A34A' }} />
            Gemini AI personalized recommendations active
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={12} /> {generatedIdeas.length} Practical Capstone Proposals
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
            Tailored Final-Year Project Proposals
          </h1>
          <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '750px' }}>
            Custom-evaluated for {profile.degreeBranch || 'Computer Engineering'} ({profile.experienceLevel} level) with {profile.weeklyHours} hrs/wk, {profile.teamSize} member(s), and budget limit "{profile.budget}".
          </p>
        </div>

        {/* Top Control Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setScreen('wizard')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Edit3 size={16} /> Change Preferences
          </button>

          <button
            onClick={generateIdeas}
            disabled={isGenerating}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} className={isGenerating ? 'spin' : ''} />
            {isGenerating ? 'Generating Fresh Proposals...' : 'Regenerate Ideas'}
          </button>
        </div>
      </div>

      {/* Student Profile Quick-Summary Bar */}
      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Target size={14} style={{ color: '#4F46E5' }} /> <strong>Degree:</strong> {profile.degreeBranch || 'Engineering'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Wrench size={14} style={{ color: '#0D9488' }} /> <strong>Skills:</strong> {profile.skills.slice(0, 3).join(', ') || 'Web & Coding'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Users size={14} style={{ color: '#6366F1' }} /> <strong>Team Size:</strong> {profile.teamSize} person(s)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <DollarSign size={14} style={{ color: '#16A34A' }} /> <strong>Budget:</strong> {profile.budget}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} style={{ color: '#D97706' }} /> <strong>Time:</strong> {profile.weeklyHours}h/wk for {profile.duration}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
            <SlidersHorizontal size={16} /> Filters:
          </div>

          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
          <span style={{ color: '#64748B', fontWeight: 500 }}>Sort by:</span>
          <button
            onClick={() => setSortBy('feasibility')}
            style={{
              background: sortBy === 'feasibility' ? '#EEF2FF' : 'transparent',
              border: `1px solid ${sortBy === 'feasibility' ? '#4F46E5' : '#CBD5E1'}`,
              color: sortBy === 'feasibility' ? '#4F46E5' : '#475569',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Highest Feasibility
          </button>
          <button
            onClick={() => setSortBy('innovation')}
            style={{
              background: sortBy === 'innovation' ? '#F0FDFA' : 'transparent',
              border: `1px solid ${sortBy === 'innovation' ? '#0D9488' : '#CBD5E1'}`,
              color: sortBy === 'innovation' ? '#0D9488' : '#475569',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Highest Innovation
          </button>
        </div>
      </div>

      {/* Idea Proposals Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredIdeas.map((idea) => {
          const feasibilityPercentage = Math.round(idea.feasibilityScore * 10);
          return (
            <div key={idea.id} className="card" style={{ border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-indigo">{idea.domain}</span>
                    <span className="badge badge-neutral">{idea.difficulty}</span>
                    <span className="badge badge-teal"><Clock size={12} /> {idea.estimatedDuration} ({idea.estimatedWeeklyEffort}h/wk)</span>
                  </div>

                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                    {idea.title}
                  </h2>
                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {idea.valueProposition}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'center', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', padding: '0.6rem 1rem', borderRadius: '10px', minWidth: '100px' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4338CA' }}>{feasibilityPercentage}/100</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#3730A3', textTransform: 'uppercase' }}>Feasibility</div>
                  </div>
                  <div style={{ textAlign: 'center', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', padding: '0.6rem 1rem', borderRadius: '10px', minWidth: '90px' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0D9488' }}>{idea.innovationScore}/10</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#115E59', textTransform: 'uppercase' }}>Innovation</div>
                  </div>
                </div>
              </div>

              {idea.feasibilityBreakdown && (
                <FeasibilityScoreCard breakdown={idea.feasibilityBreakdown} compact={true} />
              )}

              {/* Problem, Solution & Match Reason */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid #4F46E5', fontSize: '0.875rem' }}>
                  <strong style={{ color: '#0F172A' }}>Proposed Solution:</strong> {idea.proposedSolution}
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid #0D9488', fontSize: '0.875rem' }}>
                  <strong style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Lightbulb size={14} style={{ color: '#0D9488' }} /> Differentiator:
                  </strong> {idea.uniqueDifferentiator}
                </div>
              </div>

              {/* Why it fits this student */}
              {idea.whyItFits && (
                <div style={{ backgroundColor: '#EEF2FF', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#3730A3' }}>
                  <strong>Why this fits you:</strong> {idea.whyItFits}
                </div>
              )}

              {/* Required Skills & Stack */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                  <Wrench size={14} style={{ color: '#64748B' }} />
                  <span style={{ color: '#64748B', fontWeight: 500 }}>Required Skills & Tech:</span>
                  {idea.requiredSkills.map((sk) => (
                    <span key={sk} style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500 }}>
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => handleViewFullPlan(idea)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    View Full Plan
                  </button>
                  <button onClick={() => handleSelectThisIdea(idea)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Rocket size={14} /> Select This Idea <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

