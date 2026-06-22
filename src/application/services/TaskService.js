import { Task } from "../../domain/entities/Task";

/**
 * Serviço de aplicação - Orquestra casos de uso
 * Responsabilidade: Lógica de aplicação e coordenação
 */
export class TaskService {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async getAllTasks() {
    return await this.taskRepository.getAll();
  }

  async createTask(title, category, priority) {
    const task = new Task(null, title, false, category, priority);

    if (!task.isValid()) {
      throw new Error("Tarefa inválida: o título não pode estar vazio");
    }

    return await this.taskRepository.create(task);
  }

  async toggleTask(taskId, currentTask) {
    const updatedTask = currentTask.toggle();
    return await this.taskRepository.update(taskId, updatedTask);
  }

  async deleteTask(taskId) {
    await this.taskRepository.delete(taskId);
  }
}
