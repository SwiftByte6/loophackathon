# Starter Setup Guide

Use this guide to run the web app and connect it to the local Academic-Agent model.

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+

## 1) Install frontend dependencies

```sh
npm install
```

## 2) Frontend environment

Create a .env file in the repo root with:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
# Optional override to use the local Academic-Agent model server
VITE_AI_CHAT_URL=http://localhost:8000/chat
```

## 3) Run the app

```sh
npm run dev
```

The app runs at http://localhost:5173

## 4) Install Academic-Agent-model dependencies

```sh
pip install -r Academic-Agent-model/requirements.txt
```

## 5) Prepare model data

1. Put your PDFs here:
	- Academic-Agent-model/data/raw_pdfs
2. Build the vector DB:

```sh
python Academic-Agent-model/ingestion.py
```

This generates:
- Academic-Agent-model/vector_db/index.faiss
- Academic-Agent-model/vector_db/documents.pkl

## 6) Start the local model API

```sh
python -m uvicorn Academic-Agent-model.api_server:app --reload --port 8000
```

## 7) Verify the model connection

- Keep the app running
- Open the student AI chat page and send a message
- If VITE_AI_CHAT_URL is set, the UI uses the local model server

## Common issues

- Vector DB missing: run ingestion.py before starting the API server
- CORS error: ensure the app is running on http://localhost:5173
- Empty answers: check that your PDFs contain extractable text
