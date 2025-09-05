import os
from huggingface_hub import InferenceClient
import json
from dotenv import load_dotenv
import os

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise RuntimeError(
        "Defina a variável de ambiente HF_TOKEN com seu token Hugging Face")

client = InferenceClient(
    provider="nebius",
    api_key=HF_TOKEN,
)


def classify_and_respond(subject: str, body: str) -> dict:
    prompt = f"""
Você é um funcionário de um banco brasileiro responsável por responder e-mails de clientes. Para cada e-mail recebido, faça o seguinte:

1. Classifique o e-mail em uma das categorias:
- "PRODUCTIVE": o e-mail requer uma ação ou resposta específica do banco. Exemplos: abertura de conta, empréstimo, cartão, investimentos, dúvidas sobre transações, solicitações de suporte.
- "UNPRODUCTIVE": o e-mail não requer ação imediata ou não está relacionado a serviços financeiros. Exemplos: mensagens de agradecimento, felicitações, propaganda, spam.

2. Gere uma resposta educada e profissional, apropriada para a categoria, considerando o contexto do e-mail do cliente.

É importante responder sempre em português, independentemente do idioma do e-mail original.

Email:
Subject: {subject}
Body: {body}

Responda estritamente no seguinte formato JSON:
{{
    "category": "PRODUCTIVE" ou "UNPRODUCTIVE",
    "suggested_response": "Sua resposta educada ao cliente aqui"
}}
"""
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}]
        )
        content = completion.choices[0].message['content']
        return json.loads(content)
    except Exception as e:
        return {"category": "UNPRODUCTIVE", "suggested_response": f"Erro ao processar IA: {e}"}
