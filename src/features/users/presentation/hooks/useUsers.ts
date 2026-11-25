'use client';

import { useCallback, useMemo } from 'react';
import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { usersContainer } from '../../di/users.container';
import { ChangePasswordParams } from '../../domain/repositories/UserRepository';
import {
  deserializeUser,
  replaceUser,
  serializeUser,
  setUsers,
  setUsersError,
  setUsersLoading,
} from '../store/users.slice';

export function useUsers() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((root) => root.users);

  const users = useMemo(() => items.map(deserializeUser), [items]);

  const fetchUsers = useCallback(async () => {
    dispatch(setUsersLoading(true));
    try {
      const result = await usersContainer.getUsersUseCase.execute();
      dispatch(setUsers(result.map(serializeUser)));
    } catch (err) {
      dispatch(
        setUsersError(
          err instanceof Error ? err.message : 'Error al cargar usuarios.',
        ),
      );
    }
  }, [dispatch]);

  const updateUserRole = useCallback(
    async (id: string, role: UserRole) => {
      const updated = await usersContainer.updateUserRoleUseCase.execute(
        id,
        role,
      );
      dispatch(replaceUser(serializeUser(updated)));
      return updated;
    },
    [dispatch],
  );


  const updateMyEmail = useCallback(async (email: string) => {
    return usersContainer.updateMyEmailUseCase.execute(email);
  }, []);

  const changeMyPassword = useCallback(async (params: ChangePasswordParams) => {
    return usersContainer.changeMyPasswordUseCase.execute(params);
  }, []);

  const getMyAccount = useCallback(
    () => usersContainer.getMyAccountUseCase.execute(),
    [],
  );

  return {
    users,
    isLoading,
    error,
    getMyAccount,
    fetchUsers,
    updateUserRole,
    updateMyEmail,
    changeMyPassword,
  };
}
