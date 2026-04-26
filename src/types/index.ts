// src/types/index.ts
import { Role } from '../generated/prisma/client';
import { Request } from 'express';

// ─── API Response wrapper ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export function fail(error: string): ApiResponse<never> {
  return { success: false, error };
}

// ─── Auth types ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── Request augmentation ────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

// ─── Module interface — for microservice extraction ──────────────────────────
// Each module exports this shape; the app mounts it with router + prefix.

import { Router } from 'express';

export interface AppModule {
  prefix: string;
  router: Router;
}
