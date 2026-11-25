import { LibraryItemDto } from '../dtos/LibraryItemDto';

export interface LibraryDatasource {
  getMine(): Promise<LibraryItemDto[]>;
  getByUser(userId: string): Promise<LibraryItemDto[]>;
}