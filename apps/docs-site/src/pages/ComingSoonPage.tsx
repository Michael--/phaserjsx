/**
 * Coming Soon Page - Placeholder for under construction routes
 */
/** @jsxImportSource react */
import { Section } from '@/components/Doc'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'
import { useLocation } from 'react-router-dom'

export function ComingSoonPage() {
  const location = useLocation()
  const pageName = location.pathname.split('/').pop() || 'This page'

  return (
    <DocLayout>
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>🚧</div>
        <h1>Coming Soon</h1>
        <p
          className="doc-description"
          style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}
        >
          The <strong>{pageName}</strong> documentation is currently under construction. Check back
          soon!
        </p>

        <Section>
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
        </Section>
      </div>
    </DocLayout>
  )
}
