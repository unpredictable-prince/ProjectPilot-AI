import type { StudentProfile } from '../types/profile';
import type { ProjectIdea, MentorMessage, FeasibilityBreakdown, StructuredMentorResponse } from '../types/project';
import type { GenerateIdeasResponse, ProjectPitchResponse } from '../types/api';
import { FallbackGenerator } from '../services/fallbackGenerator';
import { FeasibilityEngine } from '../services/feasibilityEngine';
import { DEFAULT_GEMINI_MODEL, CANDIDATE_GEMINI_MODELS, isValidGeminiResponsePayload } from '../config/aiConfig';

declare const process: { env: Record<string, string | undefined> };

/**
 * Reads configured server-side GEMINI_MODEL or falls back to default flash model
 */
export function getSafeGeminiModel(): string {
  return (process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL).trim();
}

/**
 * Handles HTTP error status codes securely without leaking raw provider details to clients.
 */
function logGeminiErrorStatus(status: number, modelName: string) {
  if (status === 404) {
    console.warn(`[Server API] Configured Gemini model (${modelName}) is unavailable; using offline recommendations.`);
  } else if (status === 401 || status === 403) {
    console.warn(`[Server API] Gemini configuration needs administrator attention; using offline recommendations.`);
  } else if (status === 429) {
    console.warn(`[Server API] AI is busy; using offline recommendations.`);
  } else {
    console.warn(`[Server API] Gemini API request failed with status ${status}; using offline recommendations.`);
  }
}

/**
 * SERVER-SIDE API HANDLER MODULE
 * Operates strictly server-side (Node.js / Vite server middleware).
 * Reads process.env.GEMINI_API_KEY and process.env.GEMINI_MODEL.
 * Never exposes API keys, secrets, or raw provider errors to frontend clients.
 */
