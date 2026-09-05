import React from 'react';
import { useApp } from '../context/AppContext';
import { FeasibilityScoreCard } from '../components/common/FeasibilityScoreCard';
import { ArrowLeft, Rocket, Layers, ShieldAlert, CheckCircle2, Cpu, Clock, Users, Lightbulb, Database, Sparkles, AlertTriangle } from 'lucide-react';

export const IdeaDetailPage: React.FC = () => {
  const { selectedIdea, setScreen, selectProjectToExecute } = useApp();

  if (!selectedIdea) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>No Project Selected</h2>
        <button onClick={() => setScreen('results')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Idea Results
        </button>
      </div>
    );
  }

  const idea = selectedIdea;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '1000px' }}>
      <button onClick={() => setScreen('results')} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Results
      </button>

      {/* Main Title Banner */}
      <div className="card" style={{ marginBottom: '2rem', border: '1px solid #CBD5E1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">{idea.domain}</span>
              <span className="badge badge-neutral">{idea.difficulty}</span>
              <span className="badge badge-teal"><Clock size={12} /> {idea.estimatedDuration} ({idea.estimatedWeeklyEffort}h/wk)</span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              {idea.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
              {idea.valueProposition}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ textAlign: 'center', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', padding: '0.6rem 1rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0D9488' }}>{idea.innovationScore}/10</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#115E59' }}>Innovation</div>
              </div>
            </div>

            <button onClick={() => selectProjectToExecute(idea)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <Rocket size={18} /> Select This Project
            </button>
          </div>
        </div>

        {/* Transparent Feasibility Score Breakdown Widget */}
        {idea.feasibilityBreakdown && (
          <FeasibilityScoreCard breakdown={idea.feasibilityBreakdown} compact={false} />
        )}
      </div>

      {/* Problem, Solution & Differentiator */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert style={{ color: '#DC2626' }} size={20} /> Problem Statement
          </h3>
          <p style={{ color: '#334155', fontSize: '0.925rem', lineHeight: 1.6 }}>
            {idea.problemStatement}
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb style={{ color: '#0D9488' }} size={20} /> Solution & Differentiator
          </h3>
          <p style={{ color: '#334155', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            <strong>Proposed Solution:</strong> {idea.proposedSolution}
          </p>
          <div style={{ backgroundColor: '#F0FDFA', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #0D9488', fontSize: '0.85rem', color: '#115E59' }}>
            <strong>Unique Differentiator:</strong> {idea.uniqueDifferentiator}
          </div>
        </div>
      </div>

      {/* Target Users & Data / Hardware Specs */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users style={{ color: '#4F46E5' }} size={20} /> Target Users & Stakeholders
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {idea.targetUsers.map((user, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
                <CheckCircle2 size={16} style={{ color: '#0D9488' }} /> {user}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database style={{ color: '#4F46E5' }} size={20} /> Data & Infrastructure Setup
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
            <div>
              <strong>Primary API / Data:</strong> {idea.dataHardwareRequirements.primaryDataOrAPI}
            </div>
            <div style={{ backgroundColor: '#EEF2FF', padding: '0.6rem', borderRadius: '6px', color: '#3730A3' }}>
              <strong>Mock-Data Fallback:</strong> {idea.dataHardwareRequirements.mockAlternative}
            </div>
            <div>
              <strong>Hardware / Client:</strong> {idea.dataHardwareRequirements.hardwareNotes}
            </div>
          </div>
        </div>
      </div>

      {/* MVP Scope vs Future Scope */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: '#4F46E5' }} size={20} /> Feature Scope Architecture
        </h3>

        <div className="grid-2">
          <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ color: '#4F46E5', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Phase 1: MVP Core (Deliverable)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {idea.mvpFeatures.map((feat) => (
                <div key={feat.id} style={{ borderLeft: '3px solid #4F46E5', paddingLeft: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{feat.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{feat.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ color: '#0D9488', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Phase 2: Future Scope (Thesis Add-on)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {idea.futureScope.map((feat) => (
                <div key={feat.id} style={{ borderLeft: '3px solid #0D9488', paddingLeft: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{feat.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{feat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Tech Stack & System Architecture */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu style={{ color: '#4F46E5' }} size={20} /> Tech Stack & Architecture Rationale
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {idea.recommendedStack.map((item, idx) => (
            <div key={idx} style={{ backgroundColor: '#EEF2FF', padding: '1rem', borderRadius: '8px', border: '1px solid #C7D2FE' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338CA', textTransform: 'uppercase' }}>{item.category}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: '0.2rem 0' }}>{item.technology}</div>
              <div style={{ fontSize: '0.825rem', color: '#475569' }}>{item.reason}</div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #0D9488', fontSize: '0.9rem', color: '#334155' }}>
          <strong>System Design Summary:</strong> {idea.architectureSummary}
        </div>
      </div>

      {/* Milestone Plan Overview */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles style={{ color: '#4F46E5' }} size={20} /> 4-Sprint Milestone Plan
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {idea.milestones.map((m) => (
            <div key={m.week} style={{ borderLeft: '3px solid #4F46E5', paddingLeft: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{m.phaseTitle}</span>
                <span className="badge badge-indigo">Week {m.week}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.2rem 0' }}><strong>Deliverable:</strong> {m.deliverable}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risks & Mitigations Table */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle style={{ color: '#D97706' }} size={20} /> Risk Assessment & Mitigation Strategies
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {idea.risks.map((r, i) => (
            <div key={i} style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', padding: '0.85rem', borderRadius: '8px', fontSize: '0.875rem' }}>
              <div style={{ color: '#92400E', fontWeight: 700, marginBottom: '0.2rem' }}>
                Risk [{r.impact} Impact]: {r.risk}
              </div>
              <div style={{ color: '#B45309' }}>
                <strong>Mitigation Strategy:</strong> {r.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button onClick={() => selectProjectToExecute(idea)} className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem' }}>
          <Rocket size={20} /> Select & Start Execution Workspace
        </button>
      </div>
    </div>
  );
};
