export interface EdenResponse<TData> {
  readonly data: TData | null
  readonly error: unknown
  readonly status?: number
}

export function handleEdenResponse<T>(result: EdenResponse<T>): T {
  if (result.data === null) {
    throw result.error instanceof Error ? result.error : new Error(String(result.error ?? 'Request failed'))
  }
  return result.data
}
