import { useEdenQuery } from '@/lib/api/use-eden-query'
import { api } from '@/lib/api/client'
import { dronesKeys } from '../api/keys'

export function useDrones() {
  return useEdenQuery(dronesKeys.lists(), () => api.api.drone.get())
}
