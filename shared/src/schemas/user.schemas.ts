import { z } from 'zod/v4';

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
});
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
