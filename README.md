# Task Manager Frontend

Aplicação frontend em React para gerenciamento de tarefas, construída com arquitetura limpa seguindo princípios de DDD, SOLID e KISS.

## 🚀 Tecnologias

- React 19
- Vite 8
- Axios
- ESLint

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend TaskApi rodando em http://localhost:5064

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd task-manager
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário para apontar para sua API.

## 🎯 Executar

### Modo desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em http://localhost:5173

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## 🏗️ Arquitetura

Este projeto segue princípios de Clean Architecture com DDD:

- **Domain Layer**: Entidades e interfaces de negócio
- **Application Layer**: Casos de uso e serviços de aplicação
- **Infrastructure Layer**: Implementações concretas (HTTP, repositórios)
- **Presentation Layer**: Componentes React

Para mais detalhes, veja [ARCHITECTURE.md](./ARCHITECTURE.md)

## 📁 Estrutura de Pastas

```
src/
├── domain/              # Camada de domínio (entidades, interfaces)
├── application/         # Casos de uso e serviços
├── infrastructure/      # Implementações (HTTP, repos)
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── config/             # Configurações
└── App.jsx             # Componente raiz
```

## 🧪 Testes

Para adicionar testes:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Execute os testes:
```bash
npm test
```

## 📚 Recursos de Aprendizado

Este projeto é ideal para aprender:
- ✅ Arquitetura limpa em React
- ✅ Domain-Driven Design (DDD)
- ✅ Princípios SOLID em JavaScript
- ✅ Injeção de dependências sem frameworks
- ✅ Custom hooks do React
- ✅ Gerenciamento de estado

## 🤝 Contribuindo

Este é um projeto de aprendizado. Sinta-se à vontade para:
- Criar issues com dúvidas
- Sugerir melhorias
- Fazer pull requests

## 📝 Licença

MIT
