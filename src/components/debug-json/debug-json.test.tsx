import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DebugJSON } from './debug-json.js'

describe('DebugJSON', () => {
  it('renders the value as pretty JSON', () => {
    render(<DebugJSON value={{ name: 'test', count: 42 }} />)
    expect(screen.getByText(/count/)).toBeInTheDocument()
  })

  it('renders the label in the summary', () => {
    render(<DebugJSON value={null} label='my state' />)
    expect(screen.getByText('my state')).toBeInTheDocument()
  })

  it('uses "debug" as the default label', () => {
    render(<DebugJSON value={null} />)
    expect(screen.getByText('debug')).toBeInTheDocument()
  })

  it('renders nothing in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    render(<DebugJSON value={{ should: 'not render' }} label='prod' />)
    expect(screen.queryByText('prod')).not.toBeInTheDocument()
    vi.unstubAllEnvs()
  })
})
