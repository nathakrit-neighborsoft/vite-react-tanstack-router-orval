---
name: tanstack-router-query
description: Use when editing TanStack Router routes, route loaders, src/app/router.ts, React Query hooks, query keys, or route-driven data loading in this Drone frontend repo.
---

# TanStack Router + Query

## Overview

File-based routing (TanStack Router) + server state management (TanStack Query).

## Router

- Route files in `src/routes/`. File-based. Do not manually edit `src/routeTree.gen.ts`.
- Router setup in `src/app/router.ts` — register types there.
- Keep route components thin; import from `src/features/*`.
- Routes use `createFileRoute` from `@tanstack/react-router`.

## Query

- React Query client is passed via router context (`context.queryClient`).
- Route loaders can use `context.queryClient.ensureQueryData(...)` for prefetch.
- Use Orval-generated hooks from `src/lib/api/generated/` for API calls (e.g. `useGetDrones`, `getDrones` for prefetch).

## Query keys

Keys live in feature `api/keys.ts`:

```typescript
export const dronesKeys = {
  all: ['drones'] as const,
  lists: () => [...dronesKeys.all, 'list'] as const,
  details: () => [...dronesKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...dronesKeys.details(), uuid] as const,
}
```

## Mutation invalidation

Feature hooks wrap generated mutation hooks with invalidation:

```typescript
export function useCreateDrone() {
  const qc = useQueryClient()
  return useGenCreateDrone({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }) },
  })
}
```

## Type safety

Register router type in `src/app/router.ts`:

```typescript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

This makes `Link`, `useNavigate`, `useParams` type-safe.
