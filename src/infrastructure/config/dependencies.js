import { HttpClient } from "../http/HttpClient";
import { TaskRepository } from "../repositories/TaskRepository";
import { LocalStorageTaskRepository } from "../repositories/LocalStorageTaskRepository";
import { AuthRepository } from "../repositories/AuthRepository";
import { TaskService } from "../../application/services/TaskService";
import { AuthService } from "../../application/services/AuthService";
import { API_CONFIG } from "../../config/constants";

/**
 * Configuração de injeção de dependências
 * Facilita testes e manutenção (Dependency Inversion Principle)
 * 
 * 💡 Para trocar entre API e LocalStorage:
 * - USE_LOCAL_STORAGE = false → usa backend API
 * - USE_LOCAL_STORAGE = true → usa LocalStorage (sem backend)
 */

// 🔧 CONFIGURAÇÃO: Mude aqui para usar LocalStorage
const USE_LOCAL_STORAGE = false; // true = LocalStorage, false = API

class DependencyContainer {
  constructor() {
    this._instances = {};
  }

  _createHttpClient() {
    if (!this._instances.httpClient) {
      this._instances.httpClient = new HttpClient(API_CONFIG.BASE_URL);
    }
    return this._instances.httpClient;
  }

  _createTaskRepository() {
    if (!this._instances.taskRepository) {
      if (USE_LOCAL_STORAGE) {
        // Usando LocalStorage (funciona sem backend)
        console.log('📦 Usando LocalStorage para persistência');
        this._instances.taskRepository = new LocalStorageTaskRepository();
      } else {
        // Usando API Backend
        console.log('🌐 Usando API Backend para persistência');
        const httpClient = this._createHttpClient();
        this._instances.taskRepository = new TaskRepository(httpClient);
      }
    }
    return this._instances.taskRepository;
  }

  getTaskService() {
    if (!this._instances.taskService) {
      const taskRepository = this._createTaskRepository();
      this._instances.taskService = new TaskService(taskRepository);
    }
    return this._instances.taskService;
  }

  _createAuthRepository() {
    if (!this._instances.authRepository) {
      const httpClient = this._createHttpClient();
      this._instances.authRepository = new AuthRepository(httpClient);
    }
    return this._instances.authRepository;
  }

  getAuthService() {
    if (!this._instances.authService) {
      const authRepository = this._createAuthRepository();
      this._instances.authService = new AuthService(authRepository);
    }
    return this._instances.authService;
  }
}

export const container = new DependencyContainer();
