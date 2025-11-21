# Book Ingestion Script
#
# PURPOSE:
# - Read finance book text files from data/books/
# - Split books into chunks (500 words, 50 word overlap)
# - Generate embeddings for each chunk
# - Store in ChromaDB for similarity search
# - RUN ONCE after adding book files
#
# IMPLEMENTATION STEPS:
# 1. Import chromadb, SentenceTransformer, Path, logging
# 2. Create chunk_text(text, chunk_size=500, overlap=50) function:
#    - Split text into words
#    - Create overlapping chunks
#    - Return list of chunk strings
# 3. Create ingest_books() function:
#    - Initialize ChromaDB client (persistent storage)
#    - Delete existing collection (fresh start)
#    - Create new collection "finance_books"
#    - Initialize embedding model (all-MiniLM-L6-v2)
#    - Find all .txt files in data/books/
#    - For each book:
#      a. Read file content
#      b. Chunk the text
#      c. Create metadata: {"source": book_name, "chunk_id": i}
#      d. Create unique IDs: f"{book_name}_{i}"
#    - Generate embeddings for all chunks (batched)
#    - Add to ChromaDB: collection.add(documents, embeddings, metadatas, ids)
#    - Log success
# 4. Add main block to run script
#
# EXAMPLE STRUCTURE:
# def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
#     words = text.split()
#     chunks = []
#     for i in range(0, len(words), chunk_size - overlap):
#         chunk = ' '.join(words[i:i + chunk_size])
#         chunks.append(chunk)
#     return chunks
#
# def ingest_books():
#     # 1. Setup ChromaDB
#     client = chromadb.Client(Settings(persist_directory="./chroma_data"))
#     collection = client.create_collection("finance_books")
#
#     # 2. Load embedding model
#     model = SentenceTransformer("all-MiniLM-L6-v2")
#
#     # 3. Process all books
#     for book_file in Path("./data/books").glob("*.txt"):
#         text = book_file.read_text()
#         chunks = chunk_text(text)
#         # ... generate embeddings and add to ChromaDB
#
#     print("✅ Ingested books successfully!")
#
# if __name__ == "__main__":
#     ingest_books()
#
# HOW TO RUN:
# cd ai-service
# python scripts/ingest_books.py
#
# IMPORTANT NOTES:
# - Run this ONCE after adding book files
# - Takes ~1-2 minutes for 10 books
# - Creates chroma_data/ directory with vector database
# - Can re-run to refresh (deletes and recreates collection)
