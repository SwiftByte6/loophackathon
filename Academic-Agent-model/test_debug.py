import faiss
import numpy as np
import torch
from sentence_transformers import SentenceTransformer

print("Testing FAISS...")
d = 64
index = faiss.IndexFlatL2(d)
print("FAISS OK")

print("Testing Torch...")
x = torch.rand(5, 3)
print("Torch OK")

print("Testing SentenceTransformers...")
model = SentenceTransformer("sentence-transformers/static-retrieval-mrl-en-v1", device="cpu")
print("SentenceTransformers initialized")
print("Testing model.encode...")
emb = model.encode(["Hello world"], normalize_embeddings=True)
print(f"model.encode OK, shape: {emb.shape}")
