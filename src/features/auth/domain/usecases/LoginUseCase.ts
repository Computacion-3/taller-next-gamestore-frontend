import { AuthSession } from '../entities/AuthUser';
import { AuthRepository, LoginCredentials } from '../repositories/AuthRepository';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthSession> {
    if (!credentials.email.trim()) {
      throw new Error('Ingresa tu correo electrónico o usuario.');
    }
    if (!credentials.password) {
      throw new Error('Ingresa tu contraseña.');
    }
    return this.authRepository.login(credentials);
  }
}
