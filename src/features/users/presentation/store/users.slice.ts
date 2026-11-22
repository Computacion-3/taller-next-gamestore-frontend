import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { UserAccount } from '../../domain/entities/UserAccount';

export interface UserRecord {
  id: string;
  email: string;
  walletBalance: number;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export function serializeUser(entity: UserAccount): UserRecord {
  return {
    id: entity.id,
    email: entity.email,
    walletBalance: entity.walletBalance,
    role: entity.role,
    createdAt: entity.createdAt?.toISOString(),
    updatedAt: entity.updatedAt?.toISOString(),
  };
}

export function deserializeUser(record: UserRecord): UserAccount {
  return new UserAccount({
    id: record.id,
    email: record.email,
    walletBalance: record.walletBalance,
    role: record.role,
    createdAt: record.createdAt ? new Date(record.createdAt) : undefined,
    updatedAt: record.updatedAt ? new Date(record.updatedAt) : undefined,
  });
}

export interface UsersState {
  items: UserRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setUsers(state, action: PayloadAction<UserRecord[]>) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    replaceUser(state, action: PayloadAction<UserRecord>) {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item,
      );
    },
    setUsersError(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetUsersState() {
      return { ...initialState };
    },
  },
});

export const {
  setUsersLoading,
  setUsers,
  replaceUser,
  setUsersError,
  resetUsersState,
} = usersSlice.actions;

export const usersReducer = usersSlice.reducer;
