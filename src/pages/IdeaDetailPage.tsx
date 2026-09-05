import React from 'react';
import { useApp } from '../context/AppContext';
import { FeasibilityScoreCard } from '../components/common/FeasibilityScoreCard';
import { RubricScoreCard } from '../components/project/RubricScoreCard';
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

      {/* Faculty Rubric & Academic Jury Alignment */}
      <RubricScoreCard project={idea} />

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
            <Users style={{ color: '#2563EB' }} size={20} /> Target Users
          </h3>
          <ul style={{ paddingLeft: '1.25rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {idea.targetUsers.map((user, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>{user}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database style={{ color: '#7C3AED' }} size={20} /> Data & Hardware Requirements
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div><strong>Primary Data/API:</strong> {idea.dataHardwareRequirements.primaryDataOrAPI}</div>
            <div><strong>Mock Alternative:</strong> {idea.dataHardwareRequirements.mockAlternative}</div>
            <div><strong>Hardware Notes:</strong> {idea.dataHardwareRequirements.hardwareNotes}</div>
          </div>
        </div>
      </div>

      {/* MVP Features vs Future Scope */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: '#2563EB' }} size={22} /> Project Modules & Scope Breakdown
        </h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0D9488', marginBottom: '0.75rem' }}>
            Core MVP Features (Phase 1 Deliverables)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {idea.mvpFeatures.map((feat) => (
              <div key={feat.id} style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.925rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#0D9488" /> {feat.title}
                </div>
                <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#6366F1', marginBottom: '0.75rem' }}>
            Future Work Scope (Post-MVP / Thesis Recommendations)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {idea.futureScope.map((feat) => (
              <div key={feat.id} style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.925rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="#6366F1" /> {feat.title}
                </div>
                <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Tech Stack */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu style={{ color: '#2563EB' }} size={22} /> Recommended Technology Stack
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {idea.recommendedStack.map((item, idx) => (
            <div key={idx} style={{ backgroundColor: '#F1F5F9', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.25rem' }}>
                {item.category}
              </div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                {item.technology}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                {item.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risks & Mitigations */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle style={{ color: '#EAB308' }} size={22} /> Technical Risks & Mitigation Plan
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {idea.risks.map((r, idx) => (
            <div key={idx} style={{ backgroundColor: '#FFFBEB', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '4px solid #F59E0B', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ fontWeight: 600, color: '#92400E', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  Risk: {r.risk}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#B45309' }}>
                  <strong>Mitigation:</strong> {r.mitigation}
                </div>
              </div>
              <span className={`badge ${r.impact === 'High' ? 'badge-amber' : 'badge-neutral'}`}>
                {r.impact} Impact
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={() => setScreen('results')} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Recommendations
        </button>
        <button onClick={() => selectProjectToExecute(idea)} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
          <Rocket size={18} /> Launch Workspace With This Idea
        </button>
      </div>
    </div>
  );
};
