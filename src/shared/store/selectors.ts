import { Authority } from '@/features/auth/domain/entities/Authority';
import type { RootState } from './store';

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthorities = (state: RootState) => state.auth.authorities;
export const selectHasAuthority =
  (authority: Authority) => (state: RootState) =>
    state.auth.authorities.includes(authority);

export const selectGamesState = (state: RootState) => state.games;
export const selectCategoriesState = (state: RootState) => state.categories;
export const selectWishlistState = (state: RootState) => state.wishlist;
export const selectLibraryState = (state: RootState) => state.library;
export const selectPurchasesState = (state: RootState) => state.purchases;
export const selectUsersState = (state: RootState) => state.users;
export const selectToasts = (state: RootState) => state.ui.toasts;
