#!/usr/bin/env python3
"""
Book Ingestion Script - Load Finance Books into ChromaDB

This script:
1. Reads financial education books from data/books/ directory
2. Splits books into overlapping chunks (for better context)
3. Generates embeddings for each chunk
4. Stores in ChromaDB vector database for semantic search

Run this ONCE after adding book files:
    cd ai-service
    python scripts/ingest_books.py
"""

import chromadb
from sentence_transformers import SentenceTransformer
from pathlib import Path
from typing import List, Tuple
import sys
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50
) -> List[str]:
    """
    Split text into overlapping chunks

    Overlapping ensures that context isn't lost at chunk boundaries.

    Args:
        text: Full text to chunk
        chunk_size: Number of words per chunk (default: 500)
        overlap: Number of overlapping words (default: 50)

    Returns:
        List of text chunks

    Example:
        text = "word1 word2 word3 ... word1000"
        chunks = chunk_text(text, chunk_size=500, overlap=50)
        # chunk 1: words 1-500
        # chunk 2: words 451-950  (50 word overlap)
        # chunk 3: words 901-1000
    """
    # Split into words
    words = text.split()

    if len(words) == 0:
        return []

    chunks = []
    start = 0

    while start < len(words):
        # Get chunk of words
        end = start + chunk_size
        chunk_words = words[start:end]
        chunk = ' '.join(chunk_words)

        chunks.append(chunk)

        # Move to next chunk with overlap
        start += (chunk_size - overlap)

        # Break if we've processed all words
        if end >= len(words):
            break

    logger.debug(f"Split text into {len(chunks)} chunks")
    return chunks


def ingest_books(
    books_dir: str = "./data/books",
    chroma_dir: str = "./chroma_db",
    collection_name: str = "finance_books"
):
    """
    Ingest financial education books into ChromaDB

    Process:
    1. Initialize ChromaDB client
    2. Load embedding model
    3. Find all .txt files in books_dir
    4. For each book:
       - Read content
       - Split into chunks
       - Generate embeddings
       - Store in ChromaDB
    5. Log statistics

    Args:
        books_dir: Directory containing book .txt files
        chroma_dir: ChromaDB persistent storage directory
        collection_name: Name of ChromaDB collection
    """
    logger.info("=" * 60)
    logger.info("📚 Starting book ingestion process")
    logger.info("=" * 60)

    # 1. Initialize ChromaDB client
    logger.info(f"Initializing ChromaDB at: {chroma_dir}")
    client = chromadb.PersistentClient(path=chroma_dir)

    # Delete existing collection if it exists (fresh start)
    try:
        client.delete_collection(name=collection_name)
        logger.info(f"Deleted existing collection: {collection_name}")
    except:
        logger.info(f"No existing collection to delete")

    # Create new collection
    collection = client.create_collection(
        name=collection_name,
        metadata={"description": "Financial education books for RAG"}
    )
    logger.info(f"✅ Created collection: {collection_name}")

    # 2. Load embedding model
    logger.info("Loading embedding model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("✅ Embedding model loaded")

    # 3. Find all book files
    books_path = Path(books_dir)
    if not books_path.exists():
        logger.error(f"Books directory not found: {books_dir}")
        logger.info("Creating directory. Please add book .txt files there.")
        books_path.mkdir(parents=True, exist_ok=True)
        return

    book_files = list(books_path.glob("*.txt"))

    if len(book_files) == 0:
        logger.warning(f"No .txt files found in {books_dir}")
        logger.info("Add book files as .txt to the books directory")
        return

    logger.info(f"Found {len(book_files)} book files")

    # 4. Process each book
    all_documents = []
    all_metadatas = []
    all_ids = []

    for book_file in book_files:
        book_name = book_file.stem  # Filename without extension

        logger.info(f"\nProcessing: {book_name}")

        # Read book content
        try:
            text = book_file.read_text(encoding='utf-8')
            logger.info(f"  Read {len(text)} characters")
        except Exception as e:
            logger.error(f"  Failed to read file: {e}")
            continue

        # Chunk the text
        chunks = chunk_text(text, chunk_size=500, overlap=50)
        logger.info(f"  Created {len(chunks)} chunks")

        # Create metadata and IDs for each chunk
        for i, chunk in enumerate(chunks):
            # Document
            all_documents.append(chunk)

            # Metadata (includes book name and chunk number)
            all_metadatas.append({
                "title": book_name,
                "chunk_id": i,
                "chunk_total": len(chunks)
            })

            # Unique ID
            all_ids.append(f"{book_name}_chunk_{i}")

    logger.info("\n" + "=" * 60)
    logger.info(f"📊 Total chunks from all books: {len(all_documents)}")
    logger.info("=" * 60)

    # 5. Generate embeddings (batched for efficiency)
    logger.info("\n⏳ Generating embeddings (this may take 1-2 minutes)...")

    embeddings = model.encode(
        all_documents,
        convert_to_numpy=True,
        show_progress_bar=True,
        batch_size=32
    )

    logger.info(f"✅ Generated {len(embeddings)} embeddings")

    # 6. Add to ChromaDB
    logger.info("\n⏳ Adding to ChromaDB...")

    collection.add(
        documents=all_documents,
        embeddings=embeddings.tolist(),
        metadatas=all_metadatas,
        ids=all_ids
    )

    logger.info("✅ Added to ChromaDB")

    # 7. Verify
    count = collection.count()
    logger.info("\n" + "=" * 60)
    logger.info(f"✅ INGESTION COMPLETE!")
    logger.info(f"   Total documents in collection: {count}")
    logger.info(f"   Collection name: {collection_name}")
    logger.info(f"   Storage location: {chroma_dir}")
    logger.info("=" * 60)

    # Test query
    logger.info("\n🔍 Testing similarity search...")
    test_query = "How can I save money effectively?"
    test_embedding = model.encode(test_query)

    results = collection.query(
        query_embeddings=[test_embedding.tolist()],
        n_results=3
    )

    logger.info(f"Test query: '{test_query}'")
    logger.info(f"Found {len(results['documents'][0])} relevant chunks:")
    for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
        logger.info(f"  {i+1}. {metadata['title']} (chunk {metadata['chunk_id']})")
        logger.info(f"     Preview: {doc[:100]}...")

    logger.info("\n✅ All done! Vector database is ready for RAG.")


if __name__ == "__main__":
    """
    Run book ingestion

    Usage:
        python scripts/ingest_books.py

    Make sure you have book .txt files in data/books/ directory.
    """
    import argparse

    parser = argparse.ArgumentParser(description="Ingest books into ChromaDB")
    parser.add_argument(
        "--books-dir",
        default="./data/books",
        help="Directory containing book .txt files (default: ./data/books)"
    )
    parser.add_argument(
        "--chroma-dir",
        default="./chroma_db",
        help="ChromaDB storage directory (default: ./chroma_db)"
    )
    parser.add_argument(
        "--collection",
        default="finance_books",
        help="Collection name (default: finance_books)"
    )

    args = parser.parse_args()

    try:
        ingest_books(
            books_dir=args.books_dir,
            chroma_dir=args.chroma_dir,
            collection_name=args.collection
        )
    except KeyboardInterrupt:
        logger.info("\n\nIngestion cancelled by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"\n\n❌ Ingestion failed: {e}", exc_info=True)
        sys.exit(1)
