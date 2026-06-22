import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/User";

/**
 * Implementação do repositório de autenticação
 * Responsabilidade: Comunicação com a API de autenticação
 */
export class AuthRepository extends IAuthRepository {
  constructor(httpClient) {
    super();
    this.httpClient = httpClient;
    this.authEndpoint = "/api/auth";
  }

  async login(email, password) {
    try {
      const response = await this.httpClient.post(`${this.authEndpoint}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Armazena o token
      localStorage.setItem("authToken", token);

      return {
        token,
        user: User.fromApiResponse(user),
      };
    } catch (error) {
      throw new Error(`Erro ao fazer login: ${error.message}`, { cause: error });
    }
  }

  async register(name, email, password) {
    try {
      const response = await this.httpClient.post(`${this.authEndpoint}/register`, {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      // Armazena o token
      localStorage.setItem("authToken", token);

      return {
        token,
        user: User.fromApiResponse(user),
      };
    } catch (error) {
      throw new Error(`Erro ao cadastrar: ${error.message}`, { cause: error });
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return null;
      }

      const response = await this.httpClient.get(`${this.authEndpoint}/me`);
      return User.fromApiResponse(response.data);
    } catch (error) {
      // Se falhar ao buscar usuário, remove token inválido
      localStorage.removeItem("authToken");
      return null;
    }
  }

  async logout() {
    localStorage.removeItem("authToken");
  }

  getToken() {
    return localStorage.getItem("authToken");
  }
}
