import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'

export async function sendTestNotification() {
  let permissionGranted = await isPermissionGranted()

  if (!permissionGranted) {
    permissionGranted = (await requestPermission()) === 'granted'
  }

  if (!permissionGranted) return

  sendNotification({
    title: 'Drone Client',
    body: 'Tauri notification is working.',
  })
}