export async function handleGenerateIdeasServer(profile: StudentProfile): Promise<GenerateIdeasResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = getSafeGeminiModel();

  if (!apiKey) {
    console.log('[Server API] No server GEMINI_API_KEY configured. Returning deterministic fallback ideas.');
    const fallbackIdeas = FallbackGenerator.generateIdeasForProfile(profile);
    return {
      ideas: fallbackIdeas,
      isFallback: true,
      source: 'deterministic-fallback',
    };
  }

  console.log(`[Server API Diagnostic] Key configured: ${apiKey ? 'yes' : 'no'} | Selected Model: ${modelName}`);

  try {
    const prompt = `You are ProjectPilot AI, an academic project advisor for final-year engineering students.
Generate exactly 4 distinct, practical, non-generic project ideas tailored for this student profile:
${JSON.stringify(profile, null, 2)}

Important Rules:
1. Ideas MUST be realistic for a college final-year capstone project. Do NOT suggest massive enterprise software (e.g. no full Uber clones, no full hospital ERPs, no global social networks).
2. Match the student's skills, available weekly hours, duration, team size, and budget.
3. Every idea MUST have between 3 to 5 practical MVP features maximum.
4. Ensure the 4 ideas vary in scope and domain.

Return strict JSON format with key "ideas" containing an array of 4 project objects matching this exact schema:
{
  "ideas": [
    {
      "title": string,
      "valueProposition": string,
      "domain": string,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "estimatedWeeklyEffort": number,
      "requiredSkills": string[],
      "whyItFits": string,
      "problemStatement": string,
      "targetUsers": string[],
      "proposedSolution": string,
      "uniqueDifferentiator": string,
      "mvpFeatures": [{"id": string, "title": string, "description": string, "isCore": boolean}],
      "futureScope": [{"id": string, "title": string, "description": string}],
      "recommendedStack": [{"category": string, "technology": string, "reason": string}],
      "architectureSummary": string,
      "dataHardwareRequirements": {
        "primaryDataOrAPI": string,
        "mockAlternative": string,
        "hardwareNotes": string
      },
      "risks": [{"risk": string, "impact": "High"|"Medium"|"Low", "mitigation": string}]
    }
  ]
}`;

    const candidateModels = Array.from(new Set([modelName, ...CANDIDATE_GEMINI_MODELS]));
    let response: Response | null = null;
    let successfulModel = modelName;

    for (const m of candidateModels) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      console.log(`[Server API Diagnostic] Model: ${m} | Response status: ${res.status}`);

      if (res.ok) {
        response = res;
        successfulModel = m;
        break;
      } else {
        logGeminiErrorStatus(res.status, m);
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Gemini API request failed for all configured models.`);
    }

    console.log(`[Server API Diagnostic] Live generation succeeded with model: ${successfulModel}`);

    const rawJson = await response.json();
    if (!isValidGeminiResponsePayload(rawJson)) {
      throw new Error('Invalid JSON payload schema received from Gemini API');
    }

    const text = rawJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response text from Gemini model');

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error('Malformed JSON payload received from Gemini model');
    }

    const parsedIdeas = (Array.isArray(parsed.ideas) ? parsed.ideas : Array.isArray(parsed) ? parsed : []) as Record<string, any>[];

    if (parsedIdeas.length === 0 || !parsedIdeas[0]?.title) {
      throw new Error('AI response failed strict schema validation checks');
    }

    const fallbackTemplates = FallbackGenerator.generateIdeasForProfile(profile);

    const validatedIdeas: ProjectIdea[] = parsedIdeas.map((raw, idx) => {
      const fallback = fallbackTemplates[idx % fallbackTemplates.length];
      const difficulty = (raw.difficulty || fallback.difficulty) as 'Beginner' | 'Intermediate' | 'Advanced';
      const requiredSkills = Array.isArray(raw.requiredSkills) ? raw.requiredSkills : fallback.requiredSkills;
      const stackList = Array.isArray(raw.recommendedStack) ? raw.recommendedStack.map((s: any) => s.technology) : fallback.recommendedStack.map((s) => s.technology);

      const breakdown: FeasibilityBreakdown = FeasibilityEngine.calculateFeasibilityBreakdown(
        profile,
        requiredSkills,
        difficulty,
        stackList
      );
      const innovation = FeasibilityEngine.calculateInnovationScore(
        raw.domain || profile.preferredDomain,
        profile.interests,
        difficulty
      );

      return {
        id: `idea_gemini_${idx}_${Date.now()}`,
        title: raw.title || fallback.title,
        valueProposition: raw.valueProposition || fallback.valueProposition,
        domain: raw.domain || profile.preferredDomain,
        difficulty,
        estimatedDuration: profile.duration,
        estimatedWeeklyEffort: raw.estimatedWeeklyEffort || Math.min(profile.weeklyHours, 16),
        requiredSkills,
        innovationScore: innovation,
        feasibilityScore: breakdown.overallScore,
        feasibilityBreakdown: breakdown,
        whyItFits: raw.whyItFits || fallback.whyItFits,
        problemStatement: raw.problemStatement || fallback.problemStatement,
        targetUsers: Array.isArray(raw.targetUsers) ? raw.targetUsers : fallback.targetUsers,
        proposedSolution: raw.proposedSolution || fallback.proposedSolution,
        uniqueDifferentiator: raw.uniqueDifferentiator || fallback.uniqueDifferentiator,
        mvpFeatures: Array.isArray(raw.mvpFeatures) ? raw.mvpFeatures : fallback.mvpFeatures,
        futureScope: Array.isArray(raw.futureScope) ? raw.futureScope : fallback.futureScope,
        recommendedStack: Array.isArray(raw.recommendedStack) ? raw.recommendedStack : fallback.recommendedStack,
        architectureSummary: raw.architectureSummary || fallback.architectureSummary,
        dataHardwareRequirements: raw.dataHardwareRequirements || fallback.dataHardwareRequirements,
        risks: Array.isArray(raw.risks) ? raw.risks : fallback.risks,
        milestones: fallback.milestones,
        tasks: fallback.tasks,
        blockers: [],
        createdAt: new Date().toISOString(),
        status: 'draft',
        progressPercentage: 0,
        mentorMessages: fallback.mentorMessages,
        mentorNotes: fallback.mentorNotes,
      };
    });

    return {
      ideas: validatedIdeas,
      isFallback: false,
      source: 'gemini',
    };
  } catch (err) {
    console.warn('[Server API] Live Gemini call unconfigured or using fallback generator:', err instanceof Error ? err.message : err);
    const fallbackIdeas = FallbackGenerator.generateIdeasForProfile(profile);
    return {
      ideas: fallbackIdeas,
      isFallback: true,
      source: 'deterministic-fallback',
    };
  }
}

export async function handleMentorResponseServer(project: ProjectIdea, userMessageText: string): Promise<MentorMessage> {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = getSafeGeminiModel();

  if (apiKey) {
    const candidateModels = Array.from(new Set([modelName, 'gemini-1.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro']));
    for (const m of candidateModels) {
      try {
        const prompt = `You are an expert technical mentor advising a student on their capstone project titled "${project.title}".
Student query: "${userMessageText}"

Return JSON matching this exact schema:
{
  "directAnswer": string,
  "recommendedNextAction": string,
  "riskFlag": string optional,
  "rationale": string,
  "suggestedActions": string[]
}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });

        if (response.ok) {
          const rawJson = await response.json();
          const text = rawJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            const structured: StructuredMentorResponse = {
              directAnswer: parsed.directAnswer || `For "${project.title}", focus on delivering core MVP modules first.`,
              recommendedNextAction: parsed.recommendedNextAction || `Complete the next pending sprint checklist task.`,
              riskFlag: parsed.riskFlag,
              rationale: parsed.rationale || `Consistent sprint progress minimizes last-minute capstone submission risks.`,
              suggestedActions: Array.isArray(parsed.suggestedActions) && parsed.suggestedActions.length > 0
                ? parsed.suggestedActions
                : ['Show Phase 1 Tasks', 'Review Sprint Checklist', 'Check Tech Stack'],
            };

            return {
              id: `msg_mentor_${Date.now()}`,
              sender: 'mentor',
              text: structured.directAnswer,
              structuredResponse: structured,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              suggestedActions: structured.suggestedActions,
            };
          }
        }
      } catch {
        // Try next candidate model
      }
    }
  }

  // Deterministic rule-based mentor fallback
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
}

