# Comparação: Antes vs Depois

## 📌 Exemplo 1: Adicionar uma Tarefa

### ❌ ANTES (Código Original)

```javascript
// App.jsx - TUDO MISTURADO
import { useState } from "react";
import { createTask } from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  async function addTask() {
	const res = await createTask({ title: newTask, done: false });
	setTasks([...tasks, res.data]);
	setNewTask("");
  }

  return (
	<div>
	  <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
	  <button onClick={addTask}>Adicionar</button>
	</div>
  );
}
```

**Problemas:**
- ❌ Sem validação
- ❌ Sem tratamento de erros
- ❌ Sem feedback de loading
- ❌ Lógica de negócio no componente
- ❌ Estado misturado com apresentação
- ❌ Difícil de testar

---

### ✅ DEPOIS (Nova Arquitetura)

```javascript
// 1. Domain Layer - Task.js
export class Task {
  constructor(id, title, done = false) {
	this.id = id;
	this.title = title;
	this.done = done;
  }

  isValid() {
	return this.title && this.title.trim().length > 0;
  }

  static fromApiResponse(data) {
	return new Task(data.id, data.title, data.done);
  }
}

// 2. Application Layer - TaskService.js
export class TaskService {
  async createTask(title) {
	const task = new Task(null, title, false);

	if (!task.isValid()) {
	  throw new Error("Tarefa inválida: título vazio");
	}

	return await this.taskRepository.create(task);
  }
}

// 3. Custom Hook - useTasks.js
export function useTasks(taskService) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTask = useCallback(async (title) => {
	try {
	  setError(null);
	  const newTask = await taskService.createTask(title);
	  setTasks(prev => [...prev, newTask]);
	  return newTask;
	} catch (err) {
	  setError(err.message);
	  throw err;
	}
  }, [taskService]);

  return { tasks, loading, error, addTask };
}

// 4. Component - TaskForm.jsx
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
	e.preventDefault();
	if (!title.trim()) return;

	try {
	  setIsSubmitting(true);
	  await onAddTask(title);
	  setTitle("");
	} catch (error) {
	  console.error(error);
	} finally {
	  setIsSubmitting(false);
	}
  };

  return (
	<form onSubmit={handleSubmit}>
	  <input 
		value={title} 
		onChange={(e) => setTitle(e.target.value)}
		disabled={isSubmitting}
	  />
	  <button 
		type="submit" 
		disabled={isSubmitting || !title.trim()}
	  >
		{isSubmitting ? "Adicionando..." : "Adicionar"}
	  </button>
	</form>
  );
}

// 5. App.jsx - APENAS COMPOSIÇÃO
function App() {
  const taskService = container.getTaskService();
  const { tasks, error, addTask } = useTasks(taskService);

  return (
	<div>
	  <ErrorMessage message={error} />
	  <TaskForm onAddTask={addTask} />
	  <TaskList tasks={tasks} />
	</div>
  );
}
```

**Benefícios:**
- ✅ Validação no domínio
- ✅ Tratamento completo de erros
- ✅ Feedback visual de loading
- ✅ Separação de responsabilidades
- ✅ Estado gerenciado em hook customizado
- ✅ Fácil de testar cada parte

---

## 📌 Exemplo 2: Trocar API por LocalStorage

### ❌ ANTES

```javascript
// Para mudar de API para LocalStorage:
// Precisaria REESCREVER TUDO em taskService.js
// E provavelmente vários componentes

export const createTask = (task) => {
  // Mudar de api.post para localStorage.setItem
  // Refatorar TODA a lógica
};
```

**Problemas:**
- ❌ Acoplamento forte com axios
- ❌ Sem abstração
- ❌ Mudança impacta vários arquivos
- ❌ Difícil testar

---

### ✅ DEPOIS

```javascript
// 1. Criar nova implementação
// src/infrastructure/repositories/LocalStorageTaskRepository.js
export class LocalStorageTaskRepository extends ITaskRepository {
  async create(task) {
	const tasks = this._getTasks();
	const newTask = new Task(this._generateId(), task.title, task.done);
	tasks.push(newTask);
	localStorage.setItem('tasks', JSON.stringify(tasks));
	return newTask;
  }
  // ... outros métodos
}

// 2. Mudar APENAS uma linha no container
// src/infrastructure/config/dependencies.js
_createTaskRepository() {
  // Antes:
  // return new TaskRepository(httpClient);

  // Depois:
  return new LocalStorageTaskRepository();
}

// PRONTO! Todo o resto continua funcionando!
```

