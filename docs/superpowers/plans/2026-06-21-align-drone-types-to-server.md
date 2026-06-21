# Align Drone Client Types to Server Schema

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename drone fields throughout the client to match the regenerated `src/lib/api/server.d.ts` schema (`brand`→`company`, `priceThb`→`priceRTF`, `tankCapacityL`→`tankCapacity`, `speedMps`→`flightSpeed`, `sprayWidthM`→`sprayWidth`, `performanceRaiPerDay`→`coveragePerDay`, add `rtfEquipment`), and change `Drone.id` from `string` to `number`.

**Estimated tasks:** 6 | **Estimated time:** ~30 min | **Touches:** Frontend (`features/drones/*`)

## Current Problem / Current Solution

`src/lib/api/server.d.ts` was regenerated after the backend changed the `Drone` schema. The client still hardcodes the old field names (`brand`, `priceThb`, `tankCapacityL`, `speedMps`, `sprayWidthM`, `performanceRaiPerDay`) and types `id` as `string`. Eden Treaty calls compile only by accident (the inferred response type is the new shape but our local types lag), and the form sends fields the server rejects. There is also no UI for the new required `rtfEquipment` field, so any POST would 422.

## Proposed Approach

Mechanical field-by-field rename across the four drone feature files plus the query-keys helper. `id` flips from `string` to `number` everywhere it is referenced (delete mutation, delete dialog, query key detail factory). `DroneForm` grows one extra `Input` for `rtfEquipment`. List/form labels mirror the new schema ("Brand"→"Company", "Price (THB)"→"Price (RTF)", "Speed (m/s)"→"Flight speed", "Performance (rai/day)"→"Coverage per day", plus "RTF equipment" new field). No new abstractions, no refactor of the existing structure.

## Side by Side

| Scenario | Before | After |
| -------- | ------ | ----- |
| POST `/drone` body | `{ brand, priceThb, tankCapacityL, speedMps, sprayWidthM, performanceRaiPerDay }` (no `rtfEquipment` → 422) | `{ company, priceRTF, tankCapacity, flightSpeed, sprayWidth, coveragePerDay, rtfEquipment }` |
| Drone card display | `{brand} {model}`, `฿{priceThb}…` | `{company} {model}`, `฿{priceRTF}…` |
| Delete mutation | `remove.mutateAsync(drone.id)` where `id: string` | `remove.mutateAsync(drone.id)` where `id: number` |
| Form validation | 8 fields | 9 fields (adds RTF equipment) |
| `dronesKeys.detail(id)` | `(id: string)` | `(id: number)` |

## Assumptions & Risks

- **Assumed:** Server returns `id: number` and the form's `id` (string-keyed) was only inferred from local types — switching to `number` will not break runtime because no production path persists `id` as a string (URL params, local storage).
- **Assumed:** The feature has no existing Vitest coverage for these files (confirmed via codegraph: "⚠️ no covering tests found"), so TDD steps are not added; `tsc --noEmit` is the primary verification gate.
- **Risk:** If any consumer outside `src/features/drones/*` destructures the old field names, the rename will leak — `grep` for old names is part of Task 6 verification.
- **Risk:** `bun run typecheck` will fail mid-plan if any step is missed; each task ends with a partial typecheck (only against the file touched) and Task 6 runs the full check.

## Impact

- Client drone CRUD matches server schema (no more 422 on POST/PATCH)
- Type safety restored: `CreateDroneInput` derives from `api.api.drone.post` would be a larger refactor — kept manual but consistent
- One new form field (RTF equipment) is now captured
- No changes to Eden client wiring, routes, or feature barrel exports

---

## Task Overview

1. **Update query keys helper** — flip `detail` id type to `number`
2. **Update mutations hook** — rename fields, add `rtfEquipment`, accept `id: number` in delete
3. **Update DroneList** — rename fields in `Drone` type and rendering
4. **Update DroneForm** — rename fields, add `rtfEquipment` input, update labels
5. **Update DroneFormDialog + DeleteDroneDialog** — apply new field names + `id: number`
6. **Verify** — typecheck + grep for residual old names + lint

---

### Task 1: Update query keys helper

**Files:**

- Modify: `src/features/drones/api/keys.ts`

- [ ] **Step 1: Change `detail` id parameter to `number`**

