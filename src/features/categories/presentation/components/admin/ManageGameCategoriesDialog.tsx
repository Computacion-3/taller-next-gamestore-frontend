'use client';

import { useEffect, useState } from 'react';
import { Game } from '@/features/games/domain/entities/Game';
import { Button } from '@/shared/presentation/components/ui/Button';
import { fieldClasses } from '@/shared/presentation/components/ui/FormField';
import { Modal } from '@/shared/presentation/components/ui/Modal';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { Category } from '../../../domain/entities/Category';
import { useCategories } from '../../hooks/useCategories';

export interface ManageGameCategoriesDialogProps {
  /** Juego a editar; null mantiene el diálogo cerrado. */
  game: Game | null;
  onClose: () => void;
}

/** Asigna o quita categorías de un juego. Cada cambio se guarda al instante. */
export function ManageGameCategoriesDialog({ game, onClose }: ManageGameCategoriesDialogProps) {
  const {
    categories,
    gameCategories,
    fetchGameCategories,
    assignCategoryToGame,
    removeCategoryFromGame,
    replaceGameCategories,
  } = useCategories();
  const { notify } = useToasts();
  const [selected, setSelected] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (game) void fetchGameCategories(game.id);
  }, [game, fetchGameCategories]);

  // null mientras llegan las categorías de ESTE juego
  const assigned = game && gameCategories?.gameId === game.id ? gameCategories.items : null;
  const available = assigned
    ? categories.filter((category) => !assigned.some((item) => item.id === category.id))
    : [];

  const run = async (action: () => Promise<void>, successTitle: string) => {
    setIsBusy(true);
    setError(null);
    try {
      await action();
      notify('success', successTitle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleAdd = () => {
    if (!game || !selected) return;
    const category = categories.find((item) => item.id === selected);
    void run(async () => {
      await assignCategoryToGame(game.id, selected);
      setSelected('');
    }, `Categoría "${category?.name ?? ''}" agregada`);
  };

  const handleRemove = (category: Category) => {
    if (!game) return;
    void run(
      () => removeCategoryFromGame(game.id, category.id),
      `Categoría "${category.name}" quitada`,
    );
  };

  const handleClear = () => {
    if (!game) return;
    void run(() => replaceGameCategories(game.id, []), 'Se quitaron todas las categorías');
  };

  return (
    <Modal
      open={game !== null}
      title="Categorías del juego"
      onClose={onClose}
      isBusy={isBusy}
      testId="game-categories-dialog"
      footer={
        <>
          {assigned && assigned.length > 0 && (
            <Button variant="danger" onClick={handleClear} disabled={isBusy}>
              Quitar todas
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} disabled={isBusy}>
            Listo
          </Button>
        </>
      }
    >
      {game && (
        <>
          <p>
            <strong className="text-white">{game.title}</strong>
          </p>

          {assigned === null ? (
            <p className="mt-3 text-blue-cloud/70">Cargando categorías...</p>
          ) : assigned.length === 0 ? (
            <p className="mt-3 text-blue-cloud/70">Este juego todavía no tiene categorías.</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Categorías asignadas">
              {assigned.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center gap-1 rounded-full border border-blue-sky/50 py-1 pl-3 pr-1 text-xs font-semibold text-blue-sky"
                >
                  {category.name}
                  <button
                    type="button"
                    onClick={() => handleRemove(category)}
                    disabled={isBusy}
                    aria-label={`Quitar la categoría ${category.name}`}
                    className="rounded-full px-1.5 text-blue-cloud/70 transition hover:bg-red-500/30 hover:text-white disabled:opacity-50"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {assigned !== null && available.length > 0 && (
            <div className="mt-5 flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="add-game-category" className="block text-xs font-medium text-blue-cloud">
                  Agregar categoría
                </label>
                <select
                  id="add-game-category"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  disabled={isBusy}
                  className={fieldClasses()}
                  data-testid="add-game-category-select"
                >
                  <option value="">Selecciona una categoría</option>
                  {available.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAdd} disabled={!selected} isLoading={isBusy} loadingText="...">
                Agregar
              </Button>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-red-200">
              {error}
            </p>
          )}

          <p className="mt-4 text-xs text-blue-cloud/60">Los cambios se guardan al instante.</p>
        </>
      )}
    </Modal>
  );
}