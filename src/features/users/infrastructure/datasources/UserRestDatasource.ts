import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import { ChangePasswordDto, UserAccountDto } from '../dtos/UserAccountDto';
import { UserDatasource } from './UserDatasource';

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

  async changeMyPassword(dto: ChangePasswordDto): Promise<void> {
    await this.http.request('/users/me/password', { method: 'PATCH', body: dto });
  }

  updateRole(id: string, role: UserRole): Promise<UserAccountDto> {
    return this.http.request<UserAccountDto>(`/users/${id}/role`, {
      method: 'PATCH',
      body: { role },
    });
  }
}