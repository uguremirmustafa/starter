import type { UpdateUserDto, UserDto } from '@starter/shared';

import { apiRequest } from '@/lib/apiClient';

export async function getUsers(): Promise<UserDto[]> {
  return apiRequest<UserDto[]>('/api/v1/users');
}

export async function getUserById(id: string): Promise<UserDto> {
  return apiRequest<UserDto>(`/api/v1/users/${id}`);
}

export async function updateUser(id: string, dto: UpdateUserDto): Promise<UserDto> {
  return apiRequest<UserDto>(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export async function deleteUser(id: string): Promise<null> {
  return apiRequest<null>(`/api/v1/users/${id}`, {
    method: 'DELETE',
  });
}
