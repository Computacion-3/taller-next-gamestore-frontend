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

export interface AddWishlistItemDto {
  gameId: string;
  targetPrice?: number;
}