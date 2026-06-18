export type CustomFetchError = {
  status: number
  message: string
  details?: unknown
}

export async function customFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options?.headers as Record<string, string>),
    },
  })

  if (!res.ok) {
    const err: CustomFetchError = {
      status: res.status,
      message: res.statusText,
      details: await res.json().catch(() => undefined),
    }
    throw err
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
