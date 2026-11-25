import { AuthUser } from '../entities/AuthUser';
import { AuthRepository } from '../repositories/AuthRepository';

export class UpdateWalletBalanceUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(balance: number): AuthUser | null {
    if (!Number.isFinite(balance) || balance < 0) {
      throw new Error('El saldo debe ser un número mayor o igual a 0.');
    }
    return this.authRepository.updateStoredWalletBalance(balance);
  }
}