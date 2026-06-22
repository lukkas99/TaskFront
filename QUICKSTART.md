# 🚀 Início Rápido - Sistema de Autenticação

## Frontend (React) - PRONTO ✅

### Executar o frontend
```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## Backend (ASP.NET Core) - A IMPLEMENTAR 📋

### Passo 1: Executar Script SQL
Execute o arquivo `database-migration-auth.sql` no SQL Server Management Studio ou Azure Data Studio.

### Passo 2: Instalar Pacotes
No diretório do backend, execute:
```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package BCrypt.Net-Next
```

### Passo 3: Implementar Backend
Siga o guia completo em **BACKEND-AUTH-GUIDE.md** que contém:
- ✅ Todos os códigos completos prontos para copiar
- ✅ Models, Controllers, Services
- ✅ Configuração de JWT
- ✅ Atualização do DbContext
- ✅ Configuração de CORS

### Passo 4: Executar Backend
```bash
dotnet run
```

## 📖 Documentação Completa

- **AUTH-README.md** - Visão geral do sistema
- **BACKEND-AUTH-GUIDE.md** - Guia passo a passo do backend
- **database-migration-auth.sql** - Script de criação de tabelas

## ⚡ Resumo Rápido

### O que o Frontend faz?
1. Mostra tela de Login ou Cadastro
2. Envia credenciais para `/api/auth/login` ou `/api/auth/register`
3. Recebe token JWT e guarda no localStorage
4. Envia token em todas as requisições (header Authorization)
5. Mostra tasks apenas do usuário autenticado
6. Permite logout (remove token)

### O que o Backend precisa fazer?
1. Receber login/cadastro em `/api/auth/login` e `/api/auth/register`
2. Validar credenciais com BCrypt
3. Gerar token JWT
4. Proteger endpoints de tasks com `[Authorize]`
5. Filtrar tasks por `UserId` do token
6. Validar token JWT em cada requisição

## 🎯 Endpoints Necessários

```
POST /api/auth/register
Body: { "name": "Nome", "email": "email@exemplo.com", "password": "123456" }
Response: { "token": "jwt-token", "user": { "id": 1, "name": "Nome", "email": "email@exemplo.com" } }

POST /api/auth/login
Body: { "email": "email@exemplo.com", "password": "123456" }
Response: { "token": "jwt-token", "user": { "id": 1, "name": "Nome", "email": "email@exemplo.com" } }

GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { "id": 1, "name": "Nome", "email": "email@exemplo.com" }

GET /api/tasks
Headers: Authorization: Bearer {token}
Response: [{ "id": 1, "title": "Task", "userId": 1, ... }]
```

## ✅ Checklist Mínimo

### Frontend ✅
- [x] Telas de Login e Cadastro
- [x] Armazenamento de token
- [x] Envio de token nas requisições
- [x] Proteção de rotas
- [x] Logout

### Backend (A fazer)
- [ ] Tabela Users no banco
- [ ] Coluna UserId na tabela Tasks
- [ ] AuthController com login e register
- [ ] JWT configurado no Program.cs
- [ ] TasksController protegido com [Authorize]
- [ ] Filtro por UserId nas queries de tasks

## 🔥 Teste Rápido

1. **Inicie o frontend** (já funciona com mock)
2. **Cadastre um usuário** - Funcionará com validações
3. **Implementar o backend** conforme o guia
4. **Testar integração completa**

---

**Dúvidas? Consulte o BACKEND-AUTH-GUIDE.md com código completo!**
