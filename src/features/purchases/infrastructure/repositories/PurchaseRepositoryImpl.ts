import { GameDto } from '@/features/games/infrastructure/dtos/GameDto';
import { GameMapper } from '@/features/games/infrastructure/mappers/GameMapper';
import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import { Purchase, PurchaseStatus } from '../../domain/entities/Purchase';
import {
  CreatePurchaseParams,
  PurchaseRepository,
} from '../../domain/repositories/PurchaseRepository';

export interface PurchaseDto {
  id: string;
  user?: { id: string; email: string };
  totalAmount: number;
  status: PurchaseStatus;
  items: Array<{
    id: string;
    priceAtPurchase: number;
    game: GameDto;
  }>;
  createdAt: string;
}

export interface PurchaseDatasource {
  create(params: CreatePurchaseParams): Promise<PurchaseDto>;
  getMine(): Promise<PurchaseDto[]>;
  getAll(): Promise<PurchaseDto[]>;
  getById(id: string): Promise<PurchaseDto>;
}

export class PurchaseRestDatasource implements PurchaseDatasource {
  private readonly http: RestHttpClient;

  constructor(baseUrl?: string, getToken?: () => string | null) {
    this.http = new RestHttpClient(baseUrl, getToken);
  }

  create(params: CreatePurchaseParams): Promise<PurchaseDto> {
    return this.http.request<PurchaseDto>('/purchases', {
      method: 'POST',
      body: params,
    });
  }

  getMine(): Promise<PurchaseDto[]> {
    return this.http.request<PurchaseDto[]>('/purchases/me');
  }

  getAll(): Promise<PurchaseDto[]> {
    return this.http.request<PurchaseDto[]>('/purchases');
  }

  getById(id: string): Promise<PurchaseDto> {
    return this.http.request<PurchaseDto>(`/purchases/${id}`);
  }
}

export class PurchaseMapper {
  static toDomain(dto: PurchaseDto): Purchase {
    return new Purchase({
      id: dto.id,
      user: dto.user,
      totalAmount: Number(dto.totalAmount),
      status: dto.status,
      items: (dto.items ?? []).map((item) => ({
        id: item.id,
        priceAtPurchase: Number(item.priceAtPurchase),
        game: GameMapper.toDomain(item.game),
      })),
      createdAt: new Date(dto.createdAt),
    });
  }
}

export class PurchaseRepositoryImpl implements PurchaseRepository {
  constructor(private readonly datasource: PurchaseDatasource) {}

  async create(params: CreatePurchaseParams): Promise<Purchase> {
    const dto = await this.datasource.create(params);
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
