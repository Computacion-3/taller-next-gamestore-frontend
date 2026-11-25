export interface GameDto {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  developer: string;
  releaseDate: string;
  coverImage: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGameDto {
  title: string;
  description: string;
  price: number;
  discount?: number;
  developer: string;
  releaseDate: string;
  coverImage?: string;
  categoryIds?: string[];
}

export interface UpdateGameDto {
  title?: string;
  description?: string;
  price?: number;
  developer?: string;
  releaseDate?: string;
  coverImage?: string;
  categoryIds?: string[];
}

export interface PaginatedGamesDto {
  items: GameDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}