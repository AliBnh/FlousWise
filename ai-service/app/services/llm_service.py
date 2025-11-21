"""
LLM Service - Ollama Client for Text Generation

Connects to Ollama running on the host machine to generate AI responses.
Ollama provides local LLM inference (no API costs, full privacy).
"""

import httpx
from typing import Optional, AsyncGenerator
import json

from app.utils.logger import get_logger
from app.utils.exceptions import LLMServiceException, LLMTimeoutException

logger = get_logger(__name__)


class LLMService:
    """
    Service for generating text using Ollama LLM

    Ollama must be running on host: ollama serve
    Model must be pulled: ollama pull mistral
    """

    def __init__(self, base_url: str, model: str = "mistral", timeout: int = 60):
        """
        Initialize LLM service

        Args:
            base_url: Ollama API URL (e.g., "http://host.docker.internal:11434")
            model: Model name (e.g., "mistral")
            timeout: Request timeout in seconds
        """
        self.base_url = base_url.rstrip('/')
        self.model = model
        self.timeout = timeout
        logger.info(f"LLMService initialized: {base_url}, model={model}")

    async def generate_response(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        """
        Generate LLM response (non-streaming)

        Args:
            prompt: User prompt (includes context + question)
            system_message: System instructions (role definition)
            temperature: Randomness (0.0=deterministic, 1.0=creative)
            max_tokens: Maximum response length

        Returns:
            Generated text response

        Raises:
            LLMServiceException: If generation fails
            LLMTimeoutException: If request times out
        """
        # Construct full prompt with system message
        full_prompt = prompt
        if system_message:
            full_prompt = f"{system_message}\n\n{prompt}"

        # Ollama API payload
        payload = {
            "model": self.model,
            "prompt": full_prompt,
            "stream": False,  # Get complete response at once
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }

        url = f"{self.base_url}/api/generate"

        try:
            logger.info(f"Calling Ollama: model={self.model}, prompt_length={len(full_prompt)}")

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()

                result = response.json()
                generated_text = result.get("response", "")

                logger.info(f"✅ LLM generated {len(generated_text)} characters")
                return generated_text

        except httpx.TimeoutException:
            logger.error(f"LLM request timed out after {self.timeout}s")
            raise LLMTimeoutException(self.timeout)

        except httpx.HTTPError as e:
            logger.error(f"LLM HTTP error: {e}")
            raise LLMServiceException(f"HTTP error: {str(e)}")

        except Exception as e:
            logger.error(f"LLM unexpected error: {e}", exc_info=True)
            raise LLMServiceException(f"Unexpected error: {str(e)}")

    async def generate_streaming_response(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = 0.7
    ) -> AsyncGenerator[str, None]:
        """
        Generate LLM response with streaming (token-by-token)

        Yields tokens as they're generated for real-time UX.
        Optional feature - can implement later.
        """
        full_prompt = prompt
        if system_message:
            full_prompt = f"{system_message}\n\n{prompt}"

        payload = {
            "model": self.model,
            "prompt": full_prompt,
            "stream": True,
            "options": {"temperature": temperature}
        }

        url = f"{self.base_url}/api/generate"

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream("POST", url, json=payload) as response:
                    response.raise_for_status()

                    async for line in response.aiter_lines():
                        if line:
                            data = json.loads(line)
                            if "response" in data:
                                yield data["response"]

        except Exception as e:
            logger.error(f"Streaming error: {e}")
            raise LLMServiceException(f"Streaming failed: {str(e)}")


if __name__ == "__main__":
    """Test LLM service - requires Ollama running"""
    import asyncio

    async def test():
        service = LLMService("http://localhost:11434", "mistral")
        response = await service.generate_response(
            prompt="What is 2+2?",
            system_message="You are a helpful assistant."
        )
        print(f"Response: {response}")

    asyncio.run(test())
