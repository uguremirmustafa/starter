// src/index.ts
import { createApp } from './app';
import { config } from './config';
import { prisma } from './lib/prisma';

function main() {
  const app = createApp();

  const server = app.listen(config.PORT, () => {
    console.log(`🚀  Server running on http://localhost:${config.PORT}${config.API_PREFIX}`);
    console.log(`    ENV: ${config.NODE_ENV}`);
  });

  // ─── Graceful shutdown ──────────────────────────────────────────────────
  function shutdown(signal: string) {
    console.log(`\n${signal} received — shutting down gracefully`);
    server.close(() => {
      prisma
        .$disconnect()
        .then(() => {
          console.log('HTTP server closed, DB disconnected');
          process.exit(0);
        })
        .catch((e) => {
          console.log(e);
        });
    });

    // Force exit after 10 s
    setTimeout(() => {
      console.error('Forced exit after timeout');
      process.exit(1);
    }, 10_000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // ─── Unhandled rejections ───────────────────────────────────────────────
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    process.exit(1);
  });
}

try {
  main();
} catch (error) {
  console.error('Fatal startup error:', error);
  process.exit(1);
}
