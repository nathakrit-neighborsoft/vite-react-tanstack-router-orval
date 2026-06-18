export type CustomFetchConfig = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  data?: unknown
  params?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
}

export type CustomFetchError = {
  status: number
  message: string
  details?: unknown
}

export async function customFetch<T>(config: CustomFetchConfig): Promise<T> {
  const url = new URL(config.url, window.location.origin)
  if (config.params) {
    for (const [key, value] of Object.entries(config.params)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }

  const isBodyPresent = config.data !== undefined
  const res = await fetch(url.toString(), {
    method: config.method,
    headers: {
      ...(isBodyPresent ? { 'Content-Type': 'application/json' } : {}),
      ...config.headers,
    },
    credentials: 'include',
    body: isBodyPresent ? JSON.stringify(config.data) : undefined,
    signal: config.signal,
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
