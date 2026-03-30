/** `true` when running in a browser environment. */
export const isClient = typeof window !== 'undefined'

/** `true` when running in a server environment (Node, Deno, edge runtime). */
export const isServer = !isClient
