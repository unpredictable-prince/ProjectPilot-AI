import React, { useState } from 'react';
import { AlertCircle, Plus, CheckCircle2, MessageSquare } from 'lucide-react';

interface BlockersManagerProps {
  blockers: string[];
  onAddBlocker: (blockerText: string) => void;
  onRemoveBlocker: (index: number) => void;
  onAskMentorForBlocker: (blockerText: string) => void;
}

export const BlockersManager: React.FC<BlockersManagerProps> = ({
  blockers,
  onAddBlocker,
  onRemoveBlocker,
  onAskMentorForBlocker,
}) => {
  const [newBlocker, setNewBlocker] = useState<string>('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlocker.trim()) return;
    onAddBlocker(newBlocker.trim());
    setNewBlocker('');
  };

  return (
    <div className="card" style={{ borderLeft: '4px solid #DC2626' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle style={{ color: '#DC2626' }} size={20} /> Active Project Blockers & Delays
        </h3>
        <span className="badge badge-amber">{blockers.length} Active</span>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Log a technical blocker (e.g., CORS error on FastAPI or missing dataset)..."
          value={newBlocker}
          onChange={(e) => setNewBlocker(e.target.value)}
        />
        <button type="submit" disabled={!newBlocker.trim()} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
          <Plus size={16} /> Log Blocker
        </button>
      </form>

      {blockers.length === 0 ? (
        <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', color: '#64748B', textAlign: 'center' }}>
          No active blockers logged! Your project sprint is running smoothly.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {blockers.map((b, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.9rem', color: '#991B1B', fontWeight: 500, flex: 1 }}>
                {b}
              </span>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => onAskMentorForBlocker(`I am blocked on: "${b}". What concrete next actions should I take to resolve this?`)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  <MessageSquare size={12} /> Ask Mentor
                </button>
                <button
                  onClick={() => onRemoveBlocker(idx)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#059669', borderColor: '#A7F3D0' }}
                  title="Mark Blocker Resolved"
                >
                  <CheckCircle2 size={12} /> Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
