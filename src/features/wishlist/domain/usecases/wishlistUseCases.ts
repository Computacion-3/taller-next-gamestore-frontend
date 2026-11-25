import { PriceAlert, WishlistItem } from '../entities/WishlistItem';
import {
  AddWishlistItemParams,
  WishlistRepository,
} from '../repositories/WishlistRepository';

export class GetMyWishlistUseCase {
  constructor(private readonly repository: WishlistRepository) {}
  execute(): Promise<WishlistItem[]> {
    return this.repository.getMine();
  }
}

export class GetPriceAlertsUseCase {
  constructor(private readonly repository: WishlistRepository) {}
  execute(): Promise<PriceAlert[]> {
    return this.repository.getPriceAlerts();
  }
}

export class AddWishlistItemUseCase {
  constructor(private readonly repository: WishlistRepository) {}
  execute(params: AddWishlistItemParams): Promise<WishlistItem> {
    if (!params.gameId) {
      throw new Error('El identificador del videojuego es obligatorio.');
    }
    if (
      params.targetPrice !== undefined &&
      (!Number.isFinite(params.targetPrice) || params.targetPrice < 0)
    ) {
      throw new Error('El precio objetivo debe ser un número mayor o igual a 0.');
    }
    return this.repository.add(params);
  }
}

export class RemoveWishlistItemUseCase {
  constructor(private readonly repository: WishlistRepository) {}
  execute(id: string): Promise<void> {
    return this.repository.remove(id);
  }
}
