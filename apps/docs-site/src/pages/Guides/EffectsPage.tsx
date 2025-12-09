/**
 * Effects & Animations Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Effects & Animations guide page
 */
export function EffectsPage() {
  return (
    <DocLayout>
      <h1>Effects & Animations</h1>
      <DocDescription>
        Create engaging user experiences with PhaserJSX's built-in effect system and physics-based
        spring animations. This guide covers click effects, smooth transitions, and custom animation
        patterns.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          PhaserJSX provides two complementary animation systems, each optimized for different use
          cases.
        </SectionDescription>

        <h3>Effect System - Event-Driven Animations</h3>
        <p>
          The effect system provides pre-built animations triggered by user interactions. Effects
          are fire-and-forget animations that run once when triggered, making them perfect for
          button clicks, hover states, and other discrete events. Examples include jello, bounce,
          pulse, shake, and fade effects.
        </p>

        <h3>Spring Animations - Continuous State Transitions</h3>
        <p>
          Spring animations use physics-based motion for smooth, natural-feeling transitions between
          states. Unlike effects, springs continuously track a target value and smoothly animate
          towards it. They excel at reactive UI elements like sliders, draggable objects, and
          state-driven transforms.
        </p>
      </Section>

      <Section title="Effect System">
        <SectionDescription>
          Built-in effects for common UI animations, integrated with interactive components.
        </SectionDescription>

        <h3>How Effects Work</h3>
        <p>
          Effects are Phaser tween-based animations applied to game objects. When triggered, an
          effect creates one or more tweens that animate properties like position, scale, rotation,
          or alpha. The effect system automatically manages tween lifecycle, cleanup, and prevents
          position drift from overlapping animations.
        </p>

        <h3>Using Effects with Components</h3>
        <p>
          Many interactive components like <code>Button</code> and <code>NineSliceButton</code>{' '}
          support effects through the <code>effect</code> and <code>effectConfig</code> props. When
          the user clicks, the effect plays automatically.
        </p>

        <CodeBlock language="tsx">
          {`<NineSliceButton
  texture="ui"
  frame="button"
  effect="jello"
  effectConfig={{ time: 600 }}
  onClick={() => console.log('Clicked!')}
>
  <Text text="Click Me!" />
</NineSliceButton>`}
        </CodeBlock>

        <p>
          See the <a href="/components/nineslice-button">NineSliceButton Interactive Example</a> for
          live demonstrations of different effects.
        </p>

        <h3>Available Effects</h3>
        <p>
          The effect registry includes 21 built-in effects, organized by category. Each effect
          accepts configuration options like <code>time</code> (duration in milliseconds),{' '}
          <code>magnitude</code> (intensity), and <code>direction</code>.
        </p>

        <h4>Bounce & Spring Effects</h4>
        <ul>
          <li>
            <strong>bounce</strong> - Quick scale bounce (default 300ms)
          </li>
          <li>
            <strong>jello</strong> - Wobbly rotation shake (wiggle effect)
          </li>
          <li>
            <strong>pulse</strong> - Gentle scale pulse in/out
          </li>
          <li>
            <strong>tada</strong> - Celebratory scale + rotation combo
          </li>
        </ul>

        <h4>Motion Effects</h4>
        <ul>
          <li>
            <strong>shake</strong> - Horizontal position shake (configurable magnitude)
          </li>
          <li>
            <strong>swing</strong> - Pendulum rotation swing
          </li>
          <li>
            <strong>wiggle</strong> - Rotation wiggle left/right
          </li>
          <li>
            <strong>wobble</strong> - Combined rotation + horizontal motion
          </li>
          <li>
            <strong>float</strong> - Gentle vertical floating motion
          </li>
        </ul>

        <h4>Scale Effects</h4>
        <ul>
          <li>
            <strong>press</strong> - Quick scale down (button press feedback)
          </li>
          <li>
            <strong>breathe</strong> - Slow, continuous scale pulse (idle animation)
          </li>
          <li>
            <strong>zoomIn</strong> - Scale up from 0 (entrance)
          </li>
          <li>
            <strong>zoomOut</strong> - Scale down to 0 (exit)
          </li>
        </ul>

        <h4>Rotation Effects</h4>
        <ul>
          <li>
            <strong>spin</strong> - Full 360° rotation
          </li>
        </ul>

        <h4>Fade Effects</h4>
        <ul>
          <li>
            <strong>fade</strong> - Alpha fade out and back
          </li>
          <li>
            <strong>flash</strong> - Quick alpha flash
          </li>
        </ul>

        <h4>Slide Effects</h4>
        <ul>
          <li>
            <strong>slideIn</strong> - Slide in from direction (up/down/left/right)
          </li>
          <li>
            <strong>slideOut</strong> - Slide out to direction
          </li>
        </ul>

        <h4>Flip Effects</h4>
        <ul>
          <li>
            <strong>flipIn</strong> - 3D flip rotation entrance
          </li>
          <li>
            <strong>flipOut</strong> - 3D flip rotation exit
          </li>
        </ul>

        <h3>Effect Configuration</h3>
        <p>Each effect accepts an optional configuration object. Common properties include:</p>
        <ul>
          <li>
            <strong>time</strong> - Duration in milliseconds (default varies by effect)
          </li>
          <li>
            <strong>magnitude</strong> - Intensity of the effect (e.g., shake distance)
          </li>
          <li>
            <strong>intensity</strong> - Scale factor for pulse/bounce effects
          </li>
          <li>
            <strong>direction</strong> - Direction for slide effects ('left' | 'right' | 'up' |
            'down')
          </li>
          <li>
            <strong>onComplete</strong> - Callback function when animation finishes
          </li>
        </ul>

        <CodeBlock language="tsx">
          {`// Short, intense shake
effect="shake"
effectConfig={{ magnitude: 10, time: 200 }}

// Slow, gentle pulse
effect="pulse"
effectConfig={{ intensity: 1.1, time: 800 }}

// Slide in from left
effect="slideIn"
effectConfig={{ direction: 'left', time: 400 }}`}
        </CodeBlock>

        <h3>Preventing Animation Overlap</h3>
        <p>
          When users click repeatedly before an effect completes, multiple tweens can overlap and
          cause position drift ("wandering" buttons). PhaserJSX automatically prevents this by
          stopping active effects before starting new ones. The <code>stopEffects()</code> function
          cancels running tweens and resets the object to its original position.
        </p>

        <p>
          This protection is built into <code>NineSliceButton</code> and other interactive
          components. If you're building custom interactive elements, use the{' '}
          <code>useGameObjectEffect</code> hook and call <code>stopEffects()</code> before applying
          new effects.
        </p>

        <h3>Custom Effects</h3>
        <p>
          You can create custom effects by defining an <code>EffectFn</code> function that receives
          a game object and configuration. The function should create Phaser tweens to animate the
          object's properties.
        </p>

        <CodeBlock language="tsx">
          {`import { useGameObjectEffect, type EffectFn } from '@phaserjsx/ui'

const myCustomEffect: EffectFn = (obj, config) => {
  const time = config.time ?? 500

  obj.scene.tweens.add({
    targets: obj,
    alpha: 0.3,
    duration: time / 2,
    yoyo: true,
    ease: 'Sine.easeInOut'
  })
}

function MyButton() {
  const ref = useRef(null)
  const { applyEffect } = useGameObjectEffect(ref)

  return (
    <View
      ref={ref}
      onTouch={() => applyEffect(myCustomEffect, { time: 600 })}
    >
      <Text text="Custom Effect" />
    </View>
  )
}`}
        </CodeBlock>

        <p>
          For complex effects that need to track original positions or handle multiple concurrent
          animations, study the built-in effect implementations in{' '}
          <code>packages/ui/src/effects/use-effect.ts</code>. The system uses a <code>WeakMap</code>
          -based position state manager to coordinate multiple effects safely.
        </p>
      </Section>

      <Section title="Spring Animations">
        <SectionDescription>
          Physics-based animations for smooth, natural motion using the <code>useSpring</code> hook.
        </SectionDescription>

        <h3>Why Springs?</h3>
        <p>
          Traditional easing functions (linear, ease-in-out, etc.) feel mechanical because they
          follow predetermined curves. Spring physics creates motion that feels alive and responsive
          by simulating real-world spring-damper systems. The result is animation that naturally
          overshoots, settles, and responds to rapid changes in a visually pleasing way.
        </p>

        <h3>Basic Usage</h3>
        <p>
          The <code>useSpring</code> hook returns an animated signal and a setter function. The
          signal's <code>.value</code> property contains the current animated value, which updates
          automatically as the spring physics runs.
        </p>

        <CodeBlock language="tsx">
          {`import { useSpring, useForceRedraw } from '@phaserjsx/ui'

function AnimatedBox() {
  const [rotation, setRotation] = useSpring(0, 'gentle')

  // Force re-render when signal changes
  useForceRedraw(20, rotation)

  return (
    <TransformOriginView
      width={100}
      height={100}
      rotation={rotation.value}
      onTouch={() => setRotation(prev => prev + Math.PI / 2)}
    >
      <View backgroundColor={0xff0000} />
    </TransformOriginView>
  )
}`}
        </CodeBlock>

        <p>
          See <a href="/components/transform-origin-view">TransformOriginView Spring Example</a> for
          live demonstrations of spring-based rotation and scaling.
        </p>

        <h3>The useForceRedraw Pattern</h3>
        <p>
          Spring animations use signals, which don't trigger React-style re-renders automatically.
          To update your component as the spring animates, call <code>useForceRedraw()</code> with
          the refresh interval (in milliseconds) and the signals to watch:
        </p>

        <CodeBlock language="tsx">
          {`const [x, setX] = useSpring(0, 'wobbly')
const [y, setY] = useSpring(0, 'wobbly')

// Re-render every 20ms (~50fps) when x or y change
useForceRedraw(20, x, y)`}
        </CodeBlock>

        <p>
          The interval determines animation smoothness vs. performance. 20ms (50fps) provides smooth
          motion for most use cases. Lower values (16ms/60fps) are smoother but more CPU-intensive.
          Higher values (30ms/33fps) reduce overhead but may appear choppy.
        </p>

        <h3>Spring Presets</h3>
        <p>
          PhaserJSX includes six spring presets, each configured for different animation
          personalities:
        </p>

        <ul>
          <li>
            <strong>gentle</strong> - Slow, smooth transitions (tension: 120, friction: 14)
          </li>
          <li>
            <strong>default</strong> - Balanced motion (tension: 170, friction: 26)
          </li>
          <li>
            <strong>wobbly</strong> - Bouncy, playful animation (tension: 180, friction: 12)
          </li>
          <li>
            <strong>stiff</strong> - Fast, snappy response (tension: 210, friction: 20)
          </li>
          <li>
            <strong>slow</strong> - Very smooth, deliberate motion (tension: 280, friction: 60)
          </li>
          <li>
            <strong>instant</strong> - Nearly instant transition (tension: 1000, friction: 100)
          </li>
        </ul>

        <CodeBlock language="tsx">
          {`// Different presets for different interactions
const [width, setWidth] = useSpring(100, 'wobbly')    // Fun, bouncy
const [opacity, setOpacity] = useSpring(1, 'gentle')  // Smooth fade
const [x, setX] = useSpring(0, 'stiff')               // Quick response`}
        </CodeBlock>

        <h3>Custom Spring Configuration</h3>
        <p>
          For fine-tuned control, pass a custom configuration object instead of a preset name. The
          three key parameters are:
        </p>

        <ul>
          <li>
            <strong>tension</strong> - Spring stiffness (higher = faster, snappier). Default: 170
          </li>
          <li>
            <strong>friction</strong> - Damping force (higher = less bounce). Default: 26
          </li>
          <li>
            <strong>mass</strong> - Object weight (higher = slower acceleration). Default: 1
          </li>
        </ul>

        <CodeBlock language="tsx">
          {`const [value, setValue] = useSpring(0, {
  tension: 200,  // Faster than default
  friction: 15,  // More bounce
  mass: 0.8      // Lighter, quicker response
})`}
        </CodeBlock>

        <p>
          Higher tension makes springs respond faster. Higher friction reduces oscillation (bounce).
          Higher mass makes objects feel heavier and slower to start/stop. Experiment with these
          values to match your desired feel.
        </p>

        <h3>Multiple Springs with useSprings</h3>
        <p>
          When animating multiple related values, <code>useSprings</code> manages them together with
          shared configuration:
        </p>

        <CodeBlock language="tsx">
          {`const [pos, setPos] = useSprings({ x: 0, y: 0 }, 'stiff')

// Update both values together
setPos({ x: 100, y: 200 })

// Access individual values
<View x={pos.x.value} y={pos.y.value} />`}
        </CodeBlock>

        <h3>Declarative vs Imperative Animations</h3>
        <p>
          Springs work declaratively with props, making them ideal for{' '}
          <code>TransformOriginView</code>. For imperative control with Phaser tweens, use{' '}
          <code>RefOriginView</code> instead. See the{' '}
          <a href="/components/ref-origin-view">RefOriginView documentation</a> for details on
          tween-based animations.
        </p>

        <h3>Spring Limitations</h3>
        <p>
          Springs are <strong>not safe</strong> for animating container dimensions when children use
          percentage-based sizing. The rapid updates can cause layout thrashing:
        </p>

        <CodeBlock language="tsx">
          {`// ✗ UNSAFE - NineSlice uses width="100%"
const [width, setWidth] = useSpring(200, 'wobbly')
<View width={width.value}>
  <NineSlice width="100%" />
</View>

// ✓ SAFE - Transform properties don't affect layout
const [scale, setScale] = useSpring(1, 'wobbly')
<TransformOriginView scale={scale.value}>
  <NineSlice width="100%" />
</TransformOriginView>

// ✓ SAFE - No percentage children
const [x, setX] = useSpring(0, 'wobbly')
<View x={x.value} width={50} height={50} />`}
        </CodeBlock>

        <p>
          Safe use cases include: position (x/y), transform properties (rotation, scale), alpha, and
          any prop on leaf nodes without children.
        </p>

        <h3>Performance Considerations</h3>
        <p>
          Springs run continuously during animation, updating 50-60 times per second. For optimal
          performance:
        </p>

        <ul>
          <li>
            Use conservative <code>useForceRedraw</code> intervals (20-30ms is usually sufficient)
          </li>
          <li>Limit the number of simultaneously animated objects (5-10 is reasonable)</li>
          <li>Prefer transform properties (rotation, scale) over dimension changes</li>
          <li>Consider the 'instant' preset for non-critical animations that don't need physics</li>
        </ul>
      </Section>

      <Section title="Combining Effects and Springs">
        <SectionDescription>
          Use effects and springs together for rich, layered interactions.
        </SectionDescription>

        <h3>Complementary Patterns</h3>
        <p>
          Effects and springs excel at different things. Effects provide instant, event-driven
          feedback (button clicks). Springs handle continuous, state-driven motion (drag
          interactions, value sliders). Combining them creates polished user experiences:
        </p>

        <CodeBlock language="tsx">
          {`function InteractiveCard() {
  const [x, setX] = useSpring(0, 'stiff')
  const ref = useRef(null)
  const { applyEffect } = useGameObjectEffect(ref)

  return (
    <View
      ref={ref}
      x={x.value}              // Spring-animated position
      onTouchMove={(data) => {
        setX(data.dx ?? 0)     // Smooth spring follow
      }}
      onTouch={() => {
        applyEffect(createPulseEffect, { intensity: 1.1 })  // Click feedback
      }}
    >
      <Text text="Drag or Click" />
    </View>
  )
}`}
        </CodeBlock>

        <h3>Effect + Spring Timing</h3>
        <p>
          When triggering effects on spring-animated objects, the effect system automatically stops
          springs from interfering. The <code>stopEffects()</code> call resets objects to their
          pre-animation state, allowing effects to play cleanly.
        </p>

        <p>
          For example, <code>NineSliceButton</code> uses this internally: the button can be
          mid-spring-animation when clicked, but <code>stopEffects()</code> ensures the jello/bounce
          effect plays from a stable starting point.
        </p>
      </Section>

      <Section title="Best Practices">
        <SectionDescription>Guidelines for effective animation usage.</SectionDescription>

        <h3>Choosing Between Effects and Springs</h3>
        <ul>
          <li>
            <strong>Use effects for:</strong> Button clicks, hover feedback, celebration moments,
            attention-grabbing UI changes, one-shot animations
          </li>
          <li>
            <strong>Use springs for:</strong> Draggable objects, value sliders, state transitions,
            menu animations, physics-based motion, continuous tracking
          </li>
        </ul>

        <h3>Animation Duration Guidelines</h3>
        <p>User interface animations should be fast to avoid feeling sluggish:</p>
        <ul>
          <li>
            <strong>Micro-interactions</strong> (button press): 150-300ms
          </li>
          <li>
            <strong>Standard feedback</strong> (clicks, hovers): 300-500ms
          </li>
          <li>
            <strong>Transitions</strong> (menu open, card flip): 400-600ms
          </li>
          <li>
            <strong>Emphasis</strong> (success celebration): 600-1000ms
          </li>
          <li>
            <strong>Ambient motion</strong> (breathe, float): 2000-4000ms
          </li>
        </ul>

        <h3>Accessibility</h3>
        <p>
          Keep animations subtle and purposeful. Excessive motion can be distracting or
          uncomfortable for some users. Consider providing options to reduce animation intensity in
          settings menus. The 'instant' spring preset can serve as a no-animation fallback.
        </p>

        <h3>Mobile Performance</h3>
        <p>
          On lower-end mobile devices, reduce simultaneous animations. Use{' '}
          <code>useForceRedraw(30, ...)</code> instead of 20ms to lower frame rate expectations.
          Prefer effects over springs for mobile when possible, as tweens are more efficient than
          continuous physics calculations.
        </p>
      </Section>
    </DocLayout>
  )
}
