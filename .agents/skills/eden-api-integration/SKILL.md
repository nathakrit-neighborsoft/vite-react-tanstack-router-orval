---
name: eden-api-integration
description: Use when changing Eden Treaty API calls, Better Auth client code, VITE_API_URL, src/lib/api, generated server types, or backend integration in this Drone frontend repo.
---

# Eden API Integration

## Overview

Typed API layer using `@elysiajs/eden` Treaty client with cookie-based auth.

## VITE_API_URL rules

- Must be **origin only** — no path. Correct: `http://localhost:3050`. Wrong: `http://localhost:3050/api`.
- Eden Treaty appends server route paths itself (e.g. `api.api.drone.get()` → `/api/drone`).
- Local dev uses Vite proxy. Production uses nginx proxy.
- Setting `VITE_API_URL=` (empty) uses same-origin proxy.

## Auth

- All API calls use `credentials: 'include'` for cookie-based session auth.
- Auth client is `better-auth/react` via `src/features/auth/auth-client.ts`.
- Auth form component: `src/features/auth/components/AuthForm.tsx`.

## Client location

`src/lib/api/client.ts`:

```typescript
import { treaty } from '@elysiajs/eden'
import { env } from '@/env'
import type { App } from './server'

const baseURL = env.VITE_API_URL || ''
export const api = treaty<App>(baseURL, { fetch: { credentials: 'include' } })
```

## Generated server types

`src/lib/api/server.d.ts` is fetched from the backend:

```bash
bun run gen:types
```

This hits `http://localhost:3050/server.d.ts`. If unreachable, the old types are kept.

## Helpers

- `handleEdenResponse<T>({ result, fallbackMessage })` — extracts `.data` or throws.
- `useEdenQuery<T>(queryKey, fn, options?)` — wraps `useQuery` + `handleEdenResponse`.

## Data invalidation

After mutations (create/update/delete), always invalidate:

```typescript
qc.invalidateQueries({ queryKey: dronesKeys.all })
```

## Vite proxy (dev)

| Path      | Target                             |
| --------- | ---------------------------------- |
| `/api/*`  | `http://localhost:3050/*`          |
| `/auth/*` | `http://localhost:3050/api/auth/*` |
