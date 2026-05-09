// src/modules/auth/auth.router.ts
import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
  Router,
} from 'express';
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from 'passport-google-oauth20';

import { config } from '../../config';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import type { AppModule } from '../../types';
import { type AuthenticatedRequest, ok, type TokenPair } from '../../types';

import {
  type LoginDto,
  loginSchema,
  type RefreshDto,
  type RegisterDto,
  refreshSchema,
  registerSchema,
} from './auth.schemas';
import { authService } from './auth.service';

// ─── Passport Google strategy ────────────────────────────────────────────────

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    (
      _req: Request,
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        done(new Error('No email from Google'));
        return;
      }

      authService
        .handleGoogleCallback(profile.id, email, profile.displayName, profile.photos?.[0]?.value)
        .then((tokens) => done(null, tokens))
        .catch((err: Error) => done(err));
    },
  ),
);

// ─── Router ──────────────────────────────────────────────────────────────────

const router = Router();

// POST /auth/register
router.post(
  '/register',
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body as RegisterDto;
      const tokens = await authService.register(email, password, name);
      res.status(201).json(ok(tokens, 'Registration successful'));
    } catch (err) {
      next(err);
    }
  },
);

// POST /auth/login
router.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginDto;
      const tokens = await authService.login(email, password);
      res.json(ok(tokens, 'Login successful'));
    } catch (err) {
      next(err);
    }
  },
);

// POST /auth/refresh
router.post(
  '/refresh',
  validate(refreshSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body as RefreshDto;
      const tokens = await authService.refresh(refreshToken);
      res.json(ok(tokens));
    } catch (err) {
      next(err);
    }
  },
);

// POST /auth/logout
router.post(
  '/logout',
  validate(refreshSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body as RefreshDto;
      await authService.logout(refreshToken);
      res.json(ok(null, 'Logged out'));
    } catch (err) {
      next(err);
    }
  },
);

// GET /auth/me — protected
router.get(
  '/me',
  requireAuth as unknown as import('express').RequestHandler,
  (req: Request, res: Response) => {
    const { user } = req as AuthenticatedRequest;
    res.json(ok({ id: user.sub, email: user.email, role: user.role }));
  },
);

// GET /auth/google — redirect to Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }) as RequestHandler,
);

// GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${config.FRONTEND_URL}/login?error=oauth_failed`,
  }) as RequestHandler,
  (req: Request, res: Response) => {
    const tokens = req.user as TokenPair;
    // Redirect to frontend with tokens in query (use secure httpOnly cookies in production)
    const params = new URLSearchParams({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    res.redirect(`${config.FRONTEND_URL}/auth/callback?${params.toString()}`);
  },
);

export const authModule: AppModule = {
  prefix: '/auth',
  router,
};
