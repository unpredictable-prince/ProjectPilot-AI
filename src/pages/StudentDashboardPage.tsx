import React from 'react';
import { useApp } from '../context/AppContext';
import type { ProjectIdea } from '../types/project';
import { Rocket, Plus, Compass, ChevronRight, Layers, Sparkles, User } from 'lucide-react';

export function calculateProjectStage(project: ProjectIdea): { stageText: string; stageNumber: number; badgeColor: string } {
  const pct = project.progressPercentage || 0;
  if (pct === 100) {
    return { stageText: 'Stage 7: Project Ready', stageNumber: 7, badgeColor: 'badge-teal' };
  } else if (pct > 70) {
    return { stageText: `Stage 6: Testing & Refinement (${pct}% complete)`, stageNumber: 6, badgeColor: 'badge-indigo' };
  } else if (pct > 20) {
    return { stageText: `Stage 5: Development In Progress (${pct}% complete)`, stageNumber: 5, badgeColor: 'badge-indigo' };
  } else if (pct > 0) {
    return { stageText: `Stage 4: MVP Planning (${pct}% complete)`, stageNumber: 4, badgeColor: 'badge-neutral' };
  } else if (project.status === 'in_progress') {
    return { stageText: 'Stage 3: Idea Selected', stageNumber: 3, badgeColor: 'badge-teal' };
  } else {
    return { stageText: 'Stage 2: Ideas Generated', stageNumber: 2, badgeColor: 'badge-neutral' };
  }
}

