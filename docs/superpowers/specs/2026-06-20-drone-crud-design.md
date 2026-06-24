# Drone CRUD Frontend — Design Spec

**Date:** 2026-06-20
**Status:** Approved (pending spec review)

## Context

Frontend drone feature currently read-only (list). Backend (`vite-react-tanstack-router-elysia-monorepo`) **already implements full CRUD**:

- `GET /drone` — list (public)
- `GET /drone/:id` — by id (public)
- `POST /drone` — create (auth required via `verifyToken`)
- `PATCH /drone/:id` — update (auth required)
- `DELETE /drone/:id` — delete (auth required)

Frontend `src/lib/api/server.d.ts` is **stale** — only declares `GET /drone`. Must re-gen types before mutations are type-safe.

## Decisions (resolved via grilling)

| Decision                | Choice                                         | Rationale                                                                |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| Create/Edit UI          | shadcn **Dialog** (modal in list page)         | YAGNI — no new routes; 8 fields fit                                      |
| Delete UX               | shadcn **AlertDialog** confirm                 | Destructive action needs confirm; consistent with shadcn                 |
| Mutation cache strategy | **invalidate + refetch** (`dronesKeys.all`)    | Simple, correct, list is small                                           |
| Form lib                | **plain useState** (no react-hook-form/zod)    | Match existing AuthForm pattern; no new deps; backend validates strictly |
| Edit data source        | populate from **list data** (no getById fetch) | List already carries every field                                         |

## Drone shape (from backend `IDrone`)

```
id: string
brand: string
model: string
fullName: string
imageUrl: string | null          // server-derived, NOT in create input
priceThb: number
tankCapacityL: number
speedMps: number
sprayWidthM: number
performanceRaiPerDay: number
```

**Create input** = all fields except `id` + `imageUrl` (8 fields).
**Update input** = Partial of create.

## Architecture (feature-based — extends existing `features/drones/`)

```
features/drones/
├── api/
│   └── keys.ts                  # +detail(id) factory
├── hooks/
│   ├── use-drones.ts            # (existing)
│   └── use-drone-mutations.ts   # NEW: useCreateDrone / useUpdateDrone / useDeleteDrone
├── components/
│   ├── DroneList.tsx            # +Add button, +edit/delete per card, +dialog open-state
│   ├── DroneForm.tsx            # NEW: 8-field form, reusable create+edit
│   ├── DroneFormDialog.tsx      # NEW: Dialog wrapper containing DroneForm
│   └── DeleteDroneDialog.tsx    # NEW: AlertDialog confirm
└── index.ts                     # +exports
```

**Shared additions:** `components/ui/dialog.tsx`, `alert-dialog.tsx`, `label.tsx` — manual shadcn copies matching existing `button.tsx` style (new-york, cva, forwardRef). No `bunx` install.

## Data Flow

### Create

1. User clicks `[Add drone]` in DroneList header
2. DroneFormDialog opens (mode=create, empty form)
3. Submit → `useCreateDrone` → `api.api.drone.post(body)` (201)
4. `onSuccess`: `queryClient.invalidateQueries({ queryKey: dronesKeys.all })` + close dialog
5. List refetches → new drone appears

### Edit

1. User clicks edit button on a drone card
2. DroneFormDialog opens (mode=edit, pre-filled from that list item)
3. Submit → `useUpdateDrone` → `api.api.drone[id].patch(body)`
4. `onSuccess`: invalidate + close

### Delete

1. User clicks delete button on a drone card
2. DeleteDroneDialog opens (AlertDialog)
3. Confirm → `useDeleteDrone` → `api.api.drone[id].delete()` returns `{ success: true }`
4. `onSuccess`: invalidate + close

## Mutation hook contract (`use-drone-mutations.ts`)

```ts
export function useCreateDrone() // useMutation, POST, invalidate all
export function useUpdateDrone() // useMutation, PATCH by id, invalidate all
export function useDeleteDrone() // useMutation, DELETE by id, invalidate all
```

Each mutation:

- Uses `api` from `@/lib/api/client`
- Calls Eden endpoint (Eden infers typed body/response from regenerated server.d.ts)
- `onSuccess` → `queryClient.invalidateQueries({ queryKey: dronesKeys.all })`
- `isPending`/`isError`/`error` consumed by dialog UI

## Form behavior (`DroneForm.tsx`)

- Props: `{ initialDrone?: Drone; onSubmit: (values) => Promise<void>; submitting: boolean; error?: string | null }`
- 8 inputs: brand, model, fullName (text); priceThb, tankCapacityL, speedMps, sprayWidthM, performanceRaiPerDay (number)
- Plain `useState` for each field, pre-filled from `initialDrone` when edit
- Basic client validation: required check + numeric parse
- On submit: call `onSubmit` (parent handles mutation), surface `error` in footer
- Calls `onSubmit` then parent closes dialog on success

## Error handling

- Eden errors flow through `handleEdenResponse` (existing util) which throws → React Query captures in `mutation.error`
- 422 (backend validation): message shown in dialog footer
- 401 (session expired): drone route component already gates on session; if mutation 401s, error shown in dialog
- Delete of non-existent id: backend 404 → error shown

## Prerequisite (Step 0 of plan)

`src/lib/api/server.d.ts` must be regenerated:

```bash
bun run gen:types   # backend must run on :3050
```

Without this, Eden POST/PATCH/DELETE won't type-check.

## Verification

- `bun run typecheck` — pass (incl. regenerated types)
- `bun run lint`
- `bun run build`
- `bun run test`
- Manual: create/edit/delete a drone end-to-end

## Out of scope

- getById fetch for edit (uses list data)
- Optimistic updates
- react-hook-form / zod
- Pagination / search / filtering
- Bulk delete
- Permissions UI (backend `verifyToken` gates; frontend session-gates the route)
