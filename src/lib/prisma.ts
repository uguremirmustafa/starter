// src/lib/prisma.ts
// Prisma 7: client is generated to src/generated/prisma, adapter-pg is required

import { PrismaPg } from '@prisma/adapter-pg';

import { config } from '@/config';
import { PrismaClient } from '@/generated/prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: config.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });
}

// Reuse in development to avoid too many connections
export const prisma = global.__prisma ?? createPrismaClient();

if (config.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
