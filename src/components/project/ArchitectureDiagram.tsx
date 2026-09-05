import React from 'react';
import type { RecommendedStackItem } from '../../types/project';
import { Laptop, Server, Database, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ArchitectureDiagramProps {
  summary: string;
  recommendedStack: RecommendedStackItem[];
  dataRequirements: {
    primaryDataOrAPI: string;
    mockAlternative: string;
    hardwareNotes: string;
  };
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  summary,
  recommendedStack,
  dataRequirements,
}) => {
  const frontendStack = recommendedStack.find((s) => s.category.toLowerCase().includes('front'))?.technology || 'React + TypeScript';
  const backendStack = recommendedStack.find((s) => s.category.toLowerCase().includes('back') || s.category.toLowerCase().includes('api'))?.technology || 'FastAPI / Express API Gateway';
  const dbStack = recommendedStack.find((s) => s.category.toLowerCase().includes('data') || s.category.toLowerCase().includes('store'))?.technology || 'PostgreSQL / IndexedDB';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ backgroundColor: '#F8FAFC', borderLeft: '4px solid #4F46E5', padding: '1rem', borderRadius: '0 8px 8px 0', fontSize: '0.9rem', color: '#334155' }}>
        <strong>System Architecture Overview:</strong> {summary}
      </div>

      <div
        role="region"
        aria-label="System Architecture Node Flow"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #C7D2FE', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#4338CA' }}>
              <Laptop size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Layer 1: Client UI</span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>{frontendStack}</h4>
            <p style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: 1.4 }}>
              Renders responsive dashboards, form state, and client-side validation logic.
            </p>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0', fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowRight size={14} style={{ color: '#4F46E5' }} /> Protocol: HTTPS / REST JSON
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #99F6E4', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#0F766E' }}>
              <Server size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Layer 2: API Gateway</span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>{backendStack}</h4>
            <p style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: 1.4 }}>
              Handles incoming requests, authentication tokens, rate limits, and async processing queues.
            </p>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0', fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowRight size={14} style={{ color: '#0D9488' }} /> Protocol: SQL / ORM Drivers
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #FED7AA', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#C2410C' }}>
              <Database size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Layer 3: Data & Fallback</span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>{dbStack}</h4>
            <p style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: 1.4 }}>
              Stores user state and benchmarks. Integrated with mock data fallback APIs.
            </p>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0', fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={14} style={{ color: '#D97706' }} /> Mock Fallback Active
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#EEF2FF', borderRadius: '10px', padding: '1rem', border: '1px solid #C7D2FE', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
        <div>
          <strong style={{ color: '#3730A3' }}>Primary Data Source / API:</strong>
          <div style={{ color: '#1E1B4B', marginTop: '0.2rem' }}>{dataRequirements.primaryDataOrAPI}</div>
        </div>
        <div>
          <strong style={{ color: '#3730A3' }}>Offline Mock Alternative:</strong>
          <div style={{ color: '#1E1B4B', marginTop: '0.2rem' }}>{dataRequirements.mockAlternative}</div>
        </div>
      </div>
    </div>
  );
};
