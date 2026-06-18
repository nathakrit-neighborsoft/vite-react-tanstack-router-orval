import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { GetApiDrone200Item } from '@/api/model'
import { authClient } from '@/lib/auth-client'
import { droneListQueryOptions } from '@/queries/drone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/drone')({
  component: DroneListPage,
})

function DroneListPage() {
  const { data: session } = authClient.useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const dronesQuery = useQuery({
    ...droneListQueryOptions(),
    enabled: !!session,
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === 'signup') await authClient.signUp.email({ email, password, name: email })
      else await authClient.signIn.email({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) {
    return (
      <form onSubmit={submit} className="mx-auto max-w-sm space-y-3">
        <h2 className="text-xl font-bold">{mode === 'signup' ? 'Sign up' : 'Sign in'}</h2>
        <Input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {mode === 'signup' ? 'Sign up' : 'Sign in'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
        >
          switch to {mode === 'signup' ? 'sign in' : 'sign up'}
        </Button>
      </form>
    )
  }

  if (dronesQuery.isLoading) return <p>Loading drones…</p>
  if (dronesQuery.isError) return <p className="text-red-600">Error: {String(dronesQuery.error)}</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Drones</h2>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await authClient.signOut()
            } catch {
              /* ignore */
            }
          }}
        >
          Sign out
        </Button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {dronesQuery.data?.data.map((d: GetApiDrone200Item) => (
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
