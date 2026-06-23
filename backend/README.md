# Townhall Application - Backend
Backend service for rooms, questions, polling, renderer status, and tenant configuration.

This backend now uses MongoDB for persistent storage (no in-memory-only runtime state).

## MongoDB Configuration
Set these environment variables in `.env`:

- `MONGODB_URL` (or `DATABASE_URL`)
- `MONGODB_NAME` (or `MONGODB_DB_NAME`)
- `MONGODB_USE_TLS` (`true`/`false`)
- `MONGODB_TLS_CERTIFICATE` (optional CA certificate path when TLS is enabled)

On startup, the app connects to MongoDB and ensures required indexes exist.

## Commands

- Install dependencies: `npm install`
- How to build: `yarn build` or `npm run build`
- How to start development server: `npm run start:dev`
- How to start production server: `yarn start:prod` or `npm run start:prod`
