# vite-react-tanstack-router-client

Frontend for the Drone monorepo backend. Consumes the API via OpenAPI codegen (orval) and TanStack Query.

## Stack

- Vite + React 19 + TanStack Router (file-based)
- TanStack Query v5
- orval (codegen from OpenAPI spec)
- better-auth/react (auth client)
- Tailwind v4 + shadcn/ui

## Develop

```bash
bun install
bun run generate   # fetch spec from http://localhost:3050/api/openapi/json, write hooks to src/api
bun run dev        # Vite on :3000, proxies /api + /auth to :3050
```

The api must be running locally before `bun run generate` will work.
