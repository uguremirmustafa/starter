// src/modules/users/users.router.ts

import { type UpdateUserDto, updateUserSchema } from '@starter/shared';
import { type NextFunction, type Request, type Response, Router } from 'express';

import { idParamsSchema } from '@/lib/schemas/common.schemas';
import { requireAuth, requireRole } from '@/middleware/requireAuth';
import { validate } from '@/middleware/validate';
import { type AppModule, type AuthenticatedRequest, ok } from '@/types';

import { userService } from './users.service';

const router = Router();

const authGuard = requireAuth as unknown as import('express').RequestHandler;

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
  validate(updateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const caller = (req as AuthenticatedRequest).user;
      const updated = await userService.updateProfile(id, caller, req.body as UpdateUserDto);
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
