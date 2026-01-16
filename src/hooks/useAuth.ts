'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    userId: session?.user?.id ?? null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    status,
  };
}
