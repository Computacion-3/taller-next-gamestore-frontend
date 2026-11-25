'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { UserAccount } from '../../domain/entities/UserAccount';
import { useUsers } from '../hooks/useUsers';
import { ProfileEmailForm } from './ProfileEmailForm';
import { ProfilePasswordForm } from './ProfilePasswordForm';
import { RoleBadge } from './RoleBadge';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormat = new Intl.DateTimeFormat('es-CO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function ProfilePanel() {
  const { user, updateSessionUser } = useAuth();
  const { getMyProfile } = useUsers();
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((result) => {
        if (active) setProfile(result);
      })
      .catch((err: unknown) => {
        if (active) {
          setLoadError(
            err instanceof Error ? err.message : 'No se pudo cargar tu perfil.',
          );
        }
      });
    return () => {
      active = false;
    };
  }, [getMyProfile]);

  if (!user) return null;

  const email = profile?.email ?? user.email;
  const role = profile?.role ?? user.role;
  const balance = profile?.walletBalance ?? user.walletBalance ?? 0;

  const handleEmailUpdated = (updated: UserAccount) => {
    setProfile(updated);
    updateSessionUser({
      id: updated.id,
      email: updated.email,
      role: updated.role,
      walletBalance: updated.walletBalance,
    });
  };

  return (
    <section aria-labelledby="profile-title">
      <h1
        id="profile-title"
        className="mb-6 text-2xl font-bold text-white drop-shadow"
      >
        Mi perfil
      </h1>

      {loadError && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-red-400/60 bg-red-500/15 px-4 py-3 text-sm text-red-200"
        >
          {loadError}
        </p>
      )}

      <dl
        data-testid="profile-summary"
        className="mb-6 grid gap-3 rounded-2xl border border-blue-sky/40 bg-blue-night/80 p-6 text-blue-cloud backdrop-blur-md sm:grid-cols-4"
      >
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wider text-blue-sky">
            Correo
          </dt>
          <dd data-testid="profile-email-value" className="mt-1 font-semibold">
            {email}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-blue-sky">Rol</dt>
          <dd className="mt-1">
            <RoleBadge role={role} />
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-blue-sky">
            Saldo
          </dt>
          <dd className="mt-1 font-semibold">{currency.format(balance)}</dd>
        </div>
        {profile?.createdAt && (
          <div className="sm:col-span-4">
            <dt className="text-xs uppercase tracking-wider text-blue-sky">
              Miembro desde
            </dt>
            <dd className="mt-1 text-sm">
              {dateFormat.format(profile.createdAt)}
            </dd>
          </div>
        )}
      </dl>

      <div className="grid gap-6 md:grid-cols-2">
        <ProfileEmailForm currentEmail={email} onUpdated={handleEmailUpdated} />
        <ProfilePasswordForm />
      </div>
    </section>
  );
}
