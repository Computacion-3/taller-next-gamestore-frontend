import { GameMapper } from '@/features/games/infrastructure/mappers/GameMapper';
import { Purchase } from '../../domain/entities/Purchase';
import { CreatePurchaseParams } from '../../domain/repositories/PurchaseRepository';
import { CreatePurchaseDto, PurchaseDto } from '../dtos/PurchaseDto';

export class PurchaseMapper {
  static toDomain(dto: PurchaseDto): Purchase {
    return new Purchase({
      id: dto.id,
      user: dto.user,
      totalAmount: Number(dto.totalAmount),
      status: dto.status,
      items: (dto.items ?? []).map((item) => ({
        id: item.id,
        priceAtPurchase: Number(item.priceAtPurchase),
        game: GameMapper.toDomain(item.game),
      })),
      createdAt: new Date(dto.createdAt),
    });
  }

  static toCreateDto(params: CreatePurchaseParams): CreatePurchaseDto {
    return { gameIds: params.gameIds };
  }
}