# 🔧 Troubleshooting Guide

## Problemas Comuns e Soluções

---

## 🚨 Erros de Compilação

### ❌ "Cannot find module 'axios'"

**Causa**: Dependências não instaladas

**Solução**:
```bash
npm install
```

---

### ❌ "Module not found: Can't resolve './services/taskService'"

**Causa**: Arquivo antigo foi removido

**Solução**: O arquivo foi refatorado. O novo caminho é:
- Antes: `./services/taskService`
- Depois: Use o `container.getTaskService()` em `./infrastructure/config/dependencies`

```javascript
import { container } from './infrastructure/config/dependencies';
const taskService = container.getTaskService();
```

---

### ❌ ESLint Error: "react-hooks/set-state-in-effect"

**Causa**: useState dentro de useEffect

**Solução**: Já corrigido! Se ainda aparecer, atualize o código em `src/hooks/useTasks.js`

---

## 🌐 Erros de Rede

### ❌ "Network Error" ou "Failed to fetch"

**Causa**: Backend não está rodando ou URL incorreta

**Solução**:
1. Verifique se o backend está rodando em http://localhost:5064
2. Verifique o arquivo `.env`:
```env
VITE_API_URL=http://localhost:5064
```
3. Reinicie o frontend:
```bash
npm run dev
```

---

### ❌ CORS Error

**Causa**: Backend não está configurado para aceitar requisições do frontend

**Solução no Backend (C#)**:
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
	{
		policy.WithOrigins("http://localhost:5173")
			  .AllowAnyHeader()
			  .AllowAnyMethod();
	});
});

app.UseCors("AllowFrontend");
```

---

### ❌ "404 Not Found" nas chamadas de API

**Causa**: Endpoint incorreto ou backend com rota diferente

**Solução**:
1. Verifique se o backend usa `/api/tasks`
2. Se usar rota diferente, atualize em `src/infrastructure/repositories/TaskRepository.js`:
```javascript
this.baseEndpoint = "/api/tasks"; // Mudar para sua rota
```

---

## 🎨 Problemas de UI

### ❌ Estilos não aplicados

**Causa**: CSS não importado

**Solução**: Verifique se `App.css` está importado em `App.jsx`:
```javascript
import "./App.css";
```

---

### ❌ Componentes não renderizam

**Causa**: Erro silencioso ou importação incorreta

**Solução**:
1. Abra DevTools (F12)
2. Verifique Console por erros
3. Verifique importações:
```javascript
// Correto
import TaskForm from "./components/TaskForm";

// Errado
import TaskForm from "./components/taskForm"; // case-sensitive!
```

---

### ❌ "Loading..." infinito

**Causa 1**: Backend não responde
**Solução**: Verifique se backend está rodando

**Causa 2**: Erro na chamada de API
**Solução**: Abra DevTools > Network e verifique requisições

**Causa 3**: useEffect em loop
**Solução**: Já corrigido em `useTasks.js`. Certifique-se de usar a versão atualizada.

---

## 🧪 Problemas com Testes

### ❌ "vitest is not recognized"

**Causa**: Vitest não instalado

**Solução**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

### ❌ "Cannot find module 'jsdom'"

**Causa**: jsdom não instalado

**Solução**:
```bash
npm install -D jsdom
```

---

### ❌ Testes falhando com erros de import

**Causa**: Vitest não configurado corretamente

**Solução**: Verifique `vitest.config.js`:
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
	globals: true,
	environment: 'jsdom',
	setupFiles: './tests/setup.js',
  },
});
```

---

## ⚙️ Problemas de Build

### ❌ Build falha com erro de memória

**Causa**: Node sem memória suficiente

**Solução**:
```bash
# Windows
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

# Linux/Mac
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

### ❌ "Module parse failed" no build

**Causa**: Sintaxe não suportada

**Solução**: Verifique se está usando features muito novas. Vite suporta ES6+.

---

## 🔄 Problemas de Estado

### ❌ Estado não atualiza após adicionar tarefa

**Causa**: Mutação direta de estado

**Solução**: Use spread operator:
```javascript
// ✅ Correto
setTasks([...tasks, newTask]);

