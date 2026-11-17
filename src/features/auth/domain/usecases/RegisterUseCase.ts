import { AuthSession } from '../entities/AuthUser';
import { AuthRepository, RegisterCredentials } from '../repositories/AuthRepository';

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: RegisterCredentials): Promise<AuthSession> {
    if (!credentials.email.trim() || !credentials.email.includes('@')) {
      throw new Error('Ingresa un correo electrónico válido.');
    }
    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    return this.authRepository.register(credentials);
  }
}
