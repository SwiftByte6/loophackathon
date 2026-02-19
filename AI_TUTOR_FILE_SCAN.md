# AI Tutor Demo - File-by-File Scan & Import Details

## Files to Port (1,250 total lines)

### 1. **Types & Interfaces** (50 lines)
📄 **Source**: `ai-tutor-demo/src/types/index.ts`  
📍 **Destination**: `src/types/tutor.ts`  
🔗 **Dependencies**: None

**Exports**:
```typescript
Message             // Chat message interface
DrawCommand         // Canvas drawing instruction
AIResponse          // AI response with drawings
TutorState          // Tutor UI state (listening, speaking, processing)
MermaidResponse     // Diagram response interface
```

**Key Interfaces**:
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DrawCommand {
  type: 'circle' | 'rectangle' | 'arrow' | 'text' | 'line' | 'freehand';
  x: number;
  y: number;
  props?: { w?, h?, radius?, text?, color?, start?, end?, points? };
}

interface AIResponse {
  explanation: string;
  drawCommands?: DrawCommand[];
  narration?: string;
}

interface TutorState {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}
```

**Changes Needed**: None - just copy as-is

---

### 2. **AI Service** (360 lines) ⭐ CORE
📄 **Source**: `ai-tutor-demo/src/services/aiService.ts`  
📍 **Destination**: `src/services/tutor/aiService.ts`  
🔗 **Dependencies**: 
  - `openai` (already in package.json)
  - `groq-sdk` (NEW - needs npm install)

**Exports**:
```typescript
getAIResponse()           // Get response with drawing commands
getMermaidResponse()      // Get mermaid diagram
isAPIKeyConfigured()      // Check API key exists
resetTopicContext()       // Clear topic tracking
getCurrentTopic()         // Get current topic
```

**What It Does**:
1. Initializes OpenAI (primary) and Groq (fallback) clients
2. Sends user message with system prompt for drawing instructions
3. Parses JSON response with drawing commands
4. Falls back to Groq if OpenAI fails
5. Generates Mermaid diagrams as alternative

**System Prompt Includes**:
- Canvas dimensions (800x600)
- Drawing zones (TOP, UPPER, MIDDLE, LOWER)
- Color scheme (blue, green, red, orange, black, violet)
- Shape constraints (circle radius 35-50, etc.)

**API Keys Required**:
```
VITE_OPENAI_API_KEY       (gpt-4o-mini)
VITE_GROQ_API_KEY         (llama-3.3-70b-versatile)
```

**Changes Needed**:
```typescript
// Change imports to absolute paths
- import type { AIResponse } from '../types';
+ import type { AIResponse, MermaidResponse, DrawCommand } from '@/types/tutor';
```

---

### 3. **Drawing Controller** (200 lines)
📄 **Source**: `ai-tutor-demo/src/services/drawingController.ts`  
📍 **Destination**: `src/services/tutor/drawingController.ts`  
🔗 **Dependencies**: `tldraw` (NEW - needs npm install)

**Exports**:
```typescript
drawingController   // Singleton object
```

**Key Methods**:
```typescript
setEditor(editor: Editor)
clearCanvas()
executeDrawCommand(command: DrawCommand)
pauseExecution()
resumeExecution()
setDrawingSpeed(speed: number)
getDrawingSpeed(): number
```

**What It Does**:
- Manages tldraw editor instance
- Converts drawing commands to tldraw shapes
- Controls drawing speed for step-by-step animation
- Clears canvas between responses

**Important**: 
- Uses tldraw's internal API to create shapes
- Manages animation queue for step-by-step execution

**Changes Needed**:
```typescript
// Update imports
- import { Editor } from 'tldraw';
+ import { Editor } from 'tldraw';
  (same - no change needed)
