import { LibraryItem } from '../entities/LibraryItem';

export interface LibraryRepository {
  getMine(): Promise<LibraryItem[]>;
  getByUser(userId: string): Promise<LibraryItem[]>;
}
