// src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '@/config';
import type { Role } from '@/generated/prisma/client';
import { ConflictError, UnauthorizedError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import type { JwtPayload, TokenPair } from '@/types';

const MS: Record<string, number> = { m: 60_000, h: 3_600_000, d: 86_400_000 };

function parseDuration(s: string): number {
  const match = s.match(/^(\d+)([mhd])$/);
  if (!match) throw new Error(`Invalid duration: ${s}`);
  return Number(match[1]) * MS[match[2]];
}

export class AuthService {
  // ─── Email / password ────────────────────────────────────────────────────

  async register(email: string, password: string, name?: string): Promise<TokenPair> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError('Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
    });

    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) throw new UnauthorizedError('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    return this.issueTokens(user.id, user.email, user.role);
  }

  // ─── Google OAuth callback ───────────────────────────────────────────────

  async handleGoogleCallback(
    googleId: string,
    email: string,
    name: string,
    avatarUrl?: string,
  ): Promise<TokenPair> {
    // Upsert OAuth account → user
    let account = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: 'google',
          providerUserId: googleId,
        },
      },
      include: { user: true },
    });

    if (!account) {
      // Try to link to existing user by email
      const existingUser = await prisma.user.findUnique({ where: { email } });
      const user = existingUser
        ? existingUser
        : await prisma.user.create({ data: { email, name, avatarUrl } });

      account = await prisma.oAuthAccount.create({
        data: { provider: 'google', providerUserId: googleId, userId: user.id },
        include: { user: true },
      });
    }

    return this.issueTokens(account.user.id, account.user.email, account.user.role);
  }

  // ─── Token refresh ───────────────────────────────────────────────────────

  async refresh(token: string): Promise<TokenPair> {
    const stored = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Rotate: delete old, issue new
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.issueTokens(stored.user.id, stored.user.email, stored.user.role);
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  // ─── Internals ───────────────────────────────────────────────────────────

  private async issueTokens(userId: string, email: string, role: Role): Promise<TokenPair> {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      role,
    };

    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    const expiresAt = new Date(Date.now() + parseDuration(config.JWT_REFRESH_EXPIRES_IN));
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
