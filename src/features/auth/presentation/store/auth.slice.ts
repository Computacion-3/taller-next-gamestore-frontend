import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Authority,
  getAuthoritiesForRole,
} from '../../domain/entities/Authority';
import { AuthUserProps } from '../../domain/entities/AuthUser';

export interface AuthState {
  user: AuthUserProps | null;
  token: string | null;
  authorities: Authority[];
  isAuthenticated: boolean;
  hydrated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  authorities: [],
  isAuthenticated: false,
  hydrated: false,
  isLoading: false,
  error: null,
};

interface SetSessionPayload {
  token: string;
  user: AuthUserProps;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setAuthHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },
    setAuthSession(state, action: PayloadAction<SetSessionPayload>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.authorities = getAuthoritiesForRole(action.payload.user.role);
      state.isAuthenticated = true;
      state.hydrated = true;
      state.isLoading = false;
      state.error = null;
    },
    setAuthUser(state, action: PayloadAction<AuthUserProps>) {
      state.user = action.payload;
      state.authorities = getAuthoritiesForRole(action.payload.role);
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetAuthState() {
      return { ...initialAuthState, hydrated: true };
    },
  },
});

export const {
  setAuthLoading,
  setAuthHydrated,
  setAuthSession,
  setAuthUser,
  setAuthError,
  resetAuthState,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
