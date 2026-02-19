# AI Tutor Demo Integration Plan

## Project Overview

### Current Project: Curriculum Companion
- **Type**: University learning platform  
- **Stack**: React + Vite + TypeScript + Supabase + Shadcn UI
- **Features**: Student/Faculty/Admin dashboards, RAG-based Academic Agent, text-based AI chat
- **AI**: OpenAI GPT-4 via Supabase Edge Functions + Python RAG pipeline
- **Architecture**: Dashboard-based, modular pages

### Source Project: AI Tutor Demo
- **Type**: Interactive AI tutor with real-time visualizations
- **Stack**: React + Vite + TypeScript + tldraw + Groq/OpenAI
- **Features**: Canvas drawing, voice I/O, step-by-step explanations, mermaid diagrams
- **Key Innovation**: Real-time visual explanations while explaining concepts
- **Architecture**: Split view (Canvas + Chat)

---

## Integration Scope

### Phase 1: Dependency Analysis
**Dependencies to Add:**
```
tldraw ^4.4.0          ← Canvas library for real-time drawing
groq-sdk ^0.37.0       ← Free LLM provider (Groq fallback)
mermaid ^11.12.3       ← Diagram generation
```

**Already Compatible:**
- React, Vite, TypeScript (both use same versions)
- Core UI patterns (both use React state management)
- Both have TypeScript support ready

### Phase 2: Components to Port

#### Canvas System
- **Source**: `ai-tutor-demo/src/components/Canvas.tsx`
- **Destination**: `src/components/TutorCanvas.tsx` (avoid conflicts)
- **Size**: ~40 lines
- **Dependencies**: tldraw, drawingController service
- **Integration Point**: Add as optional student view tab

#### Chat Enhancement  
- **Source**: `ai-tutor-demo/src/components/Chat.tsx`
- **Destination**: Create `src/pages/student/AITutorChat.tsx`
- **Size**: ~340 lines
- **Dependencies**: aiService, speechService, elevenLabsService, stepSyncController, preGeneratedTopics
- **Integration Point**: Alongside existing AIAgent.tsx

#### Diagram Viewer
- **Source**: `ai-tutor-demo/src/components/DiagramView.tsx`
- **Destination**: `src/components/MermaidDiagram.tsx`
- **Size**: ~30 lines
- **Dependencies**: mermaid library
- **Integration Point**: Could enhance existing AI responses

### Phase 3: Services to Port

| Service | Lines | Purpose | Status |
|---------|-------|---------|--------|
| `aiService.ts` | ~360 | Groq/OpenAI with drawing commands | Core logic |
| `drawingController.ts` | ~200 | Manages tldraw editor + drawing commands | Required |
| `speechService.ts` | ~100 | Web Speech API voice input | Enhancement |
| `elevenLabsService.ts` | ~150 | ElevenLabs voice (optional - requires key) | Enhancement |
| `stepSyncController.ts` | ~100 | Step-by-step synchronization | Enhancement |
| `preGeneratedTopics.ts` | ~300 | Pre-cached topics for instant response | Enhancement |
| `types/index.ts` | ~50 | TypeScript interfaces | Required |

**Total Code to Port**: ~1,250 lines

### Phase 4: Routes & Navigation

**Add New Route:**
```
/student/ai-tutor   ← AI Tutor with canvas + chat
```

**Existing Route:**
```
/student/ai-agent   ← Keep existing text-based chat (unmodified)
```

**Switch Structure:**
- Add navigation switch in student dashboard
- Keep both systems running in parallel
- This allows A/B testing and gradual migration

### Phase 5: Environment Configuration

**Add to `.env`:**
```
VITE_GROQ_API_KEY=your_groq_key        (free option)
VITE_OPENAI_API_KEY=your_openai_key    (backup)
VITE_ELEVENLABS_API_KEY=your_key       (optional, for voice)
```

**Note:** Groq is FREE tier friendly; OpenAI is paid but more reliable

---

## Implementation Steps

### Step 1: Install Dependencies (5 min)
```bash
npm install tldraw groq-sdk mermaid
```

### Step 2: Create Types File (10 min)
- Copy `ai-tutor-demo/src/types/index.ts` → `src/types/tutor.ts`
- Add exports to avoid conflicts

### Step 3: Port Services (30 min)
```
src/services/tutor/
  ├── aiService.ts          (AI logic + Groq integration)
  ├── drawingController.ts   (Canvas drawing)
  ├── speechService.ts       (Voice input)
  ├── elevenLabsService.ts   (Voice output)
  ├── stepSyncController.ts  (Step sync)
  └── preGeneratedTopics.ts  (Cached responses)
```

