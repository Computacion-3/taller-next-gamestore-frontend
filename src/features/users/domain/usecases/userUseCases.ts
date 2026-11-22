import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { UserAccount } from '../entities/UserAccount';
import {
  ChangePasswordParams,
  UserRepository,
} from '../repositories/UserRepository';

export class GetUsersUseCase {
  constructor(private readonly repository: UserRepository) {}
  execute(): Promise<UserAccount[]> {
    return this.repository.getAll();
  }
}

export class UpdateUserRoleUseCase {
  constructor(private readonly repository: UserRepository) {}
  execute(id: string, role: UserRole): Promise<UserAccount> {
    return this.repository.updateRole(id, role);
  }
}

export class UpdateMyEmailUseCase {
  constructor(private readonly repository: UserRepository) {}
  execute(email: string): Promise<UserAccount> {
    if (!email || !email.includes('@')) {
      throw new Error('Ingresa un correo electrónico válido.');
    }
    return this.repository.updateMyEmail(email);
  }
}

export class ChangeMyPasswordUseCase {
  constructor(private readonly repository: UserRepository) {}
  execute(params: ChangePasswordParams): Promise<void> {
    if (params.newPassword.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
    }
    return this.repository.changeMyPassword(params);
  }
}
