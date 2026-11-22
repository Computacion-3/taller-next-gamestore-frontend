import { LibraryItem } from '../entities/LibraryItem';
import { LibraryRepository } from '../repositories/LibraryRepository';

export class GetMyLibraryUseCase {
  constructor(private readonly repository: LibraryRepository) {}
  execute(): Promise<LibraryItem[]> {
    return this.repository.getMine();
  }
}

export class GetUserLibraryUseCase {
  constructor(private readonly repository: LibraryRepository) {}
  execute(userId: string): Promise<LibraryItem[]> {
    return this.repository.getByUser(userId);
  }
}
