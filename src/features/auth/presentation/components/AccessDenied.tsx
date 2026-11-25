import Link from 'next/link';

interface AccessDeniedProps {
  /** 'forbidden': sesión iniciada pero sin permisos (403). 'unauthenticated': sin sesión (401). */
  variant?: 'forbidden' | 'unauthenticated';
}

export function AccessDenied({ variant = 'forbidden' }: AccessDeniedProps) {
  const isForbidden = variant === 'forbidden';

  return (
    <section
      role="alert"
      data-testid="access-denied"
      className="mx-auto my-16 w-full max-w-lg rounded-2xl border border-blue-sky/40 bg-blue-night/80 p-8 text-center backdrop-blur-md"
    >
      <p className="text-5xl font-extrabold text-blue-star">
        {isForbidden ? '403' : '401'}
      </p>
      <h1 className="mt-3 text-xl font-bold text-blue-cloud">
        {isForbidden ? 'Acceso denegado' : 'Inicia sesión para continuar'}
      </h1>
      <p className="mt-2 text-sm text-blue-cloud/80">
        {isForbidden
          ? 'Tu cuenta no tiene los permisos necesarios para ver esta sección.'
          : 'Necesitas una sesión activa para ver esta sección.'}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3 text-sm font-semibold">
        <Link
          href="/"
          className="rounded-md bg-blue-sky px-4 py-2 text-blue-night transition hover:bg-blue-cloud"
        >
          Ir a la tienda
        </Link>
        {!isForbidden && (
          <Link
            href="/login"
            className="rounded-md border border-blue-sky/60 px-4 py-2 text-blue-cloud transition hover:border-blue-star"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </section>
  );
}
