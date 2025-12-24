/**
 * API Reference: Hooks Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Hooks API reference page
 */
export function HooksApiPage() {
  return (
    <DocLayout>
      <h1>API Reference: Hooks</h1>
      <DocDescription>
        Complete reference for PhaserJSX hooks. React-inspired hooks for state management, side
        effects, memoization, and Phaser integration.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          PhaserJSX provides a hooks API similar to React for building stateful, interactive
          components.
        </SectionDescription>

        <h3>Available Hooks</h3>
        <ul>
          <li>
            <strong>State:</strong> <code>useState</code>, <code>useRef</code>
          </li>
          <li>
            <strong>Effects:</strong> <code>useEffect</code>, <code>useLayoutEffect</code>
          </li>
          <li>
            <strong>Memoization:</strong> <code>useMemo</code>, <code>useCallback</code>
          </li>
          <li>
            <strong>Signals:</strong> <code>useForceRedraw</code>
          </li>
          <li>
            <strong>Layout:</strong> <code>useViewportSize</code>, <code>useLayoutSize</code>,{' '}
            <code>useLayoutRect</code>, <code>useWorldLayoutRect</code>,{' '}
            <code>useBackgroundGraphics</code>
          </li>
          <li>
            <strong>Context:</strong> <code>useTheme</code>, <code>useThemeTokens</code>,{' '}
            <code>useScene</code>, <code>useColors</code>, <code>useColorMode</code>,{' '}
            <code>useThemeSubscription</code>
          </li>
          <li>
            <strong>Textures:</strong> <code>useSVGTexture</code>, <code>useSVGTextures</code>
          </li>
          <li>
            <strong>Animation:</strong> <code>useSpring</code>, <code>useSprings</code>
          </li>
          <li>
            <strong>FX:</strong> <code>useFX</code>, <code>useShadow</code>, <code>useGlow</code>,{' '}
            <code>useBlur</code>
          </li>
          <li>
            <strong>Effects:</strong> <code>useGameObjectEffect</code>
          </li>
          <li>
            <strong>Icons:</strong> <code>useIconPreload</code>
          </li>
          <li>
            <strong>Manual Control:</strong> <code>useRedraw</code>
          </li>
        </ul>

        <h3>Rules of Hooks</h3>
        <p>Follow these rules when using hooks:</p>

        <ol>
          <li>
            <strong>Only call hooks at the top level</strong> - Don't call hooks inside loops,
            conditions, or nested functions
          </li>
          <li>
            <strong>Only call hooks from function components</strong> - Don't call hooks from
            regular JavaScript functions
          </li>
          <li>
            <strong>Hook order must be consistent</strong> - Always call hooks in the same order on
            every render
          </li>
        </ol>

        <CodeBlock language="tsx">
          {`// ✓ Correct
function MyComponent() {
  const [count, setCount] = useState(0)
  const scene = useScene()

  return <View>{/* ... */}</View>
}

// ✗ Wrong - hooks in condition
function MyComponent({ showCounter }) {
  if (showCounter) {
    const [count, setCount] = useState(0)  // ❌ Conditional hook
  }
  return <View>{/* ... */}</View>
}

// ✗ Wrong - hooks in loop
function MyComponent() {
  for (let i = 0; i < 3; i++) {
    const [value, setValue] = useState(i)  // ❌ Hook in loop
  }
  return <View>{/* ... */}</View>
}`}
        </CodeBlock>
      </Section>

      <Section title="State Hooks">
        <SectionDescription>Manage component state and mutable references.</SectionDescription>

        <h3>useState</h3>
        <p>Add local state to functional components. Returns current state and setter function.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void]`}
        </CodeBlock>

        <h4>Parameters</h4>
        <ul>
          <li>
            <code>initial</code> - Initial state value or initializer function
          </li>
        </ul>

        <h4>Returns</h4>
        <p>Tuple with:</p>
        <ul>
          <li>
            <code>[0]</code> - Current state value
          </li>
          <li>
            <code>[1]</code> - State setter function
          </li>
        </ul>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`// Simple state
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <View>
      <Text text={\`Count: \${count}\`} />
      <Button onClick={() => setCount(count + 1)}>
        <Text text="Increment" />
      </Button>
    </View>
  )
}

// Functional updates (recommended for state based on previous)
function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)

  return (
    <View>
      <Button onClick={increment}><Text text="+" /></Button>
      <Text text={\`\${count}\`} />
      <Button onClick={decrement}><Text text="-" /></Button>
    </View>
  )
}

// Object state
function UserForm() {
  const [user, setUser] = useState({ name: '', email: '' })

  const updateName = (name: string) => {
    setUser(prev => ({ ...prev, name }))
  }

  return <View>{/* form inputs */}</View>
}

// Lazy initialization (expensive computation)
function ExpensiveComponent() {
  const [data, setData] = useState(() => {
    return computeExpensiveValue()  // Only runs once
  })

  return <View>{/* ... */}</View>
}`}
        </CodeBlock>

        <h3>useRef</h3>
        <p>
          Create a mutable ref object that persists across renders. Changes don't trigger
          re-renders.
        </p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useRef<T>(initialValue: T): { current: T }`}
        </CodeBlock>

        <h4>Parameters</h4>
        <ul>
          <li>
            <code>initialValue</code> - Initial value for the ref
          </li>
        </ul>

        <h4>Returns</h4>
        <p>
          Ref object with <code>current</code> property
        </p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`// Store previous value
function ValueTracker({ value }: { value: number }) {
  const prevValue = useRef(value)

  useEffect(() => {
    prevValue.current = value
  })

  return (
    <Text text={\`Current: \${value}, Previous: \${prevValue.current}\`} />
  )
}

// Store timer ID
function Timer() {
  const [count, setCount] = useState(0)
  const intervalRef = useRef<number>()

  const start = () => {
    if (intervalRef.current) return
    intervalRef.current = window.setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
  }

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }

  useEffect(() => () => stop(), [])  // Cleanup on unmount

  return (
    <View>
      <Text text={\`\${count}\`} />
      <Button onClick={start}><Text text="Start" /></Button>
      <Button onClick={stop}><Text text="Stop" /></Button>
    </View>
  )
}

// Store GameObject reference
function GameObjectRef() {
  const containerRef = useRef<Phaser.GameObjects.Container>()

  return (
    <View
      ref={(node) => {
        containerRef.current = node as Phaser.GameObjects.Container
      }}
    >
      {/* Access containerRef.current to manipulate GameObject directly */}
    </View>
  )
}`}
        </CodeBlock>
      </Section>

      <Section title="Effect Hook">
        <SectionDescription>
          Perform side effects in functional components (data fetching, subscriptions, timers).
        </SectionDescription>

        <h3>useEffect</h3>
        <p>Run side effects after render. Optionally return cleanup function.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useEffect(
  effect: () => void | (() => void),
  deps?: readonly unknown[]
): void`}
        </CodeBlock>

        <h4>Parameters</h4>
        <ul>
          <li>
            <code>effect</code> - Function to run after render. Can return cleanup function
          </li>
          <li>
            <code>deps</code> - Optional dependency array. Effect runs when deps change
          </li>
        </ul>

        <h4>Dependency Array Behavior</h4>
        <ul>
          <li>
            <strong>Omitted</strong> - Effect runs after every render
          </li>
          <li>
            <strong>
              Empty <code>[]</code>
            </strong>{' '}
            - Effect runs once on mount
          </li>
          <li>
            <strong>
              With values <code>[a, b]</code>
            </strong>{' '}
            - Effect runs when <code>a</code> or <code>b</code> change
          </li>
        </ul>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`// Run once on mount
function ComponentDidMount() {
  useEffect(() => {
    console.log('Component mounted')

    return () => {
      console.log('Component unmounted')
    }
  }, [])

  return <View />
}

// Subscribe to external data
function DataSubscriber() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const subscription = dataSource.subscribe(setData)

    return () => subscription.unsubscribe()
  }, [])  // Empty deps = subscribe once

  return <Text text={data || 'Loading...'} />
}

