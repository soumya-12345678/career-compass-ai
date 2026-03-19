FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn
COPY . .
# Start Gunicorn with 1 worker to save RAM
CMD ["gunicorn", "--workers", "1", "--timeout", "120", "--access-logfile", "-", "--bind", "0.0.0.0:5000", "app:app"]
