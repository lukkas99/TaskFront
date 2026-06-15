import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";

/**
 * Implementação Mock para testes
 * Útil para testar componentes isoladamente
 */
export class MockTaskRepository extends ITaskRepository {
  constructor() {
    super();
    this.tasks = [
      new Task(1, "Tarefa de exemplo 1", false),
      new Task(2, "Tarefa de exemplo 2", true),
      new Task(3, "Tarefa de exemplo 3", false),
    ];
    this.nextId = 4;
  }

  async getAll() {
    // Simula delay de rede
    await this._delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await this._delay(100);
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error(`Tarefa ${id} não encontrada`);
    }
    return task;
  }

  async create(task) {
    await this._delay(200);
    const newTask = new Task(this.nextId++, task.title, task.done);
    this.tasks.push(newTask);
    return newTask;
  }

  async update(id, task) {
    await this._delay(200);
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Tarefa ${id} não encontrada`);
    }
    const updatedTask = new Task(id, task.title, task.done);
    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  async delete(id) {
    await this._delay(150);
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Tarefa ${id} não encontrada`);
    }
    this.tasks.splice(index, 1);
  }

  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