// Run when specific values change
function DependentEffect({ userId }: { userId: number }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data)
    })

    return () => {
      cancelled = true  // Cancel pending fetch
    }
  }, [userId])  // Re-fetch when userId changes

  return <Text text={user?.name || 'Loading...'} />
}

// Phaser scene events
function SceneEventListener() {
  const scene = useScene()
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const onPause = () => setIsPaused(true)
    const onResume = () => setIsPaused(false)

    scene.events.on('pause', onPause)
    scene.events.on('resume', onResume)

    return () => {
      scene.events.off('pause', onPause)
      scene.events.off('resume', onResume)
    }
  }, [scene])

  return <Text text={isPaused ? 'Paused' : 'Running'} />
}`}
        </CodeBlock>

        <h3>useLayoutEffect</h3>
        <p>
          Runs after layout calculations complete. Use this when you need accurate sizes from
          <code>useLayoutRect</code> or <code>useLayoutSize</code>.
        </p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useLayoutEffect(
  effect: () => void | (() => void),
  deps?: readonly unknown[]
): void`}
        </CodeBlock>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function MeasureCard() {
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const rect = useLayoutRect(ref)

  useLayoutEffect(() => {
    if (rect) {
      console.log('Measured:', rect.width, rect.height)
    }
  }, [rect])

  return (
    <View ref={ref} width={300} padding={16} backgroundColor={0x2a2a2a}>
      <Text text="Measured after layout" />
    </View>
  )
}`}
        </CodeBlock>
      </Section>

      <Section title="Memoization Hooks">
        <SectionDescription>
          Optimize performance by caching computed values and callbacks.
        </SectionDescription>

        <h3>useMemo</h3>
        <p>Memoize expensive computations. Only recomputes when dependencies change.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useMemo<T>(fn: () => T, deps: readonly unknown[]): T`}
        </CodeBlock>

        <h4>Parameters</h4>
        <ul>
          <li>
            <code>fn</code> - Function that computes the value
          </li>
          <li>
            <code>deps</code> - Dependency array
          </li>
        </ul>

        <h4>Returns</h4>
        <p>Memoized value</p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`// Expensive calculation
function DataGrid({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    return items.slice().sort((a, b) => a.score - b.score)
  }, [items])

  return (
    <View>
      {sortedItems.map(item => (
        <Text key={item.id} text={item.name} />
      ))}
    </View>
  )
}

// Memoize JSX for props
function IconButton({ icon }: { icon: string }) {
  const iconElement = useMemo(
    () => <Icon name={icon} size={24} key="btn-icon" />,
    [icon]
  )

  return <Button prefix={iconElement}><Text text="Click" /></Button>
}

// Memoize complex object
function Config({ width, height }: { width: number; height: number }) {
  const config = useMemo(
    () => ({
      viewport: { width, height },
      aspectRatio: width / height,
      layout: width > height ? 'landscape' : 'portrait'
    }),
    [width, height]
  )

  return <View {...config} />
}`}
        </CodeBlock>

        <h3>useCallback</h3>
        <p>
          Memoize callback functions. Returns same function reference until dependencies change.
        </p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useCallback<T extends (...args: any[]) => any>(
  fn: T,
  deps: readonly unknown[]
): T`}
        </CodeBlock>

        <h4>Parameters</h4>
        <ul>
          <li>
            <code>fn</code> - Callback function to memoize
          </li>
          <li>
            <code>deps</code> - Dependency array
          </li>
        </ul>

        <h4>Returns</h4>
        <p>Memoized callback function</p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`// Memoize event handler
