'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { purchasesContainer } from '../../di/purchases.container';
import { CreatePurchaseParams } from '../../domain/repositories/PurchaseRepository';
import {
  addPurchase,
  deserializePurchase,
  serializePurchase,
  setPurchases,
  setPurchasesError,
  setPurchasesLoading,
  setSelectedPurchase,
} from '../store/purchases.slice';

export function usePurchases() {
  const dispatch = useAppDispatch();
  const { items, selected, isLoading, error } = useAppSelector(
    (root) => root.purchases,
  );

  const purchases = useMemo(() => items.map(deserializePurchase), [items]);
  const selectedPurchase = useMemo(
    () => (selected ? deserializePurchase(selected) : null),
    [selected],
  );

  const fetchMyPurchases = useCallback(async () => {
    dispatch(setPurchasesLoading(true));
    try {
      const result = await purchasesContainer.getMyPurchasesUseCase.execute();
      dispatch(setPurchases(result.map(serializePurchase)));
    } catch (err) {
      dispatch(
        setPurchasesError(
          err instanceof Error ? err.message : 'Error al cargar compras.',
        ),
      );
    }
  }, [dispatch]);

  const fetchAllPurchases = useCallback(async () => {
    dispatch(setPurchasesLoading(true));
    try {
      const result = await purchasesContainer.getAllPurchasesUseCase.execute();
      dispatch(setPurchases(result.map(serializePurchase)));
    } catch (err) {
      dispatch(
        setPurchasesError(
          err instanceof Error
            ? err.message
            : 'Error al cargar historial global de compras.',
        ),
      );
    }
  }, [dispatch]);

  const createPurchase = useCallback(
    async (params: CreatePurchaseParams) => {
      const created =
        await purchasesContainer.createPurchaseUseCase.execute(params);
      dispatch(addPurchase(serializePurchase(created)));
      return created;
    },
    [dispatch],
  );

  const fetchPurchaseById = useCallback(
    async (id: string) => {
      dispatch(setPurchasesLoading(true));
      try {
        const result = await purchasesContainer.getPurchaseByIdUseCase.execute(id);
        dispatch(setSelectedPurchase(serializePurchase(result)));
      } catch (err) {
        dispatch(
          setPurchasesError(
            err instanceof Error ? err.message : 'Error al cargar la compra.',
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    purchases,
    isLoading,
    error,
    fetchMyPurchases,
    fetchAllPurchases,
    createPurchase,
    selectedPurchase,
    fetchPurchaseById,
  };
}
