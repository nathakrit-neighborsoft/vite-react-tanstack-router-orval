export const dronesKeys = {
  all: ['drones'] as const,
  lists: () => [...dronesKeys.all, 'list'] as const,
  details: () => [...dronesKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...dronesKeys.details(), uuid] as const,
}