```ts
export const dronesKeys = {
  all: ['drones'] as const,
  lists: () => [...dronesKeys.all, 'list'] as const,
  details: () => [...dronesKeys.all, 'detail'] as const,
  detail: (id: number) => [...dronesKeys.details(), id] as const,
}
```

- [ ] **Step 2: Verify file compiles** — run `bun run typecheck` (full project). Expected: pre-existing errors in other drone files are still present (we haven't fixed them yet), but no NEW error introduced by `keys.ts`. If a new error appears in `keys.ts`, fix before moving on.

---

### Task 2: Update mutations hook

**Files:**

- Modify: `src/features/drones/hooks/use-drone-mutations.ts`

- [ ] **Step 1: Rewrite `CreateDroneInput` to match server schema**

Replace the `CreateDroneInput` type alias:

```ts
export type CreateDroneInput = {
  company: string
  model: string
  fullName: string
  priceRTF: number
  tankCapacity: number
  flightSpeed: number
  sprayWidth: number
  coveragePerDay: number
  rtfEquipment: string
}

export type UpdateDroneInput = Partial<CreateDroneInput>
```

- [ ] **Step 2: Update `useDeleteDrone` signature to accept `number`**

Change the `id: string` parameter:

```ts
mutationFn: async (id: number) => {
```

- [ ] **Step 3: Verify** — `bun run typecheck`. Errors should now appear in `DroneList.tsx`, `DroneForm.tsx`, `DroneFormDialog.tsx`, `DeleteDroneDialog.tsx` (consumers of the old types) — these are expected and addressed in Tasks 3–5. No error should remain in `use-drone-mutations.ts` itself.

---

### Task 3: Update DroneList type + render

**Files:**

- Modify: `src/features/drones/components/DroneList.tsx`

- [ ] **Step 1: Rewrite the local `Drone` type**

```ts
type Drone = {
  id: number
  company: string
  model: string
  fullName: string
  priceRTF: number
  tankCapacity: number
  flightSpeed: number
  sprayWidth: number
  coveragePerDay: number
  rtfEquipment: string
}
```

- [ ] **Step 2: Update JSX field references**

In the `dronesQuery.data?.map((d) => …)` block:

- `{d.brand} {d.model}` → `{d.company} {d.model}`
- `฿{d.priceThb.toLocaleString()} • {d.tankCapacityL}L • {d.performanceRaiPerDay} rai/day` → `฿{d.priceRTF.toLocaleString()} • {d.tankCapacity}L • {d.coveragePerDay} rai/day`

Keep everything else in the component unchanged (buttons, dialog wiring, loading/error states).

- [ ] **Step 3: Verify** — `bun run typecheck`. Expected: errors in `DroneList.tsx` are gone; remaining errors live in `DroneForm.tsx`, `DroneFormDialog.tsx`, `DeleteDroneDialog.tsx`.

---

### Task 4: Update DroneForm types, state, validation, labels

**Files:**

- Modify: `src/features/drones/components/DroneForm.tsx`

- [ ] **Step 1: Rewrite `DroneFormValues` type**

```ts
export type DroneFormValues = {
  company: string
  model: string
  fullName: string
  priceRTF: number
  tankCapacity: number
  flightSpeed: number
  sprayWidth: number
  coveragePerDay: number
  rtfEquipment: string
}
```

- [ ] **Step 2: Rename all `useState` hooks and initial-value fallbacks**

For each field in the type, rename in lockstep:

| Old state | New state |
| --- | --- |
| `brand` | `company` |
| `priceThb` | `priceRTF` |
| `tankCapacityL` | `tankCapacity` |
| `speedMps` | `flightSpeed` |
| `sprayWidthM` | `sprayWidth` |
| `performanceRaiPerDay` | `coveragePerDay` |

For example:
- `const [brand, setBrand] = useState(initial?.brand ?? '')` → `const [company, setCompany] = useState(initial?.company ?? '')`
- `const [priceThb, setPriceThb] = useState(String(initial?.priceThb ?? ''))` → `const [priceRTF, setPriceRTF] = useState(String(initial?.priceRTF ?? ''))`

Do this for every renamed field. `model` and `fullName` are unchanged.

- [ ] **Step 3: Add `rtfEquipment` state + input**

Add after the `fullName` state:

```tsx
const [rtfEquipment, setRtfEquipment] = useState(initial?.rtfEquipment ?? '')
```

- [ ] **Step 4: Update `handleSubmit` validation and payload**

Change the required-fields guard:

```tsx
if (!company.trim() || !model.trim() || !fullName.trim() || !rtfEquipment.trim()) {
  setFormError('Company, model, full name, and RTF equipment are required')
  return
}
```

Rename every key inside `parsed`:

```tsx
const parsed = {
  priceRTF: Number(priceRTF),
  tankCapacity: Number(tankCapacity),
  flightSpeed: Number(flightSpeed),
  sprayWidth: Number(sprayWidth),
  coveragePerDay: Number(coveragePerDay),
}
```

Update the final `onSubmit` call:

```tsx
onSubmit({ company, model, fullName, rtfEquipment, ...parsed })
```

- [ ] **Step 5: Update JSX — rename existing Field labels, ids, and add the new RTF equipment Field**

| Old | New |
| --- | --- |
| `label="Brand"` `id="brand"` | `label="Company"` `id="company"` |
| `label="Price (THB)"` `id="priceThb"` | `label="Price (RTF)"` `id="priceRTF"` |
| `label="Tank capacity (L)"` `id="tankCapacityL"` | `label="Tank capacity"` `id="tankCapacity"` |
| `label="Speed (m/s)"` `id="speedMps"` | `label="Flight speed"` `id="flightSpeed"` |
| `label="Spray width (m)"` `id="sprayWidthM"` | `label="Spray width"` `id="sprayWidth"` |
| `label="Performance (rai/day)"` `id="performanceRaiPerDay"` | `label="Coverage per day"` `id="coveragePerDay"` |

Insert this Field block after the Full name Field (before the renamed Price Field):

```tsx
<Field label="RTF equipment" id="rtfEquipment">
  <Input id="rtfEquipment" value={rtfEquipment} onChange={(e) => setRtfEquipment(e.target.value)} required />
</Field>
```

All `onChange` handlers and `value` bindings must be updated to use the renamed state setters (e.g. `setCompany`, `setPriceRTF`, `setTankCapacity`, `setFlightSpeed`, `setSprayWidth`, `setCoveragePerDay`).

- [ ] **Step 6: Verify** — `bun run typecheck`. Expected: errors in `DroneForm.tsx` are gone; remaining errors live in `DroneFormDialog.tsx` and `DeleteDroneDialog.tsx`.

---

### Task 5: Update DroneFormDialog + DeleteDroneDialog

**Files:**

- Modify: `src/features/drones/components/DroneFormDialog.tsx`
- Modify: `src/features/drones/components/DeleteDroneDialog.tsx`

- [ ] **Step 1: Rewrite `DroneLike` in DroneFormDialog**

```ts
type DroneLike = {
  id: number
  company: string
  model: string
  fullName: string
  priceRTF: number
  tankCapacity: number
  flightSpeed: number
  sprayWidth: number
  coveragePerDay: number
  rtfEquipment: string
}
```

Everything else in the component (`handleSubmit`, JSX, prop wiring) stays as-is — `DroneFormValues` already matches, and `drone.id` (now `number`) is passed straight through to `update.mutateAsync`.

- [ ] **Step 2: Rewrite the `drone` prop type in DeleteDroneDialog**

```ts
type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  drone: { id: number; company: string; model: string } | null
}
```

Update the description text to use `drone?.company`:

```tsx
This will permanently delete {drone?.company} {drone?.model}. This action cannot be undone.
```

- [ ] **Step 3: Verify** — `bun run typecheck`. Expected: zero errors. `DroneList.tsx` passes `{...}` to `<DeleteDroneDialog drone={deleting} />` where `deleting` is `Drone | null`; with `id: number`/`company: string` now matching the dialog's narrowed prop shape, no cast is needed.

---

### Task 6: Full verification

- [ ] **Step 1: Run `bun run typecheck`** — must report zero errors.

- [ ] **Step 2: Run `bun run lint`** — must report zero errors.

- [ ] **Step 3: Grep for residual old field names** — run:

```sh
rg -n 'priceThb|tankCapacityL|speedMps|sprayWidthM|performanceRaiPerDay|\bbrand\b' src/
```

Expected: zero matches. If any match remains, fix before declaring done.

- [ ] **Step 4: Run `bun run test`** — Vitest must pass (existing tests, if any). This is a typing/rename refactor; no test changes were made.

- [ ] **Step 5: Manual smoke (optional, if backend is reachable)** — `bun run dev`, log in, add a drone via the form (verifies POST with new schema), edit it (verifies PATCH), delete it (verifies DELETE). If the backend isn't running locally, skip and note it.
