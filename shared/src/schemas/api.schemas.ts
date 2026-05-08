import { z } from 'zod/v4';
import { roleSchema } from './role.schema';

export const tokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type TokenPair = z.infer<typeof tokenPairSchema>;

// Response from GET /auth/me — JWT claims only, not a full profile
export const meResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: roleSchema,
});
export type MeResponse = z.infer<typeof meResponseSchema>;

// Response from GET /users, GET /users/:id, PATCH /users/:id
export const userDtoSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  role: roleSchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
export type UserDto = z.infer<typeof userDtoSchema>;
