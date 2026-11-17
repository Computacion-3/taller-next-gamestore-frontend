import { UserRole } from '../../domain/entities/AuthUser';

export interface AuthUserDto {
  id: string;
  email: string;
  role: UserRole;
  walletBalance?: number;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  message?: string;
  accessToken: string;
  tokenType: string;
  user: AuthUserDto;
}

export interface ProfileResponseDto {
  message: string;
  user: AuthUserDto;
}

export interface LogoutResponseDto {
  message: string;
}