function Form() {
  const [name, setName] = useState('')

  const handleSubmit = useCallback(() => {
    console.log('Submitting:', name)
    // Submit logic
  }, [name])

  return <Button onClick={handleSubmit}><Text text="Submit" /></Button>
}

// Avoid recreating callbacks
function ParentComponent() {
  const [count, setCount] = useState(0)

  // ✓ Stable reference
  const increment = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])

  return <ChildComponent onIncrement={increment} />
}

// Callback with dependencies
function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = useCallback(async () => {
    const data = await fetchResults(query)
    setResults(data)
  }, [query])  // Recreate when query changes

  return (
    <View>
      <Input value={query} onChange={setQuery} />
      <Button onClick={handleSearch}><Text text="Search" /></Button>
    </View>
  )
}`}
        </CodeBlock>
      </Section>

      <Section title="Layout & Measurement Hooks">
        <SectionDescription>
          Read viewport and layout measurements for responsive layouts and positioning.
        </SectionDescription>

        <h3>useViewportSize</h3>
        <p>Returns the current scene viewport dimensions.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useViewportSize(): { width: number; height: number }`}
        </CodeBlock>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function ResponsiveBanner() {
  const { width } = useViewportSize()
  const isNarrow = width < 600

  return (
    <View padding={16} backgroundColor={0x1f2937}>
      <Text text={isNarrow ? 'Compact layout' : 'Wide layout'} />
    </View>
  )
}`}
        </CodeBlock>

        <h3>useLayoutSize</h3>
        <p>Reads computed layout width/height from a container ref.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useLayoutSize(ref: { current: Phaser.GameObjects.Container | null }): LayoutSize | undefined`}
        </CodeBlock>

        <h3>useLayoutRect</h3>
        <p>Returns local position plus computed layout dimensions.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useLayoutRect(
  ref: { current: Phaser.GameObjects.Container | null }
): { x: number; y: number; width: number; height: number } | undefined`}
        </CodeBlock>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function LayoutDebug() {
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const rect = useLayoutRect(ref)

  return (
    <View ref={ref} width={240} height={120} backgroundColor={0x333333}>
      <Text text={rect ? \`w:\${rect.width} h:\${rect.height}\` : 'Measuring...'} />
    </View>
  )
}`}
        </CodeBlock>

        <h3>useWorldLayoutRect</h3>
        <p>Returns world-space bounds (includes parent transforms).</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useWorldLayoutRect(
  ref: { current: Phaser.GameObjects.Container | null }
): { x: number; y: number; width: number; height: number } | undefined`}
        </CodeBlock>

        <h3>useBackgroundGraphics</h3>
        <p>Access the background Graphics object for custom animation or tweaks.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useBackgroundGraphics(
  ref: { current: Phaser.GameObjects.Container | null }
): Phaser.GameObjects.Graphics | undefined`}
        </CodeBlock>
      </Section>

      <Section title="Signal Hook">
        <SectionDescription>
          Subscribe to external signals and force component re-renders.
        </SectionDescription>

        <h3>useForceRedraw</h3>
        <p>
          Force component to re-render when signals change. Useful for integrating external state
          management.
        </p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useForceRedraw(...signals: Signal<unknown>[]): void
