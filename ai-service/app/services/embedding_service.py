# Embedding Service
#
# PURPOSE:
# - Generate vector embeddings from text using Sentence Transformers
# - Convert user questions and book chunks into 384-dimensional vectors
# - Used for semantic similarity search in ChromaDB
#
# IMPLEMENTATION STEPS:
# 1. Import SentenceTransformer from sentence_transformers
# 2. Create EmbeddingService class
# 3. In __init__:
#    - Load model: self.model = SentenceTransformer('all-MiniLM-L6-v2')
#    - Set dimension: self.dimension = 384
# 4. Create generate_embedding(text: str) -> List[float]:
#    - Call self.model.encode(text, convert_to_numpy=True)
#    - Convert to list and return
# 5. Create generate_embeddings(texts: List[str]) -> List[List[float]]:
#    - For batch processing multiple texts
#    - Return list of embeddings
#
# KEY NOTES:
# - all-MiniLM-L6-v2 is fast (~30ms) and produces good quality embeddings
# - 384 dimensions is the output size
# - First call downloads model (~80MB) - cache in Docker image
#
# USAGE:
# embedding_service = EmbeddingService()
# vector = embedding_service.generate_embedding("How can I save money?")
# # Returns: [0.123, -0.456, 0.789, ...] (384 floats)
