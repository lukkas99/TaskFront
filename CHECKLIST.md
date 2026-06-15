## 📋 Checklist de Implementação

Use este checklist ao adicionar novas funcionalidades ou revisar código.

---

### ✅ Antes de Começar

- [ ] Entendi o requisito de negócio?
- [ ] Identifiquei qual camada será afetada?
- [ ] Li a documentação relevante (ARCHITECTURE.md, BEST_PRACTICES.md)?

---

### 🏗️ Implementação

#### Domain Layer (se aplicável)
- [ ] Criei/atualizei a entidade de domínio
- [ ] Adicionei métodos de comportamento na entidade
- [ ] Adicionei validações de negócio
- [ ] Entidade está imutável (retorna novas instâncias)
- [ ] Interface do repositório foi atualizada (se necessário)

#### Application Layer
- [ ] Criei/atualizei o serviço de aplicação
- [ ] Serviço orquestra o caso de uso corretamente
- [ ] Validações estão no lugar certo
- [ ] Tratamento de erros implementado
- [ ] Serviço depende de abstrações, não de implementações

#### Infrastructure Layer
- [ ] Implementei o repositório concreto
- [ ] HttpClient está sendo usado corretamente
- [ ] Conversões API ↔ Domain estão corretas
- [ ] Tratamento de erros específicos da infra
- [ ] Registrei no container de dependências

#### Presentation Layer
- [ ] Componente tem uma única responsabilidade
- [ ] Props têm nomes claros e descritivos
- [ ] Estados locais são mínimos
- [ ] Validações de UI implementadas
- [ ] Acessibilidade considerada (aria-labels)
- [ ] Loading states implementados
- [ ] Error states implementados

---

### 🎨 Qualidade de Código

#### SOLID
- [ ] **S**: Cada classe/função tem uma única responsabilidade
- [ ] **O**: Código aberto para extensão, fechado para modificação
- [ ] **L**: Implementações podem substituir abstrações
- [ ] **I**: Interfaces são focadas e pequenas
- [ ] **D**: Dependo de abstrações, não de implementações concretas

#### DDD
- [ ] Lógica de negócio está no Domain
- [ ] Orquestração está no Application
- [ ] Detalhes técnicos estão no Infrastructure
- [ ] UI não contém lógica de negócio

#### Clean Code
- [ ] Nomes são autoexplicativos
- [ ] Funções são pequenas (<20 linhas)
- [ ] Sem código duplicado (DRY)
- [ ] Comentários explicam "por quê", não "o quê"
- [ ] Sem números mágicos (usar constantes)
- [ ] Sem código morto

---

### 🧪 Testes

- [ ] Testes unitários para entidade de domínio
- [ ] Testes unitários para serviço de aplicação
- [ ] Testes com mocks para repositórios
- [ ] Testes de componentes React
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Edge cases considerados

---

### 📝 Documentação

- [ ] Comentários JSDoc em classes públicas
- [ ] README atualizado (se necessário)
- [ ] ARCHITECTURE.md atualizado (se estrutura mudou)
- [ ] EXAMPLES.md atualizado (se adicionei padrão novo)
- [ ] Comentários inline para lógica complexa

---

### 🔍 Revisão Final

#### Performance
- [ ] Sem re-renders desnecessários
- [ ] useCallback/useMemo onde apropriado
- [ ] Não estou fazendo calls desnecessárias à API
- [ ] Estados estão otimizados

#### Segurança
- [ ] Input do usuário é validado
- [ ] Sem exposição de dados sensíveis
- [ ] XSS prevention considerado

#### UX
- [ ] Feedback visual para ações
- [ ] Loading states claros
- [ ] Error messages úteis
- [ ] Confirmações para ações destrutivas
- [ ] Responsivo (mobile/desktop)

#### Acessibilidade
- [ ] Elementos interativos têm labels
- [ ] Ordem de tab faz sentido
- [ ] Cores têm contraste adequado
- [ ] Funciona com teclado

---

### ✨ Antes do Commit

- [ ] Código compila sem erros (`npm run build`)
- [ ] Lint passa sem erros (`npm run lint`)
- [ ] Testes passam (`npm test`)
- [ ] Testei manualmente a funcionalidade
- [ ] Revisei o diff das mudanças
- [ ] Commit message é descritivo

---

### 📤 Antes do Pull Request

- [ ] Branch está atualizada com main
- [ ] Todos os checklist items acima estão ✅
- [ ] Descrição do PR é clara
- [ ] Screenshots/GIFs adicionados (se UI)
- [ ] Linked issues relacionados

---

## 🎯 Exemplo de Uso

Ao adicionar "Prioridade nas Tarefas":

```
✅ Domain Layer
  ✅ Adicionei propriedade priority na Task entity
  ✅ Adicionei método isHighPriority()
  ✅ Adicionei validação de prioridade
  ✅ Task retorna novas instâncias

✅ Application Layer
  ✅ Atualizei TaskService.createTask(title, priority)
  ✅ Validação de prioridade válida
  ✅ Tratamento de erros

✅ Infrastructure Layer
  ✅ TaskRepository converte priority corretamente
  ✅ Registrado no container

✅ Presentation Layer
  ✅ TaskForm tem select de prioridade
  ✅ TaskItem mostra indicador visual
  ✅ TaskList ordena por prioridade

✅ Testes
  ✅ Task.isHighPriority() testado
  ✅ TaskService.createTask com priority testado
  ✅ TaskForm com select testado

✅ Documentação
  ✅ Comentários adicionados
  ✅ EXAMPLES.md atualizado
```

---

## 💡 Dicas

- **Quando em dúvida**: Releia ARCHITECTURE.md e BEST_PRACTICES.md
- **Se algo parece complexo**: Provavelmente está! Simplifique.
- **Se está copiando código**: Considere criar uma abstração
- **Se mudança afeta várias camadas**: Provavelmente está correto (DDD)
- **Se teste é difícil**: Código provavelmente está muito acoplado

---

## 🚫 Red Flags

Se você perceber isso, pause e refatore:

- ❌ Componente com >100 linhas
- ❌ Função com >20 linhas
- ❌ Arquivo com >300 linhas
- ❌ Mais de 3 níveis de indentação
- ❌ Lógica de negócio em componente
- ❌ Chamada direta ao axios no componente
- ❌ Props drilling (>2 níveis)
- ❌ Múltiplas responsabilidades em uma classe
- ❌ Constantes hardcoded
- ❌ Sem tratamento de erro

---

**Lembre-se**: Qualidade > Velocidade. Código limpo economiza tempo no longo prazo! 🎯
