import { AuthUser } from '../entities/AuthUser';
import { AuthRepository } from '../repositories/AuthRepository';

export class SaveSessionUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(user: AuthUser): void {
    this.authRepository.saveSessionUser(user);
  }
}
