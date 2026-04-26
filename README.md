# TypeScript REST API Starter

A bulletproof, fully type-safe Express + Prisma starter with JWT auth and Google OAuth2.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js + TypeScript | Full type safety end-to-end |
| Framework | Express | Minimal, modular, battle-tested |
| ORM | Prisma | Type-safe queries, migrations |
| Auth | JWT + Passport Google | Stateless + social login |
| Validation | Zod | Schema = types (no duplication) |
| DB | PostgreSQL | Solid default for most apps |

## Project structure

```
src/
├── config/         # Env vars — validated at startup with Zod
├── lib/
│   ├── prisma.ts   # Singleton PrismaClient
│   └── errors.ts   # Typed error classes
├── middleware/
│   ├── errorHandler.ts   # Global error → JSON
│   ├── requireAuth.ts    # JWT guard + RBAC helper
│   └── validate.ts       # Zod body/query/params validation
├── modules/
│   ├── auth/       # register, login, refresh, logout, Google OAuth
│   ├── users/      # CRUD with role-based access
│   └── health/     # liveness + readiness probes
├── types/          # Shared interfaces, ApiResponse, AppModule
├── app.ts          # Express factory
└── index.ts        # Entry point + graceful shutdown
prisma/
└── schema.prisma   # User, OAuthAccount, RefreshToken, Role
```

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill env
cp .env.example .env

# 3. Start Postgres
docker compose up -d

# 4. Run migrations and generate Prisma client
npm run db:migrate
npm run db:generate

# 5. Start dev server (hot reload)
npm run dev
```

## API endpoints

```
POST   /api/v1/auth/register       Register with email + password
POST   /api/v1/auth/login          Login → { accessToken, refreshToken }
POST   /api/v1/auth/refresh        Rotate refresh token
POST   /api/v1/auth/logout         Revoke refresh token
GET    /api/v1/auth/me             Current user (JWT required)
GET    /api/v1/auth/google         Redirect to Google OAuth
GET    /api/v1/auth/google/callback  OAuth callback

GET    /api/v1/users               List users (ADMIN only)
GET    /api/v1/users/:id           Get user by id
PATCH  /api/v1/users/:id           Update own profile (or any if ADMIN)
DELETE /api/v1/users/:id           Delete own account (or any if ADMIN)

GET    /api/v1/health              Liveness probe
GET    /api/v1/health/ready        Readiness probe (pings DB)
```

## Authentication flow

```
Client                    API                       Google
  |                        |                           |
  |-- POST /auth/login --> |                           |
  |<-- { accessToken,      |                           |
  |      refreshToken } -- |                           |
  |                        |                           |
  |-- GET /auth/google --> |                           |
  |                        |--- redirect ------------> |
  |<------- redirect back to /google/callback -------- |
  |                        |<-- profile ---------------|
  |<-- redirect with tokens|                           |
```

Tokens:
- **Access token** — short-lived (15 min), sent as `Authorization: Bearer <token>`
- **Refresh token** — long-lived (7 days), stored in DB, rotated on every use

## Adding a new module

1. Create `src/modules/myfeature/`
2. Add `myfeature.service.ts`, `myfeature.schemas.ts`, `myfeature.router.ts`
3. Export an `AppModule` from the router file
4. Register it in `src/app.ts` MODULES array — done

Each module is fully self-contained and can be extracted to a standalone microservice by pointing it at its own DB + spinning up its own Express instance.

## Converting to microservices

Each module is designed to be extracted:

1. Copy the module folder to a new repo
2. Copy `lib/`, `middleware/`, `types/`, `config/` (shared kernel — consider a private npm package)
3. Wire up its own `app.ts` and `index.ts`
4. Replace direct service imports with HTTP or message-queue calls
