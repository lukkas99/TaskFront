/**
 * Interface do repositório de tarefas (Inversão de Dependência - DIP)
 * Define o contrato que implementações devem seguir
 */
export class ITaskRepository {
  async getAll() {
    throw new Error("Method 'getAll' must be implemented");
  }

  // eslint-disable-next-line no-unused-vars
  async getById(id) {
    throw new Error("Method 'getById' must be implemented");
  }

  // eslint-disable-next-line no-unused-vars
  async create(task) {
    throw new Error("Method 'create' must be implemented");
  }

  // eslint-disable-next-line no-unused-vars
  async update(id, task) {
    throw new Error("Method 'update' must be implemented");
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error("Method 'delete' must be implemented");
  }
}
