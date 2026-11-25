import { AuthSession, AuthUser } from '../../domain/entities/AuthUser';
import {
  AuthRepository,
  LoginCredentials,
  RegisterCredentials,
} from '../../domain/repositories/AuthRepository';
import { AuthDatasource } from '../datasources/AuthDatasource';
import { decodeJwtClaims, isJwtExpired } from '../jwt/jwtClaims';
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
    const stored = this.storage.getUser();
    const claims = decodeJwtClaims(this.storage.getToken());
    // /auth/profile devuelve los datos del JWT (sin saldo): se conserva el
    // saldo guardado y el rol se lee del token.
    // El correo del token queda desactualizado si el usuario lo cambió después
    // de iniciar sesión: se conserva el guardado si es la misma cuenta.
    const sameAccount = stored !== null && stored.id === dto.user.id;
    const user = AuthMapper.userToDomain({
      ...dto.user,
      email: sameAccount ? stored.email : dto.user.email,
      role: claims?.role ?? dto.user.role,
      walletBalance: dto.user.walletBalance ?? stored?.walletBalance,
    });
    this.storage.setUser(AuthMapper.userToDto(user));
    return user;
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  saveSessionUser(user: AuthUser): void {
    this.storage.setUser(AuthMapper.userToDto(user));
  }

  getStoredSession(): AuthSession | null {
    const token = this.storage.getToken();
    const userDto = this.storage.getUser();
    if (!token || !userDto) {
      return null;
    }
    // Un token ilegible o vencido no es una sesión válida: se limpia.
    const claims = decodeJwtClaims(token);
    if (!claims || isJwtExpired(claims)) {
      this.storage.clear();
      return null;
    }
    return {
      accessToken: token,
      tokenType: 'Bearer',
      user: AuthMapper.userToDomain({ ...userDto, role: claims.role }),
    };
  }
}
