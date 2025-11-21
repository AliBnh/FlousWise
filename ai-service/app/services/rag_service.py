"""
RAG Service - Retrieval-Augmented Generation

This is the CORE service that orchestrates the entire RAG pipeline:
1. User asks question
2. Generate embedding for question
3. Retrieve relevant book chunks from ChromaDB
4. Fetch user's financial profile
5. Load Moroccan economic context
6. Construct comprehensive prompt
7. Generate personalized response with LLM

This combines book knowledge with user-specific data and local context.
"""

import chromadb
import json
from typing import List, Dict, Any, Optional

from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.profile_service import ProfileService
from app.services.context_service import ContextService
from app.utils.logger import get_logger
from app.utils.exceptions import VectorDBException, RAGException

logger = get_logger(__name__)


class RAGService:
    """
    Retrieval-Augmented Generation service

    Orchestrates the complete RAG pipeline for personalized financial advice.
    """

    def __init__(
        self,
        chroma_persist_dir: str,
        collection_name: str,
        embedding_service: EmbeddingService,
        llm_service: LLMService,
        profile_service: ProfileService,
        context_service: ContextService,
        top_k: int = 5
    ):
        """
        Initialize RAG service

        Args:
            chroma_persist_dir: Directory for ChromaDB persistent storage
            collection_name: Collection name for book embeddings
            embedding_service: Service for generating embeddings
            llm_service: Service for LLM text generation
            profile_service: Service for fetching user profiles
            context_service: Service for Moroccan economic context
            top_k: Number of book chunks to retrieve (default: 5)
        """
        logger.info(f"Initializing RAGService with collection: {collection_name}")

        # Initialize ChromaDB client
        try:
            self.chroma_client = chromadb.PersistentClient(path=chroma_persist_dir)

            # Get or create collection
            # Collection stores book chunks as embeddings for similarity search
            self.collection = self.chroma_client.get_or_create_collection(
                name=collection_name,
                metadata={"description": "Financial education books"}
            )

            logger.info(
                f"ChromaDB initialized: {self.collection.count()} documents in collection"
            )
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")
            raise VectorDBException(f"ChromaDB initialization failed: {str(e)}")

        # Store service instances
        self.embedding_service = embedding_service
        self.llm_service = llm_service
        self.profile_service = profile_service
        self.context_service = context_service
        self.top_k = top_k

        logger.info("✅ RAGService initialized successfully")

    async def query(
        self,
        user_id: str,
        user_question: str,
        jwt_token: str
    ) -> str:
        """
        Execute RAG pipeline to answer user question

        This is the main method that orchestrates everything.

        Args:
            user_id: User ID
            user_question: User's financial question
            jwt_token: JWT token for authentication

        Returns:
            AI-generated personalized response

        Raises:
            RAGException: If RAG pipeline fails at any step
        """
        try:
            logger.info(f"RAG query for user={user_id}: '{user_question[:50]}...'")

            # STEP 1: Generate embedding for question
            logger.debug("Step 1/6: Generating question embedding...")
            question_embedding = self.embedding_service.generate_embedding(user_question)

            # STEP 2: Retrieve relevant book chunks from ChromaDB
            logger.debug(f"Step 2/6: Querying ChromaDB (top_k={self.top_k})...")
            try:
                results = self.collection.query(
                    query_embeddings=[question_embedding],
                    n_results=self.top_k,
                    include=["documents", "metadatas", "distances"]
                )

                # Extract book chunks
                book_chunks = results.get("documents", [[]])[0]
                metadatas = results.get("metadatas", [[]])[0]
                distances = results.get("distances", [[]])[0]

                logger.info(f"Retrieved {len(book_chunks)} relevant book chunks")

                # Log similarity scores (distance = 1 - cosine_similarity)
                if distances:
                    for i, dist in enumerate(distances[:3]):
                        similarity = 1 - dist
                        logger.debug(f"  Chunk {i+1} similarity: {similarity:.3f}")

            except Exception as e:
                logger.error(f"ChromaDB query failed: {e}")
                # Continue without book knowledge if ChromaDB fails
                book_chunks = []
                metadatas = []

            # STEP 3: Fetch user profile
            logger.debug("Step 3/6: Fetching user profile...")
            try:
                user_profile = await self.profile_service.get_user_profile(
                    user_id,
                    jwt_token
                )
                logger.debug("User profile retrieved successfully")
            except Exception as e:
                logger.warning(f"Failed to fetch profile: {e}")
                # Continue with minimal profile if fetch fails
                user_profile = {"userId": user_id, "error": "Profile not available"}

            # STEP 4: Get Moroccan context
            logger.debug("Step 4/6: Loading Moroccan economic context...")
            moroccan_context = self.context_service.get_formatted_context()

            # STEP 5: Construct prompt
            logger.debug("Step 5/6: Constructing LLM prompt...")
            prompt = self._construct_prompt(
                user_question=user_question,
                user_profile=user_profile,
                book_chunks=book_chunks,
                metadatas=metadatas,
                moroccan_context=moroccan_context
            )

            # STEP 6: Generate response with LLM
            logger.debug("Step 6/6: Generating LLM response...")
            system_message = self._get_system_message()

            response = await self.llm_service.generate_response(
                prompt=prompt,
                system_message=system_message
            )

            logger.info(f"✅ RAG pipeline completed successfully")
            return response

        except Exception as e:
            logger.error(f"RAG pipeline failed: {e}", exc_info=True)
            raise RAGException(f"Failed to generate response: {str(e)}")

    def _get_system_message(self) -> str:
        """
        Get system message defining AI advisor's role and behavior

        Returns:
            System message for LLM
        """
        return """You are an expert financial advisor specializing in helping Moroccans manage their finances.

Your role:
- Provide practical, actionable financial advice
- Reference the user's specific financial situation (income, expenses, goals)
- Consider Moroccan economic reality (salaries, cost of living, programs)
- Cite relevant book wisdom when applicable
- Be empathetic but realistic

Guidelines:
1. Always personalize advice based on user's profile
2. Reference specific numbers from their financial data
3. Suggest local resources (government programs, opportunities)
4. Keep responses concise but comprehensive (3-5 paragraphs)
5. Use clear, simple language (avoid jargon)
6. End with 2-3 concrete action steps

Remember: You're helping real people with real financial challenges in Morocco."""

    def _construct_prompt(
        self,
        user_question: str,
        user_profile: Dict[str, Any],
        book_chunks: List[str],
        metadatas: List[Dict],
        moroccan_context: str
    ) -> str:
        """
        Construct comprehensive prompt for LLM

        Combines all context into structured prompt.

        Args:
            user_question: User's question
            user_profile: User's financial profile
            book_chunks: Relevant book excerpts from ChromaDB
            metadatas: Metadata for each chunk (book title, page, etc.)
            moroccan_context: Formatted Moroccan economic context

        Returns:
            Complete prompt for LLM
        """
        # Extract key profile data
        income = user_profile.get("monthlyIncome", {})
        fixed_expenses = user_profile.get("fixedExpenses", {})
        variable_expenses = user_profile.get("variableExpenses", {})
        debts = user_profile.get("debts", [])
        goals = user_profile.get("financialGoals", [])

        # Calculate totals
        total_income = income.get("salary", 0) + income.get("freelance", 0) + income.get("other", 0)
        total_fixed = sum(fixed_expenses.values()) if isinstance(fixed_expenses, dict) else 0
        total_variable = sum(variable_expenses.values()) if isinstance(variable_expenses, dict) else 0
        total_expenses = total_fixed + total_variable
        total_debt = sum(debt.get("remainingAmount", 0) for debt in debts) if debts else 0

        # Format book knowledge
        book_knowledge = ""
        if book_chunks:
            book_knowledge = "FINANCIAL WISDOM FROM BOOKS:\n\n"
            for i, (chunk, metadata) in enumerate(zip(book_chunks, metadatas), 1):
                book_title = metadata.get("title", "Unknown")
                book_knowledge += f"Book Excerpt {i} (from '{book_title}'):\n{chunk}\n\n"
        else:
            book_knowledge = "FINANCIAL WISDOM FROM BOOKS:\n(No relevant book excerpts found for this question)\n\n"

        # Construct prompt
        prompt = f"""You are answering a financial question for a Moroccan user.

USER FINANCIAL PROFILE:
- Monthly Income: {total_income:,.0f} MAD
  (Salary: {income.get('salary', 0):,.0f} MAD, Freelance: {income.get('freelance', 0):,.0f} MAD, Other: {income.get('other', 0):,.0f} MAD)
- Monthly Expenses: {total_expenses:,.0f} MAD
  (Fixed: {total_fixed:,.0f} MAD, Variable: {total_variable:,.0f} MAD)
- Savings Rate: {((total_income - total_expenses) / total_income * 100) if total_income > 0 else 0:.1f}%
- Total Debt: {total_debt:,.0f} MAD
- Financial Goals: {len(goals)} active goals
{f"  Goals: {', '.join(goal.get('name', '') for goal in goals[:3])}" if goals else ""}

{moroccan_context}

{book_knowledge}

USER QUESTION:
{user_question}

Provide personalized financial advice based on:
1. The user's specific financial situation (income, expenses, goals)
2. Moroccan economic reality (salaries, programs, opportunities)
3. Financial wisdom from the books above
4. Practical action steps

Be specific, reference numbers, and give actionable advice."""

        return prompt

    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the vector database collection

        Returns:
            Dictionary with collection stats
        """
        try:
            count = self.collection.count()
            return {
                "collection_name": self.collection.name,
                "document_count": count,
                "status": "healthy" if count > 0 else "empty"
            }
        except Exception as e:
            logger.error(f"Failed to get collection stats: {e}")
            return {
                "collection_name": self.collection.name,
                "status": "error",
                "error": str(e)
            }


# Test function
if __name__ == "__main__":
    import asyncio
    from app.config import settings
    import redis.asyncio as redis

    async def test():
        """Test RAG service"""
        print("=== Testing RAGService ===\n")

        # Initialize services
        embedding_service = EmbeddingService()
        llm_service = LLMService(settings.OLLAMA_BASE_URL)
        redis_client = redis.from_url(settings.REDIS_URL)
        profile_service = ProfileService(settings.FINANCE_SERVICE_URL, redis_client)
        context_service = ContextService()

        # Initialize RAG service
        rag_service = RAGService(
            chroma_persist_dir="./chroma_db",
            collection_name="finance_books",
            embedding_service=embedding_service,
            llm_service=llm_service,
            profile_service=profile_service,
            context_service=context_service,
            top_k=3
        )

        # Get stats
        stats = rag_service.get_collection_stats()
        print(f"Collection stats: {stats}\n")

        # Test query (would need real user ID and token)
        # response = await rag_service.query(
        #     user_id="test123",
        #     user_question="How can I save more money?",
        #     jwt_token="dummy_token"
        # )
        # print(f"Response: {response}")

        print("✅ RAG service test completed")

    asyncio.run(test())
