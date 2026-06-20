import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'

type EdenResponse<TData> = { data: TData | null; error: unknown; status?: number }

export function useEdenQuery<TData, TKey extends readonly unknown[]>(
  queryKey: TKey,
  fn: () => Promise<EdenResponse<TData>>,
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>,
): UseQueryResult<TData, Error> {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await fn()
      if (data === null) throw error instanceof Error ? error : new Error(String(error ?? 'Request failed'))
      return data
    },
    ...options,
  })
}