import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AsyncBoundary } from './async-boundary.js'

describe('AsyncBoundary', () => {
  it('renders children through the wrapper', () => {
    render(
      <AsyncBoundary loadingFallback={<div>Loading…</div>}>
        <div>ready</div>
      </AsyncBoundary>
    )

    expect(screen.getByText('ready')).toBeInTheDocument()
  })

  it('renders the error boundary fallback when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    function Boom() {
      throw new Error('boom')
    }

    render(
      <AsyncBoundary fallback={<div>Errored</div>}>
        <Boom />
      </AsyncBoundary>
    )

    expect(screen.getByText('Errored')).toBeInTheDocument()

    vi.restoreAllMocks()
  })
})
