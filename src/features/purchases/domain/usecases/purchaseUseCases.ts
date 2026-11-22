import { Purchase } from '../entities/Purchase';
import {
  CreatePurchaseParams,
  PurchaseRepository,
} from '../repositories/PurchaseRepository';

export class CreatePurchaseUseCase {
  constructor(private readonly repository: PurchaseRepository) {}
  execute(params: CreatePurchaseParams): Promise<Purchase> {
    if (!params.gameIds || params.gameIds.length === 0) {
      throw new Error('Debes seleccionar al menos un videojuego para comprar.');
    }
    return this.repository.create(params);
  }
}

export class GetMyPurchasesUseCase {
  constructor(private readonly repository: PurchaseRepository) {}
  execute(): Promise<Purchase[]> {
    return this.repository.getMine();
  }
}

export class GetAllPurchasesUseCase {
  constructor(private readonly repository: PurchaseRepository) {}
  execute(): Promise<Purchase[]> {
    return this.repository.getAll();
  }
}
