import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DroneForm, type DroneFormValues } from './DroneForm'
import { useCreateDrone, useUpdateDrone } from '../hooks/use-drone-mutations'

type DroneLike = {
  uuid: string
  company: string
  model: string
  fullName: string
  priceRTF: number
  tankCapacity: number
  flightSpeed: number
  sprayWidth: number
  coveragePerDay: number
  rtfEquipment: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  drone?: DroneLike | null
}

export function DroneFormDialog({ open, onOpenChange, drone }: Props) {
  const create = useCreateDrone()
  const update = useUpdateDrone()
  const isEdit = !!drone

  async function handleSubmit(values: DroneFormValues) {
    try {
      if (isEdit && drone) {
        await update.mutateAsync({ id: drone.uuid, data: values })
      } else {
        await create.mutateAsync({ data: values })
      }
      onOpenChange(false)
    } catch {
      // error surfaced via mutation.error
    }
  }

  const mutationError = (isEdit ? update.error : create.error) as Error | null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit drone' : 'Add drone'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the drone details below.' : 'Fill in the drone details below.'}
          </DialogDescription>
        </DialogHeader>
        <DroneForm
          initial={drone ?? undefined}
          submitting={isEdit ? update.isPending : create.isPending}
          error={mutationError?.message ?? null}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
