/**
 * Button Component Documentation Page
 */
/** @jsxImportSource react */
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { SimpleButtonExample } from '@/examples/SimpleButtonExample'
import { createPhaserScene } from '@/utils/phaser-bridge'

export function ButtonPage() {
  return (
    <DocLayout>
      <h1>Button Component</h1>
      <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
        Interactive button component with multiple variants, states, and full theme support.
      </p>

      <h2>Live Example</h2>
      <LiveExample sceneFactory={() => createPhaserScene(SimpleButtonExample)} />

      <h2>Usage</h2>
      <CodeBlock language="tsx">
        {`/** @jsxImportSource @phaserjsx/ui */
import { Button } from '@phaserjsx/ui'

function MyComponent() {
  return (
    <Button onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  )
}`}
      </CodeBlock>

      <h2>Variants</h2>
      <CodeBlock language="tsx">
        {`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>`}
      </CodeBlock>

      <h2>Props</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '16px',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Prop</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Default</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <td style={{ padding: '12px' }}>
              <code>variant</code>
            </td>
            <td style={{ padding: '12px' }}>string</td>
            <td style={{ padding: '12px' }}>
              <code>"primary"</code>
            </td>
            <td style={{ padding: '12px' }}>Button style variant</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <td style={{ padding: '12px' }}>
              <code>onClick</code>
            </td>
            <td style={{ padding: '12px' }}>function</td>
            <td style={{ padding: '12px' }}>-</td>
            <td style={{ padding: '12px' }}>Click event handler</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <td style={{ padding: '12px' }}>
              <code>disabled</code>
            </td>
            <td style={{ padding: '12px' }}>boolean</td>
            <td style={{ padding: '12px' }}>
              <code>false</code>
            </td>
            <td style={{ padding: '12px' }}>Disable button interaction</td>
          </tr>
        </tbody>
      </table>
    </DocLayout>
  )
}
