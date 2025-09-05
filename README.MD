# Sistema de Classificação de E-mails com IA

## 📌 Introdução

Este projeto é um sistema de **classificação de e-mails utilizando Inteligência Artificial**, desenvolvido para uma instituição financeira fictícia.  
O sistema simula o envio de e-mails para uma API construída em **Python**, classificando-os como **produtivos** ou **improdutivos**, além de gerar respostas personalizadas com base no conteúdo de cada e-mail.  
A interface é intuitiva e amigável, oferecendo uma experiência prática para o usuário final.

- **Classificação de e-mails**: Produtivo ou improdutivo.
- **Respostas automáticas personalizadas** baseadas no conteúdo do e-mail.
- **Frontend moderno** com Next.js, TailwindCSS e Shadcn UI.
- **Backend escalável** com Python e FastAPI.
- **Banco de dados relacional** PostgreSQL gerenciado via Prisma ORM.
- **Autenticação segura** com JWT.
- **Persistência offline** usando IndexedDB.
- **Deployment fácil** usando Docker e Render.

---

## 👨🏻‍💻 Tecnologias Utilizadas

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Render](https://img.shields.io/badge/Render-2EC5E6?style=for-the-badge&logo=render&logoColor=white)

---

## ⚙️ Instalação e Configuração

### 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18
- [Python](https://www.python.org/downloads/) ≥ 3

### 🔧 Passos para Configuração

1. **Clone o Repositório:**

```bash
git clone https://github.com/elielgomes/email-classifier.git
cd email-classifier
```

2 **Configurar Variáveis de Ambiente do Backend:**

Dentro da pasta backend, crie um arquivo .env copiando o conteúdo do .env.example.

Configure seu token do Hugging Face em HF_TOKEN:
```.env
HF_TOKEN=seutokenaqui
```

3. **Instalar Dependências do Backend e Executar:**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload
```

4. **Configurar Variáveis de Ambiente do Frontend:**

Dentro da pasta frontend, crie um arquivo .env copiando o conteúdo do .env.example.

5. **Instalar Dependências do Frontend e Executar:**

```bash
cd frontend
npm install
npm run dev
```

Agora o frontend estará disponível em http://localhost:3000 e o backend em http://localhost:8000.

## 🔗 Acesso ao Projeto

Você pode acessar o projeto clicando [aqui](https://email-classifier-three.vercel.app/) ou pelo link: https://email-classifier-three.vercel.app/

## 📄 Licença

Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo [LICENSE](https://github.com/elielgomes/email-classifier/blob/main/LICENSE.md).

## ✒️ Autor

Feito por [Eliel Gomes](https://github.com/elielgomes).
