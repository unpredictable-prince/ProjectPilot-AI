import React from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_PROFILES } from '../services/storageService';
import { ArrowRight, Sparkles, Target, Clock, FileCheck } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setScreen, loadPresetProfile } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      <section style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '4.5rem 0 5rem', borderBottom: '1px solid #1E293B' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            color: '#A5B4FC',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} /> Intelligent Academic Capstone Advisor
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
            Discover Original Projects.<br />
            <span style={{ color: '#38BDF8' }}>Build Feasible Execution Roadmaps.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            Over 65% of final-year engineering students struggle with vague or unfeasible project choices. ProjectPilot AI evaluates your skills, available hours, and career goals to generate verified capstones with sprint plans and mentor feedback.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setScreen('wizard')}
              className="btn btn-primary"
              style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}
            >
              Find My Project Idea <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="container">
        <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', color: '#4F46E5', marginBottom: '0.5rem' }}>
          Quick Demo Setup
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Start instantly with pre-configured student profiles
        </h2>
        <p style={{ color: '#475569', marginBottom: '2rem' }}>
          Click any preset profile to instantly test project idea generation with realistic academic backgrounds:
        </p>

        <div className="grid-3">
          {PRESET_PROFILES.map((preset) => (
            <div
              key={preset.id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #E2E8F0' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{preset.avatar}</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{preset.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#4F46E5', fontWeight: 500 }}>{preset.role}</p>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  <div><strong>Degree:</strong> {preset.profile.degreeBranch}</div>
                  <div><strong>Skills:</strong> {preset.profile.skills.slice(0, 3).join(', ')}</div>
                  <div><strong>Hours:</strong> {preset.profile.weeklyHours} hrs/week ({preset.profile.duration})</div>
                </div>
              </div>

              <button
                onClick={() => {
                  loadPresetProfile(preset.id);
                  setScreen('wizard');
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                Use {preset.name}'s Profile
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '2.5rem' }}>
          Why ProjectPilot AI works for academic capstones
        </h2>

        <div className="grid-3">
          <div className="card">
            <div style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Calculated Feasibility</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Every project comes with a 1–100 feasibility score calculated against your weekly hours, team size, and existing skill set.
            </p>
          </div>

          <div className="card">
            <div style={{ backgroundColor: '#F0FDFA', color: '#0D9488', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Weekly Milestone Roadmap</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Transform complex projects into manageable 4–12 week sprint tasks with built-in checklist trackers.
            </p>
          </div>

          <div className="card">
            <div style={{ backgroundColor: '#FFFBEB', color: '#D97706', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <FileCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Capstone Brief Export</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Export formal project proposals including target users, MVP scope, technology rationale, and risk mitigations for academic review.
            </p>
          </div>
        </div>
      </section>

      <section className="container">
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>Sample Tailored Result</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A' }}>AI-Powered Healthcare Diagnostic Execution Auditor</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem' }}>An intelligent workflow tool that automates real-time log verification and error diagnostics for medical pipelines.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ textAlign: 'center', backgroundColor: '#EEF2FF', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4F46E5' }}>92/100</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase' }}>Feasibility</div>
              </div>
              <div style={{ textAlign: 'center', backgroundColor: '#F0FDFA', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0D9488' }}>88/100</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase' }}>Innovation</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <div><strong>Recommended Stack:</strong> Python, FastAPI, React, PyTorch</div>
            <div><strong>Duration:</strong> 3-4 months (18 hrs/week)</div>
            <div><strong>Team:</strong> 2 Students</div>
          </div>
        </div>
      </section>
    </div>
  );
};
