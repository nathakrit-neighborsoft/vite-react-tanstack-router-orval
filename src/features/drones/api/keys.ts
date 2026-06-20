export const dronesKeys = {
  all: ['drones'] as const,
  lists: () => [...dronesKeys.all, 'list'] as const,
  details: () => [...dronesKeys.all, 'detail'] as const,
  detail: (id: string) => [...dronesKeys.details(), id] as const,
}
