import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendTestNotification } from './notify'

const { isPermissionGranted, requestPermission, sendNotification } = vi.hoisted(() => ({
  isPermissionGranted: vi.fn(),
  requestPermission: vi.fn(),
  sendNotification: vi.fn(),
}))

vi.mock('@tauri-apps/plugin-notification', () => ({
  isPermissionGranted,
  requestPermission,
  sendNotification,
}))

describe('sendTestNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('requests permission before sending a test notification', async () => {
    isPermissionGranted.mockResolvedValue(false)
    requestPermission.mockResolvedValue('granted')

    await sendTestNotification()

    expect(requestPermission).toHaveBeenCalledTimes(1)
    expect(sendNotification).toHaveBeenCalledWith({
      title: 'Drone Client',
      body: 'Tauri notification is working.',
    })
  })

  it('sends directly when permission is already granted', async () => {
    isPermissionGranted.mockResolvedValue(true)

    await sendTestNotification()

    expect(requestPermission).not.toHaveBeenCalled()
    expect(sendNotification).toHaveBeenCalledTimes(1)
  })

  it('does not send when permission is denied', async () => {
    isPermissionGranted.mockResolvedValue(false)
    requestPermission.mockResolvedValue('denied')

    await sendTestNotification()

    expect(sendNotification).not.toHaveBeenCalled()
  })
})
