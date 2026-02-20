from sentence_transformers import SentenceTransformer
import numpy as np

from models.llm_model import get_model
# model = get_model()

TOPICS = ["maths", "coding", "general", "sports"]

_topic_embeddings = None

def get_topic_embeddings():
    global _topic_embeddings
    if _topic_embeddings is None:
        model = get_model()
        _topic_embeddings = model.encode(TOPICS, normalize_embeddings=True)
    return _topic_embeddings

def extract_topic(question):
    model = get_model()
    topic_embeddings = get_topic_embeddings()
    q_embed = model.encode([question], normalize_embeddings=True)
    scores = np.dot(q_embed, topic_embeddings.T)
    return TOPICS[np.argmax(scores)]
