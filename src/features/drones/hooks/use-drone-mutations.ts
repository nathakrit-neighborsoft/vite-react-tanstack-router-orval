import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { dronesKeys } from '../api/keys'

export type CreateDroneInput = {
  brand: string
  model: string
  fullName: string
  priceThb: number
  tankCapacityL: number
  speedMps: number
  sprayWidthM: number
  performanceRaiPerDay: number
}

export type UpdateDroneInput = Partial<CreateDroneInput>

export function useCreateDrone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateDroneInput) => {
      const { data, error } = await api.api.drone.post(input)
      if (data === null) throw error instanceof Error ? error : new Error(String(error ?? 'Create failed'))
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}

export function useUpdateDrone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateDroneInput }) => {
      const { data, error } = await api.api.drone({ id }).patch(input)
      if (data === null) throw error instanceof Error ? error : new Error(String(error ?? 'Update failed'))
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}

export function useDeleteDrone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.api.drone({ id }).delete()
      if (data === null) throw error instanceof Error ? error : new Error(String(error ?? 'Delete failed'))
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}
