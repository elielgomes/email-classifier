# Setup Beckend (Python)

## ⚙️ Instalação e Configuração

### 📋 Pré-requisitos

- [Python](https://www.python.org/downloads/) ≥ 3

### 🔧 Passos para Configuração

1 **Configurar Variáveis de Ambiente do Backend:**

Dentro da pasta backend, crie um arquivo .env copiando o conteúdo do .env.example.

Configure seu token do Hugging Face em HF_TOKEN:
```.env
HF_TOKEN=seutokenaqui
```

Para configurar seu token basta criar uma conta no [Huggingface](https://huggingface.co/) e criar seu token com a permissão READ em ['Access Tokens'](https://huggingface.co/settings/tokens)

2. **Instalar Dependências do Backend e Executar:**

```bash
cd backend

# Windows
python -m venv .venv

# Linux/Mac
python3 -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Agora o backend estará disponível em http://localhost:8000.

## 🔗 Acesso ao Projeto

Você pode acessar o projeto clicando [aqui](https://email-classifier-three.vercel.app/) ou pelo link: https://email-classifier-three.vercel.app/

## 📄 Licença

Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo [LICENSE](https://github.com/elielgomes/email-classifier/blob/main/backend/LICENSE.md).

## ✒️ Autor

Feito por [Eliel Gomes](https://github.com/elielgomes).


