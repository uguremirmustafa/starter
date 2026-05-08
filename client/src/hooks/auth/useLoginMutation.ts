import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi, getMe } from '../../api/auth.api';
import { useAuth } from '../../context/useAuth.ts';
import { ME_QUERY_KEY } from './authKeys.ts';

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (tokens) => {
      login(tokens.accessToken, tokens.refreshToken);
      const user = await getMe();
      queryClient.setQueryData(ME_QUERY_KEY, user);
    },
  });
}
