import { treaty } from '@elysiajs/eden'
import { env } from '@/env'
import type { App } from './server'

const baseURL = env.VITE_API_URL
  ? `${env.VITE_API_URL}/api`
  : '/api'

export const api = treaty<App>(baseURL, {
  fetch: {
    credentials: 'include',
  },
})

export type Api = typeof api
