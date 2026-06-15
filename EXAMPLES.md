# Exemplos de Uso e Configuração

## 🔄 Trocar entre diferentes implementações

A arquitetura permite trocar facilmente entre diferentes fontes de dados sem modificar o código da aplicação.

### 1. Usando API Backend (padrão)

```javascript
// src/infrastructure/config/dependencies.js
import { TaskRepository } from "../repositories/TaskRepository";

_createTaskRepository() {
  const httpClient = this._createHttpClient();
  return new TaskRepository(httpClient);
}
```

### 2. Usando LocalStorage

```javascript
// src/infrastructure/config/dependencies.js
import { LocalStorageTaskRepository } from "../repositories/LocalStorageTaskRepository";

_createTaskRepository() {
  return new LocalStorageTaskRepository("my-tasks");
}
```

### 3. Usando dados Mock (desenvolvimento/testes)

```javascript
// src/infrastructure/config/dependencies.js
import { MockTaskRepository } from "../repositories/MockTaskRepository";

_createTaskRepository() {
  return new MockTaskRepository();
}
```

## 🧪 Testando componentes

### Exemplo 1: Testar TaskForm

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '../../src/components/TaskForm';

describe('TaskForm', () => {
  it('deve chamar onAddTask ao submeter', async () => {
	const mockAddTask = vi.fn().mockResolvedValue();

	render(<TaskForm onAddTask={mockAddTask} />);

	const input = screen.getByPlaceholderText('Nova tarefa...');
	const button = screen.getByText('Adicionar');

	fireEvent.change(input, { target: { value: 'Nova tarefa' } });
	fireEvent.click(button);

	expect(mockAddTask).toHaveBeenCalledWith('Nova tarefa');
  });
});
```

### Exemplo 2: Testar TaskList

```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskList from '../../src/components/TaskList';
import { Task } from '../../src/domain/entities/Task';

describe('TaskList', () => {
  it('deve renderizar mensagem quando não há tarefas', () => {
	render(
	  <TaskList 
		tasks={[]} 
		onToggleTask={() => {}} 
		onDeleteTask={() => {}} 
	  />
	);

	expect(screen.getByText(/Nenhuma tarefa cadastrada/i)).toBeInTheDocument();
  });

  it('deve renderizar lista de tarefas', () => {
	const tasks = [
	  new Task(1, 'Tarefa 1', false),
	  new Task(2, 'Tarefa 2', true),
	];

	render(
	  <TaskList 
		tasks={tasks} 
		onToggleTask={() => {}} 
		onDeleteTask={() => {}} 
	  />
	);

	expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
	expect(screen.getByText('Tarefa 2')).toBeInTheDocument();
  });
});
```

## 🔧 Configurações avançadas

### Adicionar timeout personalizado

```javascript
// src/config/constants.js
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5064",
  TIMEOUT: 30000, // aumentar para 30 segundos
};
```

### Adicionar retry automático

```javascript
// src/infrastructure/http/HttpClient.js
constructor(baseURL = API_CONFIG.BASE_URL) {
  this.client = axios.create({
	baseURL,
	timeout: API_CONFIG.TIMEOUT,
  });

  // Adicionar retry automático
  this.client.interceptors.response.use(
	(response) => response,
	async (error) => {
	  const config = error.config;

	  // Se ainda não tentou retry
	  if (!config._retry) {
		config._retry = true;

		// Tentar novamente após 1 segundo
		await new Promise(resolve => setTimeout(resolve, 1000));
		return this.client(config);
	  }

	  return Promise.reject(error);
	}
  );
}
```

### Adicionar autenticação

```javascript
// src/infrastructure/http/HttpClient.js
_setupInterceptors() {
  this.client.interceptors.request.use(
	(config) => {
	  // Adicionar token JWT
	  const token = localStorage.getItem('auth_token');
	  if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	  }
	  return config;
	},
	(error) => Promise.reject(error)
  );
}
```

## 📊 Adicionar logging

```javascript
// src/infrastructure/logging/Logger.js
export class Logger {
  static log(message, data) {
	console.log(`[LOG] ${message}`, data);
  }

  static error(message, error) {
	console.error(`[ERROR] ${message}`, error);
  }

  static warn(message, data) {
	console.warn(`[WARN] ${message}`, data);
  }
}

// Usar no repositório
async getAll() {
  try {
	Logger.log('Buscando todas as tarefas');
	const response = await this.httpClient.get(this.baseEndpoint);
	Logger.log('Tarefas carregadas', { count: response.data.length });
	return response.data.map((task) => Task.fromApiResponse(task));
  } catch (error) {
	Logger.error('Erro ao buscar tarefas', error);
	throw new Error(\`Erro ao buscar tarefas: \${error.message}\`);
  }
}
```

## 🎨 Adicionar temas

```javascript
// src/context/ThemeContext.jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
	setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
	<ThemeContext.Provider value={{ theme, toggleTheme }}>
	  <div className={\`app-\${theme}\`}>
		{children}
	  </div>
	</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

## 🌐 Internacionalização (i18n)

```javascript
// src/config/i18n.js
export const translations = {
  'pt-BR': {
	'task.add': 'Adicionar tarefa',
	'task.delete.confirm': 'Deseja excluir esta tarefa?',
	'task.loading': 'Carregando...',
  },
  'en-US': {
	'task.add': 'Add task',
	'task.delete.confirm': 'Do you want to delete this task?',
	'task.loading': 'Loading...',
  },
};

export function t(key, locale = 'pt-BR') {
  return translations[locale][key] || key;
}
```

## 📱 Progressive Web App (PWA)

Para transformar em PWA, adicione:

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
	react(),
	VitePWA({
	  registerType: 'autoUpdate',
	  manifest: {
		name: 'Task Manager',
		short_name: 'Tasks',
		description: 'Gerenciador de tarefas',
		theme_color: '#3b82f6',
		icons: [
		  {
			src: 'icon-192.png',
			sizes: '192x192',
			type: 'image/png'
		  }
		]
	  }
	})
  ]
};
```

## 🔍 Debug e DevTools

```javascript
// src/utils/devtools.js
export const enableDevTools = () => {
  if (import.meta.env.DEV) {
	window.__TASK_MANAGER_DEBUG__ = {
	  getContainer: () => container,
	  getTasks: async () => {
		const service = container.getTaskService();
		return await service.getAllTasks();
	  },
	  createTask: async (title) => {
		const service = container.getTaskService();
		return await service.createTask(title);
	  }
	};
	console.log('DevTools habilitadas: window.__TASK_MANAGER_DEBUG__');
  }
};

// Em main.jsx
enableDevTools();
```

Agora você pode usar no console do navegador:
```javascript
window.__TASK_MANAGER_DEBUG__.getTasks()
window.__TASK_MANAGER_DEBUG__.createTask('Debug task')
```