**Benefícios:**
- ✅ Mudança em 1 único lugar
- ✅ Nenhum componente precisa ser alterado
- ✅ Nenhum serviço precisa ser alterado
- ✅ Fácil reverter se necessário
- ✅ Pode ter ambas implementações simultaneamente

---

## 📌 Exemplo 3: Testar Lógica de Negócio

### ❌ ANTES

```javascript
// Como testar isso? Precisa mockar React, axios, DOM...
test('deve adicionar tarefa', async () => {
  // Impossível testar sem montar componente completo
  // Precisa mockar estado, API, etc
});
```

**Problemas:**
- ❌ Testes complexos
- ❌ Testes lentos
- ❌ Difícil isolar lógica
- ❌ Testes frágeis

---

### ✅ DEPOIS

```javascript
// Testar entidade (pura, sem dependências)
describe('Task Entity', () => {
  it('deve validar tarefa com título vazio', () => {
	const task = new Task(1, '', false);
	expect(task.isValid()).toBe(false);
  });

  it('deve alternar status', () => {
	const task = new Task(1, 'Test', false);
	const toggled = task.toggle();
	expect(toggled.done).toBe(true);
  });
});

// Testar serviço (com mock)
describe('TaskService', () => {
  it('deve criar tarefa válida', async () => {
	const mockRepo = {
	  create: vi.fn().mockResolvedValue(new Task(1, 'Test', false))
	};

	const service = new TaskService(mockRepo);
	await service.createTask('Test');

	expect(mockRepo.create).toHaveBeenCalled();
  });

  it('deve lançar erro para título vazio', async () => {
	const service = new TaskService({});

	await expect(service.createTask('')).rejects.toThrow();
  });
});

// Testar componente (com props mockadas)
describe('TaskForm', () => {
  it('deve chamar onAddTask', async () => {
	const mockAdd = vi.fn();
	render(<TaskForm onAddTask={mockAdd} />);

	fireEvent.change(screen.getByRole('textbox'), { 
	  target: { value: 'Test' } 
	});
	fireEvent.click(screen.getByText('Adicionar'));

	expect(mockAdd).toHaveBeenCalledWith('Test');
  });
});
```

**Benefícios:**
- ✅ Testes simples e rápidos
- ✅ Cada camada testada isoladamente
- ✅ Fácil identificar onde está o bug
- ✅ Alta cobertura de código
- ✅ Testes confiáveis

---

## 📌 Exemplo 4: Adicionar Nova Feature (Prioridade)

### ❌ ANTES

```javascript
// Mudanças espalhadas por todo o código
// App.jsx
const [priority, setPriority] = useState('');

// taskService.js
export const createTask = (task) => {
  return api.post("/api/tasks", { 
	...task, 
	priority  // adicionar aqui
  });
};

// TaskForm.jsx
<select value={priority} onChange={...}>

// TaskItem.jsx
<span style={{ color: task.priority === 'high' ? 'red' : 'black' }}>

// E mais vários lugares...
```

**Problemas:**
- ❌ Mudanças em muitos arquivos
- ❌ Fácil esquecer algum lugar
- ❌ Sem validação centralizada
- ❌ Lógica de UI misturada

---

### ✅ DEPOIS

```javascript
// 1. Atualizar Domínio
// src/domain/entities/Task.js
export class Task {
  constructor(id, title, done, priority = 'medium') {
	this.id = id;
	this.title = title;
	this.done = done;
	this.priority = priority;
  }

  isHighPriority() {
	return this.priority === 'high';
  }

  static PRIORITIES = ['low', 'medium', 'high'];
}

// 2. Atualizar Serviço
// src/application/services/TaskService.js
async createTask(title, priority = 'medium') {
  const task = new Task(null, title, false, priority);

  if (!Task.PRIORITIES.includes(priority)) {
	throw new Error('Prioridade inválida');
  }

  return await this.taskRepository.create(task);
}

// 3. Atualizar Hook
// src/hooks/useTasks.js
const addTask = useCallback(async (title, priority) => {
  const newTask = await taskService.createTask(title, priority);
  setTasks(prev => [...prev, newTask]);
}, [taskService]);

// 4. Atualizar Componentes
// src/components/TaskForm.jsx
const [priority, setPriority] = useState('medium');

<select value={priority} onChange={e => setPriority(e.target.value)}>
  {Task.PRIORITIES.map(p => <option key={p}>{p}</option>)}
</select>

// src/components/TaskItem.jsx
<span className={task.isHighPriority() ? 'high-priority' : ''}>
  {task.title}
</span>

// App.jsx - NÃO PRECISA MUDAR!
```

