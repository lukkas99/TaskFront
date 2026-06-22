/**
 * Entidade User
 * Representa um usuário do sistema
 */
export class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static fromApiResponse(data) {
    return new User(
      data.id,
      data.name,
      data.email
    );
  }

  toApiRequest() {
    return {
      name: this.name,
      email: this.email,
    };
  }
}
