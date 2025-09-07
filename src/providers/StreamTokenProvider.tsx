'use client';

import { useQuery } from '@tanstack/react-query';
import { useStreamTokenStore } from '@/stores/streamTokenStore';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ReactNode } from 'react';

interface StreamProviderProps {
  children: ReactNode;
}

export const StreamProvider = ({ children }: StreamProviderProps) => {
  const { setToken } = useStreamTokenStore();

  const { isLoading } = useQuery({
    queryKey: ['stream-token'],
    queryFn: async () => {
      const response = await fetch('/api/stream/user/get-token');
      if (!response.ok) {
        throw new Error('Failed to fetch stream token');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to get token');
      }
      const token = data.token as string;
      setToken(token);
      return token;
    },
    refetchOnWindowFocus:false,
    retry:2,
    refetchInterval:55*60*1000
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

