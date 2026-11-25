import { Purchase } from '../../domain/entities/Purchase';
import {
  CreatePurchaseParams,
  PurchaseRepository,
} from '../../domain/repositories/PurchaseRepository';
import { PurchaseDatasource } from '../datasources/PurchaseDatasource';
import { PurchaseMapper } from '../mappers/PurchaseMapper';

export class PurchaseRepositoryImpl implements PurchaseRepository {
  constructor(private readonly datasource: PurchaseDatasource) {}

  async create(params: CreatePurchaseParams): Promise<Purchase> {
    const dto = await this.datasource.create(PurchaseMapper.toCreateDto(params));
    return PurchaseMapper.toDomain(dto);
  }

  async getMine(): Promise<Purchase[]> {
    const dtos = await this.datasource.getMine();
    return dtos.map(PurchaseMapper.toDomain);
  }

  async getAll(): Promise<Purchase[]> {
    const dtos = await this.datasource.getAll();
    return dtos.map(PurchaseMapper.toDomain);
  }

  async getById(id: string): Promise<Purchase> {
    const dto = await this.datasource.getById(id);
    return PurchaseMapper.toDomain(dto);
  }
}