### Step 4: Port Components (30 min)
```
src/components/tutor/
  ├── TutorCanvas.tsx        (tldraw integration)
  ├── TutorChat.tsx          (chat with drawing)
  └── DiagramRenderer.tsx    (mermaid display)

src/pages/student/
  └── AITutor.tsx            (new route container)
```

### Step 5: Create New Route (10 min)
- Add route in existing student routes
- Add sidebar navigation option

### Step 6: Test (20 min)
- Test canvas drawing
- Test chat with AI
- Test voice features (if API keys available)
- Test diagram rendering
- Verify no conflicts with existing AIAgent

### Step 7: Cleanup (Removal - 10 min)
- Delete `src/components/tutor/` folder
- Delete `src/services/tutor/` folder
- Delete `src/pages/student/AITutor.tsx`
- Remove route from navigation
- Keep dependencies (can be used elsewhere)
- Remove env vars

---

## File-by-File Mapping

### To Port:
```
FROM: ai-tutor-demo/src/
TO:   src/

components/
  Canvas.tsx           →  components/tutor/TutorCanvas.tsx
  Chat.tsx             →  pages/student/AITutorChat.tsx
  DiagramView.tsx      →  components/tutor/DiagramRenderer.tsx

services/
  aiService.ts         →  services/tutor/aiService.ts
  drawingController.ts →  services/tutor/drawingController.ts
  speechService.ts     →  services/tutor/speechService.ts
  elevenLabsService.ts →  services/tutor/elevenLabsService.ts
  stepSyncController.ts→  services/tutor/stepSyncController.ts
  preGeneratedTopics.ts→  services/tutor/preGeneratedTopics.ts

types/
  index.ts             →  types/tutor.ts

App.css              →  [merge into] styles/tutor.css or App.css
index.css            →  [merge into] global index.css
```

### Import Changes Needed:
```typescripterror
// From relative paths like:
import { Canvas } from './components/Canvas';

// To absolute paths like:
import { TutorCanvas } from '@/components/tutor/TutorCanvas';
```

---

## Testing Checklist

### Functional Tests
- [ ] Canvas renders without errors
- [ ] Drawing commands execute properly
- [ ] Chat sends messages to AI
- [ ] AI returns valid JSON responses
- [ ] Drawing syncs with chat steps
- [ ] Diagram mode generates mermaid code
- [ ] Voice input captures speech (if configured)
- [ ] Voice output plays (if configured)

### Integration Tests
- [ ] No conflicts with existing AIAgent page
- [ ] Navigation switches between modes
- [ ] Responsive on mobile
- [ ] Styling matches design system

### Performance Tests
- [ ] Canvas doesn't lag with drawings
- [ ] Chat responses stream properly
- [ ] DOM doesn't have memory leaks
- [ ] Bundle size impact: ~+500KB

---

## Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Install dependencies | 5 min |
| 2 | Port types & interfaces | 10 min |
| 3 | Port services | 30 min |
| 4 | Port components | 30 min |
| 5 | Create route & navigation | 10 min |
| 6 | Testing & debugging | 30 min |
| **Total** | | **~2 hours** |

---

## Removal Steps (Post-Testing)

1. Delete entire `src/components/tutor/` directory
2. Delete entire `src/services/tutor/` directory
3. Delete `src/pages/student/AITutor.tsx`
4. Remove route from student navigation
5. Remove from sidebar/menu
6. Delete `src/types/tutor.ts` if not needed elsewhere
7. `.env` cleanup (optional - can keep for future)
8. Consider keeping dependencies (reusable)

**Removal time: ~10 minutes**

---

## Key Considerations

### ✅ Advantages of Integration
- Real-time visual explanations
- Voice I/O capability
- Step-by-step learning
- Can fallback to free Groq API
- Doesn't break existing AI chat

### ⚠️ Challenges
- Additional dependencies (+500KB bundle)
- tldraw has a learning curve
- ElevenLabs requires paid API key
- Groq free tier has rate limits
- Voice features need browser permissions

### 🎯 Success Criteria
- Canvas renders smoothly
- AI responses with drawing commands work
- No conflicts with existing features
- Clean removal after testing

---

## Next Steps

1. **Confirm Plan** - Review this document
2. **Proceed with Implementation** - Run Phase 1-7 sequentially
3. **Document Results** - Create TEST_RESULTS.md
4. **Make Cleanup Decision** - Keep or remove based on testing outcome

