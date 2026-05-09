// src/app.ts

import cors from 'cors';
import express, { type Application } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import { config } from '@/config';
import { errorHandler } from '@/middleware/errorHandler';
// Modules
import { authModule } from '@/modules/auth/auth.router';
import { healthModule } from '@/modules/health/health.router';
import { usersModule } from '@/modules/users/users.router';
import type { AppModule } from '@/types';

const MODULES: AppModule[] = [authModule, usersModule, healthModule];

export function createApp(): Application {
  const app = express();

  // ─── Security ─────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: config.FRONTEND_URL,
      credentials: true,
    }),
  );

  // ─── Rate limiting ────────────────────────────────────────────────────────
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: 'Too many requests, please try again later',
      },
    }),
  );

  // ─── Parsing & logging ────────────────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // ─── Passport (session-less) ──────────────────────────────────────────────
  app.use(passport.initialize());

  // ─── Mount modules ────────────────────────────────────────────────────────
  for (const mod of MODULES) {
    app.use(`${config.API_PREFIX}${mod.prefix}`, mod.router);
  }

  // ─── 404 handler ─────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  // ─── Global error handler ─────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
