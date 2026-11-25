import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  deserializeGame,
  GameRecord,
  serializeGame,
} from '@/features/games/presentation/store/games.slice';
import { Purchase, PurchaseStatus } from '../../domain/entities/Purchase';

export interface PurchaseRecord {
  id: string;
  user?: { id: string; email: string };
  totalAmount: number;
  status: PurchaseStatus;
  items: Array<{
    id: string;
    priceAtPurchase: number;
    game: GameRecord;
  }>;
  createdAt: string;
}

export function serializePurchase(entity: Purchase): PurchaseRecord {
  return {
    id: entity.id,
    user: entity.user,
    totalAmount: entity.totalAmount,
    status: entity.status,
    items: entity.items.map((item) => ({
      id: item.id,
      priceAtPurchase: item.priceAtPurchase,
      game: serializeGame(item.game),
    })),
    createdAt: entity.createdAt.toISOString(),
  };
}

export function deserializePurchase(record: PurchaseRecord): Purchase {
  return new Purchase({
    id: record.id,
    user: record.user,
    totalAmount: record.totalAmount,
    status: record.status,
    items: record.items.map((item) => ({
      id: item.id,
      priceAtPurchase: item.priceAtPurchase,
      game: deserializeGame(item.game),
    })),
    createdAt: new Date(record.createdAt),
  });
}

export interface PurchasesState {
  /** Compras del usuario con sesión (GET /purchases/me). */
  items: PurchaseRecord[];
  /** Todas las compras de la tienda (GET /purchases, solo admin). */
  allItems: PurchaseRecord[];
  selected: PurchaseRecord | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PurchasesState = {
  items: [],
  allItems: [],
  selected: null,
  isLoading: false,
  error: null,
};

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setPurchasesLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setPurchases(state, action: PayloadAction<PurchaseRecord[]>) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setAllPurchases(state, action: PayloadAction<PurchaseRecord[]>) {
      state.allItems = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addPurchase(state, action: PayloadAction<PurchaseRecord>) {
      state.items.unshift(action.payload);
    },
    setSelectedPurchase(state, action: PayloadAction<PurchaseRecord | null>) {
      state.selected = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setPurchasesError(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetPurchasesState() {
      return { ...initialState };
    },
  },
});

export const {
  setPurchasesLoading,
  setPurchases,
  setAllPurchases,
  addPurchase,
  setSelectedPurchase,
  setPurchasesError,
  resetPurchasesState,
} = purchasesSlice.actions;

export const purchasesReducer = purchasesSlice.reducer;