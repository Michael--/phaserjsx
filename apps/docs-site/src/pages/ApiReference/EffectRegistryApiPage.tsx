/**
 * Effect Registry API Reference
 */
/** @jsxImportSource react */
import { DocDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

export function EffectRegistryApiPage() {
  return (
    <DocLayout>
      <h1>API Reference: Effect Registry</h1>
      <DocDescription>
        Built-in effects and effect system API. Centralized system for reusable visual effects.
      </DocDescription>
      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="mb-4">
          The Effect Registry provides a centralized system for reusable visual effects that can be
          applied to any component. It includes 23 built-in effects and supports custom effect
          registration.
        </p>
      </section>

      {/* Built-in Effects */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Built-in Effects</h2>
        <p className="mb-4">23 pre-configured effects ready to use.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Basic Effects */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Basic Effects</h3>
            <ul className="space-y-2">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">none</code> - No effect
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">pulse</code> - Scale up/down
                rhythmically
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">shake</code> - Horizontal shake
                motion
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">bounce</code> - Bounce up/down
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">press</code> - Scale down on
                interaction
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">flash</code> - Alpha flash effect
              </li>
            </ul>
          </div>

          {/* Animation Effects */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Animation Effects</h3>
            <ul className="space-y-2">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">jello</code> - Jelly-like wobble
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">wobble</code> - Rotation wobble
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">tada</code> - Attention-grabbing
                scale + rotate
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">swing</code> - Pendulum swing
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">wiggle</code> - Side-to-side wiggle
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">float</code> - Smooth float motion
              </li>
            </ul>
          </div>

          {/* Fade Effects */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Fade Effects</h3>
            <ul className="space-y-2">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">fade</code> - Fade in/out cycle
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">fadeIn</code> - Fade from
                transparent to opaque
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">fadeOut</code> - Fade from opaque to
                transparent
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">breathe</code> - Breathing alpha
                effect
              </li>
            </ul>
          </div>

          {/* Transform Effects */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Transform Effects</h3>
            <ul className="space-y-2">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">slideIn</code> - Slide in from side
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">slideOut</code> - Slide out to side
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">zoomIn</code> - Zoom from small to
                normal
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">zoomOut</code> - Zoom from normal to
                small
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">flipIn</code> - 3D flip in rotation
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">flipOut</code> - 3D flip out
                rotation
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">spin</code> - Continuous rotation
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Effect Types */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Type Definitions</h2>

        <div className="space-y-8">
          {/* EffectName */}
          <div>
            <h3 className="text-xl font-semibold mb-3">EffectName</h3>
            <p className="mb-3">Available effect names (built-in + custom extensions).</p>
            <CodeBlock language="typescript">
              {`type BuiltInEffectName =
  | 'none'
  | 'pulse'
  | 'shake'
  | 'bounce'
  | 'press'
  | 'flash'
  | 'jello'
  | 'fade'
  | 'fadeIn'
  | 'fadeOut'
  | 'wobble'
  | 'tada'
  | 'swing'
  | 'wiggle'
  | 'slideIn'
  | 'slideOut'
  | 'zoomIn'
  | 'zoomOut'
  | 'flipIn'
  | 'flipOut'
  | 'float'
  | 'breathe'
  | 'spin'

type EffectName =
  | BuiltInEffectName
  | (keyof EffectNameExtensions extends never
      ? never
      : keyof EffectNameExtensions)`}
            </CodeBlock>
          </div>

          {/* EffectDefinition */}
          <div>
            <h3 className="text-xl font-semibold mb-3">EffectDefinition</h3>
            <p className="mb-3">Effect configuration interface for components.</p>
            <CodeBlock language="typescript">
              {`interface EffectDefinition {
  effect?: EffectName
  effectConfig?: EffectConfig
}`}
            </CodeBlock>
          </div>

          {/* EffectConfig */}
          <div>
            <h3 className="text-xl font-semibold mb-3">EffectConfig</h3>
            <p className="mb-3">Configuration options for effect behavior.</p>
            <CodeBlock language="typescript">
              {`interface EffectConfig {
  intensity?: number   // Effect strength (e.g., 1.1 = 10% scale increase)
  time?: number        // Effect duration in milliseconds
  delay?: number       // Delay before effect starts
  repeat?: number      // Number of times to repeat (-1 = infinite)
  yoyo?: boolean       // Reverse effect at end
  ease?: string        // Easing function name
}`}
            </CodeBlock>
          </div>

          {/* EffectFn */}
          <div>
            <h3 className="text-xl font-semibold mb-3">EffectFn</h3>
            <p className="mb-3">Effect function signature for custom effects.</p>
            <CodeBlock language="typescript">
              {`type EffectFn = (
  gameObject: Phaser.GameObjects.GameObject,
  config?: EffectConfig
) => void`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* API Functions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">API Functions</h2>

        <div className="space-y-8">
          {/* applyEffectByName */}
          <div>
            <h3 className="text-xl font-semibold mb-3">applyEffectByName</h3>
            <p className="mb-3">Apply an effect by name with configuration.</p>
            <CodeBlock language="typescript">
              {`function applyEffectByName(
  applyEffect: (effect: EffectFn, config?: EffectConfig) => void,
  effectName?: EffectName,
  effectConfig?: EffectConfig
): boolean`}
            </CodeBlock>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Parameters:</h4>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>applyEffect</strong>: The applyEffect function from useGameObjectEffect
                  hook
                </li>
                <li>
                  <strong>effectName</strong>: Name of the effect to apply
                </li>
                <li>
                  <strong>effectConfig</strong>: Optional configuration for the effect
                </li>
              </ul>
              <h4 className="font-semibold mb-2 mt-4">Returns:</h4>
              <p>
                <code>boolean</code> - true if effect was applied, false otherwise
              </p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold mb-2">Example:</h4>
              <CodeBlock language="tsx">
                {`import { useGameObjectEffect } from '@phaserjsx/ui'
import { applyEffectByName } from '@phaserjsx/ui/effects'

function AnimatedButton() {
  const ref = useRef()
  const { applyEffect } = useGameObjectEffect(ref)
  
  const handleClick = () => {
    applyEffectByName(applyEffect, 'pulse', {
      intensity: 1.2,
      time: 200,
    })
  }
  
  return (
    <View ref={ref} onTouch={handleClick}>
      <Text text="Click me" />
    </View>
  )
}`}
              </CodeBlock>
            </div>
          </div>

          {/* resolveEffect */}
          <div>
            <h3 className="text-xl font-semibold mb-3">resolveEffect</h3>
            <p className="mb-3">
              Resolve effect definition with priority: props &gt; theme &gt; default.
            </p>
            <CodeBlock language="typescript">
              {`function resolveEffect(
  props?: EffectDefinition,
  theme?: EffectDefinition
): Required<EffectDefinition>`}
            </CodeBlock>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Parameters:</h4>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>props</strong>: Props-level effect definition
                </li>
                <li>
                  <strong>theme</strong>: Theme-level effect definition
                </li>
              </ul>
              <h4 className="font-semibold mb-2 mt-4">Returns:</h4>
              <p>
                <code>Required&lt;EffectDefinition&gt;</code> - Resolved effect with all fields
                defined
              </p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold mb-2">Example:</h4>
              <CodeBlock language="tsx">
                {`import { resolveEffect } from '@phaserjsx/ui/effects'

function ThemedButton(props: ButtonProps) {
  const theme = useTheme()
  const resolved = resolveEffect(props, theme.Button)
  
  // resolved.effect: from props, or theme, or 'pulse' (default)
  // resolved.effectConfig: from props, or theme, or default config
  
  return <View effect={resolved.effect} effectConfig={resolved.effectConfig} />
}`}
              </CodeBlock>
            </div>
          </div>

          {/* EFFECT_REGISTRY */}
          <div>
            <h3 className="text-xl font-semibold mb-3">EFFECT_REGISTRY</h3>
            <p className="mb-3">Map of effect names to effect functions.</p>
            <CodeBlock language="typescript">
              {`const EFFECT_REGISTRY: Record<BuiltInEffectName, EffectFn | null>`}
            </CodeBlock>
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="mb-2">
                <strong>Note:</strong> Typically you don't need to access EFFECT_REGISTRY directly.
                Use <code className="bg-gray-100 px-2 py-1 rounded">applyEffectByName()</code>{' '}
                instead.
              </p>
            </div>
          </div>

          {/* DEFAULT_EFFECT */}
          <div>
            <h3 className="text-xl font-semibold mb-3">DEFAULT_EFFECT</h3>
            <p className="mb-3">Default effect configuration.</p>
            <CodeBlock language="typescript">
              {`const DEFAULT_EFFECT: Required<EffectDefinition> = {
  effect: 'pulse',
  effectConfig: { intensity: 1.1, time: 100 },
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Usage Patterns */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Usage Patterns</h2>

        <div className="space-y-8">
          {/* Component Props */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Effect in Component Props</h3>
            <CodeBlock language="tsx">
              {`// Simple effect name
<Button effect="bounce" />

// With custom configuration
<Button
  effect="pulse"
  effectConfig={{ intensity: 1.3, time: 150 }}
/>

// No effect
<Button effect="none" />`}
            </CodeBlock>
          </div>

          {/* Theme Configuration */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Effect in Theme</h3>
            <CodeBlock language="tsx">
              {`const theme: PartialTheme = {
  Button: {
    effect: 'press',
    effectConfig: {
      intensity: 0.95,
      time: 100,
    },
  },
  Card: {
    effect: 'pulse',
    effectConfig: {
      intensity: 1.05,
      time: 200,
    },
  },
}`}
            </CodeBlock>
          </div>

          {/* Custom Component with Effects */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Custom Component with Effects</h3>
            <CodeBlock language="tsx">
              {`import { useGameObjectEffect } from '@phaserjsx/ui'
import { applyEffectByName, resolveEffect, EffectDefinition } from '@phaserjsx/ui/effects'

interface MyComponentProps extends EffectDefinition {
  label: string
}

function MyComponent(props: MyComponentProps) {
  const ref = useRef()
  const theme = useTheme()
  const { applyEffect } = useGameObjectEffect(ref)
  
  const handleInteraction = () => {
    const resolved = resolveEffect(props, theme.MyComponent)
    applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
  }
  
  return (
    <View ref={ref} onTouch={handleInteraction}>
      <Text text={props.label} />
    </View>
  )
}`}
            </CodeBlock>
          </div>

          {/* Programmatic Effects */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Programmatic Effect Triggering</h3>
            <CodeBlock language="tsx">
              {`import { useGameObjectEffect } from '@phaserjsx/ui'
import { applyEffectByName } from '@phaserjsx/ui/effects'

function NotificationBadge() {
  const ref = useRef()
  const { applyEffect } = useGameObjectEffect(ref)
  
  // Trigger effect from external event
  useEffect(() => {
    const unsubscribe = notificationStore.subscribe((count) => {
      if (count > 0) {
        applyEffectByName(applyEffect, 'bounce', { intensity: 1.3 })
      }
    })
    return unsubscribe
  }, [applyEffect])
  
  return (
    <View ref={ref}>
      <Icon name="bell" />
    </View>
  )
}`}
            </CodeBlock>
          </div>

          {/* Sequential Effects */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Sequential Effects</h3>
            <CodeBlock language="tsx">
              {`function AnimatedSequence() {
  const ref = useRef()
  const { applyEffect } = useGameObjectEffect(ref)
  
  const playSequence = () => {
    // First effect
    applyEffectByName(applyEffect, 'fadeIn', { time: 300 })
    
    // Second effect after delay
    setTimeout(() => {
      applyEffectByName(applyEffect, 'bounce', { intensity: 1.2 })
    }, 350)
    
    // Third effect
    setTimeout(() => {
      applyEffectByName(applyEffect, 'pulse', { intensity: 1.1 })
    }, 700)
  }
  
  return <View ref={ref} onTouch={playSequence} />
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Custom Effects */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Custom Effects</h2>
        <p className="mb-4">Extend the effect system with custom effects.</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Declaring Custom Effect Names</h3>
            <CodeBlock language="typescript">
              {`// In your types file
declare module '@phaserjsx/ui' {
  interface EffectNameExtensions {
    rainbow: 'rainbow'
    spiral: 'spiral'
  }
}`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Creating Custom Effect Functions</h3>
            <CodeBlock language="typescript">
              {`import type { EffectFn, EffectConfig } from '@phaserjsx/ui/effects'

export const createRainbowEffect: EffectFn = (
  gameObject: Phaser.GameObjects.GameObject,
  config?: EffectConfig
) => {
  const scene = gameObject.scene
  const intensity = config?.intensity ?? 1
  const time = config?.time ?? 1000
  
  scene.tweens.add({
    targets: gameObject,
    tint: {
      from: 0xff0000,
      to: 0x0000ff,
    },
    duration: time * intensity,
    repeat: config?.repeat ?? 0,
    yoyo: config?.yoyo ?? false,
    ease: config?.ease ?? 'Linear',
  })
}`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Registering Custom Effects</h3>
            <CodeBlock language="typescript">
              {`import { EFFECT_REGISTRY } from '@phaserjsx/ui/effects'
import { createRainbowEffect } from './effects/rainbow'

// Add to registry
EFFECT_REGISTRY['rainbow'] = createRainbowEffect

// Now usable like built-in effects
<Button effect="rainbow" effectConfig={{ time: 2000 }} />`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Best Practices</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Effect Selection</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Use <strong>press</strong> for button/clickable feedback
              </li>
              <li>
                Use <strong>pulse</strong> for drawing attention to elements
              </li>
              <li>
                Use <strong>fadeIn/fadeOut</strong> for modal/overlay transitions
              </li>
              <li>
                Use <strong>slideIn/slideOut</strong> for drawer/panel animations
              </li>
              <li>
                Use <strong>bounce</strong> for success feedback or notifications
              </li>
              <li>
                Use <strong>shake</strong> for error feedback or validation
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Configuration</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Keep effect times short (&lt;300ms) for interaction feedback</li>
              <li>Use longer times (500-1000ms) for attention-grabbing effects</li>
              <li>Set appropriate intensity values (1.0-1.3 for subtle, 1.5+ for dramatic)</li>
              <li>Use yoyo for reversible effects (bounce back)</li>
              <li>Configure repeat: -1 for continuous animations (use sparingly)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Performance</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Avoid continuous effects (repeat: -1) on many elements simultaneously</li>
              <li>Clean up effects when components unmount</li>
              <li>
                Use <code>effect="none"</code> to disable inherited theme effects
              </li>
              <li>Batch effect triggers instead of firing individually</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Provide alternative feedback (sound, haptics) alongside visual effects</li>
              <li>Consider users with motion sensitivity - keep effects subtle</li>
              <li>Allow users to disable effects via settings</li>
              <li>Don't rely solely on effects for critical feedback</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Custom Effects</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Follow the EffectFn signature consistently</li>
              <li>Respect the standard EffectConfig properties</li>
              <li>Clean up tweens and timers when effects complete</li>
              <li>Document custom effect behavior and config options</li>
              <li>Test custom effects with various config combinations</li>
            </ul>
          </div>
        </div>
      </section>
    </DocLayout>
  )
}
