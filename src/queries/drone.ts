import { queryOptions } from '@tanstack/react-query'

import { getDroneList } from '@/api/drone/drone'

export type { Drone } from '@/api/model'

export const droneListQueryOptions = () =>
  queryOptions({
    queryKey: ['drone', 'list'],
    queryFn: () => getDroneList(),
  })
