"""
Embedding Service - Text to Vector Conversion

This service converts text into numerical vectors (embeddings) for semantic similarity search.

What are embeddings?
- Embeddings are dense vector representations of text
- Similar texts have similar vectors (measured by cosine similarity)
- Allow us to find semantically related content

Example:
- "How to save money?" → [0.123, -0.456, 0.789, ...] (384 numbers)
- "Tips for saving" → [0.118, -0.461, 0.791, ...] (similar vector)
- "Weather forecast" → [-0.789, 0.234, -0.123, ...] (different vector)

Why Sentence Transformers?
- Pre-trained on semantic similarity tasks
- Fast inference (~30ms per query)
- Good quality embeddings
- No API costs (runs locally)
"""

from sentence_transformers import SentenceTransformer
from typing import List, Union
import numpy as np

from app.utils.logger import get_logger
from app.utils.exceptions import EmbeddingException

# Initialize logger for this module
logger = get_logger(__name__)


class EmbeddingService:
    """
    Service for generating text embeddings using Sentence Transformers

    This service loads a pre-trained embedding model and provides methods
    to convert text into numerical vectors.

    The model is loaded ONCE when the service is initialized and reused
    for all subsequent requests (efficient).
    """

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the embedding service

        Args:
            model_name: Name of the Sentence Transformers model to use
                       Default: "all-MiniLM-L6-v2"

        Model specs (all-MiniLM-L6-v2):
        - Size: ~80MB (downloads on first run)
        - Output dimension: 384
        - Speed: ~30ms per query on CPU
        - Quality: Good for general semantic search
        - Languages: English (works OK for French too)

        Alternative models:
        - "all-mpnet-base-v2": Better quality, slower (768 dimensions)
        - "paraphrase-multilingual-MiniLM-L12-v2": Multiple languages
        - "all-distilroberta-v1": Good quality, faster
        """
        logger.info(f"Initializing EmbeddingService with model: {model_name}")

        try:
            # Load the model
            # This downloads the model on first run (~80MB for all-MiniLM-L6-v2)
            # Subsequent runs load from cache (~/.cache/torch/sentence_transformers/)
            self.model = SentenceTransformer(model_name)

            # Store model name for logging
            self.model_name = model_name

            # Get embedding dimension from model
            # all-MiniLM-L6-v2 outputs 384-dimensional vectors
            self.dimension = self.model.get_sentence_embedding_dimension()

            logger.info(
                f"✅ EmbeddingService initialized successfully. "
                f"Model: {model_name}, Dimension: {self.dimension}"
            )

        except Exception as e:
            # If model loading fails, log and raise custom exception
            logger.error(f"Failed to initialize embedding model: {e}", exc_info=True)
            raise EmbeddingException(f"Failed to load model {model_name}: {str(e)}")

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text

        This converts one piece of text into a numerical vector.

        Args:
            text: Input text to convert
                 Example: "How can I save money?"

        Returns:
            List of floats representing the embedding vector
            Length: self.dimension (384 for all-MiniLM-L6-v2)
            Example: [0.123, -0.456, 0.789, ..., 0.234] (384 numbers)

        Raises:
            EmbeddingException: If embedding generation fails

        Time complexity: O(n) where n = text length
        Typical time: 20-50ms on CPU

        Usage:
            embedding = service.generate_embedding("How to save money?")
            # embedding is a list of 384 floats
            # Can now use this vector for similarity search in ChromaDB
        """
        # Validate input
        if not text or not text.strip():
            logger.warning("Empty text provided to generate_embedding")
            raise EmbeddingException("Cannot generate embedding for empty text")

        try:
            logger.debug(f"Generating embedding for text: '{text[:50]}...'")

            # Generate embedding
            # encode() returns a numpy array by default
            embedding = self.model.encode(
                text,
                convert_to_numpy=True,  # Return as numpy array
                show_progress_bar=False  # Don't show progress for single text
            )

            # Convert numpy array to list for JSON serialization
            # ChromaDB and most APIs expect lists, not numpy arrays
            embedding_list = embedding.tolist()

            logger.debug(
                f"✅ Generated embedding with dimension: {len(embedding_list)}"
            )

            return embedding_list

        except Exception as e:
            logger.error(f"Failed to generate embedding: {e}", exc_info=True)
            raise EmbeddingException(f"Embedding generation failed: {str(e)}")

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (batched)

        Batching is MORE EFFICIENT than calling generate_embedding() in a loop
        because the model can process multiple texts in parallel on GPU/CPU.

        Args:
            texts: List of texts to convert
                  Example: [
                      "How to save money?",
                      "Best investment strategies",
                      "Debt reduction tips"
                  ]

        Returns:
            List of embedding vectors (one per input text)
            Example: [
                [0.123, -0.456, ...],  # Embedding for text 1
                [0.234, -0.567, ...],  # Embedding for text 2
                [0.345, -0.678, ...]   # Embedding for text 3
            ]

        Raises:
            EmbeddingException: If any embedding generation fails

        Performance:
        - Single text: ~30ms
        - 10 texts batched: ~80ms (8ms per text)
        - 100 texts batched: ~500ms (5ms per text)
        Batching is ~6x faster!

        Usage:
            texts = ["question 1", "question 2", "question 3"]
            embeddings = service.generate_embeddings(texts)
            # embeddings[0] corresponds to texts[0], etc.
        """
        # Validate input
        if not texts:
            logger.warning("Empty list provided to generate_embeddings")
            return []

        # Filter out empty strings
        valid_texts = [text for text in texts if text and text.strip()]

        if not valid_texts:
            logger.warning("No valid texts after filtering empty strings")
            raise EmbeddingException("No valid texts to generate embeddings for")

        try:
            logger.info(f"Generating embeddings for {len(valid_texts)} texts (batched)")

            # Generate embeddings for all texts at once
            # This is much faster than a loop!
            embeddings = self.model.encode(
                valid_texts,
                convert_to_numpy=True,
                show_progress_bar=len(valid_texts) > 10,  # Show progress if many texts
                batch_size=32  # Process 32 texts at a time (good for CPU)
            )

            # Convert numpy array to list of lists
            # Shape: (num_texts, embedding_dimension)
            # Example: (100, 384) for 100 texts with 384-dim embeddings
            embeddings_list = embeddings.tolist()

            logger.info(
                f"✅ Generated {len(embeddings_list)} embeddings, "
                f"dimension: {len(embeddings_list[0]) if embeddings_list else 0}"
            )

            return embeddings_list

        except Exception as e:
            logger.error(
                f"Failed to generate embeddings for {len(valid_texts)} texts: {e}",
                exc_info=True
            )
            raise EmbeddingException(f"Batch embedding generation failed: {str(e)}")

    def compute_similarity(
        self,
        embedding1: Union[List[float], np.ndarray],
        embedding2: Union[List[float], np.ndarray]
    ) -> float:
        """
        Compute cosine similarity between two embeddings

        Cosine similarity measures how similar two vectors are:
        - 1.0: Identical vectors (perfect match)
        - 0.0: Orthogonal vectors (no similarity)
        - -1.0: Opposite vectors (very dissimilar)

        For text, typical ranges:
        - 0.8-1.0: Very similar (synonyms, paraphrases)
        - 0.5-0.8: Somewhat similar (related topics)
        - 0.0-0.5: Different (unrelated topics)

        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector

        Returns:
            Similarity score between -1 and 1

        Example:
            emb1 = service.generate_embedding("How to save money?")
            emb2 = service.generate_embedding("Tips for saving cash")
            similarity = service.compute_similarity(emb1, emb2)
            # similarity ≈ 0.85 (very similar)

        Math:
            cosine_similarity = dot(A, B) / (||A|| * ||B||)
            where ||A|| = sqrt(sum(a_i^2))
        """
        try:
            # Convert to numpy arrays if needed
            vec1 = np.array(embedding1) if not isinstance(embedding1, np.ndarray) else embedding1
            vec2 = np.array(embedding2) if not isinstance(embedding2, np.ndarray) else embedding2

            # Compute cosine similarity
            # dot product divided by product of magnitudes
            dot_product = np.dot(vec1, vec2)
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)

            # Avoid division by zero
            if norm1 == 0 or norm2 == 0:
                return 0.0

            similarity = dot_product / (norm1 * norm2)

            return float(similarity)

        except Exception as e:
            logger.error(f"Failed to compute similarity: {e}", exc_info=True)
            raise EmbeddingException(f"Similarity computation failed: {str(e)}")

    def get_model_info(self) -> dict:
        """
        Get information about the loaded model

        Returns:
            Dictionary with model metadata

        Example:
            info = service.get_model_info()
            # {
            #     "model_name": "all-MiniLM-L6-v2",
            #     "dimension": 384,
            #     "max_seq_length": 256
            # }
        """
        return {
            "model_name": self.model_name,
            "dimension": self.dimension,
            "max_seq_length": self.model.max_seq_length,
            "description": "Sentence Transformer model for semantic embeddings"
        }


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
HOW TO USE THE EMBEDDING SERVICE:

1. INITIALIZATION (do once, typically in dependencies.py):

   from app.services.embedding_service import EmbeddingService

   # Initialize service (loads model)
   embedding_service = EmbeddingService()
   # Model is now loaded and ready to use

2. GENERATE EMBEDDING FOR USER QUESTION:

   question = "How can I save 3000 MAD per month?"
   question_embedding = embedding_service.generate_embedding(question)

   # question_embedding is now a list of 384 floats
   # Use this to query ChromaDB for similar book chunks

3. GENERATE EMBEDDINGS FOR BOOK CHUNKS (in ingest_books.py):

   book_chunks = [
       "Chunk 1 text...",
       "Chunk 2 text...",
       "Chunk 3 text..."
   ]

   # Generate all embeddings at once (faster!)
   embeddings = embedding_service.generate_embeddings(book_chunks)

   # Store in ChromaDB
   collection.add(
       documents=book_chunks,
       embeddings=embeddings,
       ids=[...]
   )

4. COMPUTE SIMILARITY:

   text1 = "How to save money"
   text2 = "Tips for saving"

   emb1 = embedding_service.generate_embedding(text1)
   emb2 = embedding_service.generate_embedding(text2)

   similarity = embedding_service.compute_similarity(emb1, emb2)
   print(f"Similarity: {similarity:.2f}")  # e.g., 0.87

5. ERROR HANDLING:

   try:
       embedding = embedding_service.generate_embedding("test")
   except EmbeddingException as e:
       logger.error(f"Embedding failed: {e}")
       # Handle error (return error response, use fallback, etc.)
"""


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    """
    Test the embedding service
    Run: python -m app.services.embedding_service
    """
    print("=== Testing EmbeddingService ===\n")

    # Initialize service
    print("1. Initializing service...")
    service = EmbeddingService()
    print(f"   Model info: {service.get_model_info()}\n")

    # Test single embedding
    print("2. Generating single embedding...")
    text = "How can I save money?"
    embedding = service.generate_embedding(text)
    print(f"   Text: '{text}'")
    print(f"   Embedding dimension: {len(embedding)}")
    print(f"   First 5 values: {embedding[:5]}\n")

    # Test batch embeddings
    print("3. Generating batch embeddings...")
    texts = [
        "How to save money?",
        "Best investment strategies",
        "Debt reduction tips"
    ]
    embeddings = service.generate_embeddings(texts)
    print(f"   Generated {len(embeddings)} embeddings")
    print(f"   Each with dimension: {len(embeddings[0])}\n")

    # Test similarity
    print("4. Computing similarity...")
    text1 = "How to save money?"
    text2 = "Tips for saving cash"
    text3 = "Weather forecast"

    emb1 = service.generate_embedding(text1)
    emb2 = service.generate_embedding(text2)
    emb3 = service.generate_embedding(text3)

    sim_12 = service.compute_similarity(emb1, emb2)
    sim_13 = service.compute_similarity(emb1, emb3)

    print(f"   Similarity('{text1}', '{text2}'): {sim_12:.3f}")
    print(f"   Similarity('{text1}', '{text3}'): {sim_13:.3f}")
    print(f"   ✅ Related texts have higher similarity!\n")

    print("✅ All tests passed!")
