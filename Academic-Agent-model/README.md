# Academic Agent Model - Backend API

FastAPI backend for Academic Curriculum Companion.

## 🚀 Quick Links

- **Frontend**: https://loophackathon-roan.vercel.app
- **Deployment Guide**: [RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md)

## Local Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY

# Create vector database
python ingestion.py  # Add PDFs to data/raw_pdfs/ first

# Run server
python api_server.py  # Runs on http://localhost:8000
```

## API Endpoints

- `GET /health` - Health check & DB status
- `POST /chat` - Chat with streaming response

## Render Deployment

1. Create vector DB: `python ingestion.py`
2. Commit vector_db to Git
3. Deploy on Render using `render.yaml` Blueprint
4. Set environment variables:
   - `OPENROUTER_API_KEY`
   - `CORS_ORIGINS=https://loophackathon-roan.vercel.app`
   - `PYTHON_VERSION=3.11.0`

See [RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md) for details.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key |
| `CORS_ORIGINS` | Production | Comma-separated allowed origins |
| `PORT` | No | Server port (default: 8000) |

## Project Structure

```
Academic-Agent-model/
├── api_server.py       # Main FastAPI app
├── ingestion.py         # PDF → Vector DB
├── requirements.txt     # Dependencies
├── runtime.txt         # Python 3.11
├── .env.example        # Env template
├── models/             # AI models
└── vector_db/          # FAISS index (generated)
```

## Troubleshooting

- **Vector DB not found**: Run `python ingestion.py`
- **CORS errors**: Check CORS_ORIGINS environment variable
- **API key errors**: Verify OPENROUTER_API_KEY in .env or Render

## Key Dependencies

- FastAPI, Uvicorn - Web framework & server
- FAISS - Vector search
- SentenceTransformers - Embeddings
- OpenAI SDK - LLM (via OpenRouter)

---

Full deployment guide: [RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md)
