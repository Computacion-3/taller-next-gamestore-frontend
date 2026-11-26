import { AddWishlistItemDto, PriceAlertDto, WishlistItemDto } from '../dtos/WishlistDto';

export interface WishlistDatasource {
  getMine(): Promise<WishlistItemDto[]>;
  getPriceAlerts(): Promise<PriceAlertDto[]>;
  add(dto: AddWishlistItemDto): Promise<WishlistItemDto>;
  remove(id: string): Promise<void>;
}