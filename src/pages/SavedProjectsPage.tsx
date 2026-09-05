import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookmarkCheck, Play, Copy, Trash2, Clock, Download, AlertCircle } from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const SavedProjectsPage: React.FC = () => {
  const { savedProjects, reopenSavedProject, duplicateProject, deleteProject, setScreen, showToast } = useApp();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteProject(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const handleExportAllJSON = () => {
    const dataStr = JSON.stringify(savedProjects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projectpilot_saved_projects_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Exported saved projects backup JSON!', 'success');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
            <BookmarkCheck size={12} /> Stored Portfolios
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
            Saved Projects & Execution History
          </h1>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>
            Access, duplicate, or manage all saved capstone project roadmaps stored in local storage.
          </p>
        </div>

        {savedProjects.length > 0 && (
          <button onClick={handleExportAllJSON} className="btn btn-secondary btn-sm">
            <Download size={14} /> Backup All (JSON)
          </button>
        )}
      </div>

      {savedProjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BookmarkCheck size={48} style={{ color: '#94A3B8', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.5rem' }}>
            No Saved Projects Found
          </h3>
          <p style={{ color: '#64748B', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            You haven't selected any project ideas yet. Run the Student Profile Wizard to discover and save tailored capstones.
          </p>
          <button onClick={() => setScreen('wizard')} className="btn btn-primary">
            Start Profile Wizard
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {savedProjects.map((project) => (
            <div key={project.id} className="card" style={{ border: '1px solid #CBD5E1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-indigo">{project.domain}</span>
                    <span className="badge badge-teal">{project.status}</span>
                    <span className="badge badge-neutral"><Clock size={12} /> {project.estimatedDuration}</span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>
                    {project.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {project.valueProposition}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Progress: <strong>{project.progressPercentage}%</strong> ({project.tasks.filter((t) => t.completed).length}/{project.tasks.length} tasks)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => reopenSavedProject(project)} className="btn btn-primary btn-sm">
                    <Play size={14} /> Open Workspace
                  </button>
                  <button onClick={() => duplicateProject(project.id)} className="btn btn-secondary btn-sm" title="Duplicate Project">
                    <Copy size={14} /> Duplicate
                  </button>
                  <button onClick={() => setDeleteTargetId(project.id)} className="btn btn-outline-danger btn-sm" title="Delete Project">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Delete Project"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={24} style={{ color: '#DC2626', flexShrink: 0 }} />
          <div>
            <p style={{ color: '#0F172A', fontWeight: 500, fontSize: '0.95rem' }}>
              Are you sure you want to delete this project from your local storage?
            </p>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              This action cannot be undone. All recorded task completions and mentor chat logs will be removed.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setDeleteTargetId(null)}>
            Cancel
          </button>
          <button className="btn btn-outline-danger" onClick={handleDeleteConfirm}>
            Yes, Delete Project
          </button>
        </div>
      </Modal>
    </div>
  );
};
