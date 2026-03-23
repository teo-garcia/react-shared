import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Portal } from './portal.js'

describe('Portal', () => {
  it('renders children into the document body', () => {
    render(
      <Portal>
        <div>Portal content</div>
      </Portal>
    )
    expect(screen.getByText('Portal content')).toBeInTheDocument()
  })

  it('renders children into a custom container', () => {
    const container = document.createElement('div')
    document.body.append(container)

    render(
      <Portal container={container}>
        <div>Custom container</div>
      </Portal>
    )

    expect(container).toHaveTextContent('Custom container')
    container.remove()
  })

  it('renders nothing when container is null', () => {
    render(
      <Portal container={null}>
        <div>Null container</div>
      </Portal>
    )
    // mounted check prevents rendering when container is null — children not visible
    expect(screen.queryByText('Null container')).not.toBeInTheDocument()
  })
})
