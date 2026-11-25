'use client';

import { useCallback, useMemo } from 'react';
import {
  deserializeGame,
  serializeGame,
} from '@/features/games/presentation/store/games.slice';
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
  setCategoryDetail,
} from '../store/categories.slice';

export function useCategories() {
  const dispatch = useAppDispatch();
  const { items, detail, isLoading, error } = useAppSelector(
    (root) => root.categories,
  );

  const categories = useMemo(() => items.map(deserializeCategory), [items]);

  const categoryDetail = useMemo(
    () =>
      detail
        ? {
            category: deserializeCategory(detail.category),
            games: detail.games.map(deserializeGame),
          }
        : null,
    [detail],
  );

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

  const fetchCategoryDetail = useCallback(
    async (id: string) => {
      dispatch(setCategoriesLoading(true));
      try {
        const result = await categoriesContainer.getCategoryDetailUseCase.execute(id);
        dispatch(
          setCategoryDetail({
            category: serializeCategory(result.category),
            games: result.games.map(serializeGame),
          }),
        );
      } catch (err) {
        dispatch(
          setCategoriesError(
            err instanceof Error ? err.message : 'Error al cargar la categoría.',
          ),
        );
      }
    },
    [dispatch],
  );

  const createCategory = useCallback(
    async (params: CreateCategoryParams) => {
      const created = await categoriesContainer.createCategoryUseCase.execute(params);
      dispatch(addCategory(serializeCategory(created)));
      return created;
    },
    [dispatch],
  );

  const updateCategory = useCallback(
    async (id: string, params: UpdateCategoryParams) => {
      const updated = await categoriesContainer.updateCategoryUseCase.execute(id, params);
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
    categoryDetail,
    isLoading,
    error,
    fetchCategories,
    fetchCategoryDetail,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}