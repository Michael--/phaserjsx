/**
 * 404 Not Found Page — shown for genuinely unknown routes
 */
/** @jsxImportSource react */
import { DocDescription } from '@/components/Doc'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'
import { useLocation } from 'react-router-dom'

export function NotFoundPage() {
  const location = useLocation()

  return (
    <DocLayout>
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>🔍</div>
        <h1>404 — Page not found</h1>
        <DocDescription>
          <code>{location.pathname}</code> doesn&apos;t exist. If you followed a link here, the page
          may have moved.
        </DocDescription>

        <div style={{ marginTop: '32px' }}>
          <a
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: '#333',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              display: 'inline-block',
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </DocLayout>
  )
}
