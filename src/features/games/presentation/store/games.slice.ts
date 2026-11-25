import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game } from '../../domain/entities/Game';

export interface GameRecord {
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

export function serializeGame(entity: Game): GameRecord {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    price: entity.price,
    originalPrice: entity.originalPrice,
    discount: entity.discount,
    developer: entity.developer,
    releaseDate: entity.releaseDate.toISOString(),
    coverImage: entity.coverImage,
    isActive: entity.isActive,
    createdAt: entity.createdAt?.toISOString(),
    updatedAt: entity.updatedAt?.toISOString(),
  };
}

export function deserializeGame(record: GameRecord): Game {
  return new Game({
    id: record.id,
    title: record.title,
    description: record.description,
    price: record.price,
    originalPrice: record.originalPrice,
    discount: record.discount,
    developer: record.developer,
    releaseDate: new Date(record.releaseDate),
    coverImage: record.coverImage,
    isActive: record.isActive,
    createdAt: record.createdAt ? new Date(record.createdAt) : undefined,
    updatedAt: record.updatedAt ? new Date(record.updatedAt) : undefined,
  });
}

export interface GamesState {
  items: GameRecord[];
  isLoading: boolean;
  error: string | null;
}

export const initialGamesState: GamesState = {
  items: [],
  isLoading: false,
  error: null,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState: initialGamesState,
  reducers: {
    setGamesLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setGames(state, action: PayloadAction<GameRecord[]>) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addGame(state, action: PayloadAction<GameRecord>) {
      state.items.unshift(action.payload);
    },
    replaceGame(state, action: PayloadAction<GameRecord>) {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item,
      );
    },
    removeGame(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setGamesError(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetGamesState() {
      return { ...initialGamesState };
    },
  },
});

export const {
  setGamesLoading,
  setGames,
  addGame,
  replaceGame,
  removeGame,
  setGamesError,
  resetGamesState,
} = gamesSlice.actions;

export const gamesReducer = gamesSlice.reducer;
