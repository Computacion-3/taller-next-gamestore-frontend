import { HTMLAttributes } from 'react';

/** Panel translúcido con el mismo estilo del formulario de login. */
export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`rounded-2xl border border-blue-sky/40 bg-blue-night/80 p-5 text-blue-cloud shadow-xl backdrop-blur-md ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}