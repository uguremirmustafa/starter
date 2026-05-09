// src/middleware/errorHandler.ts
import type { Request, Response } from 'express';
import { ZodError } from 'zod/v4';

import { config } from '@/config';
import { AppError } from '@/lib/errors';
import { fail } from '@/types';

export function errorHandler(err: unknown, _req: Request, res: Response): void {
  // Zod validation error
  if (err instanceof ZodError) {
    const message = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    res.status(422).json(fail(message));
    return;
  }

  // Known application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json(fail(err.message));
    return;
  }

  // Unknown error — don't leak internals
  console.error('Unhandled error:', err);
  const message =
    config.NODE_ENV === 'development' && err instanceof Error
      ? err.message
      : 'Internal server error';
  res.status(500).json(fail(message));
}
