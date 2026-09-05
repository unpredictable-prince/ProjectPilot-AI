import React, { useState } from 'react';
import type { ProjectIdea, ProjectImprovementProposal } from '../../types/project';
import { Modal } from '../common/Modal';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ImproveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectIdea;
  onAcceptProposal: (proposal: ProjectImprovementProposal) => void;
}

export const ImproveProjectModal: React.FC<ImproveProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onAcceptProposal,
}) => {
  const [instruction, setInstruction] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ProjectImprovementProposal | null>(null);

  const handleGenerateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const generatedProposal: ProjectImprovementProposal = {
        id: `prop_${Date.now()}`,
        instruction: instruction,
        proposedTitle: instruction.toLowerCase().includes('simplify')
          ? `${project.title} (Streamlined MVP)`
          : `${project.title} + Enhanced Intelligence`,
        proposedValueProp: `${project.valueProposition} (Refined: ${instruction})`,
        newMVPFeatures: [
          ...project.mvpFeatures,
          {
            id: `mvp_imp_${Date.now()}`,
            title: `Refined Feature: ${instruction.slice(0, 32)}...`,
            description: `Scoped improvement requested by student to improve feasibility or features.`,
            isCore: true,
          },
        ],
        newFutureScope: project.futureScope,
        suggestedStackChanges: [
          ...project.recommendedStack,
          { category: 'Add-on Tool', technology: 'Vite PWA Plugin / ServiceWorker', reason: 'Enables reliable client-side caching for offline demos.' },
        ],
        rationale: `This proposal directly incorporates your request ("${instruction}") while maintaining a high Feasibility Rating for your ${project.estimatedDuration} timeline.`,
        feasibilityImpact: instruction.toLowerCase().includes('simplify')
          ? '+0.8 Feasibility Boost (Reduced scope risk)'
          : '-0.3 Feasibility (Requires additional sprint testing hours)',
      };
      setProposal(generatedProposal);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleAccept = () => {
    if (proposal) {
      onAcceptProposal(proposal);
      setProposal(null);
      setInstruction('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Improve & Refine Project Scope">
      {!proposal ? (
        <form onSubmit={handleGenerateProposal}>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.25rem' }}>
            Request customized scope modifications (e.g., <em>"Make it 100% offline for a 4-week deadline"</em> or <em>"Add IoT sensor telemetry"</em>). ProjectPilot AI will draft proposed changes for your review before updating your project plan.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="improveInstructionInput">Refinement Goal or Scope Adjustment</label>
            <textarea
              id="improveInstructionInput"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Focus exclusively on core MVP features and simplify database complexity for solo work..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isAnalyzing || !instruction.trim()} className="btn btn-primary">
              {isAnalyzing ? 'Analyzing Scope...' : <>Generate Proposal <Sparkles size={16} /></>}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338CA', textTransform: 'uppercase' }}>
              Draft Improvement Proposal (Preview)
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
              {proposal.proposedTitle}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
              {proposal.proposedValueProp}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #0D9488' }}>
              <strong>Rationale:</strong> {proposal.rationale}
            </div>

            <div style={{ backgroundColor: '#FFFBEB', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #D97706' }}>
              <strong>Feasibility Impact:</strong> {proposal.feasibilityImpact}
            </div>

            <div>
              <strong style={{ color: '#0F172A' }}>Updated MVP Feature Count:</strong> {proposal.newMVPFeatures.length} features (Includes 1 new scoped module).
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setProposal(null)}>
              Modify Instruction
            </button>
            <button className="btn btn-primary" onClick={handleAccept}>
              <CheckCircle2 size={16} /> Accept & Update Project Plan
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
