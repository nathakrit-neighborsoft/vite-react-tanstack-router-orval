import { useQueryClient } from '@tanstack/react-query'
import {
  useDroneControllerCreate,
  useDroneControllerUpdate,
  useDroneControllerDelete,
} from '@/lib/api/generated/drones/drones'
import type { CreateDroneDto } from '@/lib/api/generated/models'
import { dronesKeys } from '../api/keys'

export type CreateDroneInput = CreateDroneDto

export type UpdateDroneInput = Partial<CreateDroneDto>

export function useCreateDrone() {
  const qc = useQueryClient()
  return useDroneControllerCreate({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }) },
  })
}

export function useUpdateDrone() {
  const qc = useQueryClient()
  return useDroneControllerUpdate({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }) },
  })
}

export function useDeleteDrone() {
  const qc = useQueryClient()
  return useDroneControllerDelete({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }) },
  })
}
