import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { handleEdenResponse } from '@/lib/api/eden-helpers'
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
      const res = await api.api.drone.post(input)
      return handleEdenResponse({ result: res, fallbackMessage: 'Create failed' })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}

export function useUpdateDrone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateDroneInput }) => {
      const res = await api.api.drone({ id }).patch(input)
      return handleEdenResponse({ result: res, fallbackMessage: 'Update failed' })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}

export function useDeleteDrone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.drone({ id }).delete()
      return handleEdenResponse({ result: res, fallbackMessage: 'Delete failed' })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.all }),
  })
}
