import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PriceAlert,
  WishlistGameInfo,
  WishlistItem,
} from '../../domain/entities/WishlistItem';

export interface WishlistRecord {
  id: string;
  game: WishlistGameInfo;
  targetPrice: number | null;
  createdAt?: string;
}

export function serializeWishlistItem(entity: WishlistItem): WishlistRecord {
  return {
    id: entity.id,
    game: entity.game,
    targetPrice: entity.targetPrice,
    createdAt: entity.createdAt?.toISOString(),
  };
}

export function deserializeWishlistItem(record: WishlistRecord): WishlistItem {
  return new WishlistItem({
    id: record.id,
    game: record.game,
    targetPrice: record.targetPrice,
    createdAt: record.createdAt ? new Date(record.createdAt) : undefined,
  });
}

export interface WishlistState {
  items: WishlistRecord[];
  alerts: PriceAlert[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  alerts: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setWishlistItems(state, action: PayloadAction<WishlistRecord[]>) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setPriceAlerts(state, action: PayloadAction<PriceAlert[]>) {
      state.alerts = action.payload;
    },
    upsertPriceAlert(state, action: PayloadAction<PriceAlert>) {
      state.alerts = [
        action.payload,
        ...state.alerts.filter(
          (alert) => alert.wishlistItemId !== action.payload.wishlistItemId,
        ),
      ];
    },
    addWishlistRecord(state, action: PayloadAction<WishlistRecord>) {
      state.items.unshift(action.payload);
    },
    removeWishlistRecord(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // La alerta de un juego que ya no está en la lista deja de tener sentido
      state.alerts = state.alerts.filter(
        (alert) => alert.wishlistItemId !== action.payload,
      );
    },
    setWishlistError(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetWishlistState() {
      return { ...initialState };
    },
  },
});

export const {
  setWishlistLoading,
  setWishlistItems,
  setPriceAlerts,
  addWishlistRecord,
  removeWishlistRecord,
  setWishlistError,
  resetWishlistState,
  upsertPriceAlert,
} = wishlistSlice.actions;

export const wishlistReducer = wishlistSlice.reducer;
