import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DroneList } from './DroneList'

const { sendTestNotification, useDrones } = vi.hoisted(() => ({
  sendTestNotification: vi.fn(),
  useDrones: vi.fn(),
}))

vi.mock('@/features/notifications/notify', () => ({
  sendTestNotification,
}))

vi.mock('../hooks/use-drones', () => ({
  useDrones,
}))

vi.mock('./DroneFormDialog', () => ({
  DroneFormDialog: () => null,
}))

vi.mock('./DeleteDroneDialog', () => ({
  DeleteDroneDialog: () => null,
}))

describe('DroneList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Reflect.deleteProperty(window, '__TAURI_INTERNALS__')
  })

  it('sends a test notification from the toolbar', () => {
    Object.defineProperty(window, '__TAURI_INTERNALS__', { configurable: true, value: {} })
    sendTestNotification.mockResolvedValue(undefined)
    useDrones.mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
    })

    render(<DroneList />)

    fireEvent.click(screen.getByRole('button', { name: 'Test notification' }))

    expect(sendTestNotification).toHaveBeenCalledTimes(1)
  })

  it('hides the test notification button outside Tauri', () => {
    useDrones.mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
    })

    render(<DroneList />)

    expect(screen.queryByRole('button', { name: 'Test notification' })).not.toBeInTheDocument()
  })
})
