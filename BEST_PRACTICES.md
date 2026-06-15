# Guia de Boas Práticas - Task Manager

## 🎯 Princípios Aplicados

### 1. DDD (Domain-Driven Design)

#### Camada de Domínio
```javascript
// ✅ BOM: Entidade rica com comportamento
class Task {
  toggle() {
	return new Task(this.id, this.title, !this.done);
  }

  isValid() {
	return this.title && this.title.trim().length > 0;
  }
}

// ❌ RUIM: Entidade anêmica (apenas dados)
class Task {
  constructor(id, title, done) {
	this.id = id;
	this.title = title;
	this.done = done;
  }
}
```

#### Separação de Responsabilidades
- **Entidades**: Lógica de negócio pura
- **Serviços**: Orquestração de casos de uso
- **Repositórios**: Acesso a dados
- **Componentes**: Apenas apresentação

### 2. SOLID

#### S - Single Responsibility Principle

```javascript
// ✅ BOM: Cada classe tem uma responsabilidade
class TaskService {
  async createTask(title) { /* validação e criação */ }
}

class TaskRepository {
  async create(task) { /* apenas persistência */ }
}

// ❌ RUIM: Classe faz muitas coisas
class TaskManager {
  async createTask(title) {
	// valida
	// chama API
	// atualiza UI
	// log
  }
}
```

#### O - Open/Closed Principle

```javascript
// ✅ BOM: Aberto para extensão
class ITaskRepository {
  async getAll() { throw new Error("Not implemented"); }
}

class ApiTaskRepository extends ITaskRepository { /* ... */ }
class LocalStorageTaskRepository extends ITaskRepository { /* ... */ }

// ❌ RUIM: Modificar código existente para adicionar funcionalidades
class TaskRepository {
  async getAll() {
	if (this.useLocalStorage) { /* ... */ }
	else if (this.useApi) { /* ... */ }
  }
}
```

#### L - Liskov Substitution Principle

```javascript
// ✅ BOM: Qualquer implementação de ITaskRepository pode substituir outra
const taskService = new TaskService(new ApiTaskRepository());
const taskServiceLocal = new TaskService(new LocalStorageTaskRepository());

// Ambos funcionam da mesma forma!
```

#### I - Interface Segregation Principle

```javascript
// ✅ BOM: Interface focada
class ITaskRepository {
  async getAll() {}
  async create(task) {}
  async update(id, task) {}
  async delete(id) {}
}

// ❌ RUIM: Interface gigante
class IRepository {
  async getAll() {}
  async create() {}
  async update() {}
  async delete() {}
  async export() {}
  async import() {}
  async sync() {}
  async backup() {}
  // ... muitos outros métodos
}
```

#### D - Dependency Inversion Principle

```javascript
// ✅ BOM: Depende de abstração
class TaskService {
  constructor(taskRepository) {  // ITaskRepository
	this.repository = taskRepository;
  }
}

// ❌ RUIM: Depende de implementação concreta
class TaskService {
  constructor() {
	this.repository = new ApiTaskRepository();  // acoplamento forte!
  }
}
```

### 3. KISS (Keep It Simple, Stupid)

```javascript
// ✅ BOM: Simples e direto
function TaskItem({ task, onToggle, onDelete }) {
  return (
	<li>
	  <span>{task.title}</span>
	  <button onClick={() => onToggle(task.id)}>✅</button>
	  <button onClick={() => onDelete(task.id)}>🗑️</button>
	</li>
  );
}

// ❌ RUIM: Complexo demais
function TaskItem({ task, actions, config, theme, permissions }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const context = useContext(TaskContext);
  // ... muita lógica complexa
}
```

## 📋 Checklist de Code Review

### Antes de fazer commit:

- [ ] **Single Responsibility**: Cada classe/função tem apenas uma responsabilidade?
- [ ] **Nomes claros**: Variáveis e funções têm nomes descritivos?
- [ ] **Sem duplicação**: Código não está repetido (DRY)?
- [ ] **Funções pequenas**: Funções têm menos de 20 linhas?
- [ ] **Comentários necessários**: Comentários explicam "por quê", não "o quê"?
- [ ] **Tratamento de erros**: Erros são tratados adequadamente?
- [ ] **Testes**: Código tem testes unitários?
- [ ] **Imutabilidade**: Estado não é mutado diretamente?

