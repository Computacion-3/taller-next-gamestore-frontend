import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import {
  AddWishlistItemUseCase,
  GetMyWishlistUseCase,
  GetPriceAlertsUseCase,
  RemoveWishlistItemUseCase,
} from '../domain/usecases/wishlistUseCases';
import { WishlistRestDatasource } from '../infrastructure/datasources/WishlistRestDatasource';
import { WishlistRepositoryImpl } from '../infrastructure/repositories/WishlistRepositoryImpl';
const datasource = new WishlistRestDatasource(undefined, () =>
  tokenStorage.getToken(),
);
const wishlistRepository = new WishlistRepositoryImpl(datasource);

export const wishlistContainer = {
  getMyWishlistUseCase: new GetMyWishlistUseCase(wishlistRepository),
  getPriceAlertsUseCase: new GetPriceAlertsUseCase(wishlistRepository),
  addWishlistItemUseCase: new AddWishlistItemUseCase(wishlistRepository),
  removeWishlistItemUseCase: new RemoveWishlistItemUseCase(wishlistRepository),
  wishlistRepository,
};
