import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateDrone as useGenCreateDrone,
  useUpdateDrone as useGenUpdateDrone,
  useDeleteDrone as useGenDeleteDrone,
} from '@/lib/api/generated/drones/drones'
import type { CreateDroneDto } from '@/lib/api/generated/models'
import { dronesKeys } from '../api/keys'

export type CreateDroneInput = CreateDroneDto

export type UpdateDroneInput = Partial<CreateDroneDto>

export function useCreateDrone() {
  const qc = useQueryClient()
  return useGenCreateDrone({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }) },
  })
}

export function useUpdateDrone() {
  const qc = useQueryClient()
  return useGenUpdateDrone({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }) },
  })
}

export function useDeleteDrone() {
  const qc = useQueryClient()
  return useGenDeleteDrone({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }) },
  })
}
