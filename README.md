# vite-react-tanstack-router-client

Frontend for the Drone monorepo backend. Consumes the API via Eden Treaty (RPC) and TanStack Query.

## Stack

- Vite + React 19 + TanStack Router (file-based)
- TanStack Query v5
- `@elysiajs/eden` (Eden Treaty — typed RPC client backed by `elysia-remote-dts` types)
- better-auth/react (auth client)
- Tailwind v4 + shadcn/ui

## Develop

```bash
bun install
bun run gen:types  # fetch server.d.ts from :3050, write to src/api/server.d.ts
bun run dev        # Vite on :3000, proxies /api + /auth to :3050
```

The api must be running locally before `bun run gen:types` will work.
