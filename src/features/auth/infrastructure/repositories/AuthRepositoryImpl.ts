import { AuthSession, AuthUser } from '../../domain/entities/AuthUser';
import {
  AuthRepository,
  LoginCredentials,
  RegisterCredentials,
} from '../../domain/repositories/AuthRepository';
import { AuthDatasource } from '../datasources/AuthDatasource';
import { AuthMapper } from '../mappers/AuthMapper';
import { TokenStorage } from '../storage/tokenStorage';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly datasource: AuthDatasource,
    private readonly storage: TokenStorage,
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const dto = await this.datasource.login({
      email: credentials.email.trim(),
      password: credentials.password,
    });
    const session = AuthMapper.sessionToDomain(dto);
    this.storage.setToken(session.accessToken);
    this.storage.setUser(AuthMapper.userToDto(session.user));
    return session;
  }

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    const dto = await this.datasource.register({
      email: credentials.email.trim(),
      password: credentials.password,
    });
    const session = AuthMapper.sessionToDomain(dto);
    this.storage.setToken(session.accessToken);
    this.storage.setUser(AuthMapper.userToDto(session.user));
    return session;
  }

  async logout(): Promise<void> {
    try {
      if (this.storage.getToken()) {
        await this.datasource.logout();
      }
    } finally {
      this.storage.clear();
    }
  }

  async getProfile(): Promise<AuthUser> {
    const dto = await this.datasource.getProfile();
    const user = AuthMapper.userToDomain(dto.user);
    this.storage.setUser(AuthMapper.userToDto(user));
    return user;
  }

  getToken(): string | null {
    return this.storage.getToken();
  }
}
