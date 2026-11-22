import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { UserAccount } from '../entities/UserAccount';

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export interface UserRepository {
  getAll(): Promise<UserAccount[]>;
  getById(id: string): Promise<UserAccount>;
  getMyProfile(): Promise<UserAccount>;
  updateMyEmail(email: string): Promise<UserAccount>;
  changeMyPassword(params: ChangePasswordParams): Promise<void>;
  updateRole(id: string, role: UserRole): Promise<UserAccount>;
}
