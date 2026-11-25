import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameRecord } from '@/features/games/presentation/store/games.slice';
import { Category } from '../../domain/entities/Category';

export interface CategoryRecord {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
}

export function serializeCategory(entity: Category): CategoryRecord {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    createdAt: entity.createdAt?.toISOString(),
  };
}

export function deserializeCategory(record: CategoryRecord): Category {
  return new Category({
    id: record.id,
    name: record.name,
    description: record.description,
    createdAt: record.createdAt ? new Date(record.createdAt) : undefined,
  });
}

export interface CategoryDetailRecord {
  category: CategoryRecord;
  games: GameRecord[];
}

/** Categorías de un juego concreto (detalle del juego y administración). */
export interface GameCategoriesRecord {
  gameId: string;
  items: CategoryRecord[];
}

export interface CategoriesState {
  items: CategoryRecord[];
  detail: CategoryDetailRecord | null;
  gameCategories: GameCategoriesRecord | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  detail: null,
  gameCategories: null,
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoriesLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setCategories(state, action: PayloadAction<CategoryRecord[]>) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCategoryDetail(state, action: PayloadAction<CategoryDetailRecord>) {
      state.detail = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setGameCategories(state, action: PayloadAction<GameCategoriesRecord>) {
      state.gameCategories = action.payload;
    },
    addCategory(state, action: PayloadAction<CategoryRecord>) {
      state.items.push(action.payload);
    },
    replaceCategory(state, action: PayloadAction<CategoryRecord>) {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item,
      );
    },
    removeCategory(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setCategoriesError(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetCategoriesState() {
      return { ...initialState };
    },
  },
});

export const {
  setCategoriesLoading,
  setCategories,
  setCategoryDetail,
  addCategory,
  replaceCategory,
  removeCategory,
  setCategoriesError,
  resetCategoriesState,
  setGameCategories,
} = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;