---
name: frontend-boilerplate-development
description: Use when working in this Vite + React + TanStack Router + Orval starter, especially before editing application code, documentation, scripts, or project structure.
---

# Frontend Boilerplate Development

## Overview

Treat this repository as a reusable frontend foundation. Domain-shaped code already present is sample/template material, not a product contract.

## Before editing

1. Read `agents.md`, `README.md`, and the relevant config/source. **Done when** the stack, scripts, generated boundaries, and task scope are known.
2. Search for an existing pattern before adding one. **Done when** the target implementation and affected callers are identified.
3. Derive names, routes, API tags, and query keys from the request. **Done when** no sample-domain assumption is driving the change.

## Keep the template tight

- Use Bun and the existing project scripts.
- Keep TanStack Router route files thin; put domain logic under `src/features/<feature>/`.
- Read Vite environment values through `src/lib/env.ts`.
- Treat `src/routeTree.gen.ts`, `src/lib/api/generated/**`, and `.orval-spec.json` as generated. Regenerate them with the existing script instead of hand-editing them.
- Keep API/query wrappers and invalidation keys with their feature. Do not copy names from an existing sample feature into a new feature.
- Preserve the current stack and user changes. Add dependencies only when the task requires one.

## Verification

- Documentation or skill change: inspect the diff and confirm no stale domain-specific identity remains.
- TypeScript: `bun run typecheck`; lint: `bun run lint`; formatting: `bun run format:check`; tests: `bun run test`; production build: `bun run build`.
- Run only checks relevant to the changed files. The work is ready when the smallest relevant checks pass and the diff contains only requested files.
