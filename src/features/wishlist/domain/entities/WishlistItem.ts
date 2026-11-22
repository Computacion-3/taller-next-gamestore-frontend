export interface WishlistGameInfo {
  id: string;
  title: string;
  currentPrice: number;
  description?: string;
  developer?: string;
  isActive?: boolean;
}

export interface WishlistItemProps {
  id: string;
  game: WishlistGameInfo;
  targetPrice: number | null;
  createdAt?: Date;
}

export class WishlistItem {
  public readonly id: string;
  public readonly game: WishlistGameInfo;
  public readonly targetPrice: number | null;
  public readonly createdAt?: Date;

  constructor(props: WishlistItemProps) {
    if (props.targetPrice !== null && props.targetPrice < 0) {
      throw new Error('El precio objetivo no puede ser negativo.');
    }
    this.id = props.id;
    this.game = props.game;
    this.targetPrice = props.targetPrice;
    this.createdAt = props.createdAt;
  }

  get hasReachedTarget(): boolean {
    return (
      this.targetPrice !== null && this.game.currentPrice <= this.targetPrice
    );
  }
}

export interface PriceAlert {
  wishlistItemId: string;
  gameId: string;
  title: string;
  currentPrice: number;
  targetPrice: number;
  message: string;
}