### Estrutura de arquivos:

- [ ] **Localização correta**: Arquivo está na camada correta (domain/application/infrastructure)?
- [ ] **Importações limpas**: Importações organizadas e sem ciclos?
- [ ] **Exports consistentes**: Exports no final do arquivo ou inline?

## 🚀 Como Adicionar Novas Funcionalidades

### Exemplo: Adicionar Prioridade às Tarefas

#### 1. Atualizar a Entidade de Domínio

```javascript
// src/domain/entities/Task.js
export class Task {
  constructor(id, title, done = false, priority = 'medium') {
	this.id = id;
	this.title = title;
	this.done = done;
	this.priority = priority; // nova propriedade
  }

  // Adicionar método de domínio
  isHighPriority() {
	return this.priority === 'high';
  }
}
```

#### 2. Atualizar o Serviço de Aplicação

```javascript
// src/application/services/TaskService.js
async createTask(title, priority = 'medium') {
  const task = new Task(null, title, false, priority);

  if (!task.isValid()) {
	throw new Error("Tarefa inválida");
  }

  return await this.taskRepository.create(task);
}
```

#### 3. Atualizar o Componente

```javascript
// src/components/TaskForm.jsx
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = async (e) => {
	e.preventDefault();
	await onAddTask(title, priority);
	setTitle("");
  };

  return (
	<form onSubmit={handleSubmit}>
	  <input value={title} onChange={e => setTitle(e.target.value)} />
	  <select value={priority} onChange={e => setPriority(e.target.value)}>
		<option value="low">Baixa</option>
		<option value="medium">Média</option>
		<option value="high">Alta</option>
	  </select>
	  <button type="submit">Adicionar</button>
	</form>
  );
}
```

## 🧪 Como Escrever Testes

### Testar Entidade de Domínio

```javascript
// tests/domain/Task.test.js
import { describe, it, expect } from 'vitest';
import { Task } from '../../src/domain/entities/Task';

describe('Task Entity', () => {
  it('deve criar tarefa válida', () => {
	const task = new Task(1, 'Test', false);
	expect(task.isValid()).toBe(true);
  });

  it('deve alternar status', () => {
	const task = new Task(1, 'Test', false);
	const toggled = task.toggle();
	expect(toggled.done).toBe(true);
  });
});
```

### Testar Serviço com Mock

```javascript
// tests/application/TaskService.test.js
import { describe, it, expect, vi } from 'vitest';
import { TaskService } from '../../src/application/services/TaskService';

describe('TaskService', () => {
  it('deve criar tarefa válida', async () => {
	const mockRepo = {
	  create: vi.fn().mockResolvedValue({ id: 1, title: 'Test', done: false })
	};

	const service = new TaskService(mockRepo);
	const result = await service.createTask('Test');

	expect(mockRepo.create).toHaveBeenCalled();
	expect(result.title).toBe('Test');
  });
});
```

## 🔧 Troubleshooting

### Problema: Props drilling (passar props por muitos níveis)

**Solução**: Use Context API ou custom hooks

```javascript
// ✅ BOM: Custom hook
function App() {
  const { tasks, addTask } = useTasks(taskService);
  return <TaskForm onAddTask={addTask} />;
}

// ❌ RUIM: Props drilling
function App() {
  return <Container tasks={tasks} addTask={addTask} />;
}
function Container({ tasks, addTask }) {
  return <Section tasks={tasks} addTask={addTask} />;
}
function Section({ tasks, addTask }) {
  return <TaskForm addTask={addTask} />;
}
```

### Problema: Lógica complexa no componente

**Solução**: Mova para custom hook ou serviço

```javascript
// ✅ BOM: Lógica no hook
function useTasks() {
  // toda a lógica complexa aqui
}

function TaskList() {
  const { tasks, loading } = useTasks();
  return <ul>{tasks.map(t => <TaskItem task={t} />)}</ul>;
}

// ❌ RUIM: Lógica no componente
function TaskList() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => { /* lógica complexa */ }, []);
  // muita lógica...
  return <ul>...</ul>;
}
```

## 📚 Recursos para Aprender Mais

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [React Hooks Best Practices](https://react.dev/reference/react)
