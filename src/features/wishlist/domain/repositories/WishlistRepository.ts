import { PriceAlert, WishlistItem } from '../entities/WishlistItem';

export interface AddWishlistItemParams {
  gameId: string;
  targetPrice?: number;
}

export interface WishlistRepository {
  getMine(): Promise<WishlistItem[]>;
  getPriceAlerts(): Promise<PriceAlert[]>;
  add(params: AddWishlistItemParams): Promise<WishlistItem>;
  remove(id: string): Promise<void>;
}
