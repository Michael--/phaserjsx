/**
 * Animation Showcase Page
 * Demonstrates spring animations applied to real UI components and layouts
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import {
  AnimatedCardExample,
  AnimatedDashboardExample,
  SpringButtonGridExample,
} from '@/examples/animation-showcase'
import AnimatedCardExampleRaw from '@/examples/animation-showcase/AnimatedCardExample.tsx?raw'
import AnimatedDashboardExampleRaw from '@/examples/animation-showcase/AnimatedDashboardExample.tsx?raw'
import SpringButtonGridExampleRaw from '@/examples/animation-showcase/SpringButtonGridExample.tsx?raw'
import '@/styles/docs.css'
import { createPhaserScene } from '@/utils/phaser-bridge'

/**
 * Animation Showcase guide page
 */
export function AnimationShowcasePage() {
  return (
    <DocLayout>
      <h1>Animation Showcase</h1>
      <DocDescription>
        Spring animations applied to real UI components. These examples demonstrate how spring
        physics enhance common UI patterns — cards, buttons, dashboards — with smooth, natural
        motion.
      </DocDescription>

      <Section title="Animated Card">
        <SectionDescription>
          A card component that responds to taps with spring-driven scale and rotation. The{' '}
          <code>TransformOriginView</code> handles the pivot point while <code>useSpring</code> with
          the "wobbly" preset creates a playful bounce effect. The card contains real UI elements:
          icon, title, description text, and a Button.
        </SectionDescription>

        <LiveExample
          sceneFactory={() => createPhaserScene(AnimatedCardExample)}
          width={600}
          height={260}
        />

        <details>
          <summary>View source code</summary>
          <CodeBlock language="tsx">{AnimatedCardExampleRaw}</CodeBlock>
        </details>
      </Section>

      <Section title="Spring Button Grid">
        <SectionDescription>
          Five buttons, each using a different spring preset. This demonstrates how the same
          interaction (tap-to-scale) feels different with each preset. Gentle feels smooth, wobbly
          feels playful, stiff feels snappy — choose the right preset for your UX.
        </SectionDescription>

        <LiveExample
          sceneFactory={() => createPhaserScene(SpringButtonGridExample)}
          width={620}
          height={220}
        />

        <details>
          <summary>View source code</summary>
          <CodeBlock language="tsx">{SpringButtonGridExampleRaw}</CodeBlock>
        </details>
      </Section>

      <Section title="Animated Dashboard">
        <SectionDescription>
          A mini dashboard combining multiple UI components with spring animations. A pulsing
          circular indicator uses <code>useSpring</code> with "wobbly" for continuous heartbeat-like
          animation. The Slider and ProgressBar provide interactive control — demonstrating how
          spring-animated elements coexist with standard form controls.
        </SectionDescription>

        <LiveExample
          sceneFactory={() => createPhaserScene(AnimatedDashboardExample)}
          width={600}
          height={340}
        />

        <details>
          <summary>View source code</summary>
          <CodeBlock language="tsx">{AnimatedDashboardExampleRaw}</CodeBlock>
        </details>
      </Section>
    </DocLayout>
  )
}
