import faiss
import pickle
import os
import numpy as np
from sentence_transformers import SentenceTransformer

VECTOR_DB_PATH = "vector_db"
INDEX_PATH = os.path.join(VECTOR_DB_PATH, "index.faiss")
DOC_PATH = os.path.join(VECTOR_DB_PATH, "documents.pkl")

os.makedirs(VECTOR_DB_PATH, exist_ok=True)

model = SentenceTransformer("sentence-transformers/static-retrieval-mrl-en-v1", device="cpu")

text = "Welcome to the Academic Agent! This is a sample context for testing."
embedding = model.encode([text], normalize_embeddings=True)
embedding = np.array(embedding).astype("float32")

index = faiss.IndexFlatL2(embedding.shape[1])
index.add(embedding)

documents = [{"text": text, "source": "welcome.txt"}]

faiss.write_index(index, INDEX_PATH)
with open(DOC_PATH, "wb") as f:
    pickle.dump(documents, f)

print("Vector DB initialized with sample data!")
