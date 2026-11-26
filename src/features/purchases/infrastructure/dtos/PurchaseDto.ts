import { GameDto } from '@/features/games/infrastructure/dtos/GameDto';
import { PurchaseStatus } from '../../domain/entities/Purchase';

export interface PurchaseItemDto {
  id: string;
  priceAtPurchase: number;
  game: GameDto;
}

export interface PurchaseDto {
  id: string;
  user?: { id: string; email: string };
  totalAmount: number;
  status: PurchaseStatus;
  items: PurchaseItemDto[];
  createdAt: string;
}

export interface CreatePurchaseDto {
  gameIds: string[];
}