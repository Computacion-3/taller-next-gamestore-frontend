import { UserAccount } from '../../domain/entities/UserAccount';
import { ChangePasswordParams } from '../../domain/repositories/UserRepository';
import { ChangePasswordDto, UserAccountDto } from '../dtos/UserAccountDto';

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

  static toChangePasswordDto(params: ChangePasswordParams): ChangePasswordDto {
    return {
      currentPassword: params.currentPassword,
      newPassword: params.newPassword,
    };
  }
}