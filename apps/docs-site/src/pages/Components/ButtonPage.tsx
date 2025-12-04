/**
 * Button Component Documentation Page
 */
/** @jsxImportSource react */
import { PropsTable } from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { buttonContent } from '@/content/button.content'
import { SimpleButtonExample } from '@/examples/SimpleButtonExample'
import { createPhaserScene } from '@/utils/phaser-bridge'

export function ButtonPage() {
  return (
    <DocLayout>
      <h1>{buttonContent.title}</h1>
      <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
        {buttonContent.description}
      </p>

      <h2>Live Example</h2>
      <LiveExample sceneFactory={() => createPhaserScene(SimpleButtonExample)} />

      <h2>Usage</h2>
      <CodeBlock language="tsx">{buttonContent.usage}</CodeBlock>

      <h2>Variants</h2>
      <CodeBlock language="tsx">{buttonContent.variants}</CodeBlock>

      <h2>Props</h2>
      <PropsTable props={buttonContent.props} />
    </DocLayout>
  )
}
