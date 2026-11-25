import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import { AddWishlistItemDto, PriceAlertDto, WishlistItemDto } from '../dtos/WishlistDto';
import { WishlistDatasource } from './WishlistDatasource';

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

  add(dto: AddWishlistItemDto): Promise<WishlistItemDto> {
    return this.http.request<WishlistItemDto>('/wishlist', { method: 'POST', body: dto });
  }

  async remove(id: string): Promise<void> {
    await this.http.request(`/wishlist/${id}`, { method: 'DELETE' });
  }
}