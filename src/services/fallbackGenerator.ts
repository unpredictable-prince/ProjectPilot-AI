import type { StudentProfile } from '../types/profile.js';
import type { ProjectIdea, Milestone, SprintTask, RiskFactor, MVPFeature, FutureFeature, RecommendedStackItem } from '../types/project.js';
import { FeasibilityEngine } from './feasibilityEngine.js';

export const FallbackGenerator = {
  generateIdeasForProfile(profile: StudentProfile): ProjectIdea[] {
    const skillsList = Array.isArray(profile?.skills) ? profile.skills : Array.isArray((profile as any)?.technicalSkills) ? (profile as any).technicalSkills : ['JavaScript'];
    const interestsList = Array.isArray(profile?.interests) ? profile.interests : ['Technology'];
    const primarySkill = skillsList[0] || 'JavaScript';
    const secondarySkill = skillsList[1] || 'Web Technologies';
    const preferredDomain = profile?.preferredDomain || 'Education Tech';
    const duration = profile?.duration || '3-4 months';

    const allDomainTemplates = [
      {
        domain: 'Education Tech',
        title: `Adaptive Peer Code Auditor & Study Sprint Planner`,
        valueProposition: `A lightweight interactive web tool that parses student project repos to provide instant syntax diagnostics, peer feedback queues, and milestone deadlines.`,
        estimatedDifficulty: (profile.experienceLevel === 'beginner' ? 'Beginner' : 'Intermediate') as 'Beginner' | 'Intermediate' | 'Advanced',
        estimatedWeeklyEffort: Math.min(profile.weeklyHours, 14),
        requiredSkills: [primarySkill, secondarySkill, 'DOM Manipulation', 'Git API'],
        proposedSolution: `A browser-native IDE extension & web dashboard that automatically scans code structure, highlights anti-patterns, and generates personalized study schedules based on submission deadlines.`,
        uniqueDifferentiator: `Operates completely client-side with zero external database dependencies, providing zero-latency feedback without exposing student code to third-party cloud servers.`,
        problemStatement: `Engineering students often complete assignments in isolation without peer review feedback until grading day, leading to undetected syntax errors and last-minute crunch work.`,
        targetUsers: ['Undergraduate Computer Science Students', 'Teaching Assistants', 'Coding Bootcamp Learners'],
        mvpFeatures: [
          { id: 'mvp_ed_1', title: 'Static Code Diagnostics Engine', description: 'Parse AST / regex patterns to flag common student coding errors.', isCore: true },
          { id: 'mvp_ed_2', title: 'Sprint Task Matrix', description: 'Visual Kanban board mapping assignment deliverables to weekly study hours.', isCore: true },
          { id: 'mvp_ed_3', title: 'Peer Review Checklists', description: 'Structured rubric template for code reviews.', isCore: false },
        ] as MVPFeature[],
        futureScope: [
          { id: 'fut_ed_1', title: 'Automated Test Generator', description: 'Generate unit tests automatically from function docstrings.' },
        ] as FutureFeature[],
        recommendedStack: [
          { category: 'Frontend', technology: primarySkill.includes('React') ? 'React + TypeScript' : 'HTML5 + JavaScript (ES6)', reason: 'Simple, fast component tree compatible with student skill level.' },
          { category: 'Storage', technology: 'IndexedDB / LocalStorage', reason: 'Persists user benchmarks and peer feedback locally without backend server fees.' },
        ] as RecommendedStackItem[],
        architectureSummary: 'Single-page web application executing client-side static analysis, backed by browser local storage for project persistence.',
        dataHardwareRequirements: {
          primaryDataOrAPI: 'Public GitHub REST API for commit metadata',
          mockAlternative: 'Pre-packaged JSON dataset containing 50+ sample student code submissions',
          hardwareNotes: 'Standard laptop / web browser',
        },
        risks: [
          { risk: 'Browser memory bottleneck when parsing large source files.', impact: 'Low', mitigation: 'Chunk file processing and limit max file size to 2MB.' },
        ] as RiskFactor[],
      },
      {
        domain: 'Healthcare AI & Telemetry',
        title: `Privacy-First Patient Medication Telemetry & Reminder Engine`,
        valueProposition: `A secure, offline-capable health tracker monitoring prescription adherence, symptom logs, and emergency contact alerts.`,
        estimatedDifficulty: 'Intermediate' as const,
        estimatedWeeklyEffort: Math.min(profile.weeklyHours, 16),
        requiredSkills: [primarySkill, 'Async API', 'Local Databases'],
        proposedSolution: `A responsive health dashboard allowing patients to log medication doses, track symptoms over time via interactive graphs, and export encrypted PDF reports for doctors.`,
        uniqueDifferentiator: `Implements Web Crypto API encryption at rest, ensuring sensitive health logs remain private on user devices.`,
        problemStatement: `Elderly and chronic disease patients frequently miss medication schedules or fail to maintain accurate symptom journals for medical consultations.`,
        targetUsers: ['Outpatients with Chronic Conditions', 'Caregivers', 'General Practitioners'],
        mvpFeatures: [
          { id: 'mvp_hl_1', title: 'Medication Schedule & Alarm Manager', description: 'Web notification scheduler for daily dosages.', isCore: true },
          { id: 'mvp_hl_2', title: 'Symptom Severity Logger', description: 'Visual scale input for tracking pain, fatigue, or blood pressure.', isCore: true },
        ] as MVPFeature[],
        futureScope: [
          { id: 'fut_hl_1', title: 'Caregiver Telemetry Sync', description: 'Encrypted WebRTC peer-to-peer data sync between patient and family.' },
        ] as FutureFeature[],
        recommendedStack: [
          { category: 'Frontend', technology: 'React / HTML5 Web App', reason: 'Responsive mobile-friendly interface for easy daily logging.' },
          { category: 'Security', technology: 'Web Crypto API (AES-GCM)', reason: 'Zero-knowledge encryption for health records.' },
        ] as RecommendedStackItem[],
        architectureSummary: 'Client app encrypts data prior to storage in browser IndexedDB with optional WebRTC sync.',
        dataHardwareRequirements: {
          primaryDataOrAPI: 'OpenFDA Drug Interaction API',
          mockAlternative: 'Static JSON dataset of common medication names and standard dosage intervals',
          hardwareNotes: 'Smartphone or tablet with web browser',
        },
        risks: [
          { risk: 'Browser notification permission rejections by user.', impact: 'Medium', mitigation: 'Fallback to visual audio chimes when tab is open.' },
        ] as RiskFactor[],
      },
      {
        domain: 'Sustainability & Green Tech',
        title: `Campus Energy Audit & Footprint Optimization Hub`,
        valueProposition: `An analytics dashboard tracking energy consumption across university buildings, recommending localized efficiency tweaks.`,
        estimatedDifficulty: 'Intermediate' as const,
        estimatedWeeklyEffort: Math.min(profile.weeklyHours, 15),
        requiredSkills: [primarySkill, 'Data Visualization', 'REST API'],
        proposedSolution: `Visual dashboard aggregating electricity, water, and waste metrics across campus labs to identify peak waste hours and award green department badges.`,
        uniqueDifferentiator: `Translates abstract kilowatt-hours into relatable metrics (e.g., 'equivalent to 420 trees planted').`,
        problemStatement: `College campuses consume massive amounts of energy during off-peak hours without visibility into which departments drive excess usage.`,
        targetUsers: ['University Sustainability Officers', 'Campus Facilities Staff', 'Student Green Clubs'],
        mvpFeatures: [
          { id: 'mvp_su_1', title: 'Building Energy Usage Heatmap', description: 'Interactive visual grid of hourly electricity usage.', isCore: true },
          { id: 'mvp_su_2', title: 'Carbon Offset Calculator', description: 'Calculates equivalent CO2 savings from lab shutdown initiatives.', isCore: true },
        ] as MVPFeature[],
        futureScope: [
          { id: 'fut_su_1', title: 'Smart Plug MQTT Sensor Feeds', description: 'Live telemetry integration with smart hardware plugs.' },
        ] as FutureFeature[],
        recommendedStack: [
          { category: 'Frontend', technology: 'React + Chart.js / Recharts', reason: 'Declarative data visualization charts for lab usage analytics.' },
          { category: 'Backend API', technology: 'Python FastAPI / Express.js', reason: 'Fast JSON endpoint processing for time-series energy datasets.' },
        ] as RecommendedStackItem[],
        architectureSummary: 'REST API ingesting hourly energy logs rendering interactive analytics charts on a React web interface.',
        dataHardwareRequirements: {
          primaryDataOrAPI: 'NREL Building Energy Data Exchange API',
          mockAlternative: 'Synthetic CSV energy dataset generated for 10 campus engineering buildings over 12 months',
          hardwareNotes: 'Standard PC',
        },
        risks: [
          { risk: 'Handling missing data entries in energy CSV logs.', impact: 'Low', mitigation: 'Apply linear interpolation for missing hourly records.' },
        ] as RiskFactor[],
      },
      {
        domain: 'Smart Agriculture & Food Tech',
        title: `Micro-Climate Soil Health & Crop Harvest Predictor`,
        valueProposition: `A decision-support tool helping smallholder farmers optimize irrigation and crop selection using micro-climate telemetry.`,
        estimatedDifficulty: 'Intermediate' as const,
        estimatedWeeklyEffort: Math.min(profile.weeklyHours, 16),
        requiredSkills: [primarySkill, 'Data Modeling', 'Mobile UI'],
        proposedSolution: `Web app where farmers enter soil pH, moisture, and local temperature to receive crop suitability recommendations and irrigation schedules.`,
        uniqueDifferentiator: `Provides offline-first PWA caching and multi-language support suited for rural agricultural communities.`,
        problemStatement: `Smallholder farmers lose up to 30% of crop yield due to unguided fertilizer application and inaccurate localized rainfall forecasts.`,
        targetUsers: ['Smallholder Farmers', 'Agricultural Extension Officers', 'Botany Researchers'],
        mvpFeatures: [
          { id: 'mvp_ag_1', title: 'Crop Suitability Matrix', description: 'Matches soil parameters against 25+ regional crops.', isCore: true },
          { id: 'mvp_ag_2', title: 'Irrigation Quantity Calculator', description: 'Daily water requirements based on soil texture and temperature.', isCore: true },
        ] as MVPFeature[],
        futureScope: [
          { id: 'fut_ag_1', title: 'LoRaWAN Moisture Sensor Integration', description: 'Wireless sensor node connections for automated soil readings.' },
        ] as FutureFeature[],
        recommendedStack: [
          { category: 'Frontend', technology: 'React PWA (Progressive Web App)', reason: 'Allows offline usage in fields with poor cellular connectivity.' },
          { category: 'Backend/Logic', technology: 'Python / JavaScript Math Engine', reason: 'Executes agronomic formulas locally.' },
        ] as RecommendedStackItem[],
        architectureSummary: 'Client-side PWA with Service Workers caching offline agricultural lookup tables.',
        dataHardwareRequirements: {
          primaryDataOrAPI: 'Open-Meteo Weather & Soil API',
          mockAlternative: 'Offline JSON soil & crop parameter database',
          hardwareNotes: 'Any mobile browser',
        },
        risks: [
          { risk: 'Inaccurate weather API forecasts for remote coordinates.', impact: 'Medium', mitigation: 'Allow manual override of local rainfall observations.' },
        ] as RiskFactor[],
      },
      {
        domain: 'Accessibility & Assistive Tech',
        title: `Real-Time Audio-Haptic Document Reader for Visually Impaired`,
        valueProposition: `An accessible web tool that converts complex PDF/image documents into structured audio narration and high-contrast tactile UI.`,
        estimatedDifficulty: (profile.experienceLevel === 'advanced' ? 'Advanced' : 'Intermediate') as 'Intermediate' | 'Advanced',
        estimatedWeeklyEffort: Math.min(profile.weeklyHours, 18),
        requiredSkills: ['React Native' in profile.skills || primarySkill.includes('React') ? 'React Native/React' : primarySkill, 'Computer Vision / OCR', 'Web Speech API'],
        proposedSolution: `A clean screen-reader accessible web app that extracts text from camera snapshots or PDFs, formatting it into logical heading hierarchies for audio playback.`,
        uniqueDifferentiator: `Uses Web Speech API + ARIA live regions to navigate tables and code snippets with keyboard shortcuts.`,
        problemStatement: `Visually impaired students struggle to navigate unstructured PDF textbooks and whiteboard photos during lectures.`,
        targetUsers: ['Visually Impaired Students', 'Screen Reader Users', 'Accessibility Advocates'],
        mvpFeatures: [
          { id: 'mvp_ac_1', title: 'Accessible OCR Parser', description: 'Extracts clean text from document photos with voice feedback.', isCore: true },
          { id: 'mvp_ac_2', title: 'High-Contrast Audio Player', description: 'Speed-adjustable speech synthesizer with section skipping.', isCore: true },
        ] as MVPFeature[],
        futureScope: [
          { id: 'fut_ac_1', title: 'Braille Display Bluetooth Output', description: 'Stream parsed text directly to refreshable braille hardware.' },
        ] as FutureFeature[],
        recommendedStack: [
          { category: 'Frontend', technology: 'React / React Native + Web Speech API', reason: 'Native support for ARIA live regions and text-to-speech.' },
          { category: 'OCR Engine', technology: 'Tesseract.js (Client-Side)', reason: 'Performs optical character recognition directly in browser memory.' },
        ] as RecommendedStackItem[],
        architectureSummary: 'Browser loads Tesseract.js WASM module for local image OCR, feeding extracted text into Web Speech API synthesis.',
        dataHardwareRequirements: {
          primaryDataOrAPI: 'Tesseract OCR Engine (Client-Side WASM)',
          mockAlternative: 'Pre-parsed text transcript files for 10 academic textbook chapters',
          hardwareNotes: 'Webcam or smartphone camera',
        },
        risks: [
          { risk: 'Low accuracy on handwriting or blurry camera captures.', impact: 'Medium', mitigation: 'Guide user with audio cues to center document before capture.' },
        ] as RiskFactor[],
      },
      {
        domain: 'Campus Life & Smart Facilities',
        title: `Conflict-Free Student Lab & Equipment Booking System`,
        valueProposition: `A streamlined real-time reservation platform preventing double-bookings and optimizing lab hardware utilization.`,
        estimatedDifficulty: 'Beginner' as const,
        estimatedWeeklyEffort: Math.min(profile.weeklyHours, 12),
        requiredSkills: [primarySkill, 'CRUD Basics', 'UI Design'],
        proposedSolution: `Web app with interactive room maps where students reserve 3D printers, oscilloscopes, or high-performance GPU workstations.`,
        uniqueDifferentiator: `Features automated waitlist queues and quick QR-code check-ins for active reservations.`,
        problemStatement: `College engineering labs suffer from chaotic scheduling, hardware hoarders, and unutilized reserved slots.`,
        targetUsers: ['Capstone Project Students', 'Lab Administrators', 'Faculty Advisors'],
        mvpFeatures: [
          { id: 'mvp_cl_1', title: 'Slot Reservation Calendar', description: 'Conflict-free visual schedule grid for lab hardware.', isCore: true },
          { id: 'mvp_cl_2', title: 'QR Code Check-In Pass', description: 'Generates client-side QR badge for reservation verification.', isCore: true },
        ] as MVPFeature[],
        futureScope: [
          { id: 'fut_cl_1', title: 'Automated Lock Box Integration', description: 'Issue hardware unlock codes upon valid QR scan.' },
        ] as FutureFeature[],
        recommendedStack: [
          { category: 'Frontend', technology: 'React / HTML5', reason: 'Clean declarative calendar grids.' },
          { category: 'Storage/Backend', technology: 'Node.js / Express or LocalStorage', reason: 'Lightweight CRUD handling.' },
        ] as RecommendedStackItem[],
        architectureSummary: 'Single-page web client communicating with RESTful reservation API with atomic slot locks.',
        dataHardwareRequirements: {
          primaryDataOrAPI: 'Department Lab Schedule API',
          mockAlternative: 'Synthetic JSON schedule dataset for 5 campus engineering labs',
          hardwareNotes: 'Standard web browser',
        },
        risks: [
          { risk: 'Double-booking during concurrent user clicks.', impact: 'High', mitigation: 'Enforce single-threaded reservation state updates.' },
        ] as RiskFactor[],
      },
      {
        domain: 'FinTech & Student Financial Health',
        title: `Micro-Budgeting & Student Loan Repayment Simulator`,
        valueProposition: `A financial literacy platform helping college students track daily expenses, simulate loan interest, and plan debt repayment.`,
        estimatedDifficulty: 'Intermediate' as const,
        estimatedWeeklyEffort: Math.min(profile.weeklyHours, 14),
        requiredSkills: [primarySkill, 'Data Visualization', 'Math Calculations'],
        proposedSolution: `Interactive web app where students input tuition loans, part-time income, and living costs to project net worth and post-graduation payoff timelines under various salary scenarios.`,
        uniqueDifferentiator: `Visualizes 'Debt Freedom Date' dynamically as users tweak monthly spending habits.`,
        problemStatement: `College graduates frequently experience financial stress due to lack of clarity surrounding compound loan interest and post-grad budget planning.`,
        targetUsers: ['College Undergraduates', 'Recent Graduates', 'Financial Aid Advisors'],
        mvpFeatures: [
          { id: 'mvp_fn_1', title: 'Amortization & Interest Simulator', description: 'Calculates monthly payment schedules under 5 loan repayment plans.', isCore: true },
          { id: 'mvp_fn_2', title: 'Daily Expense Categorizer', description: 'Log expenses with automatic category totals.', isCore: true },
        ] as MVPFeature[],
        futureScope: [
          { id: 'fut_fn_1', title: 'Plaid Open Banking Sync', description: 'Secure read-only bank transaction imports.' },
        ] as FutureFeature[],
        recommendedStack: [
          { category: 'Frontend', technology: 'React + Recharts', reason: 'Smooth interactive line graphs for multi-year financial projections.' },
          { category: 'Calculations', technology: 'Pure JavaScript Math Utilities', reason: 'Fast client-side financial calculations.' },
        ] as RecommendedStackItem[],
        architectureSummary: 'Client web app running deterministic financial math algorithms in-browser with local state persistence.',
        dataHardwareRequirements: {
          primaryDataOrAPI: 'Federal Student Aid Repayment Rates Data',
          mockAlternative: 'Standard sample loan profiles dataset ($10k-$50k debt brackets)',
          hardwareNotes: 'Standard PC / phone',
        },
        risks: [
          { risk: 'User confusion over complex financial jargon.', impact: 'Medium', mitigation: 'Include interactive tooltips explaining APR, principal, and compound interest.' },
        ] as RiskFactor[],
      },
      {
        domain: 'Small Business & Local Commerce',
        title: `Offline-First POS & Inventory Forecasting for Local Merchants`,
        valueProposition: `A lightweight digital register and stock predictor empowering local campus vendors to manage inventory without costly subscriptions.`,
        estimatedDifficulty: 'Intermediate' as const,
        estimatedWeeklyEffort: Math.min(profile.weeklyHours, 15),
        requiredSkills: [primarySkill, 'PWA', 'Database CRUD'],
        proposedSolution: `Offline web app allowing merchants to log sales, generate receipt PDFs, and receive restock alerts based on moving average sales trends.`,
        uniqueDifferentiator: `Operates 100% offline with zero cloud fees, synchronizing data when internet becomes available.`,
        problemStatement: `Small local shops and campus vendors rely on paper ledgers, causing frequent stock-outs and uncounted revenue leaks.`,
        targetUsers: ['Campus Cafes', 'Bookstore Vendors', 'Local Small Merchants'],
        mvpFeatures: [
          { id: 'mvp_sb_1', title: 'Quick Touch Point-of-Sale Register', description: 'Tap item grid to build cart and calculate change.', isCore: true },
          { id: 'mvp_sb_2', title: 'Inventory Reorder Alerts', description: 'Flags items falling below safety threshold.', isCore: true },
        ] as MVPFeature[],
        futureScope: [
          { id: 'fut_sb_1', title: 'Thermal Receipt Bluetooth Printing', description: 'Connect directly to handheld receipt printers.' },
        ] as FutureFeature[],
        recommendedStack: [
          { category: 'Frontend', technology: 'React / HTML5 PWA', reason: 'Touch-friendly UI optimized for tablets.' },
          { category: 'Storage', technology: 'IndexedDB', reason: 'High capacity offline browser database.' },
        ] as RecommendedStackItem[],
        architectureSummary: 'PWA storing inventory & sales in IndexedDB, computing moving average restock metrics locally.',
        dataHardwareRequirements: {
          primaryDataOrAPI: 'Local CSV Product Catalog',
          mockAlternative: 'Pre-populated 50-item grocery catalog dataset',
          hardwareNotes: 'Tablet or laptop',
        },
        risks: [
          { risk: 'Browser cache clearing wiping local sales data.', impact: 'High', mitigation: 'Provide one-click CSV backup export button on POS header.' },
        ] as RiskFactor[],
      },
    ];

    const matchedTemplates = [...allDomainTemplates].sort((a, b) => {
      const aMatch = a.domain.toLowerCase().includes(preferredDomain.toLowerCase()) ||
        interestsList.some((i) => a.domain.toLowerCase().includes(i.toLowerCase()));
      const bMatch = b.domain.toLowerCase().includes(preferredDomain.toLowerCase()) ||
        interestsList.some((i) => b.domain.toLowerCase().includes(i.toLowerCase()));
      return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
    });

    // Shuffle with randomness to ensure fresh proposal output on regenerate/refresh
    const shuffled = matchedTemplates.sort(() => Math.random() - 0.5);
    const selectedTemplates = shuffled.slice(0, 4);

    return selectedTemplates.map((item, idx) => {
      const recommendedTechs = item.recommendedStack.map((s) => s.technology);
      const breakdown = FeasibilityEngine.calculateFeasibilityBreakdown(
        profile,
        item.requiredSkills,
        item.estimatedDifficulty,
        recommendedTechs
      );
      const innovationScore = FeasibilityEngine.calculateInnovationScore(
        item.domain,
        interestsList,
        item.estimatedDifficulty
      );

      const numWeeks = duration === '1-2 months' ? 6 : duration === '5-6 months' ? 16 : 10;
      const milestones: Milestone[] = [
        {
          week: 1,
          phaseTitle: 'Phase 1: Requirements & System Design',
          deliverable: 'Architecture Spec & Initial UI Layout',
          tasks: [
            `Define target user personas and ${item.domain} workflow specifications.`,
            `Draft relational data schemas or local IndexedDB models.`,
            `Set up codebase repository with strict TypeScript and linter settings.`,
          ],
        },
        {
          week: Math.round(numWeeks * 0.4),
          phaseTitle: 'Phase 2: Core MVP Implementation',
          deliverable: 'Functional End-to-End Core Pipeline',
          tasks: [
            `Build primary UI components for ${item.mvpFeatures[0]?.title || 'Core Feature'}.`,
            `Implement data parsing and business logic engine using ${primarySkill}.`,
            `Integrate local storage persistence and mock data fallback.`,
          ],
        },
        {
          week: Math.round(numWeeks * 0.75),
          phaseTitle: 'Phase 3: Integration & Testing',
          deliverable: 'Tested Application with UI Polish',
          tasks: [
            `Conduct Vitest unit tests for critical business calculation logic.`,
            `Perform usability testing for accessibility and responsive layouts.`,
            `Implement error handling for offline/fallback edge cases.`,
          ],
        },
        {
          week: numWeeks,
          phaseTitle: 'Phase 4: Capstone Brief & Final Report',
          deliverable: 'Deployment & Academic Defense Slides',
          tasks: [
            `Assemble final project documentation report detailing system architecture.`,
            `Deploy application on public host (Vercel / Netlify) and verify live URL.`,
            `Prepare slide deck showcasing feasibility score of ${breakdown.overallScore}/10.`,
          ],
        },
      ];

      const tasks: SprintTask[] = milestones.flatMap((m) =>
        m.tasks.map((tText, tIdx) => ({
          id: `task_${m.week}_${tIdx}_${idx}_${Date.now()}`,
          milestoneWeek: m.week,
          title: tText,
          category: tIdx === 0 ? 'Setup' : tIdx === 1 ? 'Core' : 'Testing',
          completed: false,
        }))
      );

      // Incorporate custom tech stack overrides if specified by student
      const customTech = Array.isArray(profile?.preferredTechStack) ? profile.preferredTechStack.filter(Boolean) : [];
      const mergedStack = [...item.recommendedStack];
      if (customTech.length > 0) {
        customTech.forEach((tech) => {
          if (!mergedStack.some((s) => s.technology.toLowerCase().includes(tech.toLowerCase()))) {
            mergedStack.unshift({
              category: 'Preferred Stack',
              technology: tech,
              reason: 'Directly specified in student career & tech stack preferences.'
            });
          }
        });
      }

      const careerNote = profile?.careerGoal ? ` Aligns with your target career goal: "${profile.careerGoal}".` : '';
      const stackNote = customTech.length > 0 ? ` Integrates your preferred stack (${customTech.join(', ')}).` : '';

      return {
        id: `idea_fallback_${idx + 1}_${Date.now()}`,
        title: item.title,
        valueProposition: item.valueProposition,
        domain: item.domain,
        difficulty: item.estimatedDifficulty,
        estimatedDuration: duration,
        estimatedWeeklyEffort: item.estimatedWeeklyEffort,
        requiredSkills: Array.from(new Set([...item.requiredSkills, ...customTech])),
        innovationScore,
        feasibilityScore: breakdown.overallScore,
        feasibilityBreakdown: breakdown,
        whyItFits: `Directly leverages your skills in ${primarySkill} and aligns with your background (${profile?.degreeBranch || (profile as any)?.major || 'Computer Science'}) within your ${duration} timeframe (${profile?.weeklyHours || 15} hrs/week).${stackNote}${careerNote}`,
        problemStatement: item.problemStatement,
        targetUsers: item.targetUsers,
        proposedSolution: item.proposedSolution,
        uniqueDifferentiator: item.uniqueDifferentiator,
        mvpFeatures: item.mvpFeatures,
        futureScope: item.futureScope,
        recommendedStack: mergedStack,
        architectureSummary: item.architectureSummary,
        dataHardwareRequirements: item.dataHardwareRequirements,
        risks: item.risks,
        milestones,
        tasks,
        blockers: [],
        createdAt: new Date().toISOString(),
        status: 'draft',
        progressPercentage: 0,
        mentorMessages: [
          {
            id: 'msg_welcome_1',
            sender: 'mentor',
            text: `Welcome! I am your ProjectPilot AI Mentor. I have evaluated your profile for "${item.title}". Your Feasibility Score is ${breakdown.overallScore}/10 based on your ${profile?.weeklyHours || 15}h/week commitment. How can I help you get started?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedActions: ['View Feasibility Breakdown', 'Review Phase 1 Setup Tasks', 'Check Tech Stack Choices'],
          },
        ],
        mentorNotes: [
          'Focus on completing the Phase 1 MVP features before adding future scope.',
          'Keep your data models modular to allow easy mock data testing.',
        ],
      };
    });
  },
};
