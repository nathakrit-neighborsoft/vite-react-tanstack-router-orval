# vite-react-tanstack-router-orval

Frontend client for the Drone monorepo backend. Vite + React app using TanStack Router, TanStack Query, Better Auth, and Orval-generated React Query hooks from the backend OpenAPI spec.

## Features

- File-based routes with TanStack Router
- Auth-gated drone management page
- Drone list/create/update/delete flows via Orval-generated hooks
- React Query caching and mutation invalidation
- Tailwind CSS v4 styling with shadcn/ui-style components
- Vite dev proxy for local backend integration
- Nginx runtime image for production builds
- Tauri 2 desktop and Android support with native notifications

## Stack

- Bun 1.3
- Vite 8 + React 19
- TypeScript 5.9
- TanStack Router 1.95
- TanStack Query 5
- Orval (generated React Query hooks from OpenAPI)
- `better-auth/react` for auth client state
- Tailwind CSS v4
- Tauri 2 (desktop + Android, notifications)
- Vitest, Testing Library, oxlint, Prettier

## Requirements

- [Bun](https://bun.sh/) 1.3+
- [jq](https://jqlang.github.io/jq/) (for `gen:types`)
- Drone monorepo backend:
  - Runtime auth/drone API on `http://localhost:3050` (dev proxy target)
  - OpenAPI spec on `http://localhost:9009/api-json` (for `gen:types`)

## Getting started

```bash
bun install
cp .env.example .env
bun run gen:types
bun run dev
```

Open `http://localhost:3000`.

`bun run dev` starts Vite on port `3000` and proxies local API traffic to the backend on port `3050`:

- `/api` → `http://localhost:3050`
- `/auth` → `http://localhost:3050/api/auth`

## Environment variables

```env
# Empty = use same-origin Vite/nginx proxy
VITE_API_URL=
VITE_APP_TITLE=Drone Client
```

Set `VITE_API_URL` only when calling a backend on a different origin:

```env
VITE_API_URL=http://localhost:3050
```

Do not include `/api` in `VITE_API_URL`; Orval and the mutator append API paths themselves.

## API client generation

Generated API code lives at `src/lib/api/generated/`. Regenerate after backend API contract changes:

```bash
bun run gen:types
```

This fetches `http://localhost:9009/api-json`, strips `^/api/auth/{path}$` with `jq`, writes `.orval-spec.json`, then runs Orval. The mutator at `src/lib/api/mutator.ts` handles fetch calls with `credentials: 'include'` and JSON parsing.

## Scripts

| Command                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `bun run dev`          | Generate API types, then start Vite on port `3000`         |
| `bun run build`        | Run TypeScript checks and build production assets          |
| `bun run preview`      | Preview the production build locally on port `3000`        |
| `bun run test`         | Run Vitest once                                            |
| `bun run test:coverage`| Run Vitest with coverage report                            |
| `bun run test:watch`   | Run Vitest in watch mode                                   |
| `bun run typecheck`    | Run `tsc --noEmit`                                         |
| `bun run gen:types`    | Fetch OpenAPI spec and regenerate Orval client             |
| `bun run lint`         | Run oxlint                                                  |
| `bun run lint:fix`     | Run oxlint with fixes                                      |
| `bun run format`       | Format files with Prettier                                 |
| `bun run format:check` | Check formatting with Prettier                             |
| `bun run tauri:dev`    | Start Tauri dev shell (desktop)                            |
| `bun run tauri:build`  | Build native desktop bundle                                |
| `bun run prepare`      | Install lefthook git hooks                                  |

## App routes

| Route    | Purpose                                 |
| -------- | --------------------------------------- |
| `/`      | Home page with link to drone management |
| `/drone` | Auth-gated drone list and CRUD UI       |

## Project structure

```text
src/
  app/                 Router and shared app setup
  components/ui/       Reusable UI primitives
  features/auth/       Better Auth client and auth form
  features/drones/     Drone API hooks and CRUD components
  features/notifications/  Tauri notification helpers
  lib/api/             Orval-generated client, mutator, models
  lib/env.ts           Vite environment defaults
  routes/              TanStack Router file routes
```

## Production build

```bash
bun run build
```

The Docker image builds static assets with Bun, then serves `dist/` from nginx:

```bash
docker build -t drone-client .
docker run --rm -p 8080:80 drone-client
```

The included `nginx.conf` serves the SPA and proxies API traffic to an upstream service named `api` on port `3050`.

## Tauri desktop & Android builds

The app can also run as a native Tauri 2 desktop window or Android APK.

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (via rustup, including Android targets)
- [Android Studio](https://developer.android.com/studio) with:
  - Android SDK Platform 35+
  - NDK (installed via SDK Manager)
  - Java (Android Studio bundles a JRE at `<studio>/jbr`)
- Tauri [system dependencies](https://v2.tauri.app/start/prerequisites/)

### Commands

| Command                       | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `bun run tauri:dev`           | Start Tauri dev shell (desktop)                 |
| `bun run tauri:build`         | Build native desktop bundle                     |
| `bun run tauri:android:init`  | Initialize Android project under `src-tauri/`   |
| `bun run tauri:android:dev`   | Build and run on connected Android device/emulator |
| `bun run tauri:android:build` | Build release APK/AAB                           |

### Notes

- Android builds use the same Vite dev/build pipeline as the web app.
- Backend API/auth on a physical Android device may require setting a reachable backend origin instead of relying on `localhost` or the Vite dev proxy. Configure `VITE_API_URL` to point to an accessible backend when running on device.

## Troubleshooting

- **Auth or drone requests fail in dev**: confirm the backend is running on `http://localhost:3050`.
- **Generated Orval client is stale**: start the backend (OpenAPI endpoint), then run `bun run gen:types`.
- **Direct backend URL fails**: ensure `VITE_API_URL` is only the origin, not an `/api` path.
- **gen:types fails**: verify the backend OpenAPI endpoint is reachable at `http://localhost:9009/api-json` and `jq` is installed.