// ❌ Errado
tasks.push(newTask);
setTasks(tasks);
```

---

### ❌ Tarefa não some da lista após deletar

**Causa 1**: Erro na função deleteTask
**Solução**: Verifique se a função está sendo chamada

**Causa 2**: ID inconsistente
**Solução**: Verifique se o ID é o mesmo no frontend e backend

---

### ❌ Toggle não funciona

**Causa**: Estado desatualizado

**Solução**: Use função callback:
```javascript
// ✅ Correto
setTasks(prevTasks => prevTasks.map(t => 
  t.id === taskId ? updatedTask : t
));

// ❌ Errado
setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
```

---

## 📦 Problemas de Dependências

### ❌ "npm ERR! peer dependency"

**Causa**: Versões incompatíveis

**Solução**:
```bash
npm install --legacy-peer-deps
```

---

### ❌ Dependências desatualizadas

**Solução**:
```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar (cuidado!)
npm update
```

---

## 🔍 Debug

### Como Debugar Problemas

#### 1. Console Logs
```javascript
// Em qualquer lugar do código
console.log('Valor da variável:', variavel);
console.error('Erro:', erro);
console.table(tasks); // Para arrays/objetos
```

#### 2. React DevTools
- Instale React DevTools no Chrome/Firefox
- Inspecione componentes
- Veja props e state

#### 3. Network Tab
- F12 > Network
- Veja todas as requisições
- Verifique payloads e respostas

#### 4. Breakpoints
- F12 > Sources
- Clique na linha para adicionar breakpoint
- Execute código passo a passo

#### 5. VS Code Debugger
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
	{
	  "type": "chrome",
	  "request": "launch",
	  "name": "Debug Vite",
	  "url": "http://localhost:5173",
	  "webRoot": "${workspaceFolder}"
	}
  ]
}
```

---

## 🆘 Quando Tudo Mais Falha

### Reset Completo

```bash
# 1. Limpar node_modules
rm -rf node_modules
rm package-lock.json

# 2. Limpar cache
npm cache clean --force

# 3. Reinstalar
npm install

# 4. Limpar build
rm -rf dist

# 5. Rebuild
npm run build
```

### Verificar Versões

```bash
node --version    # Deve ser v18+
npm --version     # Deve ser v8+
```

### Porta em Uso

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

## 📞 Checklist de Debug

Quando encontrar um erro:

- [ ] Li a mensagem de erro completa?
- [ ] Verifiquei o Console do navegador?
- [ ] Verifiquei a tab Network?
- [ ] Backend está rodando?
- [ ] `.env` está configurado?
- [ ] Dependências instaladas (`npm install`)?
- [ ] Código está na versão mais recente?
- [ ] Tentei reiniciar dev server?
- [ ] Tentei limpar cache?

---

## 💡 Dicas de Prevenção

### Evitar Problemas

1. **Sempre use `npm install`** depois de `git pull`
2. **Mantenha `.env` atualizado** com valores corretos
3. **Não edite `node_modules`** diretamente
4. **Commit frequente** para poder reverter
5. **Teste antes de commit** (`npm run build`)
6. **Leia mensagens de erro** completamente
7. **Use ESLint** (`npm run lint`)

### Boas Práticas

```javascript
// ✅ Sempre trate erros
try {
  await taskService.createTask(title);
} catch (error) {
  console.error('Erro:', error);
  // Mostre mensagem ao usuário
}

// ✅ Valide antes de enviar
if (!title.trim()) {
  alert('Título vazio');
  return;
}

// ✅ Use optional chaining
const title = task?.title ?? 'Sem título';

// ✅ Log para debug (remover em produção)
console.log('Task criada:', newTask);
```

---

## 📚 Recursos Úteis

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Axios Docs**: https://axios-http.com
- **MDN JavaScript**: https://developer.mozilla.org
- **Stack Overflow**: Sempre útil!

---

## 🎯 Se o Problema Persistir

1. Verifique a documentação específica:
   - `ARCHITECTURE.md` - Para entender estrutura
   - `EXAMPLES.md` - Para ver exemplos
   - `BEST_PRACTICES.md` - Para padrões

2. Compare com o código de exemplo

3. Crie uma issue detalhada:
   - Descreva o problema
   - Inclua mensagens de erro completas
   - Mostre código relevante
   - Diga o que já tentou

---

**Lembre-se: Todo erro é uma oportunidade de aprender! 🚀**
