// src/modules/auth/auth.schemas.ts
// Schemas are now defined in @starter/shared — Zod is the source of truth.
export {
  type LoginDto,
  loginSchema,
  type RefreshDto,
  type RegisterDto,
  refreshSchema,
  registerSchema,
} from '@starter/shared';
