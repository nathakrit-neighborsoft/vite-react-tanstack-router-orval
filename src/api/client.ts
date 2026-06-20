import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

export const api = treaty<App>(baseURL, {
  fetch: {
    credentials: 'include',
  },
})

export type Api = typeof api
