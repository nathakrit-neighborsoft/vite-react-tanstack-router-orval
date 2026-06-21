import { useState } from 'react'
import { useDrones } from '../hooks/use-drones'
import { Button } from '@/components/ui/button'
import { DroneFormDialog } from './DroneFormDialog'
import { DeleteDroneDialog } from './DeleteDroneDialog'

type Drone = {
  id: number
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

export function DroneList({ onSignOut }: { onSignOut?: () => void }) {
  const dronesQuery = useDrones()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Drone | null>(null)
  const [deleting, setDeleting] = useState<Drone | null>(null)

  if (dronesQuery.isLoading) return <p>Loading drones…</p>
  if (dronesQuery.isError) return <p className="text-red-600">Error: {String(dronesQuery.error)}</p>

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(d: Drone) {
    setEditing(d)
    setFormOpen(true)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Drones</h2>
        <div className="flex gap-2">
          <Button onClick={openCreate}>Add drone</Button>
          <Button variant="outline" onClick={() => onSignOut?.()}>Sign out</Button>
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {dronesQuery.data?.map((d) => (
          <li key={d.id} className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{d.company} {d.model}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{d.fullName}</p>
                <p>฿{d.priceRTF.toLocaleString()} • {d.tankCapacity}L • {d.coveragePerDay} rai/day</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(d)}>Edit</Button>
                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setDeleting(d)}>Delete</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <DroneFormDialog open={formOpen} onOpenChange={setFormOpen} drone={editing} />
      <DeleteDroneDialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null) }} drone={deleting} />
    </div>
  )
}