**Benefícios:**
- ✅ Mudanças organizadas por camada
- ✅ Validação centralizada no domínio
- ✅ Constantes reutilizáveis
- ✅ Método de domínio (isHighPriority)
- ✅ Fácil rastrear todas as mudanças
- ✅ App.jsx não precisa mudar

---

## 📌 Exemplo 5: Tratamento de Erros

### ❌ ANTES

```javascript
// Sem tratamento
async function addTask() {
  const res = await createTask({ title: newTask });
  setTasks([...tasks, res.data]);
}

// Se der erro? Aplicação quebra!
```

**Problemas:**
- ❌ Sem feedback ao usuário
- ❌ Aplicação pode travar
- ❌ Difícil debugar
- ❌ Experiência ruim

---

### ✅ DEPOIS

```javascript
// 1. Repository - Captura erros de rede
async create(task) {
  try {
	const response = await this.httpClient.post(endpoint, task);
	return Task.fromApiResponse(response.data);
  } catch (error) {
	throw new Error(`Erro ao criar tarefa: ${error.message}`);
  }
}

// 2. Service - Valida e adiciona contexto
async createTask(title) {
  const task = new Task(null, title, false);

  if (!task.isValid()) {
	throw new Error('Tarefa inválida: título vazio');
  }

  return await this.taskRepository.create(task);
}

// 3. Hook - Gerencia estado de erro
const addTask = useCallback(async (title) => {
  try {
	setError(null);
	const newTask = await taskService.createTask(title);
	setTasks(prev => [...prev, newTask]);
  } catch (err) {
	setError(err.message);
	throw err;
  }
}, [taskService]);

// 4. Component - Feedback visual
<ErrorMessage message={error} onRetry={reloadTasks} />

// 5. HttpClient - Interceptor global
this.client.interceptors.response.use(
  response => response,
  error => {
	const message = error.response?.data?.message || error.message;
	console.error('HTTP Error:', message);
	return Promise.reject(new Error(message));
  }
);
```

**Benefícios:**
- ✅ Erros tratados em todas as camadas
- ✅ Mensagens claras ao usuário
- ✅ Fácil debugar (logs em cada camada)
- ✅ Opção de retry
- ✅ Aplicação não quebra

---

## 📊 Comparação Geral

| Aspecto | Antes ❌ | Depois ✅ |
|---------|---------|-----------|
| **Organização** | Flat, tudo misturado | Camadas bem definidas (DDD) |
| **Testabilidade** | Difícil | Fácil com mocks |
| **Manutenção** | Mudanças impactam vários arquivos | Mudanças isoladas |
| **Validação** | Nenhuma | Em todas as camadas |
| **Erros** | Sem tratamento | Tratamento completo |
| **Reutilização** | Baixa | Alta (hooks, services) |
| **Flexibilidade** | Rígida | Altamente flexível |
| **Documentação** | Nenhuma | Completa |
| **Complexidade** | Simples mas bagunçado | Estruturado mas claro |
| **Escalabilidade** | Difícil crescer | Fácil adicionar features |

---

## 🎓 Conclusão

A nova arquitetura pode parecer "mais código", mas na prática:

### Para projetos pequenos:
- ✅ Organização clara desde o início
- ✅ Fácil entender o que faz o quê
- ✅ Bom para aprender conceitos

### Para projetos médios/grandes:
- ✅ **ESSENCIAL** para manter sanidade
- ✅ Economiza tempo no longo prazo
- ✅ Facilita trabalho em equipe
- ✅ Reduz bugs e problemas

### Crescimento do projeto:
- 5 tarefas → Arquitetura simples serve
- 50 tarefas → Arquitetura estruturada ajuda
- 500 tarefas → Arquitetura estruturada é **CRÍTICA**

**Invista tempo em arquitetura agora, economize MUITO tempo depois!** 🚀
