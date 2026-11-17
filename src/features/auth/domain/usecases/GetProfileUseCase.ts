import { AuthUser } from '../entities/AuthUser';
import { AuthRepository } from '../repositories/AuthRepository';

export class GetProfileUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<AuthUser> {
    return this.authRepository.getProfile();
  }
}
