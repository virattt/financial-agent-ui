FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Add the current directory to PYTHONPATH
ENV PYTHONPATH=/app:$PYTHONPATH

EXPOSE 8000

# Run the hot reload script instead of directly running the server
CMD ["python", "hot_reload.py"]