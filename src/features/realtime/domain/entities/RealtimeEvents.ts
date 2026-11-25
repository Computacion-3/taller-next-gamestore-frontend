import { Game } from '@/features/games/domain/entities/Game';
import { PriceAlert } from '@/features/wishlist/domain/entities/WishlistItem';

export type RealtimeStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface GameDiscountUpdatedEvent {
  game: Game;
}

/** Lo que la capa de presentación quiere que pase con cada evento. */
export interface RealtimeHandlers {
  onStatusChange(status: RealtimeStatus, detail?: string): void;
  onGameDiscountUpdated(event: GameDiscountUpdatedEvent): void;
  onPriceAlert(alert: PriceAlert): void;
}