/**
 * Interface do repositório de autenticação
 * Define o contrato para operações de autenticação
 */
export class IAuthRepository {
  async login(email, password) {
    throw new Error("Método login() deve ser implementado");
  }

  async register(name, email, password) {
    throw new Error("Método register() deve ser implementado");
  }

  async getCurrentUser() {
    throw new Error("Método getCurrentUser() deve ser implementado");
  }

  async logout() {
    throw new Error("Método logout() deve ser implementado");
  }
}
