'use client';

import { useEffect, useState } from 'react';
import { Can } from '@/features/auth/presentation/components/Can';
import { Button } from '@/shared/presentation/components/ui/Button';
import { ConfirmDialog } from '@/shared/presentation/components/ui/ConfirmDialog';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { Category } from '../../../domain/entities/Category';
import { useCategories } from '../../hooks/useCategories';
import { AdminCategoriesTable } from './AdminCategoriesTable';
import { CategoryFormDialog, CategoryFormValues } from './CategoryFormDialog';

type DialogState =
  | { kind: 'create' }
  | { kind: 'edit'; category: Category }
  | { kind: 'delete'; category: Category }
  | null;

/** Contenedor del admin de categorías. Se renderiza dentro de RequireAuth. */
export function AdminCategoriesPanel() {
  const { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory } =
    useCategories();
  const { notify } = useToasts();

  const [dialog, setDialog] = useState<DialogState>(null);
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

  const run = async (action: () => Promise<unknown>, successTitle: string, description?: string) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await action();
      setDialog(null);
      notify('success', successTitle, description);
      // El backend las devuelve ordenadas por nombre: se recarga para conservar el orden
      await fetchCategories();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForm = (values: CategoryFormValues) => {
    if (dialog?.kind === 'create') {
      void run(() => createCategory(values), 'Categoría creada', values.name);
    } else if (dialog?.kind === 'edit') {
      void run(() => updateCategory(dialog.category.id, values), 'Categoría actualizada', values.name);
    }
  };

  const handleDelete = () => {
    if (dialog?.kind !== 'delete') return;
    void run(() => deleteCategory(dialog.category.id), 'Categoría eliminada', dialog.category.name);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-100 drop-shadow">{categories.length} categorías</p>
        <Can authority="categories:manage">
          <Button onClick={() => openDialog({ kind: 'create' })} data-testid="create-category">
            + Nueva categoría
          </Button>
        </Can>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      {isLoading && categories.length === 0 ? (
        <p className="text-sm text-slate-100">Cargando categorías...</p>
      ) : categories.length === 0 ? (
        <EmptyState title="Aún no hay categorías" description="Crea la primera con “+ Nueva categoría”." />
      ) : (
        <AdminCategoriesTable
          categories={categories}
          onEdit={(category) => openDialog({ kind: 'edit', category })}
          onDelete={(category) => openDialog({ kind: 'delete', category })}
        />
      )}

      <CategoryFormDialog
        key={`category-form-${dialogKey}`}
        open={dialog?.kind === 'create' || dialog?.kind === 'edit'}
        category={dialog?.kind === 'edit' ? dialog.category : null}
        isSubmitting={isSubmitting}
        serverError={actionError}
        onSubmit={handleSubmitForm}
        onClose={closeDialog}
      />

      <ConfirmDialog
        open={dialog?.kind === 'delete'}
        title="Eliminar categoría"
        confirmLabel="Eliminar"
        variant="danger"
        isSubmitting={isSubmitting}
        error={actionError}
        onConfirm={handleDelete}
        onClose={closeDialog}
        testId="delete-category-dialog"
      >
        {dialog?.kind === 'delete' && (
          <p>
            Se eliminará <strong className="text-white">{dialog.category.name}</strong> y se quitará
            de todos sus juegos. Los juegos no se eliminan.
          </p>
        )}
      </ConfirmDialog>
    </>
  );
}