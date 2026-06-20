import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { getDroneList, type Drone } from './drone'

type TError = unknown

export const getDroneListQueryKey = () => ['/api/drone'] as const

export function useDroneList(
  enabled: boolean,
  options?: Omit<UseQueryOptions<Drone[], TError, Drone[]>, 'queryKey' | 'queryFn'>,
): UseQueryResult<Drone[], TError> {
  return useQuery({
    queryKey: getDroneListQueryKey(),
    queryFn: ({ signal }) => getDroneList(signal),
    enabled,
    ...options,
  })
}
