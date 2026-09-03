import { match, P } from 'ts-pattern'
import { env } from '@/lib/env'
// import { getStoredSession } from '@/features/auth/session'

const isNonEmptyString = (val: unknown): val is string =>
  typeof val === 'string' && val.trim().length > 0

export function parseErrorMessage(rawText: string): string | null {
  try {
    const parsed: unknown = JSON.parse(rawText)
    return match(parsed)
      .with({ message: P.when(isNonEmptyString) }, ({ message }) => message.trim())
      .with({ error: P.when(isNonEmptyString) }, ({ error }) => error.trim())
      .otherwise(() => null)
  } catch {
    return null
  }
}

export async function customInstance<T>(url: string, options?: RequestInit): Promise<T> {
  // const session = getStoredSession()
  const headers = new Headers(options?.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  // if (session?.token && !headers.has('Authorization')) {
  //   headers.set('Authorization', `Bearer ${session.token}`)
  // }

  const res = await fetch(`${env.VITE_API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers,
  })
  if (!res.ok) {
    const rawText = await res.text().catch(() => res.statusText)
    const parsedMessage = parseErrorMessage(rawText)

    if (parsedMessage) {
      throw new Error(parsedMessage)
    }

    if (rawText && !rawText.trim().startsWith('<')) {
      throw new Error(rawText)
    }

    throw new Error(`${res.status} ${res.statusText}`.trim())
  }
  if (res.status === 204) return undefined as T
  // backend POST/PATCH responses currently return a non-JSON "[object Object]"
  // body (backend serialization bug) — tolerate it; callers rely on status
  const data = await res.json().catch(() => null)
  // orval fetch client contract: runtime must match the generated
  // { data, status, headers } response types
  return { data, status: res.status, headers: res.headers } as T
}

export type ErrorType<Error> = Error
