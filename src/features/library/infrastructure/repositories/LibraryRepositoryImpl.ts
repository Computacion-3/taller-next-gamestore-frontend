import { GameDto } from '@/features/games/infrastructure/dtos/GameDto';
import { GameMapper } from '@/features/games/infrastructure/mappers/GameMapper';
import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import { LibraryItem } from '../../domain/entities/LibraryItem';
import { LibraryRepository } from '../../domain/repositories/LibraryRepository';

export interface LibraryItemDto {
  id: string;
  game: GameDto;
  acquisitionDate: string;
}

export interface LibraryDatasource {
  getMine(): Promise<LibraryItemDto[]>;
  getByUser(userId: string): Promise<LibraryItemDto[]>;
}

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

export class LibraryMapper {
  static toDomain(dto: LibraryItemDto): LibraryItem {
    return new LibraryItem({
      id: dto.id,
      game: GameMapper.toDomain(dto.game),
      acquisitionDate: new Date(dto.acquisitionDate),
    });
  }
}

export class LibraryRepositoryImpl implements LibraryRepository {
  constructor(private readonly datasource: LibraryDatasource) {}

  async getMine(): Promise<LibraryItem[]> {
    const dtos = await this.datasource.getMine();
    return dtos.map(LibraryMapper.toDomain);
  }

  async getByUser(userId: string): Promise<LibraryItem[]> {
    const dtos = await this.datasource.getByUser(userId);
    return dtos.map(LibraryMapper.toDomain);
  }
}
