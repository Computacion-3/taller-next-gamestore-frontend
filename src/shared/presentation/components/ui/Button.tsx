import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-blue-sky text-blue-night hover:bg-blue-star hover:text-white',
  secondary:
    'border border-blue-sky/50 bg-blue-night/60 text-blue-cloud hover:border-blue-star hover:text-white',
  danger: 'border border-red-400/50 bg-red-950/60 text-red-100 hover:bg-red-900/80',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
};

/** Clases del botón, reutilizables también en <Link> para que se vean iguales. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
): string {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-bold shadow transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]}`;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  className = '',
  disabled,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${buttonClasses(variant, size)} ${className}`}
      {...rest}
    >
      {isLoading ? (loadingText ?? 'Procesando...') : children}
    </button>
  );
}