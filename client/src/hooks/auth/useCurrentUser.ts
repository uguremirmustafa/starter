import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/api/auth.api';
import { useAuth } from '@/context/useAuth.ts';
import { ME_QUERY_KEY } from '@/hooks/auth/authKeys.ts';

export function useCurrentUser() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    enabled: isAuthenticated,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}
