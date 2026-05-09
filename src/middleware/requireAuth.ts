// src/middleware/requireAuth.ts
import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '@/config';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';
import type { AuthenticatedRequest, JwtPayload, Role } from '@/types';

/**
 * Verifies the Bearer JWT and attaches `req.user`.
 */
export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing bearer token'));
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

/**
 * Role-based access guard — use AFTER requireAuth.
 *
 * @example router.get('/admin', requireAuth, requireRole('ADMIN'), handler)
 */
export function requireRole(...roles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }
    next();
  };
}
