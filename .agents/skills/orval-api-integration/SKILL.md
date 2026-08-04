---
name: orval-api-integration
description: Use when changing OpenAPI or Orval integration, generated React Query hooks, the fetch mutator, Better Auth session wiring, VITE_API_URL, or feature API wrappers in this Vite frontend.
---

# Integrating the Orval API Layer

The backend OpenAPI contract drives generated types and React Query hooks. Requests flow through `src/lib/api/mutator.ts`; features adapt generated APIs locally.

## Boundaries

| Concern                                      | Source of truth                                                      |
| -------------------------------------------- | -------------------------------------------------------------------- |
| Tags, output, client, and mutator            | `orval.config.ts`                                                    |
| OpenAPI snapshot and generated hooks/models  | `bun run gen:types` → `.orval-spec.json`, `src/lib/api/generated/**` |
| URL, cookies, headers, and errors            | `src/lib/api/mutator.ts`                                             |
| `VITE_*` values                              | `src/lib/env.ts`                                                     |
| Session client                               | `src/features/auth/auth-client.ts`                                   |
| Domain adaptation, keys, invalidation, tests | `src/features/<feature>/`                                            |

## Workflow

1. **Trace the contract.** Inspect the endpoint, response shape, parameters, tag, and generated symbol. **Done when** the symbol is found or the missing contract is recorded as a blocker.
2. **Choose the branch.** Contract change means source/config plus generation; runtime, env, auth, or wrapper work uses the existing contract. If the OpenAPI server is unavailable, separate runtime work and report the generation blocker; use only a supplied fixture. **Done when** no endpoint or generated output is invented.
3. **Generate from source.** Run `bun run gen:types`. It fetches `http://localhost:9009/api-json`, removes the auth path with `jq`, writes `.orval-spec.json`, and runs `orval.config.ts`. **Done when** generated diffs are reproducible.
4. **Adapt and verify.** Keep generated imports, response mapping, wrappers, keys, invalidation, and tests under `src/features/<feature>/`; check URL, cookies, headers, errors, imports, and behavior. **Done when** each symbol has one feature owner and targeted checks pass or the blocker is reported.

## Runtime contract

`src/lib/api/mutator.ts` is the fetch entry point:

```typescript
export async function customInstance<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${env.VITE_API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`${res.status} ${res.statusText}: ${msg}`)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
```

- `VITE_API_URL` is an origin such as `http://localhost:3050`, or empty for same-origin proxying; API paths do not belong in it.
- `credentials: 'include'` sends the Better Auth cookie; cross-origin backends must allow credentialed requests.
- Non-2xx responses throw with status/text; `204` skips JSON parsing. Caller headers remain supported.

## Common traps

| Symptom                                                 | Fix                                                            |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| Generated hook/model needs a quick fix                  | Change OpenAPI/config and regenerate                           |
| URL contains `/api/api/`                                | Use an origin-only `VITE_API_URL`                              |
| API is anonymous or generated imports spread through UI | Preserve shared credentials and export a feature-owned wrapper |

## Verification map

| Change                          | Check                                                             |
| ------------------------------- | ----------------------------------------------------------------- |
| Contract/generated output       | `bun run gen:types`, then inspect the generated diff              |
| Mutator/env/auth/feature API    | targeted tests, `bun run typecheck`, `bun run lint`               |
| Formatting or broad integration | `bun run format:check`, `bun run test`, `bun run build` as needed |
