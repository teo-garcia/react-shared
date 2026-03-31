import { useEffect, useState } from 'react'

export interface WindowSize {
  height: number
  width: number
}

function readWindowSize(): WindowSize {
  if (typeof window === 'undefined') {
    return { height: 0, width: 0 }
  }

  return {
    height: window.innerHeight,
    width: window.innerWidth,
  }
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(readWindowSize)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const update = () => setSize(readWindowSize())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}
