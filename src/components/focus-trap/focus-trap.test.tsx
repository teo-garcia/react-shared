import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FocusTrap } from './focus-trap.js'

describe('FocusTrap', () => {
  it('renders children', () => {
    render(
      <FocusTrap>
        <button>Action</button>
      </FocusTrap>
    )

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('focuses the first focusable element on mount when initialFocus is true', () => {
    render(
      <FocusTrap initialFocus>
        <button>First</button>
        <button>Second</button>
      </FocusTrap>
    )

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
  })

  it('does not auto-focus when initialFocus is false', () => {
    render(
      <FocusTrap initialFocus={false}>
        <button>Button</button>
      </FocusTrap>
    )

    expect(screen.getByRole('button', { name: 'Button' })).not.toHaveFocus()
  })

  it('does not trap focus when active is false', () => {
    const handleKeyDown = vi.fn()
    document.addEventListener('keydown', handleKeyDown)

    render(
      <FocusTrap active={false} initialFocus={false}>
        <button>Button</button>
      </FocusTrap>
    )

    fireEvent.keyDown(document, { key: 'Tab' })
    // No focus shifting happens — the keydown propagates freely
    document.removeEventListener('keydown', handleKeyDown)
    expect(handleKeyDown).toHaveBeenCalled()
  })

  it('wraps Tab from last focusable to first', () => {
    render(
      <FocusTrap initialFocus={false}>
        <button>First</button>
        <button>Last</button>
      </FocusTrap>
    )

    const last = screen.getByRole('button', { name: 'Last' })
    last.focus()
    expect(last).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false })
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
  })

  it('wraps Shift+Tab from first focusable to last', () => {
    render(
      <FocusTrap initialFocus={false}>
        <button>First</button>
        <button>Last</button>
      </FocusTrap>
    )

    const first = screen.getByRole('button', { name: 'First' })
    first.focus()
    expect(first).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
  })
})
