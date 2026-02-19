# Curriculum Companion

React + Vite app for a university learning platform with student, faculty, and admin dashboards. The AI features are split between a Supabase Edge Function (live chat in the app) and a standalone Python RAG pipeline (Academic-Agent-model).

## App structure

- Frontend routes and dashboards live under [src/pages](src/pages).
- The student AI chat UI is in [src/pages/student/AIAgent.tsx](src/pages/student/AIAgent.tsx).
- The AI request handler is a Supabase Edge Function in [supabase/functions/academic-chat/index.ts](supabase/functions/academic-chat/index.ts).
- The standalone academic agent RAG pipeline lives in [Academic-Agent-model](Academic-Agent-model).

## Where the models are required

### 1) Live AI chat (in-app)

**Used by:** Student AI chat UI and Edge Function.

- UI sends requests to the Edge Function: [src/pages/student/AIAgent.tsx](src/pages/student/AIAgent.tsx)
- Edge Function calls the AI gateway and sets the system policy: [supabase/functions/academic-chat/index.ts](supabase/functions/academic-chat/index.ts)

**Model used:** `gpt-4-turbo` (via OpenAI API)

**Required configuration:**

- `OPENAI_API_KEY` in the Edge Function environment
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the frontend environment

**Notes:**

- This path enforces academic integrity rules inside the system prompt.
- Streaming is enabled and handled in the client.

### 2) Academic-Agent-model (standalone Python RAG)

**Used by:** CLI scripts for ingestion, retrieval, adaptive tutoring, and analytics.

Core files:

- Ingest PDFs and build vector DB: [Academic-Agent-model/ingestion.py](Academic-Agent-model/ingestion.py)
- Query loop with integrity checks and adaptive answer flow: [Academic-Agent-model/ragQuery/ragQuery.py](Academic-Agent-model/ragQuery/ragQuery.py)
- Local LLM wrapper: [Academic-Agent-model/models/llm.py](Academic-Agent-model/models/llm.py)
- Adaptive tutoring logic: [Academic-Agent-model/models/adaptiveAnswer.py](Academic-Agent-model/models/adaptiveAnswer.py)
- Misconception detection: [Academic-Agent-model/models/misconceptionDetector.py](Academic-Agent-model/models/misconceptionDetector.py)
- Student mastery tracking: [Academic-Agent-model/models/studentModel.py](Academic-Agent-model/models/studentModel.py)
- Topic mapping: [Academic-Agent-model/models/topicMapper.py](Academic-Agent-model/models/topicMapper.py)
- Teacher analytics: [Academic-Agent-model/models/teacherAnalytics.py](Academic-Agent-model/models/teacherAnalytics.py)
- Integrity guard: [Academic-Agent-model/models/integrityGuard.py](Academic-Agent-model/models/integrityGuard.py)

**Models used:**

- Sentence embedding: `sentence-transformers/static-retrieval-mrl-en-v1`
- Local LLM: `TinyLlama/TinyLlama-1.1B-Chat-v1.0`

**Required inputs and data:**

- PDFs at `Academic-Agent-model/data/raw_pdfs`
- Vector DB output at `Academic-Agent-model/vector_db` (creates `index.faiss` and `documents.pkl`)
- Student state at `Academic-Agent-model/data/student_db.json`

**Dependencies (Python):**

- `sentence-transformers`, `faiss`, `pypdf`, `transformers`, `torch`, `numpy`, `langchain-text-splitters`

**Notes:**

- This pipeline is currently standalone and not wired into the React app or the Supabase Edge Function.
- Run ingestion before running the query loop so the vector DB exists.

## Development

```sh
npm install
npm run dev
```

## Connect the model to the app (local)

1) Install Python dependencies:

```sh
pip install -r Academic-Agent-model/requirements.txt
```

2) Build the vector DB first:

```sh
python Academic-Agent-model/ingestion.py
```

3) Start the local API server:

```sh
python -m uvicorn Academic-Agent-model.api_server:app --reload --port 8000
```

4) Point the frontend to the local server:

- Set `VITE_AI_CHAT_URL=http://localhost:8000/chat`
- Restart `npm run dev`

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui
- Supabase (Edge Functions)
