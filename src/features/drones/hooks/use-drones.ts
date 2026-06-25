import { useDroneControllerGetAll } from '@/lib/api/generated/drones/drones'
import { dronesKeys } from '../api/keys'

export function useDrones() {
  const dronesQuery = useDroneControllerGetAll()
  return {
    ...dronesQuery,
    data: dronesQuery.data?.data,
  }
}

export { dronesKeys }
