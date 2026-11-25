import { AuthSession, AuthUser } from '../../domain/entities/AuthUser';
import { AuthResponseDto, AuthUserDto } from '../dtos/AuthDto';
import { decodeJwtClaims } from '../jwt/jwtClaims';

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
    // El rol se toma del payload del JWT (fuente de verdad de la sesión);
    // si el token no se pudiera leer, se usa el del cuerpo de la respuesta.
    const claims = decodeJwtClaims(dto.accessToken);
    return {
      accessToken: dto.accessToken,
      tokenType: dto.tokenType ?? 'Bearer',
      user: AuthMapper.userToDomain({
        ...dto.user,
        role: claims?.role ?? dto.user.role,
      }),
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
