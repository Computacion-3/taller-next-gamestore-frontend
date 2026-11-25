import Image from 'next/image';

/** Versión estática del Header mientras el real (que depende de la URL) se renderiza. */
export function HeaderFallback() {
  return (
    <header className="relative z-40 w-full bg-blue-cloud text-blue-night" aria-busy="true">
      <div className="border-b border-blue-sky/60 bg-blue-cloud">
        <div className="mx-auto flex h-20 max-w-6xl items-center px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/logo.jpg"
              alt="GameStore logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover shadow"
              priority
            />
            <span className="text-lg font-extrabold leading-none tracking-wide text-blue-night">
              GAMESTORE
            </span>
          </div>
        </div>
      </div>
      <div className="border-b border-blue-sky/30 bg-blue-night">
        <div className="mx-auto flex max-w-6xl justify-end px-6 py-2.5">
          <div className="h-[30px] w-full rounded-md border border-blue-sky/40 bg-blue-night/80 sm:w-64" />
        </div>
      </div>
    </header>
  );
}