import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { AuthContext } from '@/context/authContext.ts';
import { ME_QUERY_KEY } from '@/hooks/auth/authKeys.ts';
import { clearTokens, getAccessToken, storeTokens } from '@/lib/apiClient';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken());
  const queryClient = useQueryClient();

  // React to forced logouts triggered by apiClient (e.g., failed token refresh)
  useEffect(() => {
    const handle = () => {
      setAccessToken(null);
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
    };
    window.addEventListener('auth:logout', handle);
    return () => window.removeEventListener('auth:logout', handle);
  }, [queryClient]);

  const login = useCallback((newAccessToken: string, refreshToken: string) => {
    storeTokens(newAccessToken, refreshToken);
    setAccessToken(newAccessToken);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated: !!accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
