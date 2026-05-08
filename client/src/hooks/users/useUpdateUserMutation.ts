import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../api/users.api';
import type { UpdateUserDto } from '@starter/shared';
import { USERS_QUERY_KEY } from './useUsers';
import { userQueryKey } from './useUser';

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
