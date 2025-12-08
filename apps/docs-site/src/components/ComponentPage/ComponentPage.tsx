/**
 * Generic Component Documentation Page
 * Renders any component documentation based on ComponentDocs structure
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
import '@/styles/docs.css'
import type { ComponentDocs } from '@/types/docs'
import { createPhaserScene } from '@/utils/phaser-bridge'
import { useState } from 'react'

interface ComponentPageProps {
  /** Component documentation content */
  content: ComponentDocs
  /** Optional info box to display after description */
  infoBox?: React.ReactNode
}

/**
 * Generic component documentation page
 * Handles all common documentation patterns: quickstart, examples, props, inheritance
 * @param content - Component documentation structure
 * @param infoBox - Optional info/warning box after description
 */
export function ComponentPage({ content, infoBox }: ComponentPageProps) {
  const [showAllProps, setShowAllProps] = useState(false)

  return (
    <DocLayout>
      <h1>{content.title}</h1>
      <DocDescription>{content.description}</DocDescription>

      {infoBox && <div style={{ marginBottom: '24px' }}>{infoBox}</div>}

      {/* Quick Start Section */}
      <Section title="Quick Start">
        <SectionDescription>{content.quickStart.description}</SectionDescription>
        <LiveExample
          sceneFactory={() =>
            createPhaserScene(content.quickStart.component, content.quickStart.background)
          }
          height={content.quickStart.height}
          background={content.quickStart.background}
          preload={content.quickStart.preload}
        />
        <div className="code-wrapper">
          <CodeBlock language="tsx">{content.quickStart.code}</CodeBlock>
        </div>
      </Section>

      {/* Examples Section */}
      {content.examples && content.examples.length > 0 && (
        <Section title="Examples">
          {content.examples.map((example) => (
            <ExampleSection key={example.id} example={example} />
          ))}
        </Section>
      )}

      {/* API Reference Section */}
      <Section title="API Reference">
        <h3>{content.title} Props</h3>
        <PropsTable props={content.propsEssential} />

        <ToggleButton
          isActive={showAllProps}
          activeText="← Show Essential Props Only"
          inactiveText={`Show All ${content.title} Props →`}
          onClick={() => setShowAllProps(!showAllProps)}
        />

        {showAllProps && (
          <div className="toggle-section">
            <h3>Complete {content.title} Props</h3>
            <PropsTable props={content.propsComplete} />
          </div>
        )}

        {/* Inherited Props Section */}
        {content.inherits && content.inherits.length > 0 && (
          <InheritedProps inherits={content.inherits} />
        )}
      </Section>
    </DocLayout>
  )
}
