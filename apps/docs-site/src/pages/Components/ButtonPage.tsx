/**
 * Button Component Documentation Page
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
import { buttonContent } from '@/content/button.content'
import '@/styles/docs.css'
import { createPhaserScene } from '@/utils/phaser-bridge'
import { useState } from 'react'

export function ButtonPage() {
  const [showAllProps, setShowAllProps] = useState(false)

  return (
    <DocLayout>
      <h1>{buttonContent.title}</h1>
      <DocDescription>{buttonContent.description}</DocDescription>

      <Section title="Quick Start">
        <SectionDescription>{buttonContent.quickStart.description}</SectionDescription>
        <LiveExample
          sceneFactory={() =>
            createPhaserScene(
              buttonContent.quickStart.component,
              buttonContent.quickStart.background
            )
          }
          height={buttonContent.quickStart.height}
          background={buttonContent.quickStart.background}
        />
        <div className="code-wrapper">
          <CodeBlock language="tsx">{buttonContent.quickStart.code}</CodeBlock>
        </div>
      </Section>

      <Section title="Examples">
        {buttonContent.examples.map((example) => (
          <ExampleSection key={example.id} example={example} />
        ))}
      </Section>

      <Section title="API Reference">
        <h3>Button Props</h3>
        <PropsTable props={buttonContent.propsEssential} />

        <ToggleButton
          isActive={showAllProps}
          activeText="← Show Essential Props Only"
          inactiveText="Show All Button Props →"
          onClick={() => setShowAllProps(!showAllProps)}
        />

        {showAllProps && (
          <div className="toggle-section">
            <h3>Complete Button Props</h3>
            <PropsTable props={buttonContent.propsComplete} />
          </div>
        )}

        {buttonContent.inherits && <InheritedProps inherits={buttonContent.inherits} />}
      </Section>
    </DocLayout>
  )
}
