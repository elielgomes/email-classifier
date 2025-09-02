from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from app.nlp import preprocess_text
from app.ai import classify_and_respond

app = FastAPI(title="Email Classifier API")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/classify-email")
async def classify_email(subject: str = Form(...), body: str = Form(...)):
    processed_body = preprocess_text(body)
    result = classify_and_respond(subject, processed_body)
    return result
