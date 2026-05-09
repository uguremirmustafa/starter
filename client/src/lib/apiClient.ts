import type { ApiResponse, TokenPair } from '@starter/shared';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Called when a token refresh fails — notifies AuthContext to clear state.
export function forceLogout(): void {
  clearTokens();
  window.dispatchEvent(new Event('auth:logout'));
}

async function attemptRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch('/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    forceLogout();
    return null;
  }

  const json: ApiResponse<TokenPair> = await res.json();
  if (!json.data) {
    forceLogout();
    return null;
  }

  storeTokens(json.data.accessToken, json.data.refreshToken);
  return json.data.accessToken;
}

export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const newToken = await attemptRefresh();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      const retryRes = await fetch(url, { ...options, headers });
      if (!retryRes.ok) {
        const retryJson: ApiResponse<never> = await retryRes.json();
        throw new Error(retryJson.error ?? `Request failed: ${retryRes.status}`);
      }
      const retryJson: ApiResponse<T> = await retryRes.json();
      if (!retryJson.success) throw new Error(retryJson.error ?? 'Request failed');
      return retryJson.data as T;
    }
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const json: ApiResponse<never> = await res.json();
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Request failed');
  return json.data as T;
}
