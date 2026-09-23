import 'server-only'

/**
 * Server-only read token used for draft/preview requests. The `server-only`
 * import guarantees this value can never be bundled into client code.
 */
export const token = process.env.SANITY_API_READ_TOKEN || ''
