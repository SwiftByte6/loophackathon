import os
from openai import OpenAI

print("Using OpenRouter Trinity LLM")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
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
        ],
        extra_body={"reasoning": {"enabled": True}}
    )

    msg = response.choices[0].message

    return msg.content.strip()
