import { Game } from '../../domain/entities/Game';
import {
  CreateGameParams,
  PaginatedGames,
  UpdateGameParams,
} from '../../domain/repositories/GameRepository';
import {
  CreateGameDto,
  GameDto,
  PaginatedGamesDto,
  UpdateGameDto,
} from '../dtos/GameDto';

export class GameMapper {
  static toDomain(dto: GameDto): Game {
    return new Game({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      price: Number(dto.price),
      originalPrice: Number(dto.originalPrice),
      discount: Number(dto.discount ?? 0),
      developer: dto.developer,
      releaseDate: new Date(dto.releaseDate),
      coverImage: dto.coverImage ?? null,
      isActive: Boolean(dto.isActive ?? true),
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }

    static toPaginatedDomain(dto: PaginatedGamesDto): PaginatedGames {
    return {
      items: dto.items.map(GameMapper.toDomain),
      total: Number(dto.total),
      page: Number(dto.page),
      limit: Number(dto.limit),
      totalPages: Number(dto.totalPages),
    };
  }

  static toDto(entity: Game): GameDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      price: entity.price,
      originalPrice: entity.originalPrice,
      discount: entity.discount,
      developer: entity.developer,
      releaseDate: entity.releaseDate.toISOString().split('T')[0],
      coverImage: entity.coverImage,
      isActive: entity.isActive,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toCreateDto(params: CreateGameParams): CreateGameDto {
    return {
      title: params.title,
      description: params.description,
      price: params.originalPrice,
      ...(params.discount !== undefined && { discount: params.discount }),
      developer: params.developer,
      releaseDate: params.releaseDate.toISOString().split('T')[0],
      ...(params.coverImage ? { coverImage: params.coverImage } : {}),
      ...(params.categoryIds !== undefined && { categoryIds: params.categoryIds }),
    };
  }

  static toUpdateDto(params: UpdateGameParams): UpdateGameDto {
    return {
      ...(params.title !== undefined && { title: params.title }),
      ...(params.description !== undefined && { description: params.description }),
      ...(params.originalPrice !== undefined && { price: params.originalPrice }),
      ...(params.developer !== undefined && { developer: params.developer }),
      ...(params.releaseDate !== undefined && {
        releaseDate: params.releaseDate.toISOString().split('T')[0],
      }),
      ...(params.coverImage ? { coverImage: params.coverImage } : {}),
      ...(params.categoryIds !== undefined && { categoryIds: params.categoryIds }),
    };
  }
}
