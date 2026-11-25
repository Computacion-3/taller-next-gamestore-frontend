import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import { LibraryItemDto } from '../dtos/LibraryItemDto';
import { LibraryDatasource } from './LibraryDatasource';

export class LibraryRestDatasource implements LibraryDatasource {
  private readonly http: RestHttpClient;

  constructor(baseUrl?: string, getToken?: () => string | null) {
    this.http = new RestHttpClient(baseUrl, getToken);
  }

  getMine(): Promise<LibraryItemDto[]> {
    return this.http.request<LibraryItemDto[]>('/library/me');
  }

  getByUser(userId: string): Promise<LibraryItemDto[]> {
    return this.http.request<LibraryItemDto[]>(`/library/user/${userId}`);
  }
}