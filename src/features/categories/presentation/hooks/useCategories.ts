'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { categoriesContainer } from '../../di/categories.container';
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../../domain/repositories/CategoryRepository';
import {
  addCategory,
  deserializeCategory,
  removeCategory,
  replaceCategory,
  serializeCategory,
  setCategories,
  setCategoriesError,
  setCategoriesLoading,
} from '../store/categories.slice';

export function useCategories() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((root) => root.categories);

  const categories = useMemo(() => items.map(deserializeCategory), [items]);

  const fetchCategories = useCallback(async () => {
    dispatch(setCategoriesLoading(true));
    try {
      const result = await categoriesContainer.getCategoriesUseCase.execute();
      dispatch(setCategories(result.map(serializeCategory)));
    } catch (err) {
      dispatch(
        setCategoriesError(
          err instanceof Error ? err.message : 'Error al cargar categorías.',
        ),
      );
    }
  }, [dispatch]);

  const createCategory = useCallback(
    async (params: CreateCategoryParams) => {
      const created =
        await categoriesContainer.createCategoryUseCase.execute(params);
      dispatch(addCategory(serializeCategory(created)));
      return created;
    },
    [dispatch],
  );

  const updateCategory = useCallback(
    async (id: string, params: UpdateCategoryParams) => {
      const updated = await categoriesContainer.updateCategoryUseCase.execute(
        id,
        params,
      );
      dispatch(replaceCategory(serializeCategory(updated)));
      return updated;
    },
    [dispatch],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      await categoriesContainer.deleteCategoryUseCase.execute(id);
      dispatch(removeCategory(id));
    },
    [dispatch],
  );

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
