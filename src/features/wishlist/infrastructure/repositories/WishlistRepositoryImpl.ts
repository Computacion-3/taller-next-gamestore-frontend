import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import {
  PriceAlert,
  WishlistItem,
} from '../../domain/entities/WishlistItem';
import {
  AddWishlistItemParams,
  WishlistRepository,
} from '../../domain/repositories/WishlistRepository';

export interface WishlistItemDto {
  id: string;
  game: {
    id: string;
    title: string;
    currentPrice: number;
    description?: string;
    developer?: string;
    isActive?: boolean;
  };
  targetPrice: number | null;
  createdAt?: string;
}

export interface PriceAlertDto {
  wishlistItemId: string;
  gameId: string;
  title: string;
  currentPrice: number;
  targetPrice: number;
  message: string;
}

export interface WishlistDatasource {
  getMine(): Promise<WishlistItemDto[]>;
  getPriceAlerts(): Promise<PriceAlertDto[]>;
  add(params: AddWishlistItemParams): Promise<WishlistItemDto>;
  remove(id: string): Promise<void>;
}

export class WishlistRestDatasource implements WishlistDatasource {
  private readonly http: RestHttpClient;

  constructor(baseUrl?: string, getToken?: () => string | null) {
    this.http = new RestHttpClient(baseUrl, getToken);
  }

  getMine(): Promise<WishlistItemDto[]> {
    return this.http.request<WishlistItemDto[]>('/wishlist');
  }

  getPriceAlerts(): Promise<PriceAlertDto[]> {
    return this.http.request<PriceAlertDto[]>('/wishlist/alerts');
  }

  add(params: AddWishlistItemParams): Promise<WishlistItemDto> {
    return this.http.request<WishlistItemDto>('/wishlist', {
      method: 'POST',
      body: params,
    });
  }

  async remove(id: string): Promise<void> {
    await this.http.request(`/wishlist/${id}`, { method: 'DELETE' });
  }
}

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
}

export class WishlistRepositoryImpl implements WishlistRepository {
  constructor(private readonly datasource: WishlistDatasource) {}

  async getMine(): Promise<WishlistItem[]> {
    const dtos = await this.datasource.getMine();
    return dtos.map(WishlistMapper.toDomain);
  }

  async getPriceAlerts(): Promise<PriceAlert[]> {
    const dtos = await this.datasource.getPriceAlerts();
    return dtos.map(WishlistMapper.alertToDomain);
  }

  async add(params: AddWishlistItemParams): Promise<WishlistItem> {
    const dto = await this.datasource.add(params);
    return WishlistMapper.toDomain(dto);
  }

  async remove(id: string): Promise<void> {
    await this.datasource.remove(id);
  }
}
