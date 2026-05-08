import type { UpdateUserDto } from '@starter/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUser } from '@/api/users.api';
import { userQueryKey } from '@/hooks/users/useUser';
import { USERS_QUERY_KEY } from '@/hooks/users/useUsers';

export function useUpdateUserMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => updateUser(id, dto),
    onSuccess: (updated) => {
      queryClient.setQueryData(userQueryKey(id), updated);
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
