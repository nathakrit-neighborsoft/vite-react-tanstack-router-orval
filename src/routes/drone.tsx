import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { authClient, AuthForm } from '@/features/auth'
import { DroneList, dronesKeys } from '@/features/drones'
import { sendTestNotification } from '@/features/notifications/notify'
import { api } from '@/lib/api/client'
import { handleEdenResponse } from '@/lib/api/eden-helpers'

export const Route = createFileRoute('/drone')({
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData({
        queryKey: dronesKeys.lists(),
        queryFn: async () =>
          handleEdenResponse({
            result: await api.api.drone.get(),
            fallbackMessage: 'Request failed',
          }),
      })
    } catch {
      // user may be unauthenticated — component will gate and show AuthForm
    }
  },
  component: DronePage,
})

function DronePage() {
  const { data: session } = authClient.useSession()
  const queryClient = useQueryClient()

  if (!session) {
    return (
      <div className="space-y-4">
        <NotificationTestButton />
        <AuthForm onSuccess={() => queryClient.invalidateQueries({ queryKey: dronesKeys.all })} />
      </div>
    )
  }

  return <DroneList onSignOut={() => authClient.signOut().catch(() => {})} />
}

function NotificationTestButton() {
  if (!('__TAURI_INTERNALS__' in window)) return null

  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={() => sendTestNotification().catch(() => {})}>
        Test notification
      </Button>
    </div>
  )
}
