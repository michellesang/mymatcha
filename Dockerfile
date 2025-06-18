# --- Build frontend ---
FROM node:20 AS frontend
WORKDIR /app
COPY mymatcha-ui/ ./mymatcha-ui/
RUN cd mymatcha-ui/my-app && npm install && npm run build

# --- Build backend ---
FROM python:3.11 AS backend
WORKDIR /app

# Install system dependencies if needed
# RUN apt-get update && apt-get install -y gcc libpq-dev  # Uncomment if needed

# Install Python dependencies
COPY mymatcha-api/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# Copy backend source
COPY mymatcha-api/ ./mymatcha-api/

# Copy built frontend into backend static dir
COPY --from=frontend /app/mymatcha-ui/my-app/dist ./mymatcha-api/static

# Command to run the app
WORKDIR /app/mymatcha-api
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
