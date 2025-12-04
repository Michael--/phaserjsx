/**
 * Button Component Documentation Page
 */
/** @jsxImportSource react */
import { ExampleSection, PropsTable } from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { buttonContent } from '@/content/button.content'
import { createPhaserScene } from '@/utils/phaser-bridge'
import { useState } from 'react'

export function ButtonPage() {
  const [showAllProps, setShowAllProps] = useState(false)

  return (
    <DocLayout>
      <h1>{buttonContent.title}</h1>
      <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
        {buttonContent.description}
      </p>

      <h2>Quick Start</h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        {buttonContent.quickStart.description}
      </p>
      <LiveExample
        sceneFactory={() => createPhaserScene(buttonContent.quickStart.component)}
        height={buttonContent.quickStart.height}
      />
      <div style={{ marginTop: '16px' }}>
        <CodeBlock language="tsx">{buttonContent.quickStart.code}</CodeBlock>
      </div>

      <h2 style={{ marginTop: '48px' }}>Examples</h2>
      {buttonContent.examples.map((example) => (
        <ExampleSection key={example.id} example={example} />
      ))}

      <h2 style={{ marginTop: '48px' }}>API Reference</h2>
      <h3>Props</h3>
      <PropsTable props={buttonContent.propsEssential} />

      <button
        onClick={() => setShowAllProps(!showAllProps)}
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        {showAllProps ? '← Show Essential Props Only' : 'Show All Props →'}
      </button>

      {showAllProps && (
        <div style={{ marginTop: '24px' }}>
          <h3>Complete Props Reference</h3>
          <PropsTable props={buttonContent.propsComplete} />
        </div>
      )}
    </DocLayout>
  )
}
