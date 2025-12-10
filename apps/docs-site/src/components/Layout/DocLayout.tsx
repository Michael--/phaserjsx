/**
 * DocLayout - Main documentation layout with header, sidebar, and content
 */
/** @jsxImportSource react */
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface DocLayoutProps {
  children: ReactNode
}

/**
 * Main layout for documentation pages
 */
export function DocLayout({ children }: DocLayoutProps) {
  const darkMode = true // TODO: sync with theme context
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const main = mainRef.current
    if (main) {
      main.scrollTo({ top: 0 })
    }
  }, [location.pathname])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '40px',
            backgroundColor: darkMode ? '#0d1117' : '#ffffff',
            color: darkMode ? '#c9d1d9' : '#000000',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>{children}</div>
        </main>
      </div>
    </div>
  )
}
