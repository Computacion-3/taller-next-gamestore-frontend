import { AuthSession, AuthUser } from '../entities/AuthUser';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(credentials: RegisterCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getProfile(): Promise<AuthUser>;
  getToken(): string | null;
  getStoredSession(): AuthSession | null;
}
