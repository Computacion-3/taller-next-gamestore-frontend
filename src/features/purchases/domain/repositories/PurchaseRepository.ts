import { Purchase } from '../entities/Purchase';

export interface CreatePurchaseParams {
  gameIds: string[];
}

export interface PurchaseRepository {
  create(params: CreatePurchaseParams): Promise<Purchase>;
  getMine(): Promise<Purchase[]>;
  getAll(): Promise<Purchase[]>;
  getById(id: string): Promise<Purchase>;
}
