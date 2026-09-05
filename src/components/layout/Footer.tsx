import React from 'react';
import { Compass, GraduationCap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#0F172A', color: '#94A3B8', borderTop: '1px solid #1E293B', padding: '3rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Compass style={{ color: '#4F46E5' }} /> ProjectPilot AI
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Empowering final-year engineering students to select feasible, original project ideas and transform them into structured capstone roadmaps.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.85rem' }}>Academic Standards</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>• Feasibility & Resource Alignment</li>
              <li>• Scoped MVP vs Future Expansion</li>
              <li>• Automated Technical Risk Assessment</li>
              <li>• Structured Sprint Milestones</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.85rem' }}>Guarantees</h4>
            <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: '#0D9488' }} /> 100% Offline Generator Fallback
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={16} style={{ color: '#4F46E5' }} /> Tailored for B.Tech / BE / BS Curriculums
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1E293B', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
          <div>© {new Date().getFullYear()} ProjectPilot AI. Academic Tech System.</div>
          <div>Designed for Final-Year Project Execution.</div>
        </div>
      </div>
    </footer>
  );
};
