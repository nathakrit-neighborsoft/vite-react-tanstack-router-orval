export interface Drone {
  id: string
  brand: string
  model: string
  fullName: string
  imageUrl: string | null
  priceThb: number
  tankCapacityL: number
  speedMps: number
  sprayWidthM: number
  performanceRaiPerDay: number
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: 'include', ...init })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function getDroneList(signal?: AbortSignal) {
  return fetchApi<Drone[]>('/api/drone', { signal })
}
