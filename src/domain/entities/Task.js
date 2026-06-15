/**
 * Task Entity - Representação do domínio
 * Encapsula a lógica de negócio da tarefa
 */
export class Task {
  constructor(id, title, done = false) {
    this.id = id;
    this.title = title;
    this.done = done;
  }

  /**
   * Cria uma tarefa a partir de dados da API
   */
  static fromApiResponse(data) {
    return new Task(data.id, data.title, data.done);
  }

  /**
   * Converte para formato da API
   */
  toApiRequest() {
    return {
      title: this.title,
      done: this.done,
    };
  }

  /**
   * Marca tarefa como concluída
   */
  markAsDone() {
    return new Task(this.id, this.title, true);
  }

  /**
   * Marca tarefa como não concluída
   */
  markAsNotDone() {
    return new Task(this.id, this.title, false);
  }

  /**
   * Alterna o status de conclusão
   */
  toggle() {
    return new Task(this.id, this.title, !this.done);
  }

  /**
   * Valida se a tarefa é válida
   */
  isValid() {
    return this.title && this.title.trim().length > 0;
  }
}
