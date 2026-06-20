export const dronesKeys = {
  all: ['drones'] as const,
  lists: () => [...dronesKeys.all, 'list'] as const,
}
