// prisma.config.ts
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // env() is type-safe but does NOT load .env — use tsx --env-file=.env in dev
    url: env('DATABASE_URL'),
  },
});
