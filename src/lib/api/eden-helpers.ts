export interface EdenResponse<TData> {
  readonly data: TData | null
  readonly error: unknown
  readonly status?: number
}

export interface IHandleEdenResponseInput<T> {
  result: EdenResponse<T>
  fallbackMessage?: string
}

export function handleEdenResponse<T>({
  result,
  fallbackMessage = 'Request failed',
}: IHandleEdenResponseInput<T>): T {
  if (result.data === null) {
    throw result.error instanceof Error
      ? result.error
      : new Error(String(result.error ?? fallbackMessage))
  }
  return result.data
}
