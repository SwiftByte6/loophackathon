import json
import os
from typing import Generator, List, Optional

import faiss
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

from models.adaptiveAnswer import generate_adaptive_answer
from models.integrityGuard import integrity_response, violates_integrity
from models.studentModel import get_misconceptions
from models.topicMapper import extract_topic
from models.llm_model import get_model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VECTOR_DB_PATH = os.path.join(BASE_DIR, "vector_db")
INDEX_PATH = os.path.join(VECTOR_DB_PATH, "index.faiss")
DOC_PATH = os.path.join(VECTOR_DB_PATH, "documents.pkl")

app = FastAPI(title="Academic Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    mode: Optional[str] = None


def load_vector_db():
    if not os.path.exists(INDEX_PATH) or not os.path.exists(DOC_PATH):
        return None, None

    index = faiss.read_index(INDEX_PATH)

    with open(DOC_PATH, "rb") as f:
        documents = json.load(f) if DOC_PATH.endswith(".json") else None

    if documents is None:
        import pickle

        with open(DOC_PATH, "rb") as f:
            documents = pickle.load(f)

    return index, documents


_index = None
_documents = None

def get_vector_db():
    global _index, _documents
    if _index is None or _documents is None:
        _index, _documents = load_vector_db()
    return _index, _documents

def retrieve_context(query: str, top_k: int = 3) -> List[str]:
    index, documents = get_vector_db()
    model = get_model()
    
    if index is None or documents is None:
        return []

    query_embedding = model.encode([query], normalize_embeddings=True)
    query_embedding = np.array(query_embedding).astype("float32")

    distances, indices = index.search(query_embedding, top_k)

    results = []
    for idx in indices[0]:
        results.append(documents[idx]["text"])

    return results


def iter_chunks(text: str, size: int = 80) -> Generator[str, None, None]:
    start = 0
    length = len(text)
    while start < length:
        yield text[start : start + size]
        start += size


def sse_stream(text: str) -> Generator[str, None, None]:
    for chunk in iter_chunks(text):
        payload = {"choices": [{"delta": {"content": chunk}}]}
        yield f"data: {json.dumps(payload)}\n\n"
    yield "data: [DONE]\n\n"


@app.get("/health")
def health():
    index, documents = get_vector_db()
    return {
        "ok": True,
        "vector_db_ready": bool(index and documents),
    }


@app.post("/chat")
def chat(req: ChatRequest):
    index, documents = get_vector_db()
    if index is None or documents is None:
        raise HTTPException(
            status_code=400,
            detail="Vector DB not found. Run ingestion.py first.",
        )

    user_message = next((m.content for m in reversed(req.messages) if m.role == "user"), "")
    if not user_message:
        raise HTTPException(status_code=400, detail="No user message provided.")

    if violates_integrity(user_message):
        return StreamingResponse(
            sse_stream(integrity_response()),
            media_type="text/event-stream",
        )

    topic = extract_topic(user_message)
    misconceptions = get_misconceptions("web", topic)
    context = retrieve_context(user_message)
    answer = generate_adaptive_answer(context, user_message, misconceptions)

    return StreamingResponse(sse_stream(answer), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
