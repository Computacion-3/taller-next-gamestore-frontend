import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { UserAccount } from '../../domain/entities/UserAccount';
import {
  ChangePasswordParams,
  UserRepository,
} from '../../domain/repositories/UserRepository';
import { UserDatasource } from '../datasources/UserDatasource';
import { UserMapper } from '../mappers/UserMapper';

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
    await this.datasource.changeMyPassword(UserMapper.toChangePasswordDto(params));
  }

  async updateRole(id: string, role: UserRole): Promise<UserAccount> {
    const dto = await this.datasource.updateRole(id, role);
    return UserMapper.toDomain(dto);
  }
}