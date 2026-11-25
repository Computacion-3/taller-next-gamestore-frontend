import { CreatePurchaseDto, PurchaseDto } from '../dtos/PurchaseDto';

export interface PurchaseDatasource {
  create(dto: CreatePurchaseDto): Promise<PurchaseDto>;
  getMine(): Promise<PurchaseDto[]>;
  getAll(): Promise<PurchaseDto[]>;
  getById(id: string): Promise<PurchaseDto>;
}