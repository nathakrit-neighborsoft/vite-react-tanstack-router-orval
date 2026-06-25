import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentType } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { sendTestNotification, useQueryClient, useSession } = vi.hoisted(() => ({
  sendTestNotification: vi.fn(),
  useQueryClient: vi.fn(),
  useSession: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: unknown) => config,
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient,
}))

vi.mock('@/features/auth', () => ({
  AuthForm: () => <form aria-label="auth form" />,
  authClient: {
    signOut: vi.fn(),
    useSession,
  },
}))

vi.mock('@/features/drones', () => ({
  DroneList: () => null,
  dronesKeys: { all: ['drones'], lists: () => ['drones', 'list'] },
}))

vi.mock('@/features/notifications/notify', () => ({
  sendTestNotification,
}))

vi.mock('@/lib/api/generated/drones/drones', () => ({
  droneControllerGetAll: vi.fn(),
}))

describe('/drone route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Reflect.deleteProperty(window, '__TAURI_INTERNALS__')
    useQueryClient.mockReturnValue({ invalidateQueries: vi.fn() })
    useSession.mockReturnValue({ data: null })
  })

  it('lets users test notifications before signing in', async () => {
    Object.defineProperty(window, '__TAURI_INTERNALS__', { configurable: true, value: {} })
    sendTestNotification.mockResolvedValue(undefined)
    const { Route } = await import('./drone')
    const Component = (Route as unknown as { component: ComponentType }).component

    render(<Component />)

    fireEvent.click(screen.getByRole('button', { name: 'Test notification' }))

    expect(sendTestNotification).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('form', { name: 'auth form' })).toBeInTheDocument()
  })
})
