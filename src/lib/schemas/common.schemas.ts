import { z } from 'zod/v4';

export const idParamsSchema = z.object({ id: z.string() });
