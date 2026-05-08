import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../api/users.api';

export const userQueryKey = (id: string) => ['users', id] as const;

export function useUser(id: string) {
  return useQuery({
    queryKey: userQueryKey(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}
