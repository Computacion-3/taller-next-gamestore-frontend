import { GameDto } from '@/features/games/infrastructure/dtos/GameDto';
import { PriceAlertDto } from '@/features/wishlist/infrastructure/repositories/WishlistRepositoryImpl';

/** Deben coincidir con RealtimeEvents del backend. */
export const REALTIME_EVENTS = {
  GAME_DISCOUNT_UPDATED: 'game:discount-updated',
  WISHLIST_PRICE_ALERT: 'wishlist:price-alert',
} as const;

export interface GameDiscountUpdatedDto {
  game: GameDto;
}

export type PriceAlertEventDto = PriceAlertDto;