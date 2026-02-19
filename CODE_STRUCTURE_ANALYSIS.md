# Current Codebase Analysis

## Your Project Structure: Curriculum Companion

### Root Level
```
curriculum-companion/
├── package.json             ← Main dependencies
├── tsconfig.json            ← TypeScript config
├── vite.config.ts           ← Vite bundler config
├── tailwind.config.ts       ← Tailwind CSS config
├── eslint.config.js         ← Linting rules
├── index.html               ← Entry point
├── .env                     ← Environment variables (you'll add tutor vars here)
```

### Frontend Layout: `src/`
```
src/
├── main.tsx                 ← React DOM render
├── App.tsx                  ← Main app component
├── App.css                  ← Global styles
├── index.css                ← Base styles
│
├── components/              ← Reusable UI components
│   ├── AppSidebar.tsx       ← Left sidebar navigation
│   ├── DashboardLayout.tsx  ← Wrapper for dashboard pages
│   ├── NavLink.tsx          ← Navigation links
│   ├── StatCard.tsx         ← Statistics card
│   └── ui/                  ← Shadcn UI components (buttons, dialogs, etc.)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (40+ UI primitives)
│
├── pages/                   ← Route pages
│   ├── Index.tsx            ← Dashboard home
│   ├── Login.tsx            ← Login page
│   ├── NotFound.tsx         ← 404 page
│   ├── admin/               ← Admin pages
│   │   └── ... (admin features)
│   ├── faculty/             ← Faculty pages
│   │   └── ... (faculty features)
│   └── student/             ← STUDENT PAGES (where AI tutor goes)
│       ├── AIAgent.tsx      ← ✅ EXISTING: Text-based AI chat
│       └── [other student features]
│
├── services/                ← API/business logic
│   └── aiService.ts         ← Calls Supabase Edge Function
│
├── contexts/                ← React Context
│   └── AuthContext.tsx      ← Authentication state
│
├── hooks/                   ← Custom React hooks
│   ├── use-mobile.tsx       ← Mobile detection
│   └── use-toast.ts         ← Toast notifications
│
├── integrations/
│   └── supabase/            ← Supabase client setup
│
├── lib/
│   └── utils.ts             ← Utility functions
│
└── test/                    ← Unit tests
```

### Backend Infrastructure
```
supabase/
├── config.toml              ← Supabase local config
├── functions/
│   └── academic-chat/       ← Edge Function (Node.js)
│       └── index.ts         ← Handles AI requests
└── migrations/              ← Database migrations
    ├── 20260217161117_...sql
    └── 20260217161209_...sql
```

### Python ML Backend
```
Academic-Agent-model/
├── api_server.py            ← FastAPI server for RAG
├── ingestion.py             ← Vector DB creation
├── requirements.txt         ← Python dependencies
│
├── models/
│   ├── adaptiveAnswer.py    ← Adaptive tutoring
│   ├── studentModel.py      ← Student progress tracking
│   ├── misconceptionDetector.py
│   ├── topicMapper.py       ← Topic relationships
│   ├── teacherAnalytics.py  ← Analytics
│   ├── integrityGuard.py    ← Academic integrity
│   └── llm.py               ← Local LLM wrapper
│
└── ragQuery/
    └── ragQuery.py          ← Query handler
```

---

## Current AI Implementation

### Flow 1: Supabase Edge Function (Current)
```
Student UI (AIAgent.tsx)
    ↓
fetch("VITE_SUPABASE_URL/functions/v1/academic-chat")
    ↓
Supabase Edge Function (academic-chat/index.ts)
    ↓
OpenAI GPT-4 API (via OPENAI_API_KEY)
    ↓
Response streamed back to UI
```

**Location**: [src/pages/student/AIAgent.tsx](src/pages/student/AIAgent.tsx)

### Flow 2: Local Python RAG (Optional)
```
Python Script
    ↓
Academic-Agent-model/ services
    ↓
Ollama or Transformers (local LLM)
    ↓
FAISS Vector Database
    ↓
Response JSON
```

---

## AI Tutor Demo Structure (What You're Integrating)

```
ai-tutor-demo/src/
├── App.tsx                  ← Main app (split canvas + chat)
├── App.css                  ← Styling
│
├── components/
│   ├── Canvas.tsx           ← tldraw integration (40 lines)
│   ├── Chat.tsx             ← Chat UI with drawing sync (340 lines)
│   └── DiagramView.tsx      ← Mermaid renderer (30 lines)
│
├── services/
│   ├── aiService.ts         ← Groq/OpenAI + drawing commands (360 lines)
│   ├── drawingController.ts ← tldraw editor control (200 lines)
│   ├── speechService.ts     ← Web Speech API (100 lines)
│   ├── elevenLabsService.ts ← Voice synthesis (150 lines)
│   ├── stepSyncController.ts← Step timeline (100 lines)
│   └── preGeneratedTopics.ts← Cached responses (300 lines)
│
└── types/
    └── index.ts             ← TypeScript interfaces (50 lines)
```

