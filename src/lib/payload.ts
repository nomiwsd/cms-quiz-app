import { getPayload } from 'payload'
import config from '@payload-config'

// Singleton pattern — Next.js hot reloads can create multiple Payload
// instances in dev mode. Caching the promise here prevents that.
let cachedPayload: ReturnType<typeof getPayload> | null = null

export async function getPayloadClient() {
  if (!cachedPayload) {
    cachedPayload = getPayload({ config })
  }
  return cachedPayload
}
