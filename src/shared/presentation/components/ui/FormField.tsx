import { ReactNode } from 'react';

/** Clases de los campos de formulario (mismo estilo del login). */
export function fieldClasses(hasError = false): string {
  return `mt-1 w-full rounded-lg border bg-blue-cloud/95 px-3 py-2 text-sm font-medium text-blue-night placeholder-blue-night/45 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-400'
      : 'border-blue-sky/40 focus:border-blue-star focus:ring-blue-star'
  }`;
}

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  /** El control (input, textarea, select). Debe usar aria-describedby={`${id}-error`} cuando hay error. */
  children: ReactNode;
}

/** Etiqueta + control + mensaje de error accesible. */
export function FormField({ id, label, error, hint, className = '', children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-blue-cloud">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-blue-cloud/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}