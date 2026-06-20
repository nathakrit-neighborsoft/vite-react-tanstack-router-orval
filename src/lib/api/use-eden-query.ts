import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { handleEdenResponse, type EdenResponse } from './eden-helpers'

export function useEdenQuery<TData, TKey extends readonly unknown[]>(
  queryKey: TKey,
  fn: () => Promise<EdenResponse<TData>>,
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>,
): UseQueryResult<TData, Error> {
  return useQuery({
    queryKey,
    queryFn: () => fn().then(handleEdenResponse),
    ...options,
  })
}
