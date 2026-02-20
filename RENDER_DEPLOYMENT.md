# Render Deployment Guide

## Quick Start

Deploy your Academic Agent Model backend to Render in 3 steps:

### 1. Prepare Vector Database

```bash
cd Academic-Agent-model
python ingestion.py  # Ensure you have PDFs in data/raw_pdfs/
cd ..
git add Academic-Agent-model/vector_db/
git commit -m "Add vector database"
git push origin main
```

### 2. Deploy to Render

1. Go to [render.com](https://render.com) → **New** → **Blueprint** 
2. Connect to your GitHub repo: **loophackathon**
3. Render detects `render.yaml` automatically
4. Add environment variables:
   - `OPENROUTER_API_KEY`: your_key_here
   - `CORS_ORIGINS`: https://loophackathon-roan.vercel.app
   - `PYTHON_VERSION`: 3.11.0
5. Click **Apply** to deploy

### 3. Connect Frontend

1. Copy your Render URL (e.g., `https://academic-agent-api.onrender.com`)
2. In Vercel → Settings → Environment Variables:
   - Add `VITE_API_URL` = your Render URL
3. Redeploy frontend

## Configuration Files

- `render.yaml` - Render Blueprint configuration
- `Academic-Agent-model/runtime.txt` - Python version
- `Academic-Agent-model/.env.example` - Environment variables template

## Testing

```bash
# Health check
curl https://your-app.onrender.com/health

# Chat test
curl -X POST https://your-app.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}]}'
```

## Troubleshooting

**Vector DB not found**: Ensure vector_db/ is committed to Git

**CORS errors**: Check CORS_ORIGINS includes your Vercel URL

**API key errors**: Verify OPENROUTER_API_KEY in Render dashboard

**Cold starts**: Free tier sleeps after 15min inactivity (10-20s wake up)

## Documentation

- Frontend URL: https://loophackathon-roan.vercel.app
- Render Dashboard: https://dashboard.render.com
- Full docs: See Academic-Agent-model/README.md

## Free Tier Limits

- 750 hours/month
- Auto-sleeps after 15min inactivity
- 512MB RAM
- Perfect for development and testing

---

For detailed instructions, visit [Render's Python docs](https://render.com/docs/deploy-fastapi)
