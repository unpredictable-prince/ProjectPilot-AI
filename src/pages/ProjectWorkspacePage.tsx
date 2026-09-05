import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIService } from '../services/aiService';
import type { MentorMessage, SprintTask } from '../types/project';
import { ArchitectureDiagram } from '../components/project/ArchitectureDiagram';
import { ImproveProjectModal } from '../components/project/ImproveProjectModal';
import { PrintableProjectBrief } from '../components/project/PrintableProjectBrief';
import { BlockersManager } from '../components/project/BlockersManager';
import { MentorChat } from '../components/project/MentorChat';
import { FeasibilityScoreCard } from '../components/common/FeasibilityScoreCard';

import {
  Rocket,
  CheckSquare,
  Calendar,
  MessageSquare,
  Download,
  Sparkles,
  RefreshCw,
  Edit2,
  Check,
  Cpu,
  Layers,
  FileText,
  Clock,
  Plus,
} from 'lucide-react';

export const ProjectWorkspacePage: React.FC = () => {
  const {
    activeProject,
    toggleTaskCompletion,
    addCustomTaskToWorkspace,
    updateActiveProjectTitleAndScope,
    addBlocker,
    removeBlocker,
    acceptProjectImprovement,
    setScreen,
    showToast,
    profile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'brief' | 'tasks' | 'roadmap' | 'architecture' | 'mentor'>('brief');
  const [messages, setMessages] = useState<MentorMessage[]>(() => activeProject?.mentorMessages || []);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showImproveModal, setShowImproveModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Editable Title & Scope state
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(activeProject?.title || '');
  const [editScope, setEditScope] = useState<string>(activeProject?.valueProposition || '');

  // Custom Task form state
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskHours, setNewTaskHours] = useState<number>(3);
  const [newTaskWeek, setNewTaskWeek] = useState<number>(1);
  const [newTaskCategory, setNewTaskCategory] = useState<SprintTask['category']>('Core');
  const [showAddTaskForm, setShowAddTaskForm] = useState<boolean>(false);

  if (!activeProject) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>No Active Project Selected</h2>
        <p style={{ color: '#64748B', margin: '1rem 0' }}>Please select a project idea to view your execution workspace.</p>
        <button onClick={() => setScreen('results')} className="btn btn-primary">
          Browse Project Ideas
        </button>
      </div>
    );
  }

  const project = activeProject;
  const completedCount = project.tasks.filter((t) => t.completed).length;

  const handleSaveTitleAndScope = () => {
    updateActiveProjectTitleAndScope(editTitle, editScope);
    setIsEditingTitle(false);
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addCustomTaskToWorkspace(newTaskTitle, newTaskHours, newTaskWeek, newTaskCategory);
    setNewTaskTitle('');
    setShowAddTaskForm(false);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: MentorMessage = {
      id: `user_msg_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const mentorReply = await AIService.sendMentorMessage(project, textToSend);
      setMessages((prev) => [...prev, mentorReply]);
    } catch (e) {
      console.error(e);
      showToast('Failed to send message to mentor.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleAskMentorForBlocker = (blockerText: string) => {
    setActiveTab('mentor');
    handleSendMessage(blockerText);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Workspace Header */}
      <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-teal"><Rocket size={12} /> Active Workspace</span>
              <span className="badge badge-indigo">{project.domain}</span>
              <span className="badge badge-neutral"><Clock size={12} /> {project.estimatedDuration} ({project.estimatedWeeklyEffort}h/wk)</span>
            </div>

            {!isEditingTitle ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>{project.title}</h1>
                  <button
                    onClick={() => {
                      setEditTitle(project.title);
                      setEditScope(project.valueProposition);
                      setIsEditingTitle(true);
                    }}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.2rem' }}
                    title="Edit project title & scope"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>{project.valueProposition}</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1E293B', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ color: '#CBD5E1' }}>Project Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ color: '#CBD5E1' }}>Value Proposition / Scope</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={editScope}
                    onChange={(e) => setEditScope(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingTitle(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveTitleAndScope}>
                    <Check size={14} /> Save Title & Scope
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setScreen('review')} className="btn btn-teal btn-sm">
              <RefreshCw size={14} /> Weekly Progress Review
            </button>
            <button onClick={() => setShowPrintModal(true)} className="btn btn-secondary btn-sm">
              <Download size={14} /> Export Brief (PDF / Print)
            </button>
            <button
              onClick={() => setShowImproveModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Sparkles size={14} /> Improve Project
            </button>
          </div>
        </div>

        {/* Overall Progress Tracker Bar */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
            <span>Workspace Completion Tracker ({completedCount} of {project.tasks.length} tasks completed)</span>
            <span style={{ fontWeight: 700, color: '#38BDF8' }}>{project.progressPercentage}%</span>
          </div>
          <div style={{ backgroundColor: '#1E293B', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#38BDF8', height: '100%', width: `${project.progressPercentage}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', marginBottom: '2rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('brief')} style={tabButtonStyle(activeTab === 'brief')}>
          <FileText size={18} /> Executive Brief
        </button>
        <button onClick={() => setActiveTab('tasks')} style={tabButtonStyle(activeTab === 'tasks')}>
          <CheckSquare size={18} /> Task Checklist ({completedCount}/{project.tasks.length})
        </button>
        <button onClick={() => setActiveTab('roadmap')} style={tabButtonStyle(activeTab === 'roadmap')}>
          <Calendar size={18} /> Sprint Roadmap
        </button>
        <button onClick={() => setActiveTab('architecture')} style={tabButtonStyle(activeTab === 'architecture')}>
          <Cpu size={18} /> Architecture & Stack
        </button>
        <button onClick={() => setActiveTab('mentor')} style={tabButtonStyle(activeTab === 'mentor')}>
          <MessageSquare size={18} /> AI Mentor Advisor
        </button>
      </div>

      {/* Tab 1: Executive Brief & Scope Board */}
      {activeTab === 'brief' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {project.feasibilityBreakdown && (
            <FeasibilityScoreCard breakdown={project.feasibilityBreakdown} compact={false} />
          )}

          <BlockersManager
            blockers={project.blockers || []}
            onAddBlocker={addBlocker}
            onRemoveBlocker={removeBlocker}
            onAskMentorForBlocker={handleAskMentorForBlocker}
          />

          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers style={{ color: '#4F46E5' }} size={20} /> Feature Scope Architecture Board
            </h3>

            <div className="grid-2">
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ color: '#4F46E5', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Phase 1: MVP Core (Deliverable)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {project.mvpFeatures.map((feat) => (
                    <div key={feat.id} style={{ borderLeft: '3px solid #4F46E5', paddingLeft: '0.75rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{feat.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{feat.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ color: '#0D9488', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Phase 2: Future Expansion Scope
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {project.futureScope.map((feat) => (
                    <div key={feat.id} style={{ borderLeft: '3px solid #0D9488', paddingLeft: '0.75rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{feat.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{feat.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Task Checklist with Add Custom Task Form */}
      {activeTab === 'tasks' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>
                Sprint Execution Checklist ({completedCount} of {project.tasks.length} Done)
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                Total sprint effort: {project.tasks.reduce((sum, t) => sum + (t.estimatedHours || 3), 0)} hours
              </span>
            </div>

            <button
              onClick={() => setShowAddTaskForm(!showAddTaskForm)}
              className="btn btn-secondary btn-sm"
            >
              <Plus size={14} /> Add Custom Sprint Task
            </button>
          </div>

          {/* Add Custom Task Form Drawer */}
          {showAddTaskForm && (
            <form onSubmit={handleAddCustomTask} style={{ backgroundColor: '#EEF2FF', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #C7D2FE' }}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" htmlFor="customTaskTitle">Task Description</label>
                <input
                  id="customTaskTitle"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Implement WebSockets live notification handler..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-3" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label" htmlFor="customTaskHours">Est. Hours</label>
                  <input
                    id="customTaskHours"
                    type="number"
                    min={1}
                    max={40}
                    className="form-control"
                    value={newTaskHours}
                    onChange={(e) => setNewTaskHours(parseInt(e.target.value) || 3)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="customTaskWeek">Milestone Week</label>
                  <input
                    id="customTaskWeek"
                    type="number"
                    min={1}
                    max={20}
                    className="form-control"
                    value={newTaskWeek}
                    onChange={(e) => setNewTaskWeek(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="customTaskCategory">Category</label>
                  <select
                    id="customTaskCategory"
                    className="form-select"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as SprintTask['category'])}
                  >
                    <option value="Setup">Setup</option>
                    <option value="Core">Core</option>
                    <option value="Integration">Integration</option>
                    <option value="Testing">Testing</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddTaskForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Add Task to Sprint
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {project.tasks.map((task) => (
              <label
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: task.completed ? '#F8FAFC' : '#FFFFFF',
                  border: `1px solid ${task.completed ? '#CBD5E1' : '#E2E8F0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  style={{ width: '18px', height: '18px', accentColor: '#4F46E5', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#64748B' : '#0F172A',
                    }}
                  >
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                    Week {task.milestoneWeek} • Category: {task.category} • Est. {task.estimatedHours || 3} hrs
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Weekly Roadmap */}
      {activeTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {project.milestones.map((m) => (
            <div key={m.week} className="card" style={{ borderLeft: '4px solid #4F46E5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{m.phaseTitle}</h3>
                <span className="badge badge-indigo">Week {m.week}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600, marginBottom: '0.75rem' }}>
                Deliverable: {m.deliverable}
              </p>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {m.tasks.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Architecture & Stack Rationale */}
      {activeTab === 'architecture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
              System Architecture Diagram
            </h3>
            <ArchitectureDiagram
              summary={project.architectureSummary}
              recommendedStack={project.recommendedStack}
              dataRequirements={project.dataHardwareRequirements}
            />
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
              Technology Stack Rationale
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {project.recommendedStack.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#EEF2FF', padding: '1rem', borderRadius: '8px', border: '1px solid #C7D2FE' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338CA', textTransform: 'uppercase' }}>{item.category}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: '0.2rem 0' }}>{item.technology}</div>
                  <div style={{ fontSize: '0.825rem', color: '#475569' }}>{item.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: AI Mentor Advisor */}
      {activeTab === 'mentor' && (
        <MentorChat
          project={project}
          messages={messages}
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      )}

      <ImproveProjectModal
        isOpen={showImproveModal}
        onClose={() => setShowImproveModal(false)}
        project={project}
        onAcceptProposal={acceptProjectImprovement}
      />

      <PrintableProjectBrief
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        project={project}
        profile={profile}
      />
    </div>
  );
};

const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  background: 'none',
  border: 'none',
  color: isActive ? '#4F46E5' : '#64748B',
  fontWeight: isActive ? 600 : 500,
  fontSize: '0.95rem',
  padding: '0.75rem 0.75rem',
  cursor: 'pointer',
  borderBottom: isActive ? '3px solid #4F46E5' : '3px solid transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});
