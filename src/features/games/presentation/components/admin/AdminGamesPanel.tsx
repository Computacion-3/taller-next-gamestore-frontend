'use client';

import { useEffect, useState } from 'react';
import { Can } from '@/features/auth/presentation/components/Can';
import { useCategories } from '@/features/categories/presentation/hooks/useCategories';
import { Pagination } from '@/shared/presentation/components/Pagination';
import { Button } from '@/shared/presentation/components/ui/Button';
import { ConfirmDialog } from '@/shared/presentation/components/ui/ConfirmDialog';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { Game } from '../../../domain/entities/Game';
import { useGames } from '../../hooks/useGames';
import { AdminGamesTable } from './AdminGamesTable';
import { DiscountDialog } from './DiscountDialog';
import { GameFormDialog, GameFormValues } from './GameFormDialog';
import { ManageGameCategoriesDialog } from '@/features/categories/presentation/components/admin/ManageGameCategoriesDialog';

const PAGE_SIZE = 10;

type DialogState =
  | { kind: 'categories'; game: Game }
  | { kind: 'create' }
  | { kind: 'edit'; game: Game }
  | { kind: 'discount'; game: Game }
  | { kind: 'remove'; game: Game }
  | null;

/** Contenedor del admin de juegos. Se renderiza dentro de RequireAuth. */
export function AdminGamesPanel() {
  const [page, setPage] = useState(1);
  const { games, pagination, isLoading, error, refetch, createGame, updateGame, updateDiscount, deleteGame } =
    useGames({ page, limit: PAGE_SIZE });
  const { categories, fetchCategories } = useCategories();
  const { notify } = useToasts();

  const [dialog, setDialog] = useState<DialogState>(null);
  // Cambia en cada apertura para remontar los diálogos con su estado inicial
  const [dialogKey, setDialogKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const openDialog = (next: DialogState) => {
    setDialog(next);
    setActionError(null);
    setDialogKey((key) => key + 1);
  };

  const closeDialog = () => {
    if (!isSubmitting) setDialog(null);
  };

  /** Ejecuta una mutación: muestra el error en el diálogo o cierra, avisa y recarga la página. */
  const run = async (action: () => Promise<unknown>, successTitle: string, description?: string) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await action();
      setDialog(null);
      notify('success', successTitle, description);
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForm = (values: GameFormValues) => {
    if (dialog?.kind === 'create') {
      void run(() => createGame(values), 'Juego creado', values.title);
    } else if (dialog?.kind === 'edit') {
      const { title, developer, description, originalPrice, releaseDate, coverImage } = values;
      void run(
        () =>
          updateGame(dialog.game.id, { title, developer, description, originalPrice, releaseDate, coverImage }),
        'Juego actualizado',
        title,
      );
    }
  };

  const handleDiscount = (discount: number) => {
    if (dialog?.kind !== 'discount') return;
    void run(
      () => updateDiscount(dialog.game.id, discount),
      discount > 0 ? `Descuento de ${discount}% aplicado` : 'Descuento retirado',
      'Los clientes conectados ya ven el nuevo precio.',
    );
  };

  const handleRemove = () => {
    if (dialog?.kind !== 'remove') return;
    void run(() => deleteGame(dialog.game.id), 'Juego retirado de la tienda', dialog.game.title);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-100 drop-shadow">{pagination.total} juegos activos</p>
        <Can authority="games:create">
          <Button onClick={() => openDialog({ kind: 'create' })} data-testid="create-game">
            + Nuevo juego
          </Button>
        </Can>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      {isLoading && games.length === 0 ? (
        <p className="text-sm text-slate-100">Cargando juegos...</p>
      ) : games.length === 0 ? (
        <EmptyState title="No hay juegos activos" description="Crea el primero con “+ Nuevo juego”." />
      ) : (
        <AdminGamesTable
          games={games}
          onEdit={(game) => openDialog({ kind: 'edit', game })}
          onDiscount={(game) => openDialog({ kind: 'discount', game })}
          onCategories={(game) => openDialog({ kind: 'categories', game })}
          onRemove={(game) => openDialog({ kind: 'remove', game })}
        />
      )}

      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />

      <GameFormDialog
        key={`form-${dialogKey}`}
        open={dialog?.kind === 'create' || dialog?.kind === 'edit'}
        game={dialog?.kind === 'edit' ? dialog.game : null}
        categories={categories}
        isSubmitting={isSubmitting}
        serverError={actionError}
        onSubmit={handleSubmitForm}
        onClose={closeDialog}
      />

      <DiscountDialog
        key={`discount-${dialogKey}`}
        game={dialog?.kind === 'discount' ? dialog.game : null}
        isSubmitting={isSubmitting}
        serverError={actionError}
        onConfirm={handleDiscount}
        onClose={closeDialog}
      />

      <ManageGameCategoriesDialog
        key={`categories-${dialogKey}`}
        game={dialog?.kind === 'categories' ? dialog.game : null}
        onClose={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.kind === 'remove'}
        title="Retirar juego de la tienda"
        confirmLabel="Retirar"
        variant="danger"
        isSubmitting={isSubmitting}
        error={actionError}
        onConfirm={handleRemove}
        onClose={closeDialog}
        testId="remove-game-dialog"
      >
        {dialog?.kind === 'remove' && (
          <p>
            <strong className="text-white">{dialog.game.title}</strong> dejará de aparecer en el
            catálogo. Quienes ya lo compraron lo conservan en su biblioteca.
          </p>
        )}
      </ConfirmDialog>
    </>
  );
}