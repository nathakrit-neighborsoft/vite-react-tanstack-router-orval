import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { authClient, AuthForm } from '@/features/auth'
import { DroneList, dronesKeys } from '@/features/drones'
import { api } from '@/lib/api/client'
import { handleEdenResponse } from '@/lib/api/eden-helpers'

export const Route = createFileRoute('/drone')({
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData({
        queryKey: dronesKeys.lists(),
        queryFn: async () => handleEdenResponse(await api.api.drone.get()),
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
      <AuthForm onSuccess={() => queryClient.invalidateQueries({ queryKey: dronesKeys.all })} />
    )
  }

  return (
    <DroneList onSignOut={() => authClient.signOut().catch(() => {})} />
  )
}
