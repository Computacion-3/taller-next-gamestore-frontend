import { PriceAlert, WishlistItem } from '../../domain/entities/WishlistItem';
import { AddWishlistItemParams } from '../../domain/repositories/WishlistRepository';
import { AddWishlistItemDto, PriceAlertDto, WishlistItemDto } from '../dtos/WishlistDto';

export class WishlistMapper {
  static toDomain(dto: WishlistItemDto): WishlistItem {
    return new WishlistItem({
      id: dto.id,
      game: {
        id: dto.game.id,
        title: dto.game.title,
        currentPrice: Number(dto.game.currentPrice),
        description: dto.game.description,
        developer: dto.game.developer,
        isActive: dto.game.isActive,
      },
      targetPrice:
        dto.targetPrice !== null && dto.targetPrice !== undefined
          ? Number(dto.targetPrice)
          : null,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
    });
  }

  static alertToDomain(dto: PriceAlertDto): PriceAlert {
    return {
      wishlistItemId: dto.wishlistItemId,
      gameId: dto.gameId,
      title: dto.title,
      currentPrice: Number(dto.currentPrice),
      targetPrice: Number(dto.targetPrice),
      message: dto.message,
    };
  }

  static toAddDto(params: AddWishlistItemParams): AddWishlistItemDto {
    return {
      gameId: params.gameId,
      ...(params.targetPrice !== undefined && { targetPrice: params.targetPrice }),
    };
  }
}