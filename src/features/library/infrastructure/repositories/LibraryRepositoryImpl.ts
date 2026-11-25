import { LibraryItem } from '../../domain/entities/LibraryItem';
import { LibraryRepository } from '../../domain/repositories/LibraryRepository';
import { LibraryDatasource } from '../datasources/LibraryDatasource';
import { LibraryMapper } from '../mappers/LibraryMapper';

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