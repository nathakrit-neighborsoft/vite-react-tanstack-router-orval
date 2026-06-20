# vite-react-tanstack-router-client

Frontend for the Drone monorepo backend. Consumes the API via native `fetch` and TanStack Query.

## Stack

- Vite + React 19 + TanStack Router (file-based)
- TanStack Query v5
- better-auth/react (auth client)
- Tailwind v4 + shadcn/ui

## Develop

```bash
bun install
bun run dev  # Vite on :3000, proxies /api + /auth to :3050
```

The api must be running locally before the app will load data.

## Regenerate types

If the API schema changes, run:

```bash
bun run gen:types
```
