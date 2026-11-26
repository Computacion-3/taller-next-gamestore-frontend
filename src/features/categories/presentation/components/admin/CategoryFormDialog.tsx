'use client';

import { FormEvent, useId, useState } from 'react';
import { Button } from '@/shared/presentation/components/ui/Button';
import { fieldClasses, FormField } from '@/shared/presentation/components/ui/FormField';
import { Modal } from '@/shared/presentation/components/ui/Modal';
import { Category } from '../../../domain/entities/Category';

export interface CategoryFormValues {
  name: string;
  description: string;
}

export interface CategoryFormDialogProps {
  open: boolean;
  /** null = crear; una categoría = editar. */
  category: Category | null;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: (values: CategoryFormValues) => void;
  onClose: () => void;
}

export function CategoryFormDialog({
  open,
  category,
  isSubmitting,
  serverError,
  onSubmit,
  onClose,
}: CategoryFormDialogProps) {
  const isEdit = category !== null;
  const formId = useId();
  const nameId = `${formId}-name`;
  const descriptionId = `${formId}-description`;
  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setNameError('El nombre es obligatorio.');
      return;
    }
    setNameError(null);
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Editar categoría' : 'Nueva categoría'}
      onClose={onClose}
      isBusy={isSubmitting}
      testId="category-form-dialog"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form={formId}
            isLoading={isSubmitting}
            loadingText="Guardando..."
            data-testid="save-category"
          >
            {isEdit ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField id={nameId} label="Nombre" error={nameError ?? undefined} hint="Debe ser único en la tienda.">
          <input
            id={nameId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? `${nameId}-error` : `${nameId}-hint`}
            className={fieldClasses(Boolean(nameError))}
            data-testid="category-name-input"
          />
        </FormField>
        <FormField id={descriptionId} label="Descripción (opcional)">
          <textarea
            id={descriptionId}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={fieldClasses()}
          />
        </FormField>
      </form>

      {serverError && (
        <p role="alert" className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-red-200">
          {serverError}
        </p>
      )}
    </Modal>
  );
}