import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUserProps } from '../../domain/entities/AuthUser';

export interface AuthState {
  user: AuthUserProps | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
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
    setAuthSession(state, action: PayloadAction<SetSessionPayload>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setAuthUser(state, action: PayloadAction<AuthUserProps>) {
      state.user = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetAuthState() {
      return { ...initialAuthState };
    },
  },
});

export const {
  setAuthLoading,
  setAuthSession,
  setAuthUser,
  setAuthError,
  resetAuthState,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
