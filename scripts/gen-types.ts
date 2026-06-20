/**
 * Fetch Elysia's remote dts types from running backend.
 * Source of truth: elysia-remote-dts plugin serves /server.d.ts
 */
const SERVER_DTS_URL = process.env.SERVER_DTS_URL ?? 'http://localhost:3050/server.d.ts'
const OUT_FILE = 'src/lib/api/server.d.ts'

const res = await fetch(SERVER_DTS_URL)
if (!res.ok) {
  console.error(`Failed to fetch ${SERVER_DTS_URL}: ${res.status} ${res.statusText}`)
  process.exit(1)
}

const text = await res.text()
await Bun.write(OUT_FILE, text)
console.log(`✓ ${OUT_FILE} written (${text.length} bytes)`)