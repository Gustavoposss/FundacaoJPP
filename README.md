# Sistema de Presença - Fundação José Possidônio Peixoto

Sistema web completo para gerenciamento de presenças, idosos, eventos e documentos da Fundação J.P.P.

## 🚀 Tecnologias

### Backend
- **Node.js** com **Express**
- **PostgreSQL** (Supabase)
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **bcryptjs** para hash de senhas

### Frontend
- **React** com **React Router**
- **Tailwind CSS** para estilização
- **Axios** para requisições HTTP
- **React Toastify** para notificações
- **Recharts** para gráficos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (ou PostgreSQL local)
- Git

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd fundacaojpp
```

### 2. Configure o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` com base no `.env.example`:

```env
DATABASE_URL=sua-url-de-conexao-do-supabase
JWT_SECRET=seu-secret-jwt-aqui
PORT=5000
NODE_ENV=development
```

### 3. Configure o Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend` com base no `.env.example`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🗄️ Configuração do Banco de Dados

### Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Acesse **Settings > Database**
3. Copie a **Connection String** (use a URL do pooler para melhor performance)
4. Cole no arquivo `.env` do backend como `DATABASE_URL`

### Estrutura do Banco

O banco de dados já está configurado com as seguintes tabelas:
- `usuarios` - Usuários do sistema
- `idosos` - Cadastro de idosos
- `eventos` - Eventos realizados
- `presencas` - Registro de presenças
- `documentos` - Documentos dos idosos

## 🚀 Executando o Projeto

### Backend

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

### Frontend

Em outro terminal:

```bash
cd frontend
npm start
```

O frontend estará rodando em `http://localhost:3000`

## 👤 Primeiro Acesso

1. Acesse `http://localhost:3000`
2. Clique em "Registrar" para criar o primeiro usuário
3. Faça login com as credenciais criadas
4. Comece a cadastrar idosos e eventos!

## 📚 Funcionalidades

### ✅ Implementadas

- ✅ Autenticação (Login/Registro)
- ✅ CRUD completo de Idosos
- ✅ CRUD completo de Eventos
- ✅ Registro de Presenças
- ✅ Upload e gerenciamento de Documentos
- ✅ Dashboard com estatísticas
- ✅ Relatórios (Presenças, Eventos, Idosos)
- ✅ Exportação de relatórios em CSV
- ✅ Busca e filtros
- ✅ Interface responsiva

### 🔄 Em Desenvolvimento

- Exportação de relatórios em PDF
- Testes automatizados
- Melhorias de acessibilidade

## 🛠️ Estrutura do Projeto

```
fundacaojpp/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── models/         # Acesso ao banco
│   │   ├── routes/         # Rotas da API
│   │   ├── middlewares/    # Middlewares (auth, validação)
│   │   ├── services/       # Serviços (db, upload)
│   │   ├── utils/          # Utilitários
│   │   ├── app.js          # Configuração Express
│   │   └── server.js       # Inicialização
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── context/        # Context API
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Serviços (API)
│   │   └── App.js          # Componente principal
│   └── package.json
└── README.md
```

## 🔐 Segurança

- Autenticação JWT
- Senhas hasheadas com bcrypt
- Validação de entrada no backend
- CORS configurado
- SSL habilitado para Supabase

## 📝 Variáveis de Ambiente

### Backend (.env)

| Variável | Descrição | Obrigatório |
|----------|-----------|--------------|
| `DATABASE_URL` | URL de conexão do PostgreSQL | Sim |
| `JWT_SECRET` | Chave secreta para JWT | Sim |
| `PORT` | Porta do servidor | Não (padrão: 5000) |
| `NODE_ENV` | Ambiente (development/production) | Não |

### Frontend (.env)

| Variável | Descrição | Obrigatório |
|----------|-----------|--------------|
| `REACT_APP_API_URL` | URL da API backend | Sim |

## 🐛 Solução de Problemas

### Erro de conexão com banco

- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que o Supabase está ativo
- Verifique se o SSL está habilitado na URL

### Erro de autenticação

- Verifique se o `JWT_SECRET` está configurado
- Limpe o localStorage do navegador
- Faça logout e login novamente

### Erro de CORS

- Verifique se o `REACT_APP_API_URL` está correto
- Certifique-se de que o backend está rodando

## 📄 Licença

Este projeto é privado e de uso exclusivo da Fundação José Possidônio Peixoto.

## 👥 Contribuidores

- Desenvolvido para Fundação J.P.P.

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Versão MVP** - Sistema pronto para testes finais

