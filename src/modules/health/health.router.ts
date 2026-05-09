// src/modules/health/health.router.ts
import { type Request, type Response, Router } from 'express';

import { prisma } from '@/lib/prisma';
import { type AppModule, ok } from '@/types';

const router = Router();

// GET /health — liveness (k8s: is the process up?)
router.get('/', (_req: Request, res: Response) => {
  res.json(ok({ status: 'ok', timestamp: new Date().toISOString() }));
});

// GET /health/ready — readiness (k8s: can we serve traffic?)
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json(ok({ status: 'ready', db: 'connected' }));
  } catch {
    res.status(503).json({ success: false, error: 'Database unavailable' });
  }
});

export const healthModule: AppModule = {
  prefix: '/health',
  router,
};