function useForceRedraw(throttleMs: number, ...signals: Signal<unknown>[]): void`}
        </CodeBlock>

        <h4>Parameters</h4>
        <ul>
          <li>
            <code>throttleMs</code> - Optional throttle time in milliseconds
          </li>
          <li>
            <code>signals</code> - Array of signals to watch
          </li>
        </ul>

        <h4>Returns</h4>
        <p>void</p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`import { signal } from '@preact/signals-core'

// Create signals
const playerScore = signal(0)
const playerHealth = signal(100)

// Subscribe to single signal
function ScoreDisplay() {
  useForceRedraw(playerScore)

  return <Text text={\`Score: \${playerScore.value}\`} />
}

// Subscribe to multiple signals
function PlayerStats() {
  useForceRedraw(playerScore, playerHealth)

  return (
    <View>
      <Text text={\`Score: \${playerScore.value}\`} />
      <Text text={\`Health: \${playerHealth.value}\`} />
    </View>
  )
}

// Throttle updates for performance
function AnimatedValue() {
  const animationSignal = signal(0)

  // Update at most every 33ms (~30 FPS)
  useForceRedraw(33, animationSignal)

  return <View x={animationSignal.value} />
}

// Use with game state
const gameState = signal({ score: 0, level: 1, lives: 3 })

function GameUI() {
  // Update at most every 16ms (~60 FPS)
  useForceRedraw(16, gameState)

  const state = gameState.value

  return (
    <View>
      <Text text={\`Level \${state.level}\`} />
      <Text text={\`Score: \${state.score}\`} />
      <Text text={\`Lives: \${state.lives}\`} />
    </View>
  )
}`}
        </CodeBlock>

        <div className="callout callout-warning">
          <strong>Performance Warning:</strong> Use throttling to avoid excessive re-renders.
          Unthrottled signals updating at 60 FPS can impact performance. Start with 33ms (30 FPS)
          and adjust as needed.
        </div>
      </Section>

      <Section title="Context Hooks">
        <SectionDescription>
          Access context values like theme, Phaser scene, and design tokens.
        </SectionDescription>

        <h3>useTheme</h3>
        <p>Access current theme context passed through the VDOM tree.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useTheme(): PartialTheme | undefined`}
        </CodeBlock>

        <h4>Returns</h4>
        <p>
          Current theme or <code>undefined</code> if no theme is set
        </p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function ThemedButton() {
  const theme = useTheme()

  const backgroundColor = theme?.Button?.backgroundColor ?? 0x3498db

  return (
    <View backgroundColor={backgroundColor}>
      <Text text="Themed Button" />
    </View>
  )
}

// With nested theme
function CustomCard() {
  const theme = useTheme()

  return (
    <View theme={{ Text: { color: '#ffffff' } }}>
      <Text text="White text" />
      {/* Children inherit nested theme */}
    </View>
  )
}`}
        </CodeBlock>

        <h3>useThemeTokens</h3>
        <p>
          Access complete design token system with colors, text styles, spacing, sizes, and radius.
        </p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useThemeTokens(): DesignTokens | undefined`}
        </CodeBlock>

        <h4>Returns</h4>
        <p>
          Design tokens with <code>colors</code>, <code>textStyles</code>, <code>spacing</code>,{' '}
          <code>sizes</code>, <code>radius</code>
        </p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function StyledCard() {
  const tokens = useThemeTokens()

  if (!tokens) return null

  return (
    <View
      backgroundColor={tokens.colors.surface.DEFAULT}
      padding={tokens.spacing.lg}
      cornerRadius={tokens.radius.md}
    >
      <Text text="Title" style={tokens.textStyles.title} />
      <Text text="Body text" style={tokens.textStyles.DEFAULT} />
    </View>
  )
}

// Access color palette
function ColorPalette() {
  const tokens = useThemeTokens()

  return (
    <View direction="row" gap={tokens?.spacing.sm}>
      <View width={50} height={50} backgroundColor={tokens?.colors.primary.DEFAULT} />
      <View width={50} height={50} backgroundColor={tokens?.colors.secondary.DEFAULT} />
      <View width={50} height={50} backgroundColor={tokens?.colors.success.DEFAULT} />
    </View>
  )
}`}
        </CodeBlock>

        <h3>useColors</h3>
        <p>
          Access color tokens from the current theme.
          <strong>Deprecated:</strong> prefer <code>useThemeTokens()</code>.
        </p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useColors(): ColorTokens | undefined`}
        </CodeBlock>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function LegacyColorBlock() {
  const colors = useColors()
  return <View backgroundColor={colors?.primary.DEFAULT ?? 0x4a9eff} />
}`}
        </CodeBlock>

        <h3>useColorMode</h3>
        <p>Manage light/dark mode via the theme registry.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useColorMode(): {
  colorMode: 'light' | 'dark'
  setColorMode: (mode: 'light' | 'dark') => void
  toggleColorMode: () => void
}`}
        </CodeBlock>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button onClick={toggleColorMode}>
      <Text text={colorMode === 'light' ? 'Dark Mode' : 'Light Mode'} />
    </Button>
  )
}`}
        </CodeBlock>

        <h3>useThemeSubscription</h3>
        <p>Subscribe to theme changes without reading tokens directly.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">{`function useThemeSubscription(): void`}</CodeBlock>

        <h3>useScene</h3>
        <p>Access the current Phaser scene from component context.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">{`function useScene(): Phaser.Scene`}</CodeBlock>

        <h4>Returns</h4>
        <p>Current Phaser scene</p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function SceneInfo() {
  const scene = useScene()

  return (
    <View>
      <Text text={scene.scene.key} />
      <Text text={\`FPS: \${Math.round(scene.game.loop.actualFps)}\`} />
    </View>
  )
}

// Create Phaser objects
function ParticleEmitter() {
  const scene = useScene()

  useEffect(() => {
    const particles = scene.add.particles(400, 300, 'particle', {
      speed: 100,
      lifespan: 1000,
      blendMode: 'ADD'
    })

    return () => particles.destroy()
  }, [scene])

  return null
}

// Scene events
function GamePauseHandler() {
  const scene = useScene()
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const onPause = () => setIsPaused(true)
    const onResume = () => setIsPaused(false)

    scene.events.on('pause', onPause)
    scene.events.on('resume', onResume)

    return () => {
      scene.events.off('pause', onPause)
      scene.events.off('resume', onResume)
    }
  }, [scene])

  return isPaused ? <View>Paused</View> : null
}`}
        </CodeBlock>
      </Section>

      <Section title="Texture Hooks">
        <SectionDescription>Load and manage SVG textures dynamically.</SectionDescription>

        <h3>useSVGTexture</h3>
        <p>Load a single SVG as a Phaser texture. Automatically handles cleanup.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useSVGTexture(
  key: string,
  svg: string,
  width?: number,
  height?: number
): boolean`}
        </CodeBlock>

        <h4>Parameters</h4>
        <ul>
          <li>
            <code>key</code> - Unique texture key
          </li>
          <li>
            <code>svg</code> - SVG string or URL
          </li>
          <li>
            <code>width</code> - Texture width in pixels (default: 32)
          </li>
          <li>
            <code>height</code> - Texture height in pixels (default: 32)
          </li>
        </ul>

        <h4>Returns</h4>
        <p>
          <code>true</code> when texture is loaded and ready
        </p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`import customIconSvg from './assets/custom-icon.svg?raw'

function CustomIcon() {
  const ready = useSVGTexture('custom-icon', customIconSvg, 64, 64)

  if (!ready) return <Text text="Loading..." />

  return <Image texture="custom-icon" width={64} height={64} />
}

// Inline SVG
function StarIcon() {
  const svg = \`
    <svg viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  \`

  const ready = useSVGTexture('star-icon', svg, 32, 32)

  return ready ? <Image texture="star-icon" /> : null
}`}
        </CodeBlock>

        <h3>useSVGTextures</h3>
        <p>
          Load multiple SVG textures at once. Returns <code>true</code> when all are ready.
        </p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`interface SVGTextureConfig {
  key: string
  svg: string
  width?: number
  height?: number
}

function useSVGTextures(configs: SVGTextureConfig[]): boolean`}
        </CodeBlock>

        <h4>Parameters</h4>
        <ul>
          <li>
            <code>configs</code> - Array of texture configurations
          </li>
        </ul>

        <h4>Returns</h4>
        <p>
          <code>true</code> when all textures are loaded
        </p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function IconSet() {
  const ready = useSVGTextures([
    { key: 'icon-play', svg: playIconSvg, width: 32, height: 32 },
    { key: 'icon-pause', svg: pauseIconSvg, width: 32, height: 32 },
    { key: 'icon-stop', svg: stopIconSvg, width: 32, height: 32 }
  ])

  if (!ready) return <Text text="Loading icons..." />

  return (
    <View direction="row" gap={10}>
      <Image texture="icon-play" />
      <Image texture="icon-pause" />
      <Image texture="icon-stop" />
    </View>
  )
}`}
        </CodeBlock>
      </Section>

      <Section title="Animation Hooks">
        <SectionDescription>Physics-based spring animations powered by signals.</SectionDescription>

        <h3>useSpring</h3>
        <p>Create a single animated signal and update it with a spring.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useSpring(
  initialValue: number,
  config?: SpringConfig | keyof typeof SPRING_PRESETS,
  onComplete?: () => void
): [AnimatedSignal, (target: number | ((prev: number) => number)) => void]`}
        </CodeBlock>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function SpringScale() {
  const [scale, setScale] = useSpring(1, 'wobbly')

  return (
    <View
      scale={scale}
      onTouch={() => setScale((prev) => (prev === 1 ? 1.2 : 1))}
    >
      <Text text="Boing" />
    </View>
  )
}`}
        </CodeBlock>

        <h3>useSprings</h3>
        <p>Create multiple animated signals with a shared configuration.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useSprings<T extends Record<string, number>>(
  initialValues: T,
  config?: SpringConfig | keyof typeof SPRING_PRESETS
): [
  { [K in keyof T]: AnimatedSignal },
  (values: Partial<{ [K in keyof T]: number | ((prev: number) => number) }>) => void
]`}
        </CodeBlock>
      </Section>

      <Section title="FX Hooks">
        <SectionDescription>
          Apply Phaser PostFX/PreFX pipelines and convenience effects.
        </SectionDescription>

        <h3>useFX</h3>
        <p>Attach FX to a GameObject and clean them up on unmount.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useFX<T extends FXCapableGameObject>(ref: { current: T | null }): {
  applyFX: <TConfig extends FXConfig>(
    fxCreator: FXCreatorFn<TConfig>,
    config: TConfig,
    type?: FXType
  ) => void
  clearFX: () => void
}`}
        </CodeBlock>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function GlowOnHover() {
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyFX, clearFX } = useFX(ref)

  return (
    <View
      ref={ref}
      onHover={() => applyFX(createGlowFX, { color: 0x4a9eff, outerStrength: 2 })}
      onHoverOut={clearFX}
    >
      <Text text="Hover me" />
    </View>
  )
}`}
        </CodeBlock>

        <h3>useShadow / useGlow / useBlur</h3>
        <p>Convenience hooks that apply FX automatically and update on config changes.</p>
      </Section>

      <Section title="Effects Hook">
        <SectionDescription>
          Trigger built-in effect animations on any GameObject.
        </SectionDescription>

        <h3>useGameObjectEffect</h3>
        <p>Apply and clean up tween-based effects.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useGameObjectEffect(
  ref: { current: Phaser.GameObjects.Container | null }
): { applyEffect: (effect: EffectFn, config?: EffectConfig) => void; stopEffects: () => void }`}
        </CodeBlock>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`import { createPulseEffect } from '@number10/phaserjsx/effects'

