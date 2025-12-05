/**
 * View Component Documentation Page
 */
/** @jsxImportSource react */
import {
  DocDescription,
  ExampleSection,
  InheritedProps,
  PropsTable,
  Section,
  SectionDescription,
  ToggleButton,
} from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { viewContent } from '@/content/view.content'
import '@/styles/docs.css'
import { createPhaserScene } from '@/utils/phaser-bridge'
import { useState } from 'react'

export function ViewPage() {
  const [showAllProps, setShowAllProps] = useState(false)

  return (
    <DocLayout>
      <h1>{viewContent.title}</h1>
      <DocDescription>{viewContent.description}</DocDescription>

      <div className="info-box" style={{ marginBottom: '24px' }}>
        <strong>Important:</strong> An empty View without a background color is invisible. Always
        add either a <code>backgroundColor</code> or child content to make your Views visible.
      </div>

      <Section title="Quick Start">
        <SectionDescription>{viewContent.quickStart.description}</SectionDescription>
        <LiveExample
          sceneFactory={() =>
            createPhaserScene(viewContent.quickStart.component, viewContent.quickStart.background)
          }
          height={viewContent.quickStart.height}
          background={viewContent.quickStart.background}
        />
        <div className="code-wrapper">
          <CodeBlock language="tsx">{viewContent.quickStart.code}</CodeBlock>
        </div>
      </Section>

      <Section title="Examples">
        {viewContent.examples.map((example) => (
          <ExampleSection key={example.id} example={example} />
        ))}
      </Section>

      <Section title="API Reference">
        <h3>View Props</h3>
        <PropsTable props={viewContent.propsEssential} />

        <ToggleButton
          isActive={showAllProps}
          activeText="← Show Essential Props Only"
          inactiveText="Show All View Props →"
          onClick={() => setShowAllProps(!showAllProps)}
        />

        {showAllProps && (
          <div className="toggle-section">
            <h3>Complete View Props</h3>
            <PropsTable props={viewContent.propsComplete} />
          </div>
        )}

        {viewContent.inherits && viewContent.inherits.length > 0 && (
          <InheritedProps inherits={viewContent.inherits} />
        )}
      </Section>
    </DocLayout>
  )
}
