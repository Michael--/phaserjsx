/**
 * Home Page
 */
/** @jsxImportSource react */
import logoImage from '@/assets/phaser-jsx-logo.png'
import { Section } from '@/components/Doc'
import { CTAButtons, Hero } from '@/components/Home'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'
import '@/styles/home.css'

export function HomePage() {
  return (
    <DocLayout>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img
          src={logoImage}
          alt="PhaserJSX Logo"
          style={{
            height: '120px',
            width: 'auto',
            marginBottom: '24px',
          }}
        />
      </div>
      <Hero title="Welcome to PhaserJSX UI">
        A React-like component library for Phaser 3, featuring JSX syntax, hooks, flexbox layout,
        and a complete theme system.
      </Hero>

      <Section title="Features">
        <ul className="feature-list">
          <li>✅ React-like DX with JSX + Hooks</li>
          <li>✅ Flexbox Layout Engine</li>
          <li>✅ Complete Theme System</li>
          <li>✅ Spring Physics Animations</li>
          <li>✅ 30+ Built-in Components</li>
          <li>✅ TypeScript First</li>
        </ul>
      </Section>

      <Section title="Quick Start">
        <pre className="code-install">
          <code>npm install @number10/phaserjsx</code>
        </pre>
      </Section>

      <Section title="Explore">
        <CTAButtons
          buttons={[
            { to: '/components/button', text: 'View Components', variant: 'primary' },
            { to: '/installation', text: 'Installation Guide', variant: 'secondary' },
          ]}
        />
      </Section>
    </DocLayout>
  )
}
