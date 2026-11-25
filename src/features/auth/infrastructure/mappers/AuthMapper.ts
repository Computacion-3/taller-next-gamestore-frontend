import { AuthSession, AuthUser } from '../../domain/entities/AuthUser';
import { AuthResponseDto, AuthUserDto } from '../dtos/AuthDto';

export class AuthMapper {
  static userToDomain(dto: AuthUserDto): AuthUser {
    return new AuthUser({
      id: dto.id,
      email: dto.email,
      role: dto.role,
      walletBalance: dto.walletBalance,
    });
  }

  static sessionToDomain(dto: AuthResponseDto): AuthSession {
    return {
      accessToken: dto.accessToken,
      tokenType: dto.tokenType ?? 'Bearer',
      user: AuthMapper.userToDomain(dto.user),
    };
  }

  static userToDto(entity: AuthUser): AuthUserDto {
    return {
      id: entity.id,
      email: entity.email,
      role: entity.role,
      walletBalance: entity.walletBalance,
    };
  }
}
