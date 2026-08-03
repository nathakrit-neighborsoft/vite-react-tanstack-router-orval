# Project Agent Instructions

## Project

This repository is reusable frontend boilerplate for starting new products. It is intentionally domain-neutral. Existing routes, feature folders, API models, and UI flows are starter/sample material; do not infer product requirements or naming from them.

When adding product functionality, derive the domain from the request and place it under the matching `src/features/<feature>/` area. Replace or remove sample code only when the task includes that scope.

## Stack

- Bun 1.3 (package manager and script runner)
- Vite 8 + React 19 + TypeScript 5.9
- TanStack Router (file-based routing)
- TanStack Query (server state, cache, and mutations)
- Orval (generated React Query hooks from OpenAPI)
- Better Auth integration for session-based authentication
- Tailwind CSS v4 + Radix UI primitives
- Tauri 2 integration for native targets
- Vitest + Testing Library, oxlint, and Prettier

## Source layout

```text
src/
  app/                 Router setup and shared app wiring
  components/ui/       Reusable UI primitives
  features/<feature>/  Domain-specific hooks, components, and query keys
  lib/api/             API mutator and generated Orval client
  lib/env.ts           Single Vite environment source
  routes/              Thin TanStack Router route files
```

## Working rules

- Use Bun for all project scripts (`bun run ...`); do not add npm, Yarn, or pnpm lockfiles.
- Keep route files thin and put application logic in `src/features/*`.
- Never hand-edit `src/routeTree.gen.ts`, `src/lib/api/generated/**`, or `.orval-spec.json`; use the existing generation script.
- Keep API wrappers, query keys, and mutation invalidation close to the feature that owns them.
- Read `VITE_*` values through `src/lib/env.ts`. Inspect the current API config before changing base URLs or generation filters.
- Reuse existing components, utilities, hooks, and scripts. Do not add dependencies or refactor unrelated code without a concrete task need.
- Preserve unrelated user changes. Do not commit or push unless explicitly requested.

## Before finishing

Run the narrowest relevant checks:

- TypeScript: `bun run typecheck`
- Lint: `bun run lint`
- Formatting: `bun run format:check`
- Tests: `bun run test`
- Production build: `bun run build`

Documentation-only changes normally need diff inspection rather than application tests. Report any check that could not run and why.
