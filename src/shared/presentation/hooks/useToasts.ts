'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { selectToasts } from '@/shared/store/selectors';
import {
  clearToasts,
  dismissToast,
  pushToast,
  ToastType,
} from '@/shared/store/ui.slice';

export function useToasts() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);

  const notify = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      dispatch(pushToast({ id, type, title, description }));
      return id;
    },
    [dispatch],
  );

  const dismiss = useCallback(
    (id: string) => {
      dispatch(dismissToast(id));
    },
    [dispatch],
  );

  const clear = useCallback(() => {
    dispatch(clearToasts());
  }, [dispatch]);

  return {
    toasts,
    notify,
    dismiss,
    clear,
  };
}
