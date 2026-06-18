import { queryOptions } from '@tanstack/react-query'

import type { GetDroneList200Item } from '@/api/model'
import { getDroneList } from '@/api/drone/drone'

export type Drone = GetDroneList200Item

export const droneListQueryOptions = () =>
  queryOptions({
    queryKey: ['drone', 'list'],
    queryFn: () => getDroneList(),
  })
