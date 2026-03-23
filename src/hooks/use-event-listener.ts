import { useEffect } from 'react'

import { useLatest } from './use-latest.js'

// Typed overloads so event names and handler types are inferred
export function useEventListener<K extends keyof WindowEventMap>(
  target: Window | null,
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): void
export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document | null,
  event: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
): void
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(
  target: T | null,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): void
export function useEventListener(
  target: EventTarget | null,
  event: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions
): void {
  const handlerRef = useLatest(handler)

  useEffect(() => {
    if (!target) return

    const listener = (e: Event) => handlerRef.current(e)
    target.addEventListener(event, listener, options)
    return () => target.removeEventListener(event, listener, options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, event, JSON.stringify(options)])
}
