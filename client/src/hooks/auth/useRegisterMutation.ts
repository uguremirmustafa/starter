import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerApi, getMe } from '../../api/auth.api';
import { useAuth } from '../../context/useAuth.ts';
import { ME_QUERY_KEY } from './authKeys.ts';

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: async (tokens) => {
      login(tokens.accessToken, tokens.refreshToken);
      const user = await getMe();
      queryClient.setQueryData(ME_QUERY_KEY, user);
    },
  });
}
