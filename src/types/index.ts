// src/types/index.ts
import { Role as PrismaRole } from '../generated/prisma/client';
import { Request } from 'express';
import { ApiResponse, TokenPair, Role } from '@starter/shared';

// Re-export shared types used across the server
export type { ApiResponse, TokenPair, Role };

// ─── Compile-time guard: Prisma Role must extend the shared Zod enum.
// If schema.prisma gains a new Role value, update shared/src/schemas/role.schema.ts too.
// Exported so noUnusedLocals doesn't flag it — nothing needs to import it.
export type RoleSyncGuard = PrismaRole extends Role ? true : never;

// ─── API Response helpers ────────────────────────────────────────────────────

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
