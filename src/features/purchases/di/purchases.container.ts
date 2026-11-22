import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import {
  CreatePurchaseUseCase,
  GetAllPurchasesUseCase,
  GetMyPurchasesUseCase,
} from '../domain/usecases/purchaseUseCases';
import {
  PurchaseRepositoryImpl,
  PurchaseRestDatasource,
} from '../infrastructure/repositories/PurchaseRepositoryImpl';

const datasource = new PurchaseRestDatasource(undefined, () =>
  tokenStorage.getToken(),
);
const purchaseRepository = new PurchaseRepositoryImpl(datasource);

export const purchasesContainer = {
  createPurchaseUseCase: new CreatePurchaseUseCase(purchaseRepository),
  getMyPurchasesUseCase: new GetMyPurchasesUseCase(purchaseRepository),
  getAllPurchasesUseCase: new GetAllPurchasesUseCase(purchaseRepository),
  purchaseRepository,
};
