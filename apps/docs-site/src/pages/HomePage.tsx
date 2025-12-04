/**
 * Home Page
 */
/** @jsxImportSource react */
import { DocLayout } from '@/components/Layout'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <DocLayout>
      <h1>Welcome to PhaserJSX UI</h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
        A React-like component library for Phaser 3, featuring JSX syntax, hooks, flexbox layout,
        and a complete theme system.
      </p>

      <h2>Features</h2>
      <ul style={{ lineHeight: '2' }}>
        <li>✅ React-like DX with JSX + Hooks</li>
        <li>✅ Flexbox Layout Engine</li>
        <li>✅ Complete Theme System</li>
        <li>✅ Spring Physics Animations</li>
        <li>✅ 30+ Built-in Components</li>
        <li>✅ TypeScript First</li>
      </ul>

      <h2>Quick Start</h2>
      <pre
        style={{
          backgroundColor: '#1e1e1e',
          padding: '20px',
          borderRadius: '8px',
          overflow: 'auto',
        }}
      >
        <code style={{ color: '#d4d4d4' }}>npm install @phaserjsx/ui</code>
      </pre>

      <h2>Explore</h2>
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <Link
          to="/components/button"
          style={{
            padding: '12px 24px',
            backgroundColor: '#61dafb',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
          }}
        >
          View Components
        </Link>
        <Link
          to="/installation"
          style={{
            padding: '12px 24px',
            backgroundColor: '#333',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
          }}
        >
          Installation Guide
        </Link>
      </div>
    </DocLayout>
  )
}
