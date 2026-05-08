import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteUser } from '@/api/users.api';
import { userQueryKey } from '@/hooks/users/useUser';
import { USERS_QUERY_KEY } from '@/hooks/users/useUsers';

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: userQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
