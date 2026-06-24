---
name: drone-client-development
description: Use when working in this vite-react-tanstack-router-eden Drone frontend repo, especially before editing app code, docs, scripts, or project structure.
---

# Drone Client Development

## Overview

Guide for working in the Drone frontend client repo.

## Before editing

1. Read `agent.md` and `README.md` first.
2. Read the key files related to the change.
3. Understand the feature-based structure: routes are thin, features contain logic.

## Conventions

- Use Bun for all scripts (`bun` not `npm`/`yarn`/`pnpm`).
- Keep changes minimal and focused. No broad refactors.
- Do not edit generated files (`routeTree.gen.ts`, `server.d.ts`).
- Keep routes thin; app logic in `src/features/*`.

## Verification

Smallest relevant check:

- TypeScript changes → `bun run typecheck`
- Formatting → `bun run format:check`
- Linting → `bun run lint`
- Tests → `bun run test`
- Build → `bun run build`

Run the minimum that covers the change. Do not run everything unless you touched multiple areas.

## What not to do

- No new dependencies without asking.
- No commits/pushes without asking.
- No refactoring unrelated code.
