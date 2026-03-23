import { QueryClient } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { createWrapper, renderWithProviders } from './index.js'

function RequiresQueryClient() {
  return <div>rendered</div>
}

describe('createWrapper', () => {
  it('returns a React component', () => {
    const Wrapper = createWrapper()
    expect(typeof Wrapper).toBe('function')
  })

  it('accepts a custom QueryClient', () => {
    const client = new QueryClient()
    const Wrapper = createWrapper({ queryClient: client })
    expect(typeof Wrapper).toBe('function')
  })
})

describe('renderWithProviders', () => {
  it('renders the provided UI', () => {
    renderWithProviders(<RequiresQueryClient />)
    expect(screen.getByText('rendered')).toBeInTheDocument()
  })

  it('accepts a custom QueryClient', () => {
    const client = new QueryClient()
    renderWithProviders(<RequiresQueryClient />, { queryClient: client })
    expect(screen.getByText('rendered')).toBeInTheDocument()
  })
})
