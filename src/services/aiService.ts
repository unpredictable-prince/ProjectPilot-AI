import type { StudentProfile } from '../types/profile.js';
import type { ProjectIdea, MentorMessage, StructuredMentorResponse } from '../types/project.js';
import type { GenerateIdeasResponse, ProgressReviewResponse, ProjectPitchResponse } from '../types/api.js';
import { FallbackGenerator } from './fallbackGenerator.js';
import { AuthService } from './authService.js';

/**
 * Frontend AI Service client layer.
 * Strictly calls secure relative backend API endpoints (/api/generate-project-ideas, /api/mentor-response, /api/project-pitch).
 * NEVER imports server modules directly.
 * NEVER reads or exposes API keys, provider secrets, environment variables, or raw tokens in client code.
 */
export const AIService = {
  async generateProjectIdeas(profile: StudentProfile): Promise<GenerateIdeasResponse> {
    try {
      const response = await fetch('/api/generate-project-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.ideas) && data.ideas.length > 0) {
          AuthService.recordAiTelemetry(Boolean(data.isFallback));
          return data;
        }
      }
    } catch {
      // In offline runner or network error, fallback cleanly in client
    }

    AuthService.recordAiTelemetry(true);
    const fallbackIdeas = FallbackGenerator.generateIdeasForProfile(profile);
    return {
      ideas: fallbackIdeas,
      isFallback: true,
      source: 'deterministic-fallback',
    };
  },

  async conductProgressReview(
    project: ProjectIdea,
    completedTaskIds: string[],
    blockers: string
  ): Promise<ProgressReviewResponse> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const totalTasks = project.tasks.length || 1;
    const completedCount = completedTaskIds.length;
    const completionRatio = completedCount / totalTasks;

    let mentorFeedback = `Great progress! You have completed ${completedCount} out of ${totalTasks} key tasks.`;
    const revisedPriorities: string[] = [];
    const suggestedNextTasks: string[] = [];

    if (blockers.trim()) {
      mentorFeedback += ` Regarding your blocker ("${blockers}"): I recommend isolating the issue in a standalone test script before re-integrating into your main pipeline.`;
      revisedPriorities.push('Address highlighted technical blocker');
    }

    if (completionRatio < 0.25) {
      revisedPriorities.push('Focus exclusively on Phase 1 Environment Setup & Data Schemas');
      suggestedNextTasks.push('Complete project setup & database initialization tasks');
    } else if (completionRatio < 0.7) {
      revisedPriorities.push('Prioritize core MVP functional endpoints and UI bindings');
      suggestedNextTasks.push('Connect frontend components to backend API service');
    } else {
      revisedPriorities.push('Begin integration testing, error handling, and thesis documentation');
      suggestedNextTasks.push('Conduct performance benchmarking and assemble capstone slides');
    }

    return {
      mentorFeedback,
      revisedPriorities,
      suggestedNextTasks,
      updatedFeasibilityScore: Math.min(9.8, Math.round((project.feasibilityScore + 0.3) * 10) / 10),
    };
  },

  async sendMentorMessage(project: ProjectIdea, userMessageText: string): Promise<MentorMessage> {
    try {
      const response = await fetch('/api/mentor-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, userMessageText }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          AuthService.recordAiTelemetry(false);
          return data;
        }
      }
    } catch {
      // In offline runner or network error, fallback cleanly in client
    }

    AuthService.recordAiTelemetry(true);

    // Client-side rule-based mentor fallback
    const query = userMessageText.toLowerCase();
    let structured: StructuredMentorResponse;

    if (query.includes('data availability') || query.includes('ingest') || query.includes('meter') || query.includes('dataset') || query.includes('campus apis') || query.includes('sub-meter')) {
      structured = {
        directAnswer: `Data Ingestion Strategy for "${project.title}":
1) Primary Data Provider: Ingest hourly telemetry via REST / WebSocket endpoints.
2) Synthetic Fallback: Use pre-packaged JSON energy feeds for 10 engineering buildings.
3) Telemetry Schema: Include timestamp, building_id, kWh_consumed, peak_kw, and calculated_co2e.`,
        recommendedNextAction: `Create a mock JSON data provider with 100 sample hourly readings to feed your dashboard charts immediately.`,
        riskFlag: `Relying solely on external hardware feeds without mock data fallbacks risks failing your live demo presentation.`,
        rationale: `Decoupling data ingestion into a local mock provider guarantees zero latency during academic jury evaluation.`,
        suggestedActions: ['Draft System Architecture', 'Define Optimization Scope', 'Review Tech Stack'],
      };
    } else if (query.includes('architecture') || query.includes('ingestion (mqtt/rest)') || query.includes('time-series') || query.includes('influxdb') || query.includes('postgresql') || query.includes('storage')) {
      structured = {
        directAnswer: `Target System Architecture Layer for "${project.title}":
• Ingestion Layer: REST API / WebSocket telemetry receiver.
• Storage Layer: PostgreSQL with TimescaleDB extension (or local IndexedDB client cache).
• Analytics Engine: Automated baseline calculation & peak consumption anomaly detector.
• Dashboard UI: React + Chart.js / Recharts interactive energy heatmaps.`,
        recommendedNextAction: `Implement the REST ingestion endpoint and connect it to your Chart.js frontend visualization container.`,
        riskFlag: `Avoid adding complex message brokers like Kafka unless processing >10,000 telemetry events per second.`,
        rationale: `Keeping the architecture simple protects your ${project.feasibilityScore}/10 Feasibility Rating while meeting all capstone requirements.`,
        suggestedActions: ['Define Optimization Scope', 'Review Tech Stack Rationale', 'Add Sub-tasks to Checklist'],
      };
    } else if (query.includes('optimization scope') || query.includes('peak shaving') || query.includes('predictive') || query.includes('ml-driven') || query.includes('rule-based')) {
      structured = {
        directAnswer: `Optimization Scope Recommendation for "${project.title}":
1) Phase 1 MVP (Rule-Based): Implement peak shaving alerts when consumption exceeds 20% of 30-day baseline.
2) Phase 2 Future Scope (ML-Driven): Add predictive load forecasting (LSTM / ARIMA) in your thesis paper's "Future Work" section.`,
        recommendedNextAction: `Implement the 20% baseline peak-shaving threshold calculation function in your core analytics module.`,
        riskFlag: `Attempting complex ML forecasting models early often delays delivery of a working MVP demonstration.`,
        rationale: `Rule-based optimization engines are 100% deterministic, easier to unit test, and highly praised by academic juries for transparency.`,
        suggestedActions: ['View MVP Core Features', 'Check Unit Test Specs', 'Log Blocker in Workspace'],
      };
    } else if (query.includes('progress') || query.includes('tech stack preferences') || query.includes('technical design') || query.includes('review') || query.includes('share your current')) {
      structured = {
        directAnswer: `Technical Review for "${project.title}": Your technical design is solid! You have completed ${project.tasks.filter((t) => t.completed).length} out of ${project.tasks.length || 1} sprint tasks.`,
        recommendedNextAction: `Focus on completing the next pending checklist item: "${project.tasks.find((t) => !t.completed)?.title || 'Connect frontend components to backend API service'}".`,
        riskFlag: undefined,
        rationale: `Maintaining consistent weekly sprint progress guarantees timely capstone submission.`,
        suggestedActions: ['Show Phase 1 Tasks', 'Add Sub-tasks to Checklist', 'Export Project Brief'],
      };
    } else if (query.includes('break') || query.includes('task') || query.includes('smaller') || query.includes('sprint') || query.includes('divide')) {
      structured = {
        directAnswer: `To break "${project.mvpFeatures[0]?.title || 'Core Feature'}" into smaller sprints, split it into 3 sub-tasks: 1) Data Schema & Mock Endpoint, 2) UI Component Layout, and 3) Integration Test.`,
        recommendedNextAction: `Create 3 sub-tasks in your workspace checklist, each estimated at 2-3 engineering hours.`,
        riskFlag: query.includes('tight') ? 'Risk of scope creep if adding extra styling before functional endpoints work.' : undefined,
        rationale: `Decomposing complex modules into <3 hour blocks prevents engineering paralysis and maintains steady sprint momentum.`,
        suggestedActions: ['Show Phase 1 Tasks', 'Add Sub-tasks to Checklist', 'Review Architecture Layer'],
      };
    } else if (query.includes('vs') || query.includes('choose') || query.includes('stack') || query.includes('database') || query.includes('framework') || query.includes('tech')) {
      const topStack = project.recommendedStack.map((s) => `${s.category}: ${s.technology}`).join(', ');
      structured = {
        directAnswer: `For your timeline (${project.estimatedDuration}), stick with your current stack choices: ${topStack || 'React, TypeScript, Python, FastAPI'}.`,
        recommendedNextAction: `Avoid switching core frameworks midway through the project to protect your ${project.feasibilityScore}/10 Feasibility Rating.`,
        riskFlag: 'Technology stack switching during sprint execution accounts for 35% of missed capstone deadlines.',
        rationale: `Leveraging familiar technology choices guarantees faster delivery of a working MVP demo.`,
        suggestedActions: ['Review Tech Stack Rationale', 'Ask about Database Choice', 'Check Risk Assessment'],
      };
    } else if (query.includes('reduce') || query.includes('tight') || query.includes('deadline') || query.includes('time') || query.includes('schedule')) {
      structured = {
        directAnswer: `To hit a tight deadline, move all Phase 2 features (${project.futureScope.map((f) => f.title).join(', ') || 'Advanced Analytics'}) to your thesis paper's "Future Work" chapter.`,
        recommendedNextAction: `Focus 100% of your remaining hours on delivering the core MVP module: "${project.mvpFeatures[0]?.title || 'Main Feature'}".`,
        riskFlag: 'Submitting a half-finished advanced feature is graded lower than a rock-solid simple MVP.',
        rationale: `Academic juries value an end-to-end working demonstration over incomplete complex architectures.`,
        suggestedActions: ['Open "Improve Project" Modal', 'View MVP Core Features', 'Export Project Brief'],
      };
    } else if (query.includes('security') || query.includes('testing') || query.includes('test') || query.includes('privacy') || query.includes('auth')) {
      structured = {
        directAnswer: `Key requirements for "${project.title}": 1) Accessibility: Ensure ARIA labels and visible focus rings; 2) Privacy: Use LocalStorage/IndexedDB for data; 3) Testing: Add 5 Vitest unit tests for core math formulas.`,
        recommendedNextAction: `Add accessibility keyboard focus testing and a basic Vitest test suite to your Phase 3 sprint.`,
        riskFlag: 'Missing basic unit tests or broken keyboard navigation will lose presentation points during academic jury evaluation.',
        rationale: `Addressing non-functional requirements early demonstrates professional engineering maturity.`,
        suggestedActions: ['View Accessibility Checklist', 'Check Unit Test Specs', 'Ask about Security'],
      };
    } else if (query.includes('block') || query.includes('error') || query.includes('issue') || query.includes('bug') || query.includes('fix')) {
      structured = {
        directAnswer: `To resolve your blocker: 1) Replicate the error in an isolated 20-line test script; 2) Inspect the exact network response status code; 3) Use mock data fallback if external API is failing.`,
        recommendedNextAction: `Implement a deterministic mock JSON data fallback so your UI stays functional while debugging.`,
        riskFlag: 'External API rate limits or downtime can disrupt your live capstone demo presentation.',
        rationale: `Isolating failures into local unit tests isolates root causes 3x faster than debugging full application trees.`,
        suggestedActions: ['Log Blocker in Workspace', 'View Mock Data Specs', 'Review Risk Mitigations'],
      };
    } else {
      structured = {
        directAnswer: `For "${project.title}", your primary focus should be completing the uncompleted tasks in Phase 1 & 2 of your workspace.`,
        recommendedNextAction: `Complete the next pending checklist item in your sprint roadmap.`,
        riskFlag: undefined,
        rationale: `Your current Feasibility Score is ${project.feasibilityScore}/10 based on ${project.estimatedWeeklyEffort} hours/week effort.`,
        suggestedActions: ['Show Phase 1 Tasks', 'Review Sprint Checklist', 'Export Project Brief'],
      };
    }

    return {
      id: `msg_mentor_${Date.now()}`,
      sender: 'mentor',
      text: structured.directAnswer,
      structuredResponse: structured,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: structured.suggestedActions,
    };
  },

  async generateProjectPitch(project: ProjectIdea): Promise<ProjectPitchResponse> {
    try {
      const response = await fetch('/api/project-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.title) {
          return data;
        }
      }
    } catch {
      // In offline runner or network error, fallback cleanly in client
    }

    return {
      title: project.title,
      hook: project.valueProposition,
      problem: project.problemStatement,
      solution: project.proposedSolution,
      keyFeatures: project.mvpFeatures.map((f) => f.title),
      techStack: project.recommendedStack.map((s) => `${s.category}: ${s.technology}`),
      feasibilityScore: project.feasibilityScore,
      closingCallToAction: `Ready to evaluate ${project.title}? Review the complete architecture breakdown in ProjectPilot AI.`,
      isFallback: true,
      source: 'deterministic-fallback',
    };
  },
};
