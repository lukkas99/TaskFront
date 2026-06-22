/**
 * Task Entity - Representação do domínio
 * Encapsula a lógica de negócio da tarefa
 */
export class Task {
  constructor(id, title, done = false, category = 3, priority = 1) {
    this.id = id;
    this.title = title;
    this.done = done;
    this.category = category;
    this.priority = priority;
  }

  /**
   * Cria uma tarefa a partir de dados da API
   */
  static fromApiResponse(data) {
    return new Task(data.id, data.title, data.done, data.category, data.priority);
  }

  /**
   * Converte para formato da API
   */
  toApiRequest() {
    return {
      title: this.title,
      done: this.done,
      category: this.category,
      priority: this.priority,
    };
  }

  /**
   * Marca tarefa como concluída
   */
  markAsDone() {
    return new Task(this.id, this.title, true, this.category, this.priority);
  }

  /**
   * Marca tarefa como não concluída
   */
  markAsNotDone() {
    return new Task(this.id, this.title, false, this.category, this.priority);
  }

  /**
   * Alterna o status de conclusão
   */
  toggle() {
    return new Task(this.id, this.title, !this.done, this.category, this.priority);
  }

  /**
   * Valida se a tarefa é válida
   */
  isValid() {
    return this.title && this.title.trim().length > 0;
  }
}
