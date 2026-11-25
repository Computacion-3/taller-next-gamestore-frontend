'use client';

import { useEffect } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { useCategories } from '../hooks/useCategories';
import { CategoryCard } from './CategoryCard';

export function CategoriesView() {
  const { sessionReady, isAuthenticated } = useSessionReady();
  const { categories, isLoading, error, fetchCategories } = useCategories();

  useEffect(() => {
    if (sessionReady && isAuthenticated) void fetchCategories();
  }, [sessionReady, isAuthenticated, fetchCategories]);

  if (!sessionReady) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }
  if (!isAuthenticated) {
    return <LoginRequired message="Inicia sesión para explorar las categorías." />;
  }
  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
        {error}
      </p>
    );
  }
  if (isLoading && categories.length === 0) {
    return <p className="text-sm text-slate-100">Cargando categorías...</p>;
  }
  if (categories.length === 0) {
    return <EmptyState title="Aún no hay categorías" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}