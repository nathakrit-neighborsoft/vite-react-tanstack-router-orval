import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AuthForm } from './AuthForm'

const { mockSignInEmail, mockSignUpEmail } = vi.hoisted(() => ({
  mockSignInEmail: vi.fn(),
  mockSignUpEmail: vi.fn(),
}))

vi.mock('@/features/auth/auth-client', () => ({
  authClient: {
    signIn: { email: mockSignInEmail },
    signUp: { email: mockSignUpEmail },
  },
}))

describe('AuthForm', () => {
  it('shows error text when sign-in fails and does not call onSuccess', async () => {
    mockSignInEmail.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    })

    const onSuccess = vi.fn()
    render(<AuthForm onSuccess={onSuccess} />)

    fireEvent.click(screen.getByText('switch to sign in'))
    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('password'), {
      target: { value: 'secret123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
