# Drone CRUD Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Create / Update / Delete drone UI to the existing read-only list, using Dialog forms + AlertDialog confirm + TanStack Query mutations.

**Estimated tasks:** 6 | **Estimated time:** ~60 min | **Touches:** Frontend (features/drones + components/ui)

## Current Problem / Current Solution

Today `features/drones/components/DroneList.tsx` only renders a read-only grid of drones fetched via `useDrones()` (GET /drone). The backend (`vite-react-tanstack-router-elysia-monorepo`) already exposes POST/PATCH/DELETE on `/drone`, but the frontend `src/lib/api/server.d.ts` is stale (only declares GET) so those endpoints aren't even visible to Eden. There is no way to add, edit, or remove a drone from the UI.

## Proposed Approach

1. Regenerate `server.d.ts` so Eden sees the full CRUD surface (type-safe mutations).
2. Add the missing shadcn primitives (Dialog, AlertDialog, Label) by hand, matching the existing `button.tsx`/`input.tsx` style.
3. Add three `useMutation` hooks (create/update/delete) that invalidate `dronesKeys.all` on success.
4. Add `DroneForm` (8-field, plain useState) reused for create + edit.
5. Wrap it in `DroneFormDialog` (Dialog) and add `DeleteDroneDialog` (AlertDialog).
6. Wire Add / Edit / Delete buttons into `DroneList` and export from the feature barrel.

Cache strategy: invalidate + refetch (simple; list is small). No optimistic updates, no react-hook-form, no getById fetch for edit.

## Side by Side

| Scenario       | Before         | After                                                                 |
| -------------- | -------------- | --------------------------------------------------------------------- |
| Add a drone    | Not possible   | `[Add drone]` opens Dialog → POST → list refreshes                    |
| Edit a drone   | Not possible   | Edit button on card opens Dialog pre-filled → PATCH → list refreshes  |
| Delete a drone | Not possible   | Delete button on card → AlertDialog confirm → DELETE → list refreshes |
| Mutation error | n/a            | Eden error shown in Dialog footer                                     |
| Type safety    | Only GET typed | Full CRUD typed via regenerated `server.d.ts`                         |

## Assumptions & Risks

- **Assumed:** Backend is runnable on `localhost:3050` so `bun run gen:types` succeeds (Step 0). If not, Task 1 blocks — surface to user.
- **Assumed:** `verifyToken` middleware accepts the existing session cookie (same as GET already works). If auth differs for writes, mutations will 401 — error surfaces in dialog.
- **Assumed:** Drone `id` from the list is a string safe to pass as Eden `[id]` index param (backend `parseIdOrThrow` converts). Verified from backend `drone.controller.ts`.
- **Risk:** shadcn `dialog.tsx`/`alert-dialog.tsx` depend on `@radix-ui/react-dialog` + `@radix-ui/react-alert-dialog` — must install in Task 2.
- **Risk:** Regenerated `server.d.ts` may shift the Eden call shape for mutations (e.g. `api.api.drone.post()` vs `api.api.drone.post({...})`). Verify actual call shape after regen in Task 3.

## Impact

- Adds full CRUD capability to drone admin page
- Introduces reusable Dialog/AlertDialog primitives to the design system
- Establishes the mutation pattern for future features
- Keeps feature-based folder structure consistent

---

## Task Overview

1. **Regenerate Eden types** — refresh `server.d.ts` from running backend
2. **Add shadcn primitives** — Dialog, AlertDialog, Label (+ radix deps)
3. **Add drone mutations + key factory** — useCreate/useUpdate/useDelete + detail key
4. **Build DroneForm** — 8-field reusable form (create + edit)
5. **Build DroneFormDialog + DeleteDroneDialog** — Dialog/AlertDialog wrappers
6. **Wire CRUD into DroneList + barrel** — Add/Edit/Delete buttons, exports, verify

---

### Task 1: Regenerate Eden types

**Files:**

