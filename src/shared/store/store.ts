import { combineReducers, configureStore, UnknownAction } from '@reduxjs/toolkit';
import {
  authReducer,
  resetAuthState,
} from '@/features/auth/presentation/store/auth.slice';
import { categoriesReducer } from '@/features/categories/presentation/store/categories.slice';
import { gamesReducer } from '@/features/games/presentation/store/games.slice';
import { libraryReducer } from '@/features/library/presentation/store/library.slice';
import { purchasesReducer } from '@/features/purchases/presentation/store/purchases.slice';
import { usersReducer } from '@/features/users/presentation/store/users.slice';
import { wishlistReducer } from '@/features/wishlist/presentation/store/wishlist.slice';
import { uiReducer } from './ui.slice';
import { realtimeReducer } from '@/features/realtime/presentation/store/realtime.slice';

const appReducer = combineReducers({
  auth: authReducer,
  games: gamesReducer,
  categories: categoriesReducer,
  wishlist: wishlistReducer,
  library: libraryReducer,
  purchases: purchasesReducer,
  users: usersReducer,
  realtime: realtimeReducer,
  ui: uiReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: UnknownAction,
) => {
  if (action.type === resetAuthState.type) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
