import { useDrones } from '../hooks/use-drones'
import { Button } from '@/components/ui/button'

export function DroneList({ onSignOut }: { onSignOut?: () => void }) {
  const dronesQuery = useDrones()

  if (dronesQuery.isLoading) return <p>Loading drones…</p>
  if (dronesQuery.isError) return <p className="text-red-600">Error: {String(dronesQuery.error)}</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Drones</h2>
        <Button variant="outline" onClick={() => onSignOut?.()}>
          Sign out
        </Button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {dronesQuery.data?.map((d) => (
          <li key={d.id} className="rounded-lg border p-3">
            <p className="font-semibold">
              {d.brand} {d.model}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{d.fullName}</p>
            <p>
              ฿{d.priceThb.toLocaleString()} • {d.tankCapacityL}L • {d.performanceRaiPerDay} rai/day
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
