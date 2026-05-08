import type { LoginDto, RegisterDto, TokenPair, MeResponse } from '@starter/shared';
import { apiRequest } from '../lib/apiClient';

export async function loginApi(dto: LoginDto): Promise<TokenPair> {
  return apiRequest<TokenPair>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function registerApi(dto: RegisterDto): Promise<TokenPair> {
  return apiRequest<TokenPair>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function getMe(): Promise<MeResponse> {
  return apiRequest<MeResponse>('/api/v1/auth/me');
}

export async function logoutApi(refreshToken: string): Promise<null> {
  return apiRequest<null>('/api/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}
