'use client';

import { FormEvent, useId, useState } from 'react';
import { Category } from '@/features/categories/domain/entities/Category';
import { Button } from '@/shared/presentation/components/ui/Button';
import { fieldClasses, FormField } from '@/shared/presentation/components/ui/FormField';
import { Modal } from '@/shared/presentation/components/ui/Modal';
import { Game } from '../../../domain/entities/Game';

export interface GameFormValues {
  title: string;
  developer: string;
  description: string;
  originalPrice: number;
  discount: number;
  releaseDate: Date;
  coverImage: string | null;
  categoryIds: string[];
}

type FieldName =
  | 'title'
  | 'developer'
  | 'description'
  | 'price'
  | 'discount'
  | 'releaseDate'
  | 'coverImage';
type FieldErrors = Partial<Record<FieldName, string>>;

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Fecha sin hora para <input type="date"> (en UTC, igual que llega del backend). */
function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export interface GameFormDialogProps {
  open: boolean;
  /** null = crear; un juego = editar. */
  game: Game | null;
  categories: Category[];
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: (values: GameFormValues) => void;
  onClose: () => void;
}

export function GameFormDialog({
  open,
  game,
  categories,
  isSubmitting,
  serverError,
  onSubmit,
  onClose,
}: GameFormDialogProps) {
  const isEdit = game !== null;
  const formId = useId();
  const [title, setTitle] = useState(game?.title ?? '');
  const [developer, setDeveloper] = useState(game?.developer ?? '');
  const [description, setDescription] = useState(game?.description ?? '');
  const [price, setPrice] = useState(game ? String(game.originalPrice) : '');
  const [discount, setDiscount] = useState('0');
  const [releaseDate, setReleaseDate] = useState(game ? toDateInput(game.releaseDate) : '');
  const [coverImage, setCoverImage] = useState(game?.coverImage ?? '');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});

  const fieldId = (name: FieldName) => `${formId}-${name}`;
  const a11y = (name: FieldName) => ({
    id: fieldId(name),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${fieldId(name)}-error` : undefined,
  });

  const validate = (): FieldErrors => {
    const found: FieldErrors = {};
    if (!title.trim()) found.title = 'El título es obligatorio.';
    if (!developer.trim()) found.developer = 'El desarrollador es obligatorio.';
    if (!description.trim()) found.description = 'La descripción es obligatoria.';
    if (!MONEY_PATTERN.test(price.trim())) {
      found.price = 'Ingresa un precio válido (máximo 2 decimales).';
    }
    if (!isEdit) {
      const value = Number(discount);
      if (!MONEY_PATTERN.test(discount.trim()) || value > 100) {
        found.discount = 'El descuento debe estar entre 0 y 100.';
      }
    }
    if (!releaseDate || Number.isNaN(new Date(releaseDate).getTime())) {
      found.releaseDate = 'Selecciona la fecha de lanzamiento.';
    }
    if (coverImage.trim() && !isValidUrl(coverImage.trim())) {
      found.coverImage = 'Debe ser una URL que empiece por http:// o https://';
    }
    return found;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      title: title.trim(),
      developer: developer.trim(),
      description: description.trim(),
      originalPrice: Number(price),
      discount: isEdit ? game.discount : Number(discount),
      releaseDate: new Date(releaseDate),
      coverImage: coverImage.trim() || null,
      categoryIds: isEdit ? [] : categoryIds,
    });
  };

  const toggleCategory = (id: string) => {
    setCategoryIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Editar juego' : 'Nuevo juego'}
      onClose={onClose}
      isBusy={isSubmitting}
      size="lg"
      testId="game-form-dialog"
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
            data-testid="save-game"
          >
            {isEdit ? 'Guardar cambios' : 'Crear juego'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        <FormField id={fieldId('title')} label="Título" error={errors.title} className="sm:col-span-2">
          <input
            {...a11y('title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClasses(Boolean(errors.title))}
            data-testid="game-title-input"
          />
        </FormField>

        <FormField id={fieldId('developer')} label="Desarrollador" error={errors.developer}>
          <input
            {...a11y('developer')}
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            className={fieldClasses(Boolean(errors.developer))}
          />
        </FormField>

        <FormField id={fieldId('releaseDate')} label="Fecha de lanzamiento" error={errors.releaseDate}>
          <input
            {...a11y('releaseDate')}
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className={fieldClasses(Boolean(errors.releaseDate))}
          />
        </FormField>

        <FormField
          id={fieldId('price')}
          label="Precio base (USD)"
          error={errors.price}
          hint={isEdit ? 'El descuento actual se mantiene y el precio final se recalcula.' : undefined}
        >
          <input
            {...a11y('price')}
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={fieldClasses(Boolean(errors.price))}
            data-testid="game-price-input"
          />
        </FormField>

        {!isEdit && (
          <FormField id={fieldId('discount')} label="Descuento inicial (%)" error={errors.discount}>
            <input
              {...a11y('discount')}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className={fieldClasses(Boolean(errors.discount))}
            />
          </FormField>
        )}

        <FormField
          id={fieldId('coverImage')}
          label="URL de la portada (opcional)"
          error={errors.coverImage}
          className="sm:col-span-2"
        >
          <input
            {...a11y('coverImage')}
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            className={fieldClasses(Boolean(errors.coverImage))}
          />
        </FormField>

        <FormField
          id={fieldId('description')}
          label="Descripción"
          error={errors.description}
          className="sm:col-span-2"
        >
          <textarea
            {...a11y('description')}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={fieldClasses(Boolean(errors.description))}
          />
        </FormField>

        {!isEdit && categories.length > 0 && (
          <fieldset className="sm:col-span-2">
            <legend className="text-xs font-medium text-blue-cloud">Categorías (opcional)</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((category) => {
                const checked = categoryIds.includes(category.id);
                return (
                  <label
                    key={category.id}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      checked
                        ? 'border-blue-star bg-blue-star text-blue-night'
                        : 'border-blue-sky/50 text-blue-sky hover:border-blue-star'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleCategory(category.id)}
                    />
                    {category.name}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
      </form>

      {serverError && (
        <p role="alert" className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-red-200">
          {serverError}
        </p>
      )}
    </Modal>
  );
}