```

---

### 4. **Speech Recognition Service** (100 lines)
📄 **Source**: `ai-tutor-demo/src/services/speechService.ts`  
📍 **Destination**: `src/services/tutor/speechService.ts`  
🔗 **Dependencies**: Web Speech API (browser native, free)

**Exports**:
```typescript
speechService    // Singleton object
```

**Key Methods**:
```typescript
startListening(onResult: (text: string) => void)
stopListening()
isListening(): boolean
```

**What It Does**:
- Captures user voice input via browser's Web Speech API
- Converts speech to text
- No backend required (runs in browser)
- Calls callback with recognized text

**Requirements**:
- Browser support (Chrome, Edge, Safari)
- User microphone permission
- Works offline

**Changes Needed**: None - copy as-is

---

### 5. **ElevenLabs Voice Service** (150 lines)
📄 **Source**: `ai-tutor-demo/src/services/elevenLabsService.ts`  
📍 **Destination**: `src/services/tutor/elevenLabsService.ts`  
🔗 **Dependencies**: None (HTTP fetch)

**Exports**:
```typescript
elevenLabsService    // Singleton object
```

**Key Methods**:
```typescript
speak(text: string, onFinish: () => void)
stop()
isSpeaking(): boolean
```

**What It Does**:
- Sends text to ElevenLabs API
- Synthesizes natural-sounding speech
- Plays audio automatically
- Calls callback when done

**API Key Required**:
```
VITE_ELEVENLABS_API_KEY
```

**Pricing**: 
- Free tier: 10,000 characters/month
- Paid: ~$5-10/month for heavy use

**Changes Needed**: None - copy as-is

---

### 6. **Step Sync Controller** (100 lines)
📄 **Source**: `ai-tutor-demo/src/services/stepSyncController.ts`  
📍 **Destination**: `src/services/tutor/stepSyncController.ts`  
🔗 **Dependencies**: None

**Exports**:
```typescript
stepSyncController   // Singleton object
```

**Key Methods**:
```typescript
syncSteps(steps: string[])
getCurrentStep(): number
nextStep(): boolean
previousStep(): boolean
reset()
isCompleted(): boolean
```

**What It Does**:
- Tracks user progress through task steps
- Highlights current step in UI
- Prevents skipping ahead
- Synchronizes canvas drawing with steps

**Changes Needed**: None - copy as-is

---

### 7. **Pre-Generated Topics** (300 lines)
📄 **Source**: `ai-tutor-demo/src/services/preGeneratedTopics.ts`  
📍 **Destination**: `src/services/tutor/preGeneratedTopics.ts`  
🔗 **Dependencies**: None

**Exports**:
```typescript
findPreGeneratedTopic(userInput: string)
getQuickPrompts()
```

**What It Does**:
- Caches pre-computed responses for common topics
- Provides instant responses without API calls
- Includes ~20 popular topics:
  - "Explain Newton's Laws"
  - "What is photosynthesis"
  - "How does gravity work"
  - "Explain DNA structure"
  - etc.

**Structure**:
```typescript
const preGeneratedTopics = [
  {
    keywords: ["newton", "laws", "motion"],
    response: {
      explanation: "...",
      narration: "...",
      taskBreakdown: ["Step 1...", "Step 2..."],
      drawCommands: [...]
    }
  }
]
```

**Benefits**:
- 0ms response time for common questions
- No API rate limits for these queries
- Always consistent answers

**Changes Needed**: None - copy as-is

---

### 8. **Chat Component** (340 lines)
📄 **Source**: `ai-tutor-demo/src/components/Chat.tsx`  
📍 **Destination**: `src/pages/student/AITutorChat.tsx`  
🔗 **Dependencies**: All services above

**Props**:
```typescript
interface ChatProps {
  tutorState: TutorState;
  setTutorState: (state: TutorState) => void;
  viewMode: ViewMode;  // 'canvas' | 'diagram'
  onDiagramGenerated: (code: string) => void;
}
```

**Features**:
- Message history
- Task breakdown display
- Step-by-step progression
- Voice input button
- Quick prompt buttons
- Mode toggle (canvas/diagram)
- ElevenLabs voice output

**State Managed**:
```typescript
messages[]          // Chat history
input              // Current input text
taskBreakdown[]    // Steps for current task
currentStep        // Which step user is on
conversationHistory // For AI context
```

**Key Flows**:
1. User types/speaks question
2. Sends to AI service
3. Gets response with drawing commands
4. Displays in canvas or diagram
5. Plays voice narration

**Changes Needed**:
```typescript
// Update imports to absolute paths
- import { getAIResponse, ... } from '../services/aiService';
+ import { getAIResponse, ... } from '@/services/tutor/aiService';

// Update types import
- import type { ViewMode } from '../App';
+ import type { ViewMode } from '@/types/tutor';
```

---

### 9. **Canvas Component** (40 lines)
📄 **Source**: `ai-tutor-demo/src/components/Canvas.tsx`  
📍 **Destination**: `src/components/tutor/TutorCanvas.tsx`  
🔗 **Dependencies**: `tldraw`

**Props**:
```typescript
interface CanvasProps {
  onEditorReady?: (editor: Editor) => void;
}
```

**What It Does**:
- Renders tldraw whiteboard
- Registers editor with drawingController
- Provides UI for user to draw alongside AI

**Simple Component**:
```tsx
<Tldraw
  onMount={(editor) => {
    drawingController.setEditor(editor);
    onEditorReady?.(editor);
  }}
  hideUi={false}
