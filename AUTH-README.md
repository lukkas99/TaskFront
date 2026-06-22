# 🔐 Sistema de Autenticação - Task Manager

Sistema completo de autenticação com login e cadastro de usuários, onde cada usuário vê apenas suas próprias tarefas.

## ✅ O que foi implementado no Frontend

### Novos Componentes
- **Login.jsx** - Tela de login
- **Register.jsx** - Tela de cadastro
- **UserHeader.jsx** - Header com informações do usuário logado
- **Auth.css** - Estilos para as telas de autenticação

### Novos Serviços e Hooks
- **AuthService.js** - Lógica de negócio de autenticação
- **AuthRepository.js** - Comunicação com API de autenticação
- **useAuth.js** - Hook React para gerenciar estado de autenticação

### Entidades e Interfaces
- **User.js** - Entidade de usuário
- **IAuthRepository.js** - Interface do repositório de autenticação

### Modificações
- **App.jsx** - Agora verifica autenticação e mostra login/cadastro
- **HttpClient.js** - Adiciona token JWT automaticamente nas requisições
- **dependencies.js** - Registra serviços de autenticação

## 🎯 Funcionalidades

### Frontend (React)
- ✅ Tela de login
- ✅ Tela de cadastro com validação
- ✅ Validação de email e senha
- ✅ Armazenamento de token JWT no localStorage
- ✅ Envio automático do token em todas as requisições
- ✅ Header com informações do usuário logado
- ✅ Botão de logout
- ✅ Proteção de rotas (só acessa tasks se autenticado)
- ✅ Verificação automática de autenticação ao carregar a página

### Backend (A implementar)
- 📄 Script SQL para criar tabela de usuários
- 📄 Guia completo de implementação do backend
- 📄 Controllers, Services e Models necessários

## 📁 Arquivos Criados

### Frontend
```
src/
├── application/services/
│   └── AuthService.js
├── components/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── UserHeader.jsx
│   └── Auth.css
├── domain/
│   ├── entities/
│   │   └── User.js
│   └── repositories/
│       └── IAuthRepository.js
├── hooks/
│   └── useAuth.js
└── infrastructure/
	└── repositories/
		└── AuthRepository.js
```

### Backend (Scripts e Guias)
```
database-migration-auth.sql    # Script SQL para criar tabelas
BACKEND-AUTH-GUIDE.md          # Guia completo de implementação
```

## 🚀 Como Usar

### 1. Frontend (Já implementado)
O frontend está pronto! Basta iniciar o projeto:

```bash
npm run dev
```

### 2. Backend (Implementar)
Siga o guia completo em **BACKEND-AUTH-GUIDE.md**:

1. Execute o script SQL `database-migration-auth.sql`
2. Instale pacotes NuGet:
   ```bash
   dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
   dotnet add package System.IdentityModel.Tokens.Jwt
   dotnet add package BCrypt.Net-Next
   ```
3. Crie os arquivos conforme o guia
4. Configure JWT no `Program.cs`
5. Atualize `appsettings.json` com chave JWT

## 🔑 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Cadastro de novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Buscar usuário atual (requer token)

### Tasks (Protegidos)
- `GET /api/tasks` - Listar apenas tasks do usuário autenticado
- `POST /api/tasks` - Criar task para o usuário autenticado
- `PUT /api/tasks/{id}` - Atualizar task (apenas se for do usuário)
- `DELETE /api/tasks/{id}` - Deletar task (apenas se for do usuário)

## 🎨 Visual

### Tela de Login
- Design moderno com gradiente roxo
- Validação de campos
- Mensagens de erro amigáveis
- Link para cadastro

### Tela de Cadastro
- Formulário completo com nome, email, senha e confirmação
- Validação em tempo real
- Link para voltar ao login

### Header do Usuário
- Avatar com iniciais do usuário
- Nome e email exibidos
- Botão de logout

## 🔒 Segurança

- ✅ Senhas criptografadas com BCrypt
- ✅ Token JWT com expiração de 7 dias
- ✅ Validação de email
- ✅ Senha mínima de 6 caracteres
- ✅ Proteção CORS configurada
- ✅ Tasks isoladas por usuário

## 📝 Notas Importantes

### Token JWT
- Armazenado no `localStorage`
- Enviado automaticamente em todas as requisições via header `Authorization: Bearer {token}`
- Expira em 7 dias

### Isolamento de Dados
- Cada usuário vê APENAS suas próprias tasks
- Backend filtra automaticamente por `UserId`
- Tasks criadas são automaticamente associadas ao usuário logado

### Validações Frontend
- Nome: mínimo 3 caracteres
- Email: formato válido
- Senha: mínimo 6 caracteres
- Confirmação de senha: deve coincidir

## 🧪 Testando

### Teste Manual
1. Acesse o frontend
2. Clique em "Cadastre-se"
3. Preencha os dados e crie uma conta
4. Você será automaticamente logado
5. Crie algumas tasks
6. Faça logout
7. Crie outra conta
8. Observe que as tasks anteriores não aparecem

### Teste com Múltiplos Usuários
1. Abra duas abas em modo anônimo
2. Cadastre usuários diferentes
3. Crie tasks em cada conta
4. Verifique que cada usuário vê apenas suas tasks

## 🎯 Próximos Passos (Opcional)

- [ ] Recuperação de senha (forgot password)
- [ ] Confirmação de email
- [ ] Refresh token
- [ ] Perfil do usuário editável
- [ ] Avatar personalizado
- [ ] Autenticação com Google/GitHub

## 📚 Tecnologias Utilizadas

### Frontend
- React 19
- Axios para requisições HTTP
- LocalStorage para persistência do token

### Backend
- ASP.NET Core
- Entity Framework Core
- SQL Server
- JWT Bearer Authentication
- BCrypt para hash de senhas

## ⚠️ Troubleshooting

### Erro: "Usuário não autenticado"
- Verifique se o token está sendo enviado
- Verifique se o backend está processando o header Authorization
- Limpe o localStorage e faça login novamente

### Tasks não aparecem após login
- Verifique se o backend está filtrando por UserId
- Verifique se o UserId está sendo salvo ao criar tasks
- Veja os logs do console do navegador

### Erro ao registrar: "Email já cadastrado"
- Use um email diferente
- Verifique se o email não está duplicado no banco

---

**Desenvolvido com ❤️ para gerenciar suas tarefas de forma segura!**
