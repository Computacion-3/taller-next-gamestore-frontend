import { ReactNode } from 'react';

export const inputClasses =
  'w-full rounded-lg border border-blue-sky/40 bg-blue-night/70 px-3 py-2 text-sm text-blue-cloud placeholder-blue-cloud/40 focus:border-blue-star focus:outline-none focus:ring-1 focus:ring-blue-star disabled:opacity-60';

export interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-blue-cloud">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-[11px] text-blue-cloud/55">{hint}</p>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
