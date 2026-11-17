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
  originalPrice: number;
  discount?: number;
  developer: string;
  releaseDate: string;
  coverImage?: string | null;
}

export interface UpdateGameDto {
  title?: string;
  description?: string;
  originalPrice?: number;
  developer?: string;
  releaseDate?: string;
  coverImage?: string | null;
}
