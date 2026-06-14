/**
 * Animation Showcase Page
 * Demonstrates spring animations as solutions for common UI interaction problems
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import {
  PathMorphExample,
  PressFeedbackExample,
  SmoothedProgressExample,
  SnapPanelExample,
} from '@/examples/animation-showcase'
import PathMorphExampleRaw from '@/examples/animation-showcase/PathMorphExample.tsx?raw'
import PressFeedbackExampleRaw from '@/examples/animation-showcase/PressFeedbackExample.tsx?raw'
import SmoothedProgressExampleRaw from '@/examples/animation-showcase/SmoothedProgressExample.tsx?raw'
import SnapPanelExampleRaw from '@/examples/animation-showcase/SnapPanelExample.tsx?raw'
import '@/styles/docs.css'
import { createPhaserScene } from '@/utils/phaser-bridge'

/**
 * Spring animation patterns guide page
 */
export function AnimationShowcasePage() {
  return (
    <DocLayout>
      <h1>Spring Patterns</h1>
      <DocDescription>
        Spring animations are most useful when they solve a concrete interaction problem: tactile
        feedback without layout shift, smoothing volatile values, and moving overlays between stable
        states. These examples focus on those patterns instead of decorative motion.
      </DocDescription>

      <Section title="Press Feedback Without Layout Shift">
        <SectionDescription>
          Buttons should acknowledge a tap immediately, but changing width, height, or padding would
          disturb surrounding layout. This pattern springs only <code>scale</code> on a fixed-size{' '}
          <code>TransformOriginView</code>, giving tactile feedback while the layout remains stable.
        </SectionDescription>

        <LiveExample
          sceneFactory={() => createPhaserScene(PressFeedbackExample)}
          width={600}
          height={260}
        />

        <details>
          <summary>View source code</summary>
          <CodeBlock language="tsx">{PressFeedbackExampleRaw}</CodeBlock>
        </details>
      </Section>

      <Section title="Smooth Incoming Values">
        <SectionDescription>
          Game values often jump: sensor readings, scores, loading state, cooldowns. Keep the real
          target value in state, but render a spring-smoothed value into the progress bar and label.
          The data remains accurate while the UI becomes easier to read.
        </SectionDescription>

        <LiveExample
          sceneFactory={() => createPhaserScene(SmoothedProgressExample)}
          width={620}
          height={280}
        />

        <details>
          <summary>View source code</summary>
          <CodeBlock language="tsx">{SmoothedProgressExampleRaw}</CodeBlock>
        </details>
      </Section>

      <Section title="Snap Panel State Transitions">
        <SectionDescription>
          Bottom sheets, drawers, and command panels usually have a few meaningful states rather
          than arbitrary animation timelines. <code>useSprings</code> coordinates position, alpha,
          and scale so the panel snaps between closed, peek, and open states with one update.
        </SectionDescription>

        <LiveExample
          sceneFactory={() => createPhaserScene(SnapPanelExample)}
          width={620}
          height={360}
        />

        <details>
          <summary>View source code</summary>
          <CodeBlock language="tsx">{SnapPanelExampleRaw}</CodeBlock>
        </details>
      </Section>

      <Section title="Vector Shape Morphing">
        <SectionDescription>
          Morphing between arbitrary vector shapes — icons, avatars, or decorative elements — is a
          single-spring problem. Pre-sample both shapes to the same vertex count, then let{' '}
          <code>useSpring</code> drive the interpolation. The <code>Graphics</code> component
          redraws the polygon every frame from the interpolated point cloud.
        </SectionDescription>

        <LiveExample
          sceneFactory={() => createPhaserScene(PathMorphExample)}
          width={620}
          height={340}
        />

        <details>
          <summary>View source code</summary>
          <CodeBlock language="tsx">{PathMorphExampleRaw}</CodeBlock>
        </details>
      </Section>
    </DocLayout>
  )
}