function PulseCard() {
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect } = useGameObjectEffect(ref)

  return (
    <View
      ref={ref}
      onTouch={() => applyEffect(createPulseEffect, { intensity: 1.1, time: 250 })}
    >
      <Text text="Pulse on tap" />
    </View>
  )
}`}
        </CodeBlock>
      </Section>

      <Section title="Icon Hook">
        <SectionDescription>Preload icon assets before rendering.</SectionDescription>

        <h3>useIconPreload</h3>
        <p>Loads an icon via your loader and returns readiness state.</p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">
          {`function useIconPreload<T extends string>(
  type: T,
  loader: IconLoaderFn<T>
): boolean`}
        </CodeBlock>
      </Section>

      <Section title="Manual Control Hook">
        <SectionDescription>Manually trigger component re-renders.</SectionDescription>

        <h3>useRedraw</h3>
        <p>
          Returns a function to manually trigger component re-render. Use sparingly - prefer state
          updates.
        </p>

        <h4>Signature</h4>
        <CodeBlock language="typescript">{`function useRedraw(): () => void`}</CodeBlock>

        <h4>Returns</h4>
        <p>Function that triggers re-render when called</p>

        <h4>Examples</h4>
        <CodeBlock language="tsx">
          {`function ManualRedraw() {
  const redraw = useRedraw()

  return (
    <View>
      <Text text={\`Render time: \${Date.now()}\`} />
      <Button onClick={redraw}>
        <Text text="Force Update" />
      </Button>
    </View>
  )
}

// Integrate with external state (not recommended - use signals instead)
function ExternalState() {
  const redraw = useRedraw()

  useEffect(() => {
    const unsubscribe = externalStore.subscribe(() => {
      redraw()  // Force re-render when external state changes
    })

    return unsubscribe
  }, [redraw])

  return <Text text={externalStore.getValue()} />
}`}
        </CodeBlock>

        <div className="callout callout-info">
          <strong>Recommendation:</strong> Prefer <code>useState</code>, <code>useForceRedraw</code>{' '}
          with signals, or context for state management. Only use <code>useRedraw</code> when
          integrating with legacy systems.
        </div>
      </Section>

      <Section title="Best Practices">
        <SectionDescription>Guidelines for effective hook usage.</SectionDescription>

        <h3>State Management</h3>
        <ul>
          <li>
            Use <code>useState</code> for component-local state
          </li>
          <li>
            Use <code>useForceRedraw</code> with signals for shared/global state
          </li>
          <li>Use functional updates when state depends on previous value</li>
          <li>Keep state minimal - derive values instead of storing</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>
            Memoize callbacks passed as props with <code>useCallback</code>
          </li>
          <li>
            Memoize expensive computations with <code>useMemo</code>
          </li>
          <li>
            Memoize JSX elements passed as props with <code>useMemo</code>
          </li>
          <li>
            Throttle <code>useForceRedraw</code> for high-frequency signals
          </li>
          <li>Keep dependency arrays accurate - avoid empty deps when not appropriate</li>
        </ul>

        <h3>Effects</h3>
        <ul>
          <li>Always return cleanup functions for subscriptions/timers</li>
          <li>Use empty dependency array for mount-only effects</li>
          <li>Include all used variables in dependency array</li>
          <li>Avoid reading latest state in effects - use refs if needed</li>
        </ul>

        <h3>Common Patterns</h3>
        <CodeBlock language="tsx">
          {`// ✓ Toggle pattern
const [isOpen, setIsOpen] = useState(false)
const toggle = useCallback(() => setIsOpen(prev => !prev), [])

// ✓ Async data fetching
useEffect(() => {
  let cancelled = false
  fetchData().then(data => {
    if (!cancelled) setData(data)
  })
  return () => { cancelled = true }
}, [])

// ✓ Stable callback with latest state
const latestStateRef = useRef(state)
latestStateRef.current = state

const stableCallback = useCallback(() => {
  console.log(latestStateRef.current)
}, [])

// ✓ Derived state (no useState needed)
function Derived({ items }) {
  const count = items.length
  const isEmpty = count === 0

  return <Text text={\`\${count} items\${isEmpty ? ' (empty)' : ''}\`} />
}`}
        </CodeBlock>
      </Section>
    </DocLayout>
  )
}
