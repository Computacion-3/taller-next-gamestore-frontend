import { PriceAlert, WishlistItem } from '../../domain/entities/WishlistItem';
import {
  AddWishlistItemParams,
  WishlistRepository,
} from '../../domain/repositories/WishlistRepository';
import { WishlistDatasource } from '../datasources/WishlistDatasource';
import { WishlistMapper } from '../mappers/WishlistMapper';

export class WishlistRepositoryImpl implements WishlistRepository {
  constructor(private readonly datasource: WishlistDatasource) {}

  async getMine(): Promise<WishlistItem[]> {
    const dtos = await this.datasource.getMine();
    return dtos.map(WishlistMapper.toDomain);
  }

  async getPriceAlerts(): Promise<PriceAlert[]> {
    const dtos = await this.datasource.getPriceAlerts();
    return dtos.map(WishlistMapper.alertToDomain);
  }

  async add(params: AddWishlistItemParams): Promise<WishlistItem> {
    const dto = await this.datasource.add(WishlistMapper.toAddDto(params));
    return WishlistMapper.toDomain(dto);
  }

  async remove(id: string): Promise<void> {
    await this.datasource.remove(id);
  }
}