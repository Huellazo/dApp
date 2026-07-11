FROM python:3.12-slim

WORKDIR /app

# Install system deps for asyncpg and Shapely
RUN apt-get update && apt-get install -y \
    libgeos-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (Docker cache layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

EXPOSE 8000

# Development (--reload enabled in docker-compose command override)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
