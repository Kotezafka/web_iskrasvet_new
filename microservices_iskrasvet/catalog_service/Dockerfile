FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY database.py .
COPY models.py .
COPY main.py .
COPY init_db.py .

CMD ["sh", "-c", "python init_db.py && uvicorn main:app --host 0.0.0.0 --port 3000"] 