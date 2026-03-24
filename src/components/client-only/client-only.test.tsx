import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ClientOnly } from './client-only.js'

describe('ClientOnly', () => {
  it('renders the hydrated client content', () => {
    render(
      <ClientOnly fallback={<span>loading</span>}>
        <span>ready</span>
      </ClientOnly>
    )

    expect(screen.getByText('ready')).toBeInTheDocument()
  })

  it('supports render-function children', () => {
    render(<ClientOnly>{() => <span>computed</span>}</ClientOnly>)

    expect(screen.getByText('computed')).toBeInTheDocument()
  })
})