- Modify: `src/lib/api/server.d.ts` (regenerated, not hand-edited)

- [ ] **Step 1: Confirm backend is running**

```bash
curl -s http://localhost:3050/server.d.ts | head -5
```

Expect the first lines of an Elysia type declaration. If this fails or returns nothing, STOP and ask the user to start the backend (`vite-react-tanstack-router-elysia-monorepo`).

- [ ] **Step 2: Run gen:types**

```bash
bun run gen:types
```

Expect `✓ src/lib/api/server.d.ts written (<N> bytes)`.

- [ ] **Step 3: Verify CRUD endpoints now present in the type**

Search the regenerated file for `post`, `patch`, `delete` under `api.drone`:

```bash
rg -n "drone" src/lib/api/server.d.ts | rg -i "post|patch|delete"
```

Expect matches showing the three new methods. If absent, the backend is stale — ask user to rebuild/restart backend and re-run.

- [ ] **Step 4: Confirm typecheck still green**

```bash
bun run typecheck
```

Commit message: `chore: regenerate eden types for drone CRUD`

---

### Task 2: Add shadcn primitives (Dialog, AlertDialog, Label)

**Files:**

- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/alert-dialog.tsx`
- Create: `src/components/ui/label.tsx`
- Modify: `package.json` (add radix deps)

- [ ] **Step 1: Install radix dependencies**

```bash
bun add @radix-ui/react-dialog @radix-ui/react-alert-dialog @radix-ui/react-label
```

- [ ] **Step 2: Create `src/components/ui/label.tsx`**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { Primitive } from '@radix-ui/react-primitive'
import { cn } from '@/lib/utils'

// Minimal Label; uses Primitive so no extra dep import beyond what radix ships
export const Label = forwardRef<
  ElementRef<typeof Primitive.label>,
  ComponentPropsWithoutRef<typeof Primitive.label>
>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-sm font-medium leading-none', className)} {...props} />
))
Label.displayName = 'Label'
```

