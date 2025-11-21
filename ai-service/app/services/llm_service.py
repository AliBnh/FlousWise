# LLM Service (Ollama Client)
#
# PURPOSE:
# - Call Ollama API to generate text responses using Mistral 7B model
# - Handle both full responses and streaming responses
# - Manage timeouts and errors
#
# IMPLEMENTATION STEPS:
# 1. Import httpx for async HTTP requests
# 2. Import logging for error tracking
# 3. Create LLMService class
# 4. In __init__(base_url, model, timeout):
#    - Store base_url (e.g., "http://host.docker.internal:11434")
#    - Store model name (e.g., "mistral")
#    - Store timeout (default 60 seconds)
# 5. Create async generate_response(prompt, system_message, temperature, max_tokens):
#    - Construct full prompt = system_message + "\n\n" + prompt
#    - Create payload: {"model": model, "prompt": full_prompt, "stream": False, "options": {...}}
#    - POST to {base_url}/api/generate using httpx.AsyncClient
#    - Handle TimeoutException and HTTPError
#    - Return response["response"]
# 6. Create async generate_streaming_response(prompt, system_message):
#    - Similar to above but with "stream": True
#    - Use client.stream() and yield tokens
#    - For real-time chat UX (optional, can implement later)
#
# KEY NOTES:
# - Ollama runs on host machine, not in Docker
# - Use host.docker.internal to access from container
# - Mistral 7B takes ~1-2 seconds to generate response
# - Temperature controls randomness (0.7 is good for advice)
#
# EXAMPLE REQUEST TO OLLAMA:
# POST http://localhost:11434/api/generate
# {
#   "model": "mistral",
#   "prompt": "You are a financial advisor...\n\nUser: How can I save?",
#   "stream": false
# }
