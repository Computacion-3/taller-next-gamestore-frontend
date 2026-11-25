import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  deserializeGame,
  GameRecord,
  serializeGame,
} from '@/features/games/presentation/store/games.slice';
import { LibraryItem } from '../../domain/entities/LibraryItem';

export interface LibraryRecord {
  id: string;
  game: GameRecord;
  acquisitionDate: string;
}

export function serializeLibraryItem(entity: LibraryItem): LibraryRecord {
  return {
    id: entity.id,
    game: serializeGame(entity.game),
    acquisitionDate: entity.acquisitionDate.toISOString(),
  };
}

export function deserializeLibraryItem(record: LibraryRecord): LibraryItem {
  return new LibraryItem({
    id: record.id,
    game: deserializeGame(record.game),
    acquisitionDate: new Date(record.acquisitionDate),
  });
}

/** Biblioteca de otro usuario consultada por un admin. */
export interface UserLibraryRecord {
  userId: string;
  items: LibraryRecord[];
}

export interface LibraryState {
  items: LibraryRecord[];
  userLibrary: UserLibraryRecord | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LibraryState = {
  items: [],
  userLibrary: null,
  isLoading: false,
  error: null,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLibraryLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setLibraryItems(state, action: PayloadAction<LibraryRecord[]>) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserLibrary(state, action: PayloadAction<UserLibraryRecord>) {
      state.userLibrary = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLibraryError(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetLibraryState() {
      return { ...initialState };
    },
  },
});

export const {
  setLibraryLoading,
  setLibraryItems,
  setUserLibrary,
  setLibraryError,
  resetLibraryState,
} = librarySlice.actions;

export const libraryReducer = librarySlice.reducer;