import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getMe } from '@/api/auth.api';
import { useAuth } from '@/context/useAuth.ts';
import { ME_QUERY_KEY } from '@/hooks/auth/authKeys.ts';

export function AuthCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    // Store tokens first so apiClient can attach the Authorization header for /me
    login(accessToken, refreshToken);

    getMe()
      .then((user) => {
        queryClient.setQueryData(ME_QUERY_KEY, user);
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        navigate('/login?error=oauth_failed', { replace: true });
      });
  }, [login, navigate, queryClient, searchParams]);

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <p>Completing login…</p>
    </div>
  );
}