export async function handleProjectPitchServer(project: ProjectIdea): Promise<ProjectPitchResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = getSafeGeminiModel();

  if (!apiKey) {
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
  }

  try {
    const prompt = `Generate a compelling academic project pitch deck outline for final jury presentation for this project:
${JSON.stringify(project, null, 2)}

Return strict JSON format matching this schema:
{
  "title": string,
  "hook": string,
  "problem": string,
  "solution": string,
  "keyFeatures": string[],
  "techStack": string[],
  "feasibilityScore": number,
  "closingCallToAction": string
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      logGeminiErrorStatus(response.status, modelName);
      throw new Error(`Gemini status ${response.status}`);
    }

    const rawJson = await response.json();
    const text = rawJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(text);
    return {
      title: parsed.title || project.title,
      hook: parsed.hook || project.valueProposition,
      problem: parsed.problem || project.problemStatement,
      solution: parsed.solution || project.proposedSolution,
      keyFeatures: Array.isArray(parsed.keyFeatures) ? parsed.keyFeatures : project.mvpFeatures.map((f) => f.title),
      techStack: Array.isArray(parsed.techStack) ? parsed.techStack : project.recommendedStack.map((s) => `${s.category}: ${s.technology}`),
      feasibilityScore: typeof parsed.feasibilityScore === 'number' ? parsed.feasibilityScore : project.feasibilityScore,
      closingCallToAction: parsed.closingCallToAction || `Ready to evaluate ${project.title}? Review the complete architecture breakdown in ProjectPilot AI.`,
      isFallback: false,
      source: 'gemini',
    };
  } catch (err) {
    console.warn('[Server API] Pitch deck generator using fallback:', err instanceof Error ? err.message : err);
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
  }
}
