import { DevPanel, useDocumentTitle } from '@teo-garcia/react-shared'

export function App() {
  useDocumentTitle('@teo-garcia/react-shared Playground')
  return (
    <>
      <DevPanel />
      <div className='blank-stage' />
    </>
  )
}
