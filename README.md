# 🎓 Academic AI (Curriculum Companion)

> **An AI-powered academic companion designed to personalize student learning, prevent cheating, and provide deep analytics to educators.**

Built natively to eliminate the "one size fits all" approach to education by using a highly specialized, local Retrieval-Augmented Generation (RAG) pipeline combined with an adaptive LLM.

---

## 🚀 The Problem
Modern education faces three critical challenges:
1. **Lack of Personalization:** Students fall behind because standard curricula cannot adapt to their unique misconceptions or learning pace.
2. **Academic Integrity:** With the rise of generalized LLMs (like ChatGPT), students often use AI to bypass reasoning rather than enhance it. 
3. **Teacher Blindspots:** Educators lack real-time visibility into *exactly* what concepts their class is struggling to grasp.

## 💡 Our Solution
**Academic AI** is an intelligent ecosystem split into three distinct dashboards (Student, Faculty, Admin), powered by a secure FastAPI + FAISS vector database backend. 

### Key Features
* 🧠 **Adaptive AI Tutor:** Unlike normal chatbots, our AI specifically fetches the student's *past misconceptions* and forces the LLM to explain concepts simply and address past mistakes.
* 🛡️ **Integrity Guard:** The system actively intercepts prompt-injection or "do my homework" requests, pushing the student back to Socratic learning.
* 📊 **Faculty Analytics (Topic Mapper):** AI automatically clusters student questions to show teachers exactly which textbook topics need more attention in the next lecture.
* ⚡ **Local RAG Pipeline:** PDF textbooks are ingested, semantic-chunked using `langchain`, and securely embedded using local `SentenceTransformers`—ensuring no proprietary university data leaks to third parties.

---

## 🏗️ Technical Architecture

Our project applies a **Modular Monolith / Microservice** structure:

* **Frontend:** React 18, Vite, Tailwind CSS, Shadcn UI, Recharts for analytics.
* **Backend:** FastAPI (Python) for asynchronous AI routing and logic.
* **Database & Auth:** Supabase (PostgreSQL + JWT Authentication).
* **Vector Engine:** FAISS (Facebook AI Similarity Search) running locally for sub-millisecond document retrieval context mapping.
* **Embedding Model:** `sentence-transformers/static-retrieval-mrl-en-v1` (Running locally on CPU constraint).
* **LLM Engine:** OpenRouter API routing to `arcee-ai/trinity-large-preview:free` for fast, intelligent inference.

---

## ⚙️ How to Run Locally

Because this system relies on a local Vector DB and a Python backend, follow these steps closely.

### 1. Clone & Environment Setup
Clone the repository and install the frontend dependencies:
```bash
npm install
```

Create a `.env` file in the root directory and add your keys:
```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
OPENROUTER_API_KEY="sk-or-your-key-here"
```

### 2. Setup the AI Backend
Navigate into the Python model directory and install dependencies:
```bash
cd Academic-Agent-model
pip install -r requirements.txt
```

### 3. Ingest Data (Build Vector DB)
*Place any sample educational PDFs inside `Academic-Agent-model/data/raw_pdfs`.*
Run the ingestion script to chunk the text and create the FAISS index:
```bash
python ingestion.py
```

### 4. Run the Full Stack
We have configured a concurrent script to launch both the React Frontend and the FastAPI backend simultaneously!
Go back to the root directory and run:
```bash
npm run dev:all
```

* **Frontend:** `http://localhost:5173`
* **FastAPI Backend:** `http://localhost:8000`

---

## 🔮 What's Next?
* **Audio Voice Companion:** Integrating Whisper (Speech-to-Text) and ElevenLabs (Text-to-Speech) for fully hands-free tutoring sessions.
* **Direct Canvas/Blackboard Integration:** Pulling assignment due dates and syllabus PDFs automatically via LTI standards.
* **pgvector Migration:** Moving from the local FAISS pickle store directly into Supabase `pgvector` for horizontal scaling across hundreds of campuses.