(If `@radix-ui/react-primitive` isn't transitively available, drop to a plain `<label>` with `LabelHTMLAttributes<HTMLLabelElement>` — match existing Input.tsx pattern.)

- [ ] **Step 3: Create `src/components/ui/dialog.tsx`**

Copy the official shadcn (new-york) Dialog recipe. Required exports: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`. Use `cn` from `@/lib/utils`, Tailwind classes consistent with `button.tsx` (slate/blue palette). All composition uses `@radix-ui/react-dialog`.

- [ ] **Step 4: Create `src/components/ui/alert-dialog.tsx`**

Copy the official shadcn (new-york) AlertDialog recipe. Required exports: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogCancel`, `AlertDialogAction`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`. Uses `@radix-ui/react-alert-dialog`. Same styling conventions as Dialog.

- [ ] **Step 5: Verify typecheck + lint + build**

```bash
bun run typecheck && bun run lint && bun run build
```

Commit message: `feat(ui): add shadcn dialog, alert-dialog, label primitives`

---

### Task 3: Add drone mutations + extend key factory

**Files:**

- Modify: `src/features/drones/api/keys.ts`
- Create: `src/features/drones/hooks/use-drone-mutations.ts`
- Modify: `src/features/drones/index.ts`

- [ ] **Step 1: Extend `keys.ts` with detail key**

```ts
export const dronesKeys = {
  all: ['drones'] as const,
  lists: () => [...dronesKeys.all, 'list'] as const,
  details: () => [...dronesKeys.all, 'detail'] as const,
  detail: (id: string) => [...dronesKeys.details(), id] as const,
}
```

- [ ] **Step 2: Inspect actual Eden mutation call shape**

Open `src/lib/api/server.d.ts` and confirm the exact shape under `api.drone` — whether create is `api.api.drone.post(body)` and patch/delete are `api.api.drone[id].patch(body)` / `api.api.drone[id].delete()`. Write the hook to match what the regenerated types actually expose. If the shape differs (e.g. `api.api.drone({ id }).patch(...)`), adapt — do not guess.

- [ ] **Step 3: Create `use-drone-mutations.ts`**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { dronesKeys } from '../api/keys'

export function useCreateDrone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateDroneInput) => {
      const { data, error } = await api.api.drone.post(input)
      if (data === null)
        throw error instanceof Error ? error : new Error(String(error ?? 'Create failed'))
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}

export function useUpdateDrone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateDroneInput }) => {
      const { data, error } = await api.api.drone[id].patch(input)
      if (data === null)
        throw error instanceof Error ? error : new Error(String(error ?? 'Update failed'))
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}

export function useDeleteDrone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.api.drone[id].delete()
      if (data === null)
        throw error instanceof Error ? error : new Error(String(error ?? 'Delete failed'))
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}
```

Define `CreateDroneInput` / `UpdateDroneInput` types from the regenerated `server.d.ts` (preferred) or, if the regenerated types don't export a clean type, define them locally matching the backend `droneCreateInput` model:

```ts
type CreateDroneInput = {
  brand: string
  model: string
  fullName: string
  priceThb: number
  tankCapacityL: number
  speedMps: number
  sprayWidthM: number
  performanceRaiPerDay: number
}
type UpdateDroneInput = Partial<CreateDroneInput>
```

Note: these mutations do NOT use `handleEdenResponse` from `@/lib/api/eden-helpers` because that helper is generic over `{ data, error }` but the body differs per mutation; inline the same error-throw pattern for clarity. (Acceptable duplication — only 3 call sites.)

- [ ] **Step 4: Update barrel `index.ts`**

```ts
export { useDrones } from './hooks/use-drones'
export { useCreateDrone, useUpdateDrone, useDeleteDrone } from './hooks/use-drone-mutations'
export { DroneList } from './components/DroneList'
export { dronesKeys } from './api/keys'
```

- [ ] **Step 5: Verify**

```bash
bun run typecheck && bun run lint
```

Commit message: `feat(drones): add create/update/delete mutations + detail key`

---

### Task 4: Build DroneForm

**Files:**

- Create: `src/features/drones/components/DroneForm.tsx`

- [ ] **Step 1: Create `DroneForm.tsx`**

A controlled form, plain `useState`, reused for create + edit.

```tsx
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type DroneFormValues = {
  brand: string
  model: string
  fullName: string
  priceThb: number
  tankCapacityL: number
  speedMps: number
  sprayWidthM: number
  performanceRaiPerDay: number
}

type DroneFormProps = {
  initial?: Partial<DroneFormValues>
  submitting?: boolean
  error?: string | null
  onSubmit: (values: DroneFormValues) => void
}

const NUMERIC_FIELDS = [
  'priceThb',
  'tankCapacityL',
  'speedMps',
  'sprayWidthM',
  'performanceRaiPerDay',
] as const

export function DroneForm({ initial, submitting, error, onSubmit }: DroneFormProps) {
  const [brand, setBrand] = useState(initial?.brand ?? '')
  const [model, setModel] = useState(initial?.model ?? '')
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [priceThb, setPriceThb] = useState(String(initial?.priceThb ?? ''))
  const [tankCapacityL, setTankCapacityL] = useState(String(initial?.tankCapacityL ?? ''))
  const [speedMps, setSpeedMps] = useState(String(initial?.speedMps ?? ''))
  const [sprayWidthM, setSprayWidthM] = useState(String(initial?.sprayWidthM ?? ''))
  const [performanceRaiPerDay, setPerformanceRaiPerDay] = useState(
    String(initial?.performanceRaiPerDay ?? ''),
  )
  const [formError, setFormError] = useState<string | null>(null)

  function submit(e: FormEvent) {
    e.preventDefault()
    // required + numeric parse validation
    if (!brand || !model || !fullName) {
      setFormError('brand, model, fullName are required')
      return
    }
    const parsed = {
      priceThb: Number(priceThb),
      tankCapacityL: Number(tankCapacityL),
      speedMps: Number(speedMps),
      sprayWidthM: Number(sprayWidthM),
      performanceRaiPerDay: Number(performanceRaiPerDay),
    }
    for (const [k, v] of Object.entries(parsed)) {
      if (!Number.isFinite(v) || v <= 0) {
        setFormError(`${k} must be a positive number`)
        return
      }
    }
    setFormError(null)
    onSubmit({ brand, model, fullName, ...parsed })
  }

  const shownError = formError ?? error

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="brand">Brand</Label>
        <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="model">Model</Label>
        <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      {/* repeat the same block for each numeric field: priceThb, tankCapacityL, speedMps, sprayWidthM, performanceRaiPerDay — type="number" step="any" min="0" */}
      {shownError && <p className="text-sm text-red-600">{shownError}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
```

Notes for implementer:

- Render all 5 numeric fields with the same `<div className="space-y-1">` block, `type="number"`, `step="any"`, `min="0"`.
- `onSubmit` is fire-and-forget from the form's perspective; the parent (Dialog) handles the mutation + closing on success.
- Numeric inputs are kept as strings in state to allow empty intermediate values; parse on submit.

- [ ] **Step 2: Verify**

```bash
bun run typecheck && bun run lint
```

Commit message: `feat(drones): add DroneForm component`

---

### Task 5: Build DroneFormDialog + DeleteDroneDialog

**Files:**

- Create: `src/features/drones/components/DroneFormDialog.tsx`
- Create: `src/features/drones/components/DeleteDroneDialog.tsx`

- [ ] **Step 1: Create `DroneFormDialog.tsx`**

Wraps shadcn Dialog + DroneForm. Handles create OR edit based on whether `drone` is passed.

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DroneForm } from './DroneForm'
import { useCreateDrone, useUpdateDrone } from '../hooks/use-drone-mutations'

