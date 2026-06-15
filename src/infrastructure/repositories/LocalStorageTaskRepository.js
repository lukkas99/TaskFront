import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";

/**
 * Implementação alternativa usando LocalStorage
 * Demonstra o princípio Open/Closed e Liskov Substitution
 * 
 * Para usar: trocar no dependencies.js
 */
export class LocalStorageTaskRepository extends ITaskRepository {
  constructor(storageKey = "tasks") {
    super();
    this.storageKey = storageKey;
  }

  _getTasks() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];
    return JSON.parse(data).map((t) => Task.fromApiResponse(t));
  }

  _saveTasks(tasks) {
    const data = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      done: t.done,
    }));
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  _generateId() {
    const tasks = this._getTasks();
    return tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  }

  async getAll() {
    try {
      return this._getTasks();
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas do LocalStorage: ${error.message}`, { cause: error });
    }
  }

  async getById(id) {
    try {
      const tasks = this._getTasks();
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        throw new Error(`Tarefa ${id} não encontrada`);
      }
      return task;
    } catch (error) {
      throw new Error(`Erro ao buscar tarefa ${id}: ${error.message}`, { cause: error });
    }
  }

  async create(task) {
    try {
      const tasks = this._getTasks();
      const newTask = new Task(this._generateId(), task.title, task.done);
      tasks.push(newTask);
      this._saveTasks(tasks);
      return newTask;
    } catch (error) {
      throw new Error(`Erro ao criar tarefa: ${error.message}`, { cause: error });
    }
  }

  async update(id, task) {
    try {
      const tasks = this._getTasks();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error(`Tarefa ${id} não encontrada`);
      }
      const updatedTask = new Task(id, task.title, task.done);
      tasks[index] = updatedTask;
      this._saveTasks(tasks);
      return updatedTask;
    } catch (error) {
      throw new Error(`Erro ao atualizar tarefa ${id}: ${error.message}`, { cause: error });
    }
  }

  async delete(id) {
    try {
      const tasks = this._getTasks();
      const filtered = tasks.filter((t) => t.id !== id);
      if (filtered.length === tasks.length) {
        throw new Error(`Tarefa ${id} não encontrada`);
      }
      this._saveTasks(filtered);
    } catch (error) {
      throw new Error(`Erro ao deletar tarefa ${id}: ${error.message}`, { cause: error });
    }
  }
}
