import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteDrone } from '../hooks/use-drone-mutations'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  drone: { id: string; brand: string; model: string } | null
}

export function DeleteDroneDialog({ open, onOpenChange, drone }: Props) {
  const remove = useDeleteDrone()

  async function handleConfirm() {
    if (!drone) return
    try {
      await remove.mutateAsync(drone.id)
      onOpenChange(false)
    } catch {
      // error handled via mutation state
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete drone?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {drone?.brand} {drone?.model}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={remove.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {remove.isPending ? 'Deleting\u2026' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
