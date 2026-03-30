import { createContext, useContext, type Context, type Provider } from 'react'

/**
 * Creates a typed React context with a built-in hook that throws a descriptive
 * error when used outside its provider. Avoids the `| undefined` union that
 * `createContext(undefined)` forces on every consumer.
 *
 * Returns `[Provider, useCtx]`.
 */
export function createSafeContext<T>(
  name: string
): [Provider<T>, () => T, Context<T | null>] {
  const Ctx = createContext<T | null>(null)
  Ctx.displayName = name

  function useSafeContext(): T {
    const value = useContext(Ctx)
    if (value === null) {
      throw new Error(
        `use${name} must be used within a <${name}Provider>. ` +
          `Wrap a parent component with the provider.`
      )
    }
    return value
  }

  const TypedProvider = Ctx.Provider as unknown as Provider<T>

  return [TypedProvider, useSafeContext, Ctx]
}
