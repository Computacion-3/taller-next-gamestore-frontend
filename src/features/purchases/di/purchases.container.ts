import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import {
  CreatePurchaseUseCase,
  GetAllPurchasesUseCase,
  GetMyPurchasesUseCase,
  GetPurchaseByIdUseCase,
} from '../domain/usecases/purchaseUseCases';
import { PurchaseRestDatasource } from '../infrastructure/datasources/PurchaseRestDatasource';
import { PurchaseRepositoryImpl } from '../infrastructure/repositories/PurchaseRepositoryImpl';

const datasource = new PurchaseRestDatasource(undefined, () =>
  tokenStorage.getToken(),
);
const purchaseRepository = new PurchaseRepositoryImpl(datasource);

export const purchasesContainer = {
  createPurchaseUseCase: new CreatePurchaseUseCase(purchaseRepository),
  getMyPurchasesUseCase: new GetMyPurchasesUseCase(purchaseRepository),
  getAllPurchasesUseCase: new GetAllPurchasesUseCase(purchaseRepository),
  getPurchaseByIdUseCase: new GetPurchaseByIdUseCase(purchaseRepository),
  purchaseRepository,
};
