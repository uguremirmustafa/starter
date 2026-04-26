// src/modules/users/users.router.ts
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import { requireAuth, requireRole } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { userService } from './users.service';
import { ok, AuthenticatedRequest, AppModule } from '../../types';
import { idParamsSchema } from '../../lib/schemas/common.schemas';

const router = Router();

const authGuard = requireAuth as unknown as import('express').RequestHandler;

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
});

// GET /users — admin only
router.get(
  '/',
  authGuard,
  requireRole('ADMIN') as unknown as import('express').RequestHandler,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.findAll();
      res.json(ok(users));
    } catch (err) {
      next(err);
    }
  },
);

// GET /users/:id
router.get(
  '/:id',
  authGuard,
  validate(idParamsSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const user = await userService.findById(id);
      res.json(ok(user));
    } catch (err) {
      next(err);
    }
  },
);

// PATCH /users/:id
router.patch(
  '/:id',
  authGuard,
  validate(idParamsSchema, 'query'),
  validate(updateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const caller = (req as AuthenticatedRequest).user;
      const updated = await userService.updateProfile(
        id,
        caller,
        req.body as z.infer<typeof updateSchema>,
      );
      res.json(ok(updated));
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /users/:id
router.delete(
  '/:id',
  authGuard,
  validate(idParamsSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const caller = (req as AuthenticatedRequest).user;
      await userService.deleteUser(id, caller);
      res.json(ok(null, 'User deleted'));
    } catch (err) {
      next(err);
    }
  },
);

export const usersModule: AppModule = {
  prefix: '/users',
  router,
};
