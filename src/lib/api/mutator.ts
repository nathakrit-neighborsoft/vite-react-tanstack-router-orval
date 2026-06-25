import { env } from '@/lib/env'

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

export type ErrorType<Error> = Error
