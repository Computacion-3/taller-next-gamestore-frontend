'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Category } from '@/features/categories/domain/entities/Category';
import { Button } from '@/shared/presentation/components/ui/Button';

const SEARCH_DEBOUNCE_MS = 400;

const FIELD_CLASSES =
  'mt-1 w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3 py-2 text-sm font-medium text-blue-night placeholder-blue-night/45 focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star';

export interface CatalogFiltersProps {
  /** Búsqueda aplicada (la que está en la URL). */
  search: string;
  categoryId: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onClear: () => void;
}

export function CatalogFilters({
  search,
  categoryId,
  categories,
  onSearchChange,
  onCategoryChange,
  onClear,
}: CatalogFiltersProps) {
  const [text, setText] = useState(search);
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const [prevSearch, setPrevSearch] = useState(search);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Si la búsqueda cambia desde fuera (por ejemplo, el buscador del Header), se
  // refleja en el campo. Se ajusta durante el render, como recomienda React, en
  // lugar de copiar la prop al estado con un useEffect.
  if (search !== prevSearch) {
    setPrevSearch(search);
    if (search !== pendingSearch) {
      setText(search);
    }
  }

  // Al desmontar, se cancela la búsqueda pendiente
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const normalized = value.trim();
    setText(value);
    setPendingSearch(normalized);

    // Debounce: solo se busca cuando el usuario deja de escribir
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearchChange(normalized), SEARCH_DEBOUNCE_MS);
  };

  const handleClear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setText('');
    setPendingSearch('');
    onClear();
  };

  const hasFilters = Boolean(search || categoryId || text);

  return (
    <div
      role="search"
      className="mb-6 flex flex-col gap-3 rounded-2xl border border-blue-sky/40 bg-blue-night/80 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-end"
      data-testid="catalog-filters"
    >
      <div className="flex-1">
        <label htmlFor="catalog-search" className="block text-xs font-medium text-blue-cloud">
          Buscar
        </label>
        <input
          id="catalog-search"
          type="search"
          value={text}
          onChange={handleSearchChange}
          placeholder="Título, desarrollador o descripción..."
          className={FIELD_CLASSES}
          data-testid="catalog-search"
        />
      </div>

      <div className="sm:w-56">
        <label htmlFor="catalog-category" className="block text-xs font-medium text-blue-cloud">
          Categoría
        </label>
        <select
          id="catalog-category"
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
          className={FIELD_CLASSES}
          data-testid="catalog-category"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <Button variant="secondary" size="sm" onClick={handleClear}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}