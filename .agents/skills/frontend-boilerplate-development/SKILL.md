---
name: frontend-boilerplate-development
description: Use when changing this Vite + React + TanStack Router + TanStack Query + Orval boilerplate, including features, routes, API integration, configuration, scripts, or documentation.
---

# Developing the Frontend Boilerplate

## Overview

Treat this repository as a reusable template. Existing domain-shaped code is sample material; the request defines the product domain.

## Workflow

1. **Scope the request.** Name the observable behavior, affected layer, and verification target. **Done when** the acceptance criteria contain no unexplained sample-domain assumptions.
2. **Discover the foundation.** Read `AGENTS.md`, `README.md`, the relevant config, and nearby source; search for an existing pattern before adding one. Confirm the package manager, scripts, entry points, generated boundaries, owner feature, callers, and tests. **Done when** every planned edit has a concrete path and reason.
3. **Keep ownership local.** Keep TanStack Router route files thin and put domain logic under `src/features/<feature>/`. Keep feature API wrappers, query keys, mutation invalidation, and feature tests with their owner. **Done when** each new symbol has one owner and route files only compose feature behavior.
4. **Implement template-safe.** Derive names, routes, API tags, and query keys from the request. Read `VITE_*` values through `src/lib/env.ts`. Use Bun and existing project scripts. **Done when** the change does not copy sample identity or introduce an unnecessary dependency or abstraction.
5. **Respect generated boundaries.** Treat `src/routeTree.gen.ts`, `src/lib/api/generated/**`, and `.orval-spec.json` as generated outputs. Change their source/config and use the existing route plugin or `bun run gen:types`; do not hand-edit outputs. **Done when** every generated diff is reproducible from its source and the generator result is recorded.
6. **Verify the smallest useful surface.** Run the narrowest relevant test/check, then inspect the final diff. **Done when** the check passes (or its environment blocker is reported) and only requested files changed.

## Verification map

| Change                             | Check                                                             |
| ---------------------------------- | ----------------------------------------------------------------- |
| TypeScript or route/API code       | `bun run typecheck`                                               |
| Behavior or tests                  | targeted test, then `bun run test` when scope is broad            |
| Lint or formatting-sensitive files | `bun run lint` and/or `bun run format:check`                      |
| Production wiring                  | `bun run build`                                                   |
| Generated API or route output      | required generator first, then the checks above                   |
| Skill, README, or other docs       | inspect diff; confirm paths, commands, and domain-neutral wording |
