/**
 * Example section component for documentation
 */
/** @jsxImportSource react */
import { CodeBlock, LiveExample } from '@/components/Example'
import type { ExampleDefinition } from '@/types/docs'
import { createPhaserScene } from '@/utils/phaser-bridge'
import './ExampleSection.css'

interface ExampleSectionProps {
  example: ExampleDefinition
  showCode?: boolean
}

/**
 * Renders a documentation example with optional code display
 * @param example - Example definition
 * @param showCode - Whether to show the code block (default: true)
 */
export function ExampleSection({ example, showCode = true }: ExampleSectionProps) {
  return (
    <div className="example-section">
      <div className="example-header">
        <h3>{example.title}</h3>
        <p className="example-description">{example.description}</p>
      </div>

      <LiveExample
        sceneFactory={() => createPhaserScene(example.component, example.background)}
        height={example.height}
        background={example.background}
      />

      {showCode && (
        <div className="example-code">
          <CodeBlock language="tsx">{example.code}</CodeBlock>
        </div>
      )}
    </div>
  )
}
