import { AuthSession } from '../entities/AuthUser';
import { AuthRepository } from '../repositories/AuthRepository';

export class GetStoredSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): AuthSession | null {
    return this.authRepository.getStoredSession();
  }
}
