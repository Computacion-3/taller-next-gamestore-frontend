import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import { UserAccount } from '../../domain/entities/UserAccount';
import {
  ChangePasswordParams,
  UserRepository,
} from '../../domain/repositories/UserRepository';

export interface UserAccountDto {
  id: string;
  email: string;
  walletBalance: number;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDatasource {
  getAll(): Promise<UserAccountDto[]>;
  getById(id: string): Promise<UserAccountDto>;
  getMyProfile(): Promise<UserAccountDto>;
  updateMyEmail(email: string): Promise<UserAccountDto>;
  changeMyPassword(params: ChangePasswordParams): Promise<void>;
  updateRole(id: string, role: UserRole): Promise<UserAccountDto>;
}

export class UserRestDatasource implements UserDatasource {
  private readonly http: RestHttpClient;

  constructor(baseUrl?: string, getToken?: () => string | null) {
    this.http = new RestHttpClient(baseUrl, getToken);
  }

  getAll(): Promise<UserAccountDto[]> {
    return this.http.request<UserAccountDto[]>('/users');
  }

  getById(id: string): Promise<UserAccountDto> {
    return this.http.request<UserAccountDto>(`/users/${id}`);
  }

  getMyProfile(): Promise<UserAccountDto> {
    return this.http.request<UserAccountDto>('/users/me');
  }

  updateMyEmail(email: string): Promise<UserAccountDto> {
    return this.http.request<UserAccountDto>('/users/me', {
      method: 'PATCH',
      body: { email },
    });
  }

  async changeMyPassword(params: ChangePasswordParams): Promise<void> {
    await this.http.request('/users/me/password', {
      method: 'PATCH',
      body: params,
    });
  }

  updateRole(id: string, role: UserRole): Promise<UserAccountDto> {
    return this.http.request<UserAccountDto>(`/users/${id}/role`, {
      method: 'PATCH',
      body: { role },
    });
  }
}

export class UserMapper {
  static toDomain(dto: UserAccountDto): UserAccount {
    return new UserAccount({
      id: dto.id,
      email: dto.email,
      walletBalance: Number(dto.walletBalance ?? 0),
      role: dto.role,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: UserDatasource) {}

  async getAll(): Promise<UserAccount[]> {
    const dtos = await this.datasource.getAll();
    return dtos.map(UserMapper.toDomain);
  }

  async getById(id: string): Promise<UserAccount> {
    const dto = await this.datasource.getById(id);
    return UserMapper.toDomain(dto);
  }

  async getMyProfile(): Promise<UserAccount> {
    const dto = await this.datasource.getMyProfile();
    return UserMapper.toDomain(dto);
  }

  async updateMyEmail(email: string): Promise<UserAccount> {
    const dto = await this.datasource.updateMyEmail(email);
    return UserMapper.toDomain(dto);
  }

  async changeMyPassword(params: ChangePasswordParams): Promise<void> {
    await this.datasource.changeMyPassword(params);
  }

  async updateRole(id: string, role: UserRole): Promise<UserAccount> {
    const dto = await this.datasource.updateRole(id, role);
    return UserMapper.toDomain(dto);
  }
}
