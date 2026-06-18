/**
 * Fetch OpenAPI spec from the API, fix Elysia's non-standard $ref format
 * ("drone" → "#/components/schemas/drone"), and write to openapi.json.
 */
const SPEC_URL = 'http://localhost:3050/api/openapi/json'
const OUT_FILE = new URL('../openapi.json', import.meta.url)

function fixRefs(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(fixRefs)

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$ref' && typeof value === 'string' && !value.startsWith('#')) {
      result[key] = `#/components/schemas/${value}`
    } else {
      result[key] = fixRefs(value)
    }
  }
  return result
}

const res = await fetch(SPEC_URL)
if (!res.ok) {
  console.error(`Failed to fetch spec: ${res.status} ${res.statusText}`)
  process.exit(1)
}
const spec = await res.json()
const fixed = fixRefs(spec)
await Bun.write(OUT_FILE, JSON.stringify(fixed, null, 2))
console.log(`openapi.json written (${JSON.stringify(fixed).length} bytes)`)
