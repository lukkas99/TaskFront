/**
 * Serviço de autenticação
 * Responsabilidade: Lógica de negócio relacionada à autenticação
 */
export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    if (!this._isValidEmail(email)) {
      throw new Error("Email inválido");
    }

    return await this.authRepository.login(email, password);
  }

  async register(name, email, password, confirmPassword) {
    if (!name || !email || !password || !confirmPassword) {
      throw new Error("Todos os campos são obrigatórios");
    }

    if (name.trim().length < 3) {
      throw new Error("Nome deve ter pelo menos 3 caracteres");
    }

    if (!this._isValidEmail(email)) {
      throw new Error("Email inválido");
    }

    if (password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    return await this.authRepository.register(name, email, password);
  }

  async getCurrentUser() {
    return await this.authRepository.getCurrentUser();
  }

  async logout() {
    await this.authRepository.logout();
  }

  isAuthenticated() {
    return !!this.authRepository.getToken();
  }

  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
