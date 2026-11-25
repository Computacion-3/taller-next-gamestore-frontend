import { UserRole } from '@/features/auth/domain/entities/AuthUser';

export interface UserAccountDto {
  id: string;
  email: string;
  walletBalance: number;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}