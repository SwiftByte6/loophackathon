import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file from the project root (one level up from Academic-Agent-model)
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(project_root, ".env"))

print("Using OpenRouter Trinity LLM")

api_key = os.environ.get("OPENROUTER_API_KEY")
if not api_key:
    raise ValueError("OPENROUTER_API_KEY not found in environment variables. Please check your .env file.")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
    default_headers={
        "HTTP-Referer": "http://localhost",
        "X-Title": "Academic-Agent"
    }
)

MODEL_NAME = "arcee-ai/trinity-large-preview:free"


def generate_answer(context_chunks, question):

    context = "\n\n".join(context_chunks)

    prompt = f"""
You are an academic assistant.

Answer ONLY using the provided context.

Context:
{context}

Question:
{question}

If answer not found in context, say:
"I don't find this in the provided academic material."

Answer:
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    msg = response.choices[0].message

    return msg.content.strip()
