import { queryOptions } from '@tanstack/react-query'

import { getApiDrone } from '@/api/drone/drone'

export const droneListQueryOptions = () =>
  queryOptions({
    queryKey: ['drone', 'list'],
    queryFn: () => getApiDrone(),
  })
