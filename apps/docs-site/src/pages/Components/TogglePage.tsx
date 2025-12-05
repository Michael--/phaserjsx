/**
 * Toggle Component Documentation Page
 */
/** @jsxImportSource react */
import {
  DocDescription,
  PropsTable,
  Section,
  SectionDescription,
  ToggleButton,
} from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { toggleContent } from '@/content/toggle.content'
import '@/styles/docs.css'
import { createPhaserScene } from '@/utils/phaser-bridge'
import { useState } from 'react'

/**
 * Toggle component documentation page
 * @returns Toggle documentation page component
 */
export function TogglePage() {
  const [showAllProps, setShowAllProps] = useState(false)

  return (
    <DocLayout>
      <h1>{toggleContent.title}</h1>
      <DocDescription>{toggleContent.description}</DocDescription>

      {/* Quick Start */}
      <Section title={toggleContent.quickStart.title}>
        <SectionDescription>{toggleContent.quickStart.description}</SectionDescription>
        <LiveExample
          sceneFactory={() => createPhaserScene(toggleContent.quickStart.component)}
          height={toggleContent.quickStart.height}
        />
        <CodeBlock language="tsx">{toggleContent.quickStart.code}</CodeBlock>
      </Section>

      {/* Examples */}
      {toggleContent.examples.map((example) => (
        <Section key={example.id} title={example.title}>
          <SectionDescription>{example.description}</SectionDescription>
          <LiveExample
            sceneFactory={() => createPhaserScene(example.component)}
            height={example.height}
          />
          <CodeBlock language="tsx">{example.code}</CodeBlock>
        </Section>
      ))}

      {/* Props Reference */}
      <Section title="Props Reference">
        <SectionDescription>
          Toggle component properties for controlling behavior, appearance, and state management.
        </SectionDescription>

        <ToggleButton
          isActive={showAllProps}
          onClick={() => setShowAllProps(!showAllProps)}
          activeText="← Show Essential Props Only"
          inactiveText="Show All Props →"
        />

        <PropsTable
          props={showAllProps ? toggleContent.propsComplete : toggleContent.propsEssential}
        />
      </Section>
    </DocLayout>
  )
}
