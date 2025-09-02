import os
from huggingface_hub import InferenceClient
import json
from dotenv import load_dotenv
import os

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise RuntimeError("Defina a variável de ambiente HF_TOKEN com seu token Hugging Face")

client = InferenceClient(
    provider="nebius",
    api_key=HF_TOKEN,
)

def classify_and_respond(subject: str, body: str) -> dict:
    prompt = f"""
Classifique este email como 'Produtivo' ou 'Improdutivo':
- Produtivo: solicita algo relacionado a serviços financeiros.
- Improdutivo: não tem relação ou não requer ação.

Gere também uma resposta educada apropriada à categoria.

Email:
Subject: {subject}
Body: {body}

Responda estritamente no formato JSON:
{{ "categoria": "...", "resposta_sugerida": "..." }}
"""
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}]
        )
        content = completion.choices[0].message['content']
        return json.loads(content)
    except Exception as e:
        return {"categoria": "Improdutivo", "resposta_sugerida": f"Erro ao processar IA: {e}"}