export const StudentDashboardPage: React.FC = () => {
  const {
    currentUser,
    profile,
    savedProjects,
    activeProject,
    reopenSavedProject,
    setSelectedIdea,
    navigateToPath,
  } = useApp();

  const isProfileIncomplete = !profile.skills || profile.skills.length === 0;

  // Real statistics computation
  const totalProjects = savedProjects.length;
  const activeProjectsCount = savedProjects.filter((p) => p.status === 'in_progress').length;
  const totalCompletedTasks = savedProjects.reduce(
    (acc, p) => acc + (p.tasks ? p.tasks.filter((t) => t.completed).length : 0),
    0
  );
  const avgFeasibility =
    totalProjects > 0
      ? (
          savedProjects.reduce((acc, p) => acc + (p.feasibilityScore || 8.5), 0) / totalProjects
        ).toFixed(1)
      : '0.0';
  const overallCompletion =
    totalProjects > 0
      ? Math.round(
          savedProjects.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / totalProjects
        )
      : 0;

  // Highlighted Most Recent Project
  const featuredProject = activeProject || savedProjects[0] || null;

  const handleContinueProject = (project: ProjectIdea) => {
    reopenSavedProject(project);
  };

  const handleViewDetails = (project: ProjectIdea) => {
    setSelectedIdea(project);
    navigateToPath('/details');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', paddingBottom: '5rem' }}>
      {/* A. Welcome Header Banner */}
      <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '14px', padding: '2rem 2.25rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: '0.65rem' }}>
              <Sparkles size={12} /> Student Capstone Dashboard
            </span>
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              Welcome back, {currentUser?.name || 'Student'}! 👋
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.975rem', maxWidth: '600px', margin: 0 }}>
              Continue building your final-year engineering project with structured milestones, transparent feasibility ratings, and AI mentor guidance.
            </p>
          </div>

          <button
            onClick={() => navigateToPath('/wizard')}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Create New Project Idea
          </button>
        </div>
      </div>

      {/* Incomplete Profile Prompt Banner */}
      {isProfileIncomplete && (
        <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: '#FEF3C7', color: '#D97706', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#92400E', marginBottom: '0.15rem' }}>Complete Profile Required</h4>
              <p style={{ fontSize: '0.85rem', color: '#B45309', margin: 0 }}>
                Tell us your skills and career interests to receive custom-evaluated capstone recommendations.
              </p>
            </div>
          </div>
          <button onClick={() => navigateToPath('/wizard')} className="btn btn-secondary btn-sm" style={{ borderColor: '#F59E0B', color: '#92400E' }}>
            Complete Profile <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* D. Real Progress Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #4F46E5', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Total Projects
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{totalProjects}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>Saved in your portfolio</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #0D9488', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Active Workspaces
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{activeProjectsCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600, marginTop: '0.25rem' }}>In sprint execution</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #6366F1', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Tasks Completed
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{totalCompletedTasks}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>Across all milestone roadmaps</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D97706', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Avg Feasibility Score
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{avgFeasibility} <span style={{ fontSize: '1rem', color: '#64748B' }}>/ 10</span></div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>6-factor technical rating</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10B981', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Overall Completion
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{overallCompletion}%</div>
          <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#10B981', height: '100%', width: `${overallCompletion}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* C. Highlighted "Continue Where You Left Off" Card */}
      {featuredProject && (
        <div className="card" style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', marginBottom: '2.5rem', padding: '1.5rem 1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
                <Rocket size={12} /> Active Project Workspace
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                {featuredProject.title}
              </h2>
              <p style={{ color: '#475569', fontSize: '0.925rem', margin: 0 }}>
                {featuredProject.valueProposition}
              </p>
            </div>

            <button
              onClick={() => handleContinueProject(featuredProject)}
              className="btn btn-primary"
              style={{ padding: '0.7rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Rocket size={16} /> Continue Workspace <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', backgroundColor: '#FFFFFF', padding: '1.1rem', borderRadius: '10px', border: '1px solid #E0E7FF' }}>
            <div>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Current Execution Stage</div>
              <div style={{ fontWeight: 700, color: '#4338CA', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {calculateProjectStage(featuredProject).stageText}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Next Recommended Action</div>
              <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {featuredProject.tasks?.find((t) => !t.completed)?.title || 'All initial milestone tasks complete! Ready for defense.'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                <span>Milestone Completion</span>
                <span>{featuredProject.progressPercentage}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '8px', borderRadius: '4px', marginTop: '0.4rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#4F46E5', height: '100%', width: `${featuredProject.progressPercentage}%`, transition: 'width 0.3s ease' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. My Projects Section */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: '#4F46E5' }} size={22} /> My Project Portfolio ({savedProjects.length})
        </h2>
      </div>

      {savedProjects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {savedProjects.map((project) => {
            const stageInfo = calculateProjectStage(project);
            const nextTask = project.tasks?.find((t) => !t.completed);
            const mainBlocker = project.blockers && project.blockers.length > 0 ? project.blockers[0] : null;

            return (
              <div key={project.id} className="card" style={{ border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-indigo">{project.domain}</span>
                    <span className={`badge ${stageInfo.badgeColor}`}>{stageInfo.stageText}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                    {project.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    {project.valueProposition}
                  </p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      <span>Progress</span>
                      <span>{project.progressPercentage}%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#F1F5F9', height: '7px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#0D9488', height: '100%', width: `${project.progressPercentage}%` }} />
                    </div>
                  </div>

                  {/* Next Task Callout */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.825rem', color: '#334155', marginBottom: '0.65rem', borderLeft: '3px solid #4F46E5' }}>
                    <strong>Next Task:</strong> {nextTask ? nextTask.title : 'Phase complete'}
                  </div>

                  {/* Main Blocker Callout */}
                  {mainBlocker && (
                    <div style={{ backgroundColor: '#FFFBEB', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.825rem', color: '#92400E', borderLeft: '3px solid #F59E0B' }}>
                      <strong>Active Blocker:</strong> {mainBlocker}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9' }}>
                  <button
                    onClick={() => handleViewDetails(project)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.825rem' }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleContinueProject(project)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    Continue Project <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* E. Friendly Empty State */
        <div className="card" style={{ border: '2px dashed #CBD5E1', padding: '3.5rem 2rem', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'inline-flex', backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '1rem', borderRadius: '16px', marginBottom: '1.25rem' }}>
            <Compass size={40} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Your project journey starts here.
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
            Tell us your engineering branch, skills, and interests. ProjectPilot AI will help you discover feasible, original final-year project ideas tailored for your schedule.
          </p>
          <button
            onClick={() => navigateToPath('/wizard')}
            className="btn btn-primary"
            style={{ padding: '0.8rem 2rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Sparkles size={18} /> Find My Project Idea
          </button>
        </div>
      )}
    </div>
  );
};
