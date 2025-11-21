# AI Service Dockerfile
#
# PURPOSE:
# - Package AI service as Docker container
# - Install dependencies
# - Pre-download embedding model
# - Run FastAPI with uvicorn
#
# BUILD COMMAND:
# docker build -t flouswise-ai-service .
#
# RUN COMMAND (standalone):
# docker run -p 8000:8000 --env-file .env flouswise-ai-service
#
# NOTES:
# - Uses Python 3.11 slim image for smaller size
# - Downloads sentence-transformers model at build time (cached in image)
# - Exposes port 8000
# - Mounts chroma_data volume for persistence
# - Uses host.docker.internal to access Ollama on host machine

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (if needed)
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download and cache the embedding model (saves time on first run)
# This downloads the model during build, so it's already in the image
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy application code
COPY . .

# Create directories for data storage
RUN mkdir -p chroma_data data/books

# Expose port
EXPOSE 8000

# Health check (optional but recommended)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Run FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]
