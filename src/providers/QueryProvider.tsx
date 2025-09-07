/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 50 * 60 * 1000, // 50 minutes
      refetchInterval: 55 * 60 * 1000, // Poll every 55 minutes
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false, // Disable refetch on window focus
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

