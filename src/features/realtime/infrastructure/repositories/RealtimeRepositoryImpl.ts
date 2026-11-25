import { GameMapper } from '@/features/games/infrastructure/mappers/GameMapper';
import { WishlistMapper } from '@/features/wishlist/infrastructure/repositories/WishlistRepositoryImpl';
import { SocketDatasource } from '@/shared/infrastructure/datasources/SocketDatasource';
import { RealtimeHandlers } from '../../domain/entities/RealtimeEvents';
import { RealtimeRepository } from '../../domain/repositories/RealtimeRepository';
import {
  GameDiscountUpdatedDto,
  PriceAlertEventDto,
  REALTIME_EVENTS,
} from '../dtos/RealtimeEventDto';

export class RealtimeRepositoryImpl implements RealtimeRepository {
  private unsubscribers: Array<() => void> = [];

  constructor(private readonly socket: SocketDatasource) {}

  connect(token: string, handlers: RealtimeHandlers): void {
    this.disconnect();

    this.unsubscribers = [
      this.socket.on('connect', () => handlers.onStatusChange('connected')),
      this.socket.on<string>('disconnect', (reason) =>
        handlers.onStatusChange('disconnected', reason),
      ),
      this.socket.on<Error>('connect_error', (err) =>
        handlers.onStatusChange('error', err.message),
      ),
      this.socket.on<GameDiscountUpdatedDto>(
        REALTIME_EVENTS.GAME_DISCOUNT_UPDATED,
        (dto) => handlers.onGameDiscountUpdated({ game: GameMapper.toDomain(dto.game) }),
      ),
      this.socket.on<PriceAlertEventDto>(
        REALTIME_EVENTS.WISHLIST_PRICE_ALERT,
        (dto) => handlers.onPriceAlert(WishlistMapper.alertToDomain(dto)),
      ),
    ];

    handlers.onStatusChange('connecting');
    this.socket.connect(token);
  }

  disconnect(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
    this.socket.disconnect();
  }
}