/>
```

**Changes Needed**:
```typescript
// Update imports
- import { drawingController } from '../services/drawingController';
+ import { drawingController } from '@/services/tutor/drawingController';
```

---

### 10. **Diagram View Component** (30 lines)
📄 **Source**: `ai-tutor-demo/src/components/DiagramView.tsx`  
📍 **Destination**: `src/components/tutor/DiagramRenderer.tsx`  
🔗 **Dependencies**: `mermaid`

**Props**:
```typescript
interface DiagramViewProps {
  mermaidCode: string;
}
```

**What It Does**:
- Takes mermaid code string
- Renders as SVG diagram
- Auto-updates when code changes
- Handles rendering errors

**Changes Needed**:
```typescript
// Just copy as-is, no import changes
```

---

## Integration Changes Summary

### Import Path Changes (Template)
Every imported file needs this pattern:
```typescript
// BEFORE
import X from '../services/...'
import Y from '../components/...'

// AFTER  
import X from '@/services/tutor/...'
import Y from '@/components/tutor/...'
import type { ... } from '@/types/tutor'
```

### Dependencies to Add
```bash
npm install tldraw groq-sdk mermaid
```

### File Structure After
```
src/
├── services/
│   └── tutor/
│       ├── aiService.ts (360)
│       ├── drawingController.ts (200)
│       ├── speechService.ts (100)
│       ├── elevenLabsService.ts (150)
│       ├── stepSyncController.ts (100)
│       └── preGeneratedTopics.ts (300)
├── components/
│   └── tutor/
│       ├── TutorCanvas.tsx (40)
│       ├── DiagramRenderer.tsx (30)
│       └── [Chat stays in pages]
├── pages/
│   └── student/
│       └── AITutorChat.tsx (340+)
├── types/
│   └── tutor.ts (50)
└── [rest of app unchanged]
```

---

## Key Compatibility Notes

### ✅ No Conflicts
- New services in separate `tutor/` folder
- New types in separate `tutor.ts` file
- New route isolated from existing routes
- All dependencies are add-only

### ⚠️ Shared Dependencies  
- React (both use same version)
- TypeScript (both use ~5.9)
- These are fine

### ❌ Potential Issues
- tldraw adds ~500KB to bundle
- Groq free tier has rate limits (30 requests/minute)
- ElevenLabs requires separate API key
- tldraw learning curve (it's a big library)

---

## Line Count Reference

| File | Lines | Category |
|------|-------|----------|
| types/index.ts | 50 | Types |
| services/aiService.ts | 360 | Core Logic |
| services/drawingController.ts | 200 | Canvas |
| services/speechService.ts | 100 | Audio |
| services/elevenLabsService.ts | 150 | Audio |
| services/stepSyncController.ts | 100 | Logic |
| services/preGeneratedTopics.ts | 300 | Data |
| components/Chat.tsx | 340 | UI |
| components/Canvas.tsx | 40 | UI |
| components/DiagramView.tsx | 30 | UI |
| **TOTAL** | **1,670** | |

Plus styling (~200 lines for App.css merge)

---

## Testing Criteria for Each File

### aiService.ts
- [ ] Groq fallback works
- [ ] Drawing commands parse correctly
- [ ] Mermaid code sanitizes properly
- [ ] Topic context tracking works

### drawingController.ts
- [ ] Shapes appear on canvas
- [ ] Animation speed control works
- [ ] Clear canvas empties editor
- [ ] No memory leaks on repeated draws

### Chat.tsx (AITutorChat.tsx)
- [ ] Messages send and receive
- [ ] Task breakdown displays
- [ ] Steps sync with canvas
- [ ] Mode toggle works (canvas/diagram)

### Canvas.tsx (TutorCanvas.tsx)
- [ ] tldraw renders without errors
- [ ] User can draw manually
- [ ] AI drawings overlay properly

### speechService.ts
- [ ] Microphone accessed on first use
- [ ] Speech recognized correctly
- [ ] Transcription appears in input

### elevenLabsService.ts (if API key provided)
- [ ] Audio plays successfully
- [ ] Callback triggers when done
- [ ] Text pronunciations are natural

