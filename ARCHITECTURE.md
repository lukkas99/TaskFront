# Task Manager - Arquitetura DDD, SOLID e KISS

## 📁 Estrutura do Projeto

```
src/
├── domain/                      # Camada de Domínio (DDD)
│   ├── entities/               # Entidades de negócio
│   │   └── Task.js            # Entidade Task com lógica de domínio
│   └── repositories/          # Interfaces de repositórios
│       └── ITaskRepository.js # Contrato do repositório
│
├── application/               # Camada de Aplicação (DDD)
│   └── services/             # Serviços de aplicação
│       └── TaskService.js    # Orquestração de casos de uso
│
├── infrastructure/           # Camada de Infraestrutura (DDD)
│   ├── http/                # Configuração HTTP
│   │   └── HttpClient.js    # Cliente HTTP com interceptors
│   ├── repositories/        # Implementações concretas
│   │   └── TaskRepository.js # Implementação do repositório
│   └── config/              # Configurações
│       └── dependencies.js  # Injeção de dependências
│
├── hooks/                   # Custom Hooks React
│   └── useTasks.js         # Hook de gerenciamento de tarefas
│
├── components/             # Componentes de UI
│   ├── TaskForm.jsx       # Formulário de criação
│   ├── TaskItem.jsx       # Item individual
│   ├── TaskList.jsx       # Lista de tarefas
│   ├── ErrorMessage.jsx   # Mensagem de erro
│   └── LoadingSpinner.jsx # Indicador de carregamento
│
├── config/                # Configurações globais
│   └── constants.js       # Constantes da aplicação
│
├── App.jsx               # Componente raiz
└── main.jsx             # Entry point
```

## 🎯 Princípios Aplicados

### DDD (Domain-Driven Design)

#### 1. **Camada de Domínio** (`domain/`)
- **Entidades**: `Task.js` encapsula a lógica de negócio
- **Repositórios**: Interfaces que definem contratos de acesso a dados
- **Independente de frameworks**: Não depende de React ou bibliotecas externas

#### 2. **Camada de Aplicação** (`application/`)
- **TaskService**: Orquestra casos de uso do sistema
- Coordena entre domínio e infraestrutura
- Valida regras de negócio antes de persistir

#### 3. **Camada de Infraestrutura** (`infrastructure/`)
- **TaskRepository**: Implementação concreta da comunicação com API
- **HttpClient**: Abstração do axios
- **Dependencies**: Container de injeção de dependências

### SOLID

#### 1. **S - Single Responsibility Principle** ✅
Cada classe/componente tem uma única responsabilidade:
- `Task`: Lógica de domínio de tarefas
- `TaskService`: Casos de uso de tarefas
- `TaskRepository`: Comunicação com API
- `HttpClient`: Cliente HTTP
- `TaskForm`: Captura de input
- `TaskList`: Renderização de lista
- `useTasks`: Gerenciamento de estado

#### 2. **O - Open/Closed Principle** ✅
- Abstrações permitem extensão sem modificação
- `ITaskRepository` permite diferentes implementações (API, LocalStorage, Mock)
- `HttpClient` pode ser estendido com novos interceptors

#### 3. **L - Liskov Substitution Principle** ✅
- `TaskRepository` pode ser substituído por qualquer implementação de `ITaskRepository`
- Facilita testes com mocks/stubs

#### 4. **I - Interface Segregation Principle** ✅
- Interfaces pequenas e focadas
- `ITaskRepository` tem apenas métodos essenciais

#### 5. **D - Dependency Inversion Principle** ✅
- Componentes dependem de abstrações, não de implementações concretas
- Injeção de dependências via container
- `TaskService` recebe `ITaskRepository` como dependência

### KISS (Keep It Simple, Stupid)

✅ **Simplicidade mantida**:
- Componentes React simples e focados
- Lógica complexa isolada em services
- Hooks customizados para reutilização
- Sem over-engineering - apenas o necessário

## 🔄 Fluxo de Dados

```
User Interaction
	  ↓
  Component (TaskForm/TaskItem)
	  ↓
   useTasks Hook
	  ↓
  TaskService (application layer)
	  ↓
  TaskRepository (infrastructure)
	  ↓
   HttpClient
	  ↓
	Backend API
```

## 🧪 Vantagens da Arquitetura

### 1. **Testabilidade**
- Fácil criar mocks de repositórios
- Services isolados testáveis sem UI
- Componentes podem ser testados com props mockadas

### 2. **Manutenibilidade**
- Separação clara de responsabilidades
- Mudanças isoladas por camada
- Fácil localizar código

### 3. **Escalabilidade**
- Adicionar novos recursos segue padrões estabelecidos
- Fácil adicionar novos repositórios (LocalStorage, IndexedDB)
- Componentes reutilizáveis

### 4. **Flexibilidade**
- Trocar implementações facilmente (ex: mudar de axios para fetch)
- Adicionar novos serviços sem impactar existentes
- Suporte a diferentes fontes de dados

## 📝 Como Usar

### Adicionar nova entidade

1. Criar entidade em `domain/entities/`
2. Criar interface de repositório em `domain/repositories/`
3. Implementar repositório em `infrastructure/repositories/`
4. Criar service em `application/services/`
5. Registrar no container de dependências
6. Criar hook customizado se necessário

### Trocar de API para LocalStorage

```javascript
// Criar novo repositório
class LocalStorageTaskRepository extends ITaskRepository {
  async getAll() {
	const tasks = localStorage.getItem('tasks');
	return JSON.parse(tasks || '[]').map(Task.fromApiResponse);
  }
  // ... outros métodos
}

// Atualizar container de dependências
_createTaskRepository() {
  return new LocalStorageTaskRepository(); // Só isso!
}
```

## 🔧 Configuração

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:5064
```

## 🚀 Executar

```bash
npm install
npm run dev
```

## 📚 Aprendizados

Este projeto demonstra:
- ✅ Arquitetura limpa em React
- ✅ DDD aplicado no frontend
- ✅ SOLID em JavaScript
- ✅ Separação de concerns
- ✅ Injeção de dependências sem frameworks
- ✅ Custom hooks para lógica reutilizável
- ✅ Tratamento de erros centralizado
