import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";

/**
 * Implementação concreta do repositório de tarefas
 * Responsabilidade: Comunicação com a API
 */
export class TaskRepository extends ITaskRepository {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
    this.baseEndpoint = "/api/tasks";
  }

  async getAll() {
    try {
      const response = await this.httpClient.get(this.baseEndpoint);
      return response.data.map((task) => Task.fromApiResponse(task));
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas: ${error.message}`, { cause: error });
    }
  }

  async getById(id) {
    try {
      const response = await this.httpClient.get(`${this.baseEndpoint}/${id}`);
      return Task.fromApiResponse(response.data);
    } catch (error) {
      throw new Error(`Erro ao buscar tarefa ${id}: ${error.message}`, { cause: error });
    }
  }

  async create(task) {
    try {
      const response = await this.httpClient.post(
        this.baseEndpoint,
        task.toApiRequest()
      );
      return Task.fromApiResponse(response.data);
    } catch (error) {
      throw new Error(`Erro ao criar tarefa: ${error.message}`, { cause: error });
    }
  }

  async update(id, task) {
    try {
      const response = await this.httpClient.put(
        `${this.baseEndpoint}/${id}`,
        task.toApiRequest()
      );
      return Task.fromApiResponse(response.data);
    } catch (error) {
      throw new Error(`Erro ao atualizar tarefa ${id}: ${error.message}`, { cause: error });
    }
  }

  async delete(id) {
    try {
      await this.httpClient.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      throw new Error(`Erro ao deletar tarefa ${id}: ${error.message}`, { cause: error });
    }
  }
}
