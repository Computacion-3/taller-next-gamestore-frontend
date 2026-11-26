import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import { CreatePurchaseDto, PurchaseDto } from '../dtos/PurchaseDto';
import { PurchaseDatasource } from './PurchaseDatasource';

export class PurchaseRestDatasource implements PurchaseDatasource {
  private readonly http: RestHttpClient;

  constructor(baseUrl?: string, getToken?: () => string | null) {
    this.http = new RestHttpClient(baseUrl, getToken);
  }

  create(dto: CreatePurchaseDto): Promise<PurchaseDto> {
    return this.http.request<PurchaseDto>('/purchases', { method: 'POST', body: dto });
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