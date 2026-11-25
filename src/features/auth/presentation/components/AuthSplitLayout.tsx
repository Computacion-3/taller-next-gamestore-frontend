import Image from 'next/image';
import { ReactNode } from 'react';

export interface AuthSplitLayoutProps {
  children: ReactNode;
  characterSrc?: string;
  characterAlt?: string;
}

export function AuthSplitLayout({
  children,
  characterSrc = '/media/login/persona-3/character.png',
  characterAlt = 'Personaje destacado Persona 3',
}: AuthSplitLayoutProps) {
  return (
    <main className="relative flex min-h-[calc(100vh-128px)] flex-1 items-center overflow-hidden">
      {/* Personaje grande anclado a la izquierda */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 hidden h-[95%] w-[64%] max-w-[960px] items-end lg:flex">
        <Image
          src={characterSrc}
          alt={characterAlt}
          width={1682}
          height={1142}
          priority
          className="h-full w-full object-contain object-left-bottom drop-shadow-[0_12px_28px_rgba(3,4,94,0.45)]"
        />
      </div>

      {/* Formulario a la derecha */}
      <div className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-12 lg:justify-end">
        {children}
      </div>
    </main>
  );
}
