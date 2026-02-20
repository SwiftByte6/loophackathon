from sentence_transformers import SentenceTransformer
import torch

torch.set_num_threads(1)

_model = None

def get_model():
    global _model
    if _model is None:
        print("Initializing SentenceTransformer model...")
        _model = SentenceTransformer(
            "sentence-transformers/static-retrieval-mrl-en-v1",
            device="cpu"
        )
        print("SentenceTransformer model initialized")
    return _model
