# 🚀 TaskManager Frontend  
**React + TypeScript | Axios | JWT | Tailwind | Shadcn UI**

Frontend oficial do projeto **Task Manager** — construído em **React + TypeScript**, usando **Axios** para integração com o backend, gerenciamento de autenticação via **JWT** e contexto global para usuários e tarefas.

---

## 📦 Pré-requisitos

Antes de começar, tenha instalado:
- [Node.js](https://nodejs.org/) (recomendado: versão 18 ou superior)  
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

---

## 📁 Como clonar o repositório

```bash
git clone https://github.com/seu-usuario/TaskManager-Frontend.git
cd TaskManager-Frontend
```

---

## 📥 Instalar as dependências

```bash
npm install
# ou
yarn install
```

✅ As principais dependências incluem:
- React + React DOM → base do projeto  
- TypeScript → tipagem estática  
- Axios → chamadas à API  
- React Query → gerenciamento de cache/fetch  
- Tailwind CSS → estilização  
- Shadcn UI → componentes prontos de interface  
- Sonner → sistema de notificações/toasts

---

## ⚙️ Configuração do arquivo `.env`

Na raiz do projeto, crie o arquivo `.env` com este conteúdo:  

```
VITE_API_URL=http://localhost:3000/api
```

✅ **Explicação:**  
- `VITE_API_URL`: define a URL base para comunicação com o backend.  
Use `http://localhost:3000/api` em ambiente local.

---

## ▶️ Como rodar o projeto

```bash
npm run dev
# ou
yarn dev
```

✅ O frontend estará disponível em:
```
http://localhost:5173
```

---

## 🔒 Autenticação

✅ O sistema usa **JWT**:  
- O token é salvo no `localStorage` após login bem-sucedido.  
- O Axios está configurado para enviar automaticamente o token em cada requisição (via interceptor).

---

## 💻 Scripts úteis

| Script           | Descrição                                  |
|------------------|------------------------------------------|
| `npm run dev`    | Inicia em modo desenvolvimento           |
| `npm run build`  | Gera o build de produção                |
| `npm run preview`| Visualiza o build gerado localmente      |

---

## 📬 Suporte

Este projeto é privado e mantido exclusivamente por **Gabriel Correa**.  
Para dúvidas ou suporte, contate diretamente.

Bons códigos 🚀
