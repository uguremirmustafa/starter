// src/modules/auth/auth.schemas.ts
// Schemas are now defined in @starter/shared — Zod is the source of truth.
export {
  registerSchema,
  loginSchema,
  refreshSchema,
  type RegisterDto,
  type LoginDto,
  type RefreshDto,
} from '@starter/shared';
