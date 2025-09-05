from fastapi import FastAPI, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF

from app.nlp import preprocess_text
from app.ai import classify_and_respond

app = FastAPI(title="Email Classifier API")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    pdf = fitz.open(stream=file_bytes, filetype="pdf")
    for page in pdf:
        text += page.get_text()
    return text.strip()


@app.post("/classify-email")
async def classify_email(
    subject: str = Form(...),
    body: str = Form(""),
    file: UploadFile = File(None)  # deve ter o mesmo nome que o frontend envia
):
    pdf_text = ""
    if file:
        file_bytes = await file.read()
        pdf_text = extract_text_from_pdf(file_bytes)

    combined_body = body
    if pdf_text:
        combined_body += f"\n\n[Conteúdo do PDF]\n{pdf_text}"

    # Pré-processamento NLP
    processed_body = preprocess_text(combined_body)

    # Envia para IA
    result = classify_and_respond(subject, processed_body)
    return result
