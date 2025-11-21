# RAG Service (Retrieval-Augmented Generation)
#
# PURPOSE:
# - Orchestrate the complete RAG pipeline
# - Combine: User Profile + Book Knowledge + Moroccan Context + LLM
# - This is the CORE service that makes the AI advisor intelligent
#
# IMPLEMENTATION STEPS:
# 1. Import chromadb, logging, json
# 2. Import all other services: EmbeddingService, LLMService, ProfileService, ContextService
# 3. Create RAGService class
# 4. In __init__(chroma_persist_dir, collection_name, embedding_service, llm_service, profile_service, context_service, top_k=5):
#    - Initialize ChromaDB client with persistent storage
#    - Get or create collection for finance books
#    - Store all service instances
#    - Store top_k (how many book chunks to retrieve)
# 5. Create async query(user_id, user_question, jwt_token) -> str:
#    This is the MAIN method - implements the RAG pipeline:
#
#    STEP 1: Generate embedding for user question
#    - question_embedding = embedding_service.generate_embedding(user_question)
#
#    STEP 2: Retrieve relevant book chunks from ChromaDB
#    - results = collection.query(query_embeddings=[question_embedding], n_results=top_k)
#    - Extract top K most similar chunks
#
#    STEP 3: Fetch user profile from Finance Service
#    - user_profile = await profile_service.get_user_profile(user_id, jwt_token)
#
#    STEP 4: Get Moroccan context
#    - moroccan_context = context_service.get_formatted_context()
#
#    STEP 5: Construct prompt
#    - Call _construct_prompt() to combine everything
#
#    STEP 6: Call LLM
#    - response = await llm_service.generate_response(prompt, system_message)
#
#    STEP 7: Return response
#    - Return the LLM's answer
#
# 6. Create _get_system_message() -> str:
#    - Returns instructions for the LLM
#    - Define role: "You are an expert financial advisor for Moroccans"
#    - Define guidelines: be specific, reference user data, cite books
#    - Keep response concise but comprehensive
#
# 7. Create _construct_prompt(user_question, user_profile, book_knowledge, moroccan_context) -> str:
#    - Extract key profile data (income, expenses)
#    - Format book chunks as "Book Excerpt 1: ...", "Book Excerpt 2: ..."
#    - Construct structured prompt:
#      * USER FINANCIAL PROFILE section (JSON of profile)
#      * MOROCCAN ECONOMIC CONTEXT section
#      * FINANCIAL WISDOM FROM BOOKS section
#      * USER QUESTION section
#    - Return complete prompt
#
# KEY NOTES:
# - This service orchestrates ALL other services
# - ChromaDB stores book embeddings for fast similarity search
# - RAG combines retrieval (book knowledge) + generation (LLM)
# - Context-aware: LLM sees user's specific financial situation
# - Response time: ~1.5-2 seconds total
#
# EXAMPLE FLOW:
# User asks: "How can I save 3000 MAD per month?"
# 1. Generate embedding [0.123, -0.456, ...] (30ms)
# 2. ChromaDB finds 5 similar chunks about saving, budgeting (50ms)
# 3. Fetch profile: income=9000, expenses=8200 (20ms cached)
# 4. Get Moroccan context (5ms)
# 5. Build prompt with all context (10ms)
# 6. LLM generates personalized advice (1500ms)
# 7. Return: "Based on your 9,000 MAD salary and 8,200 MAD expenses, here's how to save 3,000 MAD..."
