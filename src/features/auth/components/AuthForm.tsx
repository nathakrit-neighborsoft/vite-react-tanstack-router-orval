import { useState } from 'react'
import { authClient } from '../auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === 'signup') await authClient.signUp.email({ email, password, name: email })
      else await authClient.signIn.email({ email, password })
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setSubmitting(false)
    }
  }

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