---

## What Gets Added After Integration

### New File Structure
```
src/
├── components/
│   └── tutor/               ← ✨ NEW
│       ├── TutorCanvas.tsx
│       ├── TutorChat.tsx
│       └── DiagramRenderer.tsx
│
├── services/
│   └── tutor/               ← ✨ NEW
│       ├── aiService.ts
│       ├── drawingController.ts
│       ├── speechService.ts
│       ├── elevenLabsService.ts
│       ├── stepSyncController.ts
│       └── preGeneratedTopics.ts
│
├── types/
│   └── tutor.ts             ← ✨ NEW (TypeScript interfaces)
│
└── pages/
    └── student/
        └── AITutor.tsx      ← ✨ NEW (route page)
        └── AIAgent.tsx      ← ✅ UNCHANGED
```

### New Dependencies in package.json
```json
{
  "dependencies": {
    "tldraw": "^4.4.0",      ← Canvas library
    "groq-sdk": "^0.37.0",   ← Free LLM provider
    "mermaid": "^11.12.3"    ← Diagram generator
  }
}
```

### New Environment Variables (.env)
```
VITE_GROQ_API_KEY=gsk_...        (free tier)
VITE_OPENAI_API_KEY=sk_...       (paid backup)
VITE_ELEVENLABS_API_KEY=...      (optional)
```

---

## Code Complexity Comparison

### Your Current AIAgent.tsx (195 lines)
```typescript
✅ Simple message-response loop
✅ Text-only interface
✅ Uses Supabase + OpenAI
✅ No external canvas library
```

### AI Tutor Chat.tsx (340 lines)
```typescript
❌ More complex state management (taskBreakdown, currentStep, etc.)
❌ Handles drawing commands in response JSON
❌ Manages voice input/output (Web Speech API)
❌ Step-by-step synchronization with canvas
❌ Pre-generated topic caching
```

**Complexity Increase**: ~1.7x more logic, but well-separated

---

## Key Integration Points

### 1. Student Navigation
**File**: [src/components/AppSidebar.tsx](src/components/AppSidebar.tsx)

Current nav structure:
```
Student
├── Dashboard
├── Courses
├── Assignments
├── AI Agent        ← existing
```

After integration:
```
Student
├── Dashboard
├── Courses
├── Assignments
├── AI Agent        ← existing
├── AI Tutor        ← NEW (with canvas)
```

### 2. Service Layer
**Pattern**: Create new `src/services/tutor/` folder

Current:
```typescript
// src/services/aiService.ts (minimal)
export async function chatWithAI(message: string) {
  return fetch(SUPABASE_FUNCTION_URL...)
}
```

New:
```typescript
// src/services/tutor/aiService.ts (complex)
export async function getAIResponse(message: string, history) {
  // Contains drawing commands, task breakdown, narration, etc.
  return {
    mermaidCode: "...",
    drawCommands: [...],
    explanation: "...",
    narration: "...",
    isNewTopic: true
  }
}
```

### 3. Route Structure
**File**: [vite.config.ts](vite.config.ts)

React Router setup (likely in App.tsx):
```typescript
// Current
<Route path="/student/ai-agent" element={<AIAgent />} />

// After integration
<Route path="/student/ai-tutor" element={<AITutor />} />
<Route path="/student/ai-agent" element={<AIAgent />} /> // unchanged
```

---

## Code Quality Metrics

### Before Integration
- **Bundle Size**: ~850KB (gzipped)
- **Components**: 40+ UI components
- **Services**: AI only
- **Dependencies**: 40+

### After Integration
- **Bundle Size**: ~1.3MB (gzipped) - **+450KB**
- **Components**: 43+ UI components
- **Services**: AI + Tutor services
- **Dependencies**: 43+ (adds tldraw, groq, mermaid)

---

## Thing to Watch For

### ✅ Safe to Add
- New route paths (no conflicts)
- New service folder (isolated)
- New component folder (isolated)
- Dependencies (no conflicts)

### ⚠️ Be Careful With
- CSS global styles (merge carefully)
- TypeScript types (use `tutor.*` namespace)
- Import paths (use absolute paths from `@/`)

### ❌ Don't Touch
- Existing `AIAgent.tsx`
- `supabase/functions/`
- `Academic-Agent-model/`
- Existing routes

---

## Removal Checklist (Post-Testing)

- [ ] Delete `src/components/tutor/` folder
- [ ] Delete `src/services/tutor/` folder
- [ ] Delete `src/pages/student/AITutor.tsx`
- [ ] Remove route from student routing
- [ ] Remove from sidebar navigation
- [ ] Delete `src/types/tutor.ts`
- [ ] Run `npm install` to clean node_modules (optional)
- [ ] Git commits to document test phase

---

## Files You Can Keep / Reuse

Even after removal, these remain useful:
- `tldraw` library (for other visual features)
- `groq-sdk` (fallback AI provider)
- `mermaid` (diagram generation elsewhere)

So you could selectively keep dependencies and remove only code.

