import { Game } from '@/features/games/domain/entities/Game';

export type PurchaseStatus = 'completed' | 'pending' | 'failed';

export interface PurchaseItem {
  id: string;
  priceAtPurchase: number;
  game: Game;
}

export interface PurchaseProps {
  id: string;
  user?: { id: string; email: string };
  totalAmount: number;
  status: PurchaseStatus;
  items: PurchaseItem[];
  createdAt: Date;
}

export class Purchase {
  public readonly id: string;
  public readonly user?: { id: string; email: string };
  public readonly totalAmount: number;
  public readonly status: PurchaseStatus;
  public readonly items: PurchaseItem[];
  public readonly createdAt: Date;

  constructor(props: PurchaseProps) {
    if (props.totalAmount < 0) {
      throw new Error('El total de la compra no puede ser negativo.');
    }
    this.id = props.id;
    this.user = props.user;
    this.totalAmount = props.totalAmount;
    this.status = props.status;
    this.items = props.items;
    this.createdAt = props.createdAt;
  }
}
