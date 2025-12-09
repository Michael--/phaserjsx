/**
 * Performance Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Performance optimization guide
 */
export function PerformancePage() {
  return (
    <DocLayout>
      <h1>Performance Optimization</h1>
      <DocDescription>
        Optimize your PhaserJSX applications for smooth 60 FPS gameplay. Learn memoization,
        rendering strategies, and best practices to avoid common performance pitfalls.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          PhaserJSX uses a Virtual DOM (VDOM) reconciliation system similar to React. Understanding
          when and why re-renders occur is key to building performant UIs.
        </SectionDescription>

        <h3>Performance Fundamentals</h3>
        <p>Three main factors affect UI performance:</p>

        <ul>
          <li>
            <strong>Component Re-renders</strong> - Unnecessary re-renders waste CPU cycles
          </li>
          <li>
            <strong>Layout Calculations</strong> - Complex nested layouts take time to compute
          </li>
          <li>
            <strong>Texture Memory</strong> - Large textures and icons consume GPU memory
          </li>
        </ul>

        <p>
          PhaserJSX includes <strong>automatic memoization</strong> (like React.memo) by default.
          Components only re-render when props change. However,{' '}
          <strong>inline object creation</strong> creates new references every render, defeating
          memoization.
        </p>

        <h3>Development Warnings</h3>
        <p>PhaserJSX warns about performance issues during development:</p>

        <CodeBlock language="text">
          {`[PhaserJSX] Unnecessary remount: <Dialog> remounted because key changed.
Solutions:
  • Memoize JSX: const icon = useMemo(() => <Icon />, [])
  • Memoize callbacks: const handleClick = useCallback(() => handler(), [])
  • Add stable key props: key="my-component"`}
        </CodeBlock>

        <p>
          These warnings identify expensive remounts. Fix them immediately to avoid technical debt.
        </p>
      </Section>

      <Section title="Memoization">
        <SectionDescription>
          Prevent unnecessary re-renders using <code>useMemo</code> and <code>useCallback</code>.
        </SectionDescription>

        <h3>The Problem: Inline Creation</h3>
        <p>
          Creating objects inline generates new references every render, causing components to
          remount instead of update:
        </p>

        <CodeBlock language="tsx">
          {`// ❌ Bad - new objects every render
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog
      prefix={<Icon name="info" />}           // New JSX every render
      onClose={() => setIsOpen(false)}        // New function every render
      actions={[{ label: 'OK' }]}             // New array every render
    />
  )
}

// Result: Dialog remounts completely on every parent render
// State resets, animations restart, layout recalculates`}
        </CodeBlock>

        <h3>Solution: Memoize References</h3>
        <p>Use hooks to create stable references:</p>

        <CodeBlock language="tsx">
          {`// ✅ Good - stable references
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  // Memoize JSX - returns same reference
  const icon = useMemo(
    () => <Icon name="info" key="icon" />,
    []
  )

  // Memoize callback - returns same function
  const handleClose = useCallback(
    () => setIsOpen(false),
    []
  )

  // Memoize complex objects
  const actions = useMemo(
    () => [{ label: 'OK', onClick: handleClose }],
    [handleClose]
  )

  return (
    <Dialog
      key="my-dialog"
      prefix={icon}
      onClose={handleClose}
      actions={actions}
    />
  )
}

// Result: Dialog updates props, doesn't remount
// State preserved, smooth transitions, minimal work`}
        </CodeBlock>

        <h3>useMemo for JSX</h3>
        <p>Memoize JSX elements passed as props:</p>

        <CodeBlock language="tsx">
          {`// Memoize static content
const header = useMemo(
  () => (
    <View key="header">
      <Icon name="star" size={32} />
      <Text text="Featured" />
    </View>
  ),
  []  // Empty deps = never recalculates
)

// Memoize dynamic content with dependencies
const userBadge = useMemo(
  () => (
    <View key="badge">
      <Text text={userName} />
      <Text text={\`Level \${level}\`} />
    </View>
  ),
  [userName, level]  // Recalculates only when these change
)

<Card header={header} badge={userBadge} />`}
        </CodeBlock>

        <h3>useCallback for Functions</h3>
        <p>Memoize event handlers and callbacks:</p>

        <CodeBlock language="tsx">
          {`function GameUI() {
  const [score, setScore] = useState(0)

  // ✓ Memoize - stable reference
  const handleScoreChange = useCallback((points: number) => {
    setScore(prev => prev + points)
  }, [])

  // ✓ Include dependencies
  const handleDoubleScore = useCallback(() => {
    setScore(score * 2)
  }, [score])  // Recreates when score changes

  return (
    <ScorePanel
      onScore={handleScoreChange}
      onDouble={handleDoubleScore}
    />
  )
}`}
        </CodeBlock>

        <h3>Dependency Arrays</h3>
        <p>Rules for dependency arrays:</p>

        <ul>
          <li>
            <strong>
              Empty <code>[]</code>
            </strong>{' '}
            - Never recalculates (best performance)
          </li>
          <li>
            <strong>
              With deps <code>[value]</code>
            </strong>{' '}
            - Recalculates when value changes
          </li>
          <li>
            <strong>Include all used variables</strong> - Prevents stale closure bugs
          </li>
          <li>
            <strong>Omit functions from deps</strong> - Use stable memoized functions instead
          </li>
        </ul>

        <CodeBlock language="tsx">
          {`// ✓ Correct empty deps
const icon = useMemo(() => <Icon name="star" />, [])

// ✓ Correct with deps
const label = useMemo(
  () => <Text text={\`Score: \${score}\`} />,
  [score]
)

// ✗ Avoid omitting deps
const broken = useMemo(
  () => <Text text={\`Score: \${score}\`} />,
  []  // ❌ Missing score - shows stale value
)

// ✓ Use setState updater to avoid deps
const handleClick = useCallback(() => {
  setScore(prev => prev + 1)  // No dependency on score
}, [])`}
        </CodeBlock>

        <h3>Automatic Memoization</h3>
        <p>
          Components are automatically memoized by default (shallow prop comparison). This usually
          works well:
        </p>

        <CodeBlock language="tsx">
          {`function ExpensiveCard({ title, score }: CardProps) {
  // Automatically skips re-render if title and score unchanged
  return (
    <View>
      <Text text={title} />
      <Text text={\`Score: \${score}\`} />
    </View>
  )
}

// Only re-renders when props actually change
<ExpensiveCard title="Player 1" score={score} />`}
        </CodeBlock>

        <p>To disable automatic memoization for components with side effects:</p>

        <CodeBlock language="tsx">
          {`import { noMemo } from '@number10/phaserjsx'

function AlwaysUpdate({ value }: Props) {
  console.log('Rendering:', value)  // Side effect
  return <Text text={value} />
}

// Disable memoization - always re-renders
noMemo(<AlwaysUpdate value={counter} />)`}
        </CodeBlock>
      </Section>

      <Section title="Component Keys">
        <SectionDescription>
          Use <code>key</code> props to help the VDOM identify and reuse components correctly.
        </SectionDescription>

        <h3>Why Keys Matter</h3>
        <p>
          The VDOM uses keys to match elements across renders. Without keys, it falls back to
          position-based matching, which causes remounts:
        </p>

        <CodeBlock language="tsx">
          {`// ❌ Without keys - VDOM confused by position changes
{items.map(item => (
  <Card title={item.name} />  // No key!
))}

// ✅ With keys - VDOM tracks each card by ID
{items.map(item => (
  <Card key={item.id} title={item.name} />
))}`}
        </CodeBlock>

        <h3>Lists and Dynamic Content</h3>
        <p>Always use unique, stable keys for lists:</p>

        <CodeBlock language="tsx">
          {`// ✓ Good - stable unique IDs
{players.map(player => (
  <PlayerCard key={player.id} {...player} />
))}

// ✗ Bad - array index (unstable on reorder)
{players.map((player, i) => (
  <PlayerCard key={i} {...player} />
))}

// ✗ Bad - non-unique keys
{players.map(player => (
  <PlayerCard key={player.team} {...player} />
))}`}
        </CodeBlock>

        <h3>Conditional Rendering</h3>
        <p>Add keys to conditionally rendered elements:</p>

        <CodeBlock language="tsx">
          {`// ✓ Keys help VDOM identify elements
{showSuccess && (
  <Text text="Success!" key="success-msg" />
)}

{showError && (
  <Text text="Error!" key="error-msg" />
)}

// ✓ Keys for modal states
<Dialog key="confirm-dialog" isOpen={isConfirming} />
<Dialog key="delete-dialog" isOpen={isDeleting} />`}
        </CodeBlock>

        <h3>Component Instances</h3>
        <p>Use keys to differentiate multiple instances of the same component:</p>

        <CodeBlock language="tsx">
          {`// ✓ Each dialog has unique key
<View>
  <Dialog key="settings-dialog" {...settingsProps} />
  <Dialog key="profile-dialog" {...profileProps} />
  <Modal key="game-over-modal" {...gameOverProps} />
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Rendering Strategies">
        <SectionDescription>
          Choose the right approach for hiding/showing UI elements.
        </SectionDescription>

        <h3>Three Approaches</h3>
        <p>
          PhaserJSX offers three ways to hide content, each with different performance trade-offs:
        </p>

        <h4>1. visible={'{false}'} - Hide Without Unmounting</h4>
        <p>Keeps component in VDOM, just makes it invisible:</p>

        <CodeBlock language="tsx">
          {`<View visible={isVisible}>
  <Text text="Toggles visibility" />
</View>

// Component stays mounted
// State preserved
// Layout space preserved
// Fast toggle (no mount/unmount)`}
        </CodeBlock>

        <p>
          <strong>Use when:</strong> Toggling frequently, state must persist, layout stability
          important
        </p>

        <h4>2. visible="none" - Hide and Remove from Layout</h4>
        <p>
          Removes from layout calculations (like CSS <code>display: none</code>):
        </p>

        <CodeBlock language="tsx">
          {`<View visible={isVisible ? true : 'none'}>
  <Text text="Removed from layout" />
</View>

// Component stays mounted
// State preserved
// Layout space reclaimed
// Parent reflows when hidden`}
        </CodeBlock>

        <p>
          <strong>Use when:</strong> Dynamic layout reflow needed, component shows/hides
          occasionally
        </p>

        <h4>3. Conditional Rendering - Full Unmount</h4>
        <p>Completely removes from VDOM:</p>

        <CodeBlock language="tsx">
          {`{isVisible && (
  <View>
    <Text text="Fully mounted/unmounted" />
  </View>
)}

// Component unmounted when false
// State resets on remount
// Resources freed completely
// Expensive to toggle`}
        </CodeBlock>

        <p>
          <strong>Use when:</strong> Component won't show again soon, need to reset state, free
          resources
        </p>

        <h3>Performance Comparison</h3>

        <table className="comparison-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Toggle Cost</th>
              <th>State</th>
              <th>Layout Impact</th>
              <th>Memory</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>visible={'{false}'}</code>
              </td>
              <td>Very Fast</td>
              <td>Preserved</td>
              <td>Space reserved</td>
              <td>Stays allocated</td>
            </tr>
            <tr>
              <td>
                <code>visible="none"</code>
              </td>
              <td>Fast</td>
              <td>Preserved</td>
              <td>Space reclaimed</td>
              <td>Stays allocated</td>
            </tr>
            <tr>
              <td>
                <code>{'{condition && <View />}'}</code>
              </td>
              <td>Slow</td>
              <td>Resets</td>
              <td>Space reclaimed</td>
              <td>Fully freed</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Modal Performance</h3>
        <CodeBlock language="tsx">
          {`// ✓ Good - use visible for frequent toggles
const [isOpen, setIsOpen] = useState(false)

<Modal visible={isOpen} onClose={() => setIsOpen(false)}>
  {/* Modal stays mounted, toggles visibility quickly */}
</Modal>

// ✗ Avoid - conditional rendering for modals
{isOpen && (
  <Modal onClose={() => setIsOpen(false)}>
    {/* Remounts every time - expensive animations restart */}
  </Modal>
)}`}
        </CodeBlock>
      </Section>

      <Section title="Layout Performance">
        <SectionDescription>Optimize layout calculations for complex UIs.</SectionDescription>

        <h3>Avoid Deep Nesting</h3>
        <p>Each layout level adds computation overhead:</p>

        <CodeBlock language="tsx">
          {`// ✗ Bad - deeply nested (6 levels)
<View>
  <View>
    <View>
      <View>
        <View>
          <View>
            <Text text="Deep" />
          </View>
        </View>
      </View>
    </View>
  </View>
</View>

// ✓ Better - flattened (2 levels)
<View>
  <Text text="Flat" />
</View>`}
        </CodeBlock>

        <p>
          <strong>Guideline:</strong> Keep nesting under 5 levels for optimal performance.
        </p>

        <h3>Use Fixed Sizes</h3>
        <p>Fixed sizes skip measurement calculations:</p>

        <CodeBlock language="tsx">
          {`// ✓ Fast - fixed dimensions
<View width={200} height={100}>
  <Text text="Known size" />
</View>

// ✗ Slower - auto measurement
<View width="auto" height="auto">
  <Text text="Must measure content" />
</View>`}
        </CodeBlock>

        <h3>Limit Percentage Chains</h3>
        <p>Nested percentages compound calculation complexity:</p>

        <CodeBlock language="tsx">
          {`// ✗ Bad - percentage cascade
<View width="80%">
  <View width="90%">
    <View width="75%">
      <Text text="Complex calculation" />
    </View>
  </View>
</View>

// ✓ Better - direct sizing
<View width={540}>  {/* 80% * 90% * 75% of 1000 */}
  <Text text="Precalculated" />
</View>`}
        </CodeBlock>

        <h3>Batch Layout Updates</h3>
        <p>
          PhaserJSX automatically batches layout recalculations. Multiple prop changes in the same
          frame trigger only one layout pass:
        </p>

        <CodeBlock language="tsx">
          {`// All three changes batched into single layout calculation
function updatePanel() {
  setWidth(300)
  setHeight(200)
  setPadding(20)
  // Layout calculated once after microtask
}`}
        </CodeBlock>

        <h3>Minimize Wrapping Layouts</h3>
        <p>
          <code>flexWrap="wrap"</code> requires multi-pass layout calculations:
        </p>

        <CodeBlock language="tsx">
          {`// ✗ Slower - wrapping requires multiple passes
<View direction="row" flexWrap="wrap" width="fill">
  {Array.from({ length: 100 }).map((_, i) => (
    <Card key={i} width={150} />
  ))}
</View>

// ✓ Faster - fixed columns, no wrapping
<View direction="row" gap={10}>
  <View flex={1}>{column1Items}</View>
  <View flex={1}>{column2Items}</View>
  <View flex={1}>{column3Items}</View>
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Texture & Memory">
        <SectionDescription>Manage texture loading and memory efficiently.</SectionDescription>

        <h3>Icon Performance</h3>
        <p>Icons generate textures on-demand. Reusing the same icon name reuses the texture:</p>

        <CodeBlock language="tsx">
          {`// ✓ Good - same icon name reuses texture
<Icon name="star" size={32} />
<Icon name="star" size={24} />  // Reuses "star" texture

// ✗ Inefficient - different effects create separate textures
<Icon name="star" size={32} effect={{ blur: 5 }} />
<Icon name="star" size={32} effect={{ blur: 10 }} />  // New texture!`}
        </CodeBlock>

        <h3>Texture Cleanup</h3>
        <p>Textures are reference-counted and cleaned up automatically when no longer used:</p>

        <CodeBlock language="tsx">
          {`// Texture loaded
<Icon name="trophy" />

// Component unmounts → reference count decrements
// When count reaches 0 → texture freed from GPU`}
        </CodeBlock>

        <h3>Preload Assets</h3>
        <p>Load textures during Phaser's preload phase to avoid runtime loading:</p>

        <CodeBlock language="tsx">
          {`class GameScene extends Phaser.Scene {
  preload() {
    // Preload critical textures
    this.load.image('player', 'assets/player.png')
    this.load.image('enemy', 'assets/enemy.png')
    this.load.atlas('items', 'assets/items.png', 'assets/items.json')
  }

  create() {
    mountJSX(
      <GameUI />,
      this,
      { width: 1920, height: 1080 }
    )
  }
}`}
        </CodeBlock>

        <h3>Limit Concurrent Textures</h3>
        <p>Keep texture count reasonable for your platform:</p>

        <ul>
          <li>
            <strong>Desktop:</strong> 200-500 textures comfortable
          </li>
          <li>
            <strong>Mobile:</strong> 100-200 textures recommended
          </li>
          <li>
            <strong>Low-end:</strong> Under 100 textures for safety
          </li>
        </ul>

        <p>Use texture atlases to combine multiple small textures into one large texture.</p>
      </Section>

      <Section title="Profiling & Debugging">
        <SectionDescription>Identify and fix performance bottlenecks.</SectionDescription>

        <h3>Browser DevTools</h3>
        <p>Use Chrome DevTools Performance tab:</p>

        <ol>
          <li>Open DevTools (F12)</li>
          <li>Go to Performance tab</li>
          <li>Click Record, interact with UI, stop recording</li>
          <li>Look for long-running functions in flame graph</li>
        </ol>

        <p>
          Long <code>patchVNode</code> or <code>calculateLayout</code> calls indicate
          rendering/layout bottlenecks.
        </p>

        <h3>Console Warnings</h3>
        <p>PhaserJSX warns about common issues. Don't ignore them:</p>

        <CodeBlock language="text">
          {`[PhaserJSX] Missing key in list - array.map()
[PhaserJSX] Unnecessary remount: <Component> remounted because key changed
[PhaserJSX] Layout thrashing: Multiple synchronous layouts detected`}
        </CodeBlock>

        <h3>useForceRedraw Throttling</h3>
        <p>
          When using <code>useForceRedraw</code> for animations, always throttle:
        </p>

        <CodeBlock language="tsx">
          {`// ✗ Bad - redraws every frame (60 FPS)
useForceRedraw(animationSignal)

// ✓ Good - throttled to 30 FPS
useForceRedraw(33, animationSignal)  // 33ms = ~30 FPS

// ✓ Good - throttled to 15 FPS for non-critical updates
useForceRedraw(66, dataSignal)  // 66ms = ~15 FPS`}
        </CodeBlock>

        <h3>Performance Checklist</h3>
        <ul>
          <li>
            ✓ Memoize all JSX props with <code>useMemo</code>
          </li>
          <li>
            ✓ Memoize all callbacks with <code>useCallback</code>
          </li>
          <li>
            ✓ Add <code>key</code> props to lists and conditional elements
          </li>
          <li>
            ✓ Use <code>visible</code> instead of conditional rendering for frequent toggles
          </li>
          <li>✓ Keep layout nesting under 5 levels</li>
          <li>✓ Use fixed sizes when dimensions are known</li>
          <li>
            ✓ Throttle <code>useForceRedraw</code> to reasonable FPS
          </li>
          <li>✓ Fix all console warnings immediately</li>
          <li>✓ Profile with DevTools Performance tab</li>
          <li>✓ Test on target hardware (mobile, low-end)</li>
        </ul>
      </Section>

      <Section title="Best Practices Summary">
        <SectionDescription>Quick reference for performance optimization.</SectionDescription>

        <h3>Do's ✓</h3>
        <ul>
          <li>
            Memoize JSX props: <code>const icon = useMemo(() =&gt; &lt;Icon /&gt;, [])</code>
          </li>
          <li>
            Memoize callbacks: <code>const onClick = useCallback(() =&gt; fn(), [])</code>
          </li>
          <li>
            Add keys to lists: <code>{'{items.map(i => <Item key={i.id} />)}'}</code>
          </li>
          <li>
            Use <code>visible</code> for frequent toggles
          </li>
          <li>Use conditional rendering to free resources</li>
          <li>Keep layout nesting shallow (&lt;5 levels)</li>
          <li>Use fixed sizes when possible</li>
          <li>
            Throttle <code>useForceRedraw</code>
          </li>
          <li>Fix warnings immediately</li>
        </ul>

        <h3>Don'ts ✗</h3>
        <ul>
          <li>
            Don't create JSX inline: <code>prefix={'{<Icon />}'}</code>
          </li>
          <li>
            Don't create functions inline: <code>onClick={'{() => fn()}'}</code>
          </li>
          <li>Don't omit keys from lists</li>
          <li>Don't use array index as key for reorderable lists</li>
          <li>Don't nest percentages deeply</li>
          <li>Don't ignore console warnings</li>
          <li>
            Don't use <code>auto</code> sizing everywhere
          </li>
          <li>Don't unmount/remount frequently toggled components</li>
        </ul>

        <h3>Performance Targets</h3>
        <ul>
          <li>
            <strong>Desktop:</strong> 60 FPS (16.67ms per frame)
          </li>
          <li>
            <strong>Mobile:</strong> 30-60 FPS (16.67-33.33ms per frame)
          </li>
          <li>
            <strong>Layout calculation:</strong> &lt;2ms for complex UIs
          </li>
          <li>
            <strong>Component re-render:</strong> &lt;1ms for typical components
          </li>
          <li>
            <strong>Texture count:</strong> &lt;200 on mobile, &lt;500 on desktop
          </li>
        </ul>
      </Section>
    </DocLayout>
  )
}
