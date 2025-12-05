/**
 * Scene Backgrounds Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, PropsTable, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock, LiveExample } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { BackgroundDemoComponent } from '@/examples/demos/BackgroundDemo'
import '@/styles/docs.css'
import { createPhaserScene } from '@/utils/phaser-bridge'
import { useState } from 'react'

export function SceneBackgroundsPage() {
  const [selectedType, setSelectedType] = useState<'grid' | 'logo' | 'gradient' | 'particles'>(
    'grid'
  )
  const [selectedAnimation, setSelectedAnimation] = useState<
    'lemniscate' | 'wave' | 'pulse' | 'rotate' | 'static'
  >('lemniscate')

  const backgroundConfig = {
    type: selectedType,
    animation: selectedAnimation,
    opacity: 0.2,
  }

  const backgroundTypes = [
    {
      name: 'type',
      type: '"grid" | "logo" | "gradient" | "particles" | "none"',
      default: '"grid"',
      description: 'Background visual type',
    },
    {
      name: 'animation',
      type: '"lemniscate" | "wave" | "pulse" | "rotate" | "static"',
      default: '"lemniscate"',
      description: 'Animation pattern (type-dependent)',
    },
    {
      name: 'opacity',
      type: 'number',
      default: '0.15',
      description: 'Background opacity (0-1)',
    },
    {
      name: 'color',
      type: 'number',
      default: '0x4a9eff',
      description: 'Primary color (hex number)',
    },
    {
      name: 'colorSecondary',
      type: 'number',
      description: 'Secondary color for gradients (hex number)',
    },
  ]

  return (
    <DocLayout>
      <h1>Scene Backgrounds</h1>
      <DocDescription>
        Interactive Phaser backgrounds for documentation examples. Makes canvas rendering visually
        distinct from HTML and adds visual interest to examples.
      </DocDescription>

      <Section title="Interactive Demo">
        <SectionDescription>
          Try different background types and animations. This is the same system used in all
          component examples.
        </SectionDescription>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Background Type:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['grid', 'logo', 'gradient', 'particles'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="toggle-button"
                style={{
                  backgroundColor: selectedType === type ? '#4a9eff' : '#333',
                  marginTop: 0,
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Animation:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['lemniscate', 'wave', 'pulse', 'rotate', 'static'] as const).map((anim) => (
              <button
                key={anim}
                onClick={() => setSelectedAnimation(anim)}
                className="toggle-button"
                style={{
                  backgroundColor: selectedAnimation === anim ? '#4a9eff' : '#333',
                  marginTop: 0,
                }}
              >
                {anim}
              </button>
            ))}
          </div>
        </div>

        <LiveExample
          key={`${selectedType}-${selectedAnimation}`}
          sceneFactory={() => createPhaserScene(BackgroundDemoComponent, backgroundConfig)}
          height={300}
          background={backgroundConfig}
        />
      </Section>

      <Section title="Usage in Examples">
        <SectionDescription>
          Add background configuration to any example definition:
        </SectionDescription>

        <CodeBlock language="tsx">
          {`import { SCENE_SIZES } from '@/constants/scene-sizes'
import type { ComponentDocs } from '@/types/docs'

export const myContent: ComponentDocs = {
  quickStart: {
    id: 'quick-start',
    component: MyComponent,
    height: SCENE_SIZES.medium,
    // Optional background configuration
    background: {
      type: 'grid',
      animation: 'lemniscate',
      opacity: 0.2,
      color: 0x4a9eff,
    },
    code: \`...\`,
  },
}`}
        </CodeBlock>
      </Section>

      <Section title="Default Background">
        <SectionDescription>
          If no background is specified, examples use the default configuration:
        </SectionDescription>

        <CodeBlock language="tsx">
          {`export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'grid',
  animation: 'lemniscate',
  opacity: 0.15,
  color: 0x4a9eff,
}`}
        </CodeBlock>
      </Section>

      <Section title="Background Types">
        <h3>Grid</h3>
        <p className="section-description">
          Animated grid pattern with configurable animations (lemniscate, wave, static).
        </p>

        <h3>Logo</h3>
        <p className="section-description">
          Placeholder logo shape with pulse or rotate animations. Useful for branding.
        </p>

        <h3>Gradient</h3>
        <p className="section-description">
          Two-color gradient background. Supports color and colorSecondary properties.
        </p>

        <h3>Particles</h3>
        <p className="section-description">
          Floating animated particles. Creates ambient motion in the background.
        </p>

        <h3>None</h3>
        <p className="section-description">
          Transparent background. Use when you want full control over the scene appearance.
        </p>
      </Section>

      <Section title="Configuration Options">
        <PropsTable props={backgroundTypes} />
      </Section>

      <Section title="Animation Patterns">
        <h3>Lemniscate (∞)</h3>
        <p className="section-description">
          Figure-eight pattern. Works with grid backgrounds for smooth, continuous motion.
        </p>

        <h3>Wave</h3>
        <p className="section-description">
          Horizontal wave motion. Creates a flowing effect for grid backgrounds.
        </p>

        <h3>Pulse</h3>
        <p className="section-description">
          Scale-based breathing effect. Works well with logo and particle backgrounds.
        </p>

        <h3>Rotate</h3>
        <p className="section-description">Continuous rotation. Best for logo backgrounds.</p>

        <h3>Static</h3>
        <p className="section-description">No animation. Background remains fixed.</p>
      </Section>
    </DocLayout>
  )
}
