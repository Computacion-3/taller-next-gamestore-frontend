import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { ChangePasswordDto, UserAccountDto } from '../dtos/UserAccountDto';

export interface UserDatasource {
  getAll(): Promise<UserAccountDto[]>;
  getById(id: string): Promise<UserAccountDto>;
  getMyProfile(): Promise<UserAccountDto>;
  updateMyEmail(email: string): Promise<UserAccountDto>;
  changeMyPassword(dto: ChangePasswordDto): Promise<void>;
  updateRole(id: string, role: UserRole): Promise<UserAccountDto>;
}