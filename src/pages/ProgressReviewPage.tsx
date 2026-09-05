import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIService } from '../services/aiService';
import type { ProgressReviewResponse } from '../types/api';
import { ArrowLeft, RefreshCw, Sparkles, ListOrdered } from 'lucide-react';

export const ProgressReviewPage: React.FC = () => {
  const { activeProject, setScreen, showToast } = useApp();
  const [blockers, setBlockers] = useState<string>('');
  const [progressNotes, setProgressNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<ProgressReviewResponse | null>(null);

  if (!activeProject) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>No Active Project Found</h2>
        <button onClick={() => setScreen('results')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Select a Project
        </button>
      </div>
    );
  }

  const project = activeProject;
  const completedTaskIds = project.tasks.filter((t) => t.completed).map((t) => t.id);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await AIService.conductProgressReview(project, completedTaskIds, blockers);
      setReviewResult(res);
      showToast('Weekly review completed! Revised priorities generated.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to complete review.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '800px' }}>
      <button onClick={() => setScreen('workspace')} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Workspace
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
          <RefreshCw size={12} /> Weekly Progress Review
        </span>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
          Project Check-in & Priority Revision
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Update completed tasks and flag blockers to receive updated mentor guidance for "{project.title}".
        </p>
      </div>

      {!reviewResult ? (
        <form onSubmit={handleSubmitReview} className="card">
          <div style={{ backgroundColor: '#EEF2FF', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#3730A3' }}>
              Current Status Summary:
            </div>
            <div style={{ fontSize: '0.85rem', color: '#4338CA', marginTop: '0.2rem' }}>
              Completed {completedTaskIds.length} of {project.tasks.length} sprint tasks ({project.progressPercentage}% complete).
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="blockersInput">Current Technical Blockers or Delays (Optional)</label>
            <textarea
              id="blockersInput"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Difficulty configuring CORS headers in FastAPI or dataset API key rate limits..."
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
            />
            <p className="form-hint">Detailing blockers allows the AI mentor to prescribe specific troubleshooting steps.</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notesInput">Weekly Progress Notes</label>
            <textarea
              id="notesInput"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Completed Phase 1 environment setup and connected local SQLite database."
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%' }}>
            {isSubmitting ? 'Evaluating Progress...' : 'Submit Progress Review'}
          </button>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #0D9488' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles style={{ color: '#0D9488' }} size={20} /> Mentor Guidance & Assessment
            </h3>
            <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1rem' }}>
              {reviewResult.mentorFeedback}
            </p>

            <div style={{ backgroundColor: '#F0FDFA', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#115E59', fontWeight: 600 }}>
              Updated Feasibility Score: {reviewResult.updatedFeasibilityScore}/100
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListOrdered style={{ color: '#4F46E5' }} size={18} /> Revised Weekly Priorities
            </h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {reviewResult.revisedPriorities.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setReviewResult(null)} className="btn btn-secondary">
              Conduct Another Check-in
            </button>
            <button onClick={() => setScreen('workspace')} className="btn btn-primary">
              Return to Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
