/**
 * Custom Component Pattern Page
 * Demonstrates building custom components from primitives
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { VUMeterExample } from '@/examples/custom-component-pattern'
import VUMeterExampleRaw from '@/examples/custom-component-pattern/VUMeterExample.tsx?raw'
import '@/styles/docs.css'
import { createPhaserScene } from '@/utils/phaser-bridge'

/**
 * Guide: building custom components from primitives
 */
export function CustomComponentPatternPage() {
  return (
    <DocLayout>
      <h1>Custom Components from Primitives</h1>
      <DocDescription>
        PhaserJSX provides a small set of primitives — <code>View</code>, <code>Text</code>,{' '}
        <code>Button</code>, <code>Graphics</code>, and a few more. Everything else is built by
        composing them into custom components. This guide walks through the pattern: build a static
        component, then wrap it with <code>useSpring</code> for animation — without touching the
        original.
      </DocDescription>

      <Section title="From Static to Animated — Compose, Don't Copy">
        <SectionDescription>
          The <code>VUMeter</code> component is ~30 lines of pure <code>View</code> +{' '}
          <code>Text</code> composition. No canvas drawing, no custom renderer. To animate it, we
          write <code>AnimatedVUMeter</code> — a 10-line wrapper that holds a <code>useSpring</code>
          , feeds the smoothed value into the <strong>same</strong> <code>VUMeter</code> component,
          and adds nothing else. The static component is imported, not copied. The demo auto-cycles
          through four preset levels so you can see both meters receive the identical target — the
          static one jumps, the animated one catches up.
        </SectionDescription>

        <LiveExample
          sceneFactory={() => createPhaserScene(VUMeterExample)}
          width={800}
          height={600}
        />

        <details>
          <summary>View source code</summary>
          <CodeBlock language="tsx">{VUMeterExampleRaw}</CodeBlock>
        </details>
      </Section>
    </DocLayout>
  )
}
