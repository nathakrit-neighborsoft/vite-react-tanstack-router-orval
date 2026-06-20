import { treaty } from '@elysiajs/eden'
import { env } from '@/env'
import type { App } from './server'

// Eden treaty จะต่อ path ตาม route ของ server ให้เอง (api.api.drone.get() → /api/drone)
// ดังนั้น baseURL ต้องเป็นแค่ origin ห้ามต่อ /api ซ้ำ ไม่งั้นจะได้ /api/api/...
const baseURL = env.VITE_API_URL || ''

export const api = treaty<App>(baseURL, {
  fetch: {
    credentials: 'include',
  },
})

export type Api = typeof api
