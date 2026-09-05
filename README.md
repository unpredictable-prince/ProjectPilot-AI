# 🚀 ProjectPilot AI — Student Capstone Idea Engine & Mentor Workspace

> **A Next-Generation AI Recommendation Engine and Mentor Workspace for Student Capstone Projects & Academic Faculty Advisors.**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.x-green.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#license)

---

## 📌 Overview

**ProjectPilot AI** bridges the gap between student capstone requirements and industry-grade software execution. Built for engineering and computer science students as well as department faculty advisors, ProjectPilot AI generates personalized capstone project proposals, calculates algorithmic feasibility scores, provides an interactive AI mentor assistant workspace, and offers faculty real-time telemetry analytics.

---

## ✨ Key Features

### 🎓 For Students
- **Smart Capstone Proposal Generator**: Recommends tailored project ideas based on student skill set, weekly hour budget, project duration, team size, and career goals.
- **Algorithmic Feasibility Engine**: Evaluates proposal feasibility on a 1–10 scale considering skill match, weekly effort limits, and technical complexity.
- **Interactive AI Mentor Workspace**: Real-time mentor assistant equipped with pre-built action chips (*Data Ingestion*, *Architecture Design*, *Optimization Scope*, *Tech Stack Review*).
- **Interactive Architecture & Milestones**: Generates visual component diagrams and step-by-step milestone checklists for project execution.
- **User Profile Management**: In-app account modal for updating degree branch, technical experience level, and student details.
- **Printable Project Briefs**: Export clean, print-ready project specification documents for department approval.

### 🛡️ For Faculty & Department Admins
- **Real-Time Analytics Dashboard**: Monitor student registration counts, active projects, domain distribution, and average feasibility scores.
- **Live AI Request Telemetry**: Live metrics tracking `TOTAL AI REQUESTS`, `TOTAL FALLBACK REQUESTS`, `LAST SUCCESSFUL REQUEST`, and service health status.
- **Account Management**: Faculty view for deactivating/activating student accounts and monitoring capstone execution progress.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript 5, Vanilla CSS Design System, Lucide Icons |
| **Build Tooling** | Vite 6 |
| **AI & LLM Services** | Google Gemini API (`gemini-1.5-flash`) with Server-Side Key Security |
| **Fallback Engine** | Offline Deterministic Proposal Generator & Feasibility Calculator |
| **Testing Suite** | Vitest, React Testing Library |

---

## 🔑 Demo Login Credentials

For local testing and offline demonstrations, use the pre-configured accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student Account** | `student@college.edu` | `Pilot@2026Secure!` |
| **Faculty Admin Account** | `admin@projectpilot.edu` | `AdminPilot#2026!` |

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/unpredictable-prince/ProjectPilot-AI.git
cd ProjectPilot-AI
npm install
```

### 2. Configure Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

> **Note**: If `GEMINI_API_KEY` is not provided, ProjectPilot AI automatically runs using its **Deterministic Offline Fallback Engine** without breaking any UI workflows.

### 3. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173/` in your browser.

---

## 🧪 Testing & Building

### Run Unit Test Suite
```bash
npm test
```

### Run Tests in Single Pass
```bash
npm test -- --run
```

### Build Production Bundle
```bash
npm run build
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.