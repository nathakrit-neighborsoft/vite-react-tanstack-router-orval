/**
 * Fetch Elysia's remote dts types from running backend.
 * Source of truth: elysia-remote-dts plugin serves /server.d.ts
 *
 * Graceful: if backend is unreachable, warn + exit 0 so `dev` script
 * (which chains this) still starts with whatever types are on disk.
 */
const SERVER_DTS_URL = process.env.SERVER_DTS_URL ?? 'http://localhost:3050/server.d.ts'
const OUT_FILE = 'src/lib/api/server.d.ts'

try {
  const res = await fetch(SERVER_DTS_URL)
  if (!res.ok) {
    console.warn(
      `⚠  Backend returned ${res.status} ${res.statusText} — keeping existing ${OUT_FILE}`,
    )
    process.exit(0)
  }
  const text = await res.text()
  await Bun.write(OUT_FILE, text)
  console.log(`✓ ${OUT_FILE} written (${text.length} bytes)`)
} catch (err) {
  console.warn(
    `⚠  Backend not reachable at ${SERVER_DTS_URL} — keeping existing ${OUT_FILE}`,
  )
  console.warn(`  ${(err as Error).message}`)
  process.exit(0)
}