type DroneLike = {
  id: string
  brand: string
  model: string
  fullName: string
  priceThb: number
  tankCapacityL: number
  speedMps: number
  sprayWidthM: number
  performanceRaiPerDay: number
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  drone?: DroneLike | null // present => edit mode
}

export function DroneFormDialog({ open, onOpenChange, drone }: Props) {
  const create = useCreateDrone()
  const update = useUpdateDrone()
  const isEdit = !!drone

  async function handleSubmit(
    values: Parameters<typeof DroneForm>[0] extends { onSubmit: infer F }
      ? F extends (v: infer V) => void
        ? V
        : never
      : never,
  ) {
    try {
      if (isEdit && drone) {
        await update.mutateAsync({ id: drone.id, input: values })
      } else {
        await create.mutateAsync(values)
      }
      onOpenChange(false)
    } catch {
      // error surfaced via mutation.error in the form footer
    }
  }

  const submitting = isEdit ? update.isPending : create.isPending
  const error = (isEdit ? update.error : create.error)?.message ?? null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit drone' : 'Add drone'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the drone details.' : 'Fill in the drone details.'}
          </DialogDescription>
        </DialogHeader>
        <DroneForm
          initial={drone ?? undefined}
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
```

Note: the convoluted `handleSubmit` parameter type can be simplified by exporting `DroneFormValues` from `DroneForm.tsx` and importing it here. Prefer that — export the type.

- [ ] **Step 2: Create `DeleteDroneDialog.tsx`**

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteDrone } from '../hooks/use-drone-mutations'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  drone: { id: string; brand: string; model: string } | null
}

export function DeleteDroneDialog({ open, onOpenChange, drone }: Props) {
  const remove = useDeleteDrone()

  async function confirm() {
    if (!drone) return
    try {
      await remove.mutateAsync(drone.id)
      onOpenChange(false)
    } catch {
      // swallow — caller can show toast; keep scope minimal
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete drone?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {drone?.brand} {drone?.model}. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirm}
            disabled={remove.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {remove.isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 3: Verify**

```bash
bun run typecheck && bun run lint
```

Commit message: `feat(drones): add DroneFormDialog and DeleteDroneDialog`

---

### Task 6: Wire CRUD into DroneList + barrel + final verify

**Files:**

- Modify: `src/features/drones/components/DroneList.tsx`
- Modify: `src/features/drones/index.ts`
- Modify (optional): `src/routes/drone.tsx` (only if Dialog state needs hoisting — prefer local state in DroneList)

- [ ] **Step 1: Rewrite `DroneList.tsx` to add Add button + per-card Edit/Delete + dialog state**

```tsx
import { useState } from 'react'
import { useDrones } from '../hooks/use-drones'
import { Button } from '@/components/ui/button'
import { DroneFormDialog } from './DroneFormDialog'
import { DeleteDroneDialog } from './DeleteDroneDialog'

type Drone = {
  id: string
  brand: string
  model: string
  fullName: string
  priceThb: number
  tankCapacityL: number
  speedMps: number
  sprayWidthM: number
  performanceRaiPerDay: number
}

export function DroneList({ onSignOut }: { onSignOut?: () => void }) {
  const dronesQuery = useDrones()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Drone | null>(null)
  const [deleting, setDeleting] = useState<Drone | null>(null)

  if (dronesQuery.isLoading) return <p>Loading drones…</p>
  if (dronesQuery.isError) return <p className="text-red-600">Error: {String(dronesQuery.error)}</p>

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }
  function openEdit(d: Drone) {
    setEditing(d)
    setFormOpen(true)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Drones</h2>
        <div className="flex gap-2">
          <Button onClick={openCreate}>Add drone</Button>
          <Button variant="outline" onClick={() => onSignOut?.()}>
            Sign out
          </Button>
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {dronesQuery.data?.map((d) => (
          <li key={d.id} className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {d.brand} {d.model}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{d.fullName}</p>
                <p>
                  ฿{d.priceThb.toLocaleString()} • {d.tankCapacityL}L • {d.performanceRaiPerDay}{' '}
                  rai/day
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(d)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => setDeleting(d)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <DroneFormDialog open={formOpen} onOpenChange={setFormOpen} drone={editing} />
      <DeleteDroneDialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null)
        }}
        drone={deleting}
      />
    </div>
  )
}
```

Note: `Button` currently supports `size: 'default' | 'sm' | 'lg'` per `button.tsx:15` — `size="sm"` is valid.

- [ ] **Step 2: Update barrel `index.ts`**

```ts
export { useDrones } from './hooks/use-drones'
export { useCreateDrone, useUpdateDrone, useDeleteDrone } from './hooks/use-drone-mutations'
export { DroneList } from './components/DroneList'
export { DroneFormDialog } from './components/DroneFormDialog'
export { DeleteDroneDialog } from './components/DeleteDroneDialog'
export { dronesKeys } from './api/keys'
```

- [ ] **Step 3: Full verification**

```bash
bun run typecheck
bun run lint
bun run build
bun run test
```

All four must pass.

- [ ] **Step 4: Manual smoke test**

- Start backend on :3050 (user does this).
- `bun run dev`.
- Visit `/drone`, sign in.
- Click `[Add drone]`, fill form, save → new drone appears in list.
- Click `Edit` on a card, change a field, save → list updates.
- Click `Delete` on a card, confirm → drone disappears.
- Try invalid input (empty brand, negative price) → see client-side error.
- Try server-side error (e.g. backend stopped) → see error message in dialog.

Commit message: `feat(drones): wire CRUD UI into DroneList`

---

## Definition of Done

- All 4 verification commands green
- Manual smoke test passes for create / edit / delete + error states
- Feature-based structure preserved (no new top-level dirs)
- No new runtime deps beyond the 3 radix packages
