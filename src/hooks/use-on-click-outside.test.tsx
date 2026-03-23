import { fireEvent, render } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useOnClickOutside } from './use-on-click-outside.js'

function TestComponent({
  handler,
}: {
  handler: (e: MouseEvent | TouchEvent) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, handler)
  return (
    <div>
      <div ref={ref} data-testid='inside'>
        Inside
      </div>
      <div data-testid='outside'>Outside</div>
    </div>
  )
}

describe('useOnClickOutside', () => {
  it('calls the handler when clicking outside the ref element', () => {
    const handler = vi.fn()
    const { getByTestId } = render(<TestComponent handler={handler} />)

    fireEvent.mouseDown(getByTestId('outside'))

    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not call the handler when clicking inside the ref element', () => {
    const handler = vi.fn()
    const { getByTestId } = render(<TestComponent handler={handler} />)

    fireEvent.mouseDown(getByTestId('inside'))

    expect(handler).not.toHaveBeenCalled()
  })

  it('calls the handler on touchstart outside', () => {
    const handler = vi.fn()
    const { getByTestId } = render(<TestComponent handler={handler} />)

    fireEvent.touchStart(getByTestId('outside'))

    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not call the handler on touchstart inside', () => {
    const handler = vi.fn()
    const { getByTestId } = render(<TestComponent handler={handler} />)

    fireEvent.touchStart(getByTestId('inside'))

    expect(handler).not.toHaveBeenCalled()
  })
})
