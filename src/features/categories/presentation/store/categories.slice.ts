import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export interface CategoriesState {
  items: CategoryRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
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
  addCategory,
  replaceCategory,
  removeCategory,
  setCategoriesError,
  resetCategoriesState,
} = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;
