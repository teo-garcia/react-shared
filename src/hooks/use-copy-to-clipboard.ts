import { useCallback, useState } from 'react'

/**
 * Returns `[copied, copy]`.
 * `copy(text)` writes to the clipboard and returns a boolean indicating success.
 * `copied` resets to `false` after `resetDelay` ms.
 */
export function useCopyToClipboard(
  resetDelay = 2000
): [boolean, (text: string) => Promise<boolean>] {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator.clipboard) return false

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), resetDelay)
        return true
      } catch {
        return false
      }
    },
    [resetDelay]
  )

  return [copied, copy]
}
