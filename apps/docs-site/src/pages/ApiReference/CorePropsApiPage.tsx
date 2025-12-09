/**
 * Core Props API Reference
 */
/** @jsxImportSource react */
import { DocDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

export function CorePropsApiPage() {
  return (
    <DocLayout>
      <h1>API Reference: Core Props</h1>
      <DocDescription>
        Type definitions for shared component properties. These prop groups can be composed to build
        component-specific props, providing type safety and consistent interfaces.
      </DocDescription>
      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="mb-4">
          Core props are type definitions for shared component properties. These prop groups can be
          composed to build component-specific props, providing type safety and consistent
          interfaces across all components.
        </p>
      </section>

      {/* Size Types */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Size Types</h2>

        <h3 className="text-xl font-semibold mb-3">SizeValue</h3>
        <p className="mb-4">Valid CSS-like size values with type safety.</p>
        <CodeBlock language="typescript">
          {`type SizeValue =
  | number              // Fixed pixels: 200
  | 'auto'              // Auto size to content
  | 'fill'              // Fill available space
  | \`\${number}%\`       // Percentage: "50%", "100%"
  | \`\${number}px\`      // Explicit pixels: "20px"
  | \`\${number}vw\`      // Viewport width: "100vw", "50vw"
  | \`\${number}vh\`      // Viewport height: "100vh", "80vh"
  | \`calc(\${string})\`  // Calc expressions: "calc(100% - 20px)"`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 className="font-semibold mb-2">Examples:</h4>
          <CodeBlock language="tsx">
            {`// Fixed pixels
<View width={200} height={100} />

// Percentage of parent
<View width="75%" height="50%" />

// Viewport units
<View width="100vw" height="100vh" />

// Keywords
<View width="fill" height="auto" />

// Calc expressions
<View width="calc(100% - 40px)" height="calc(50vh + 20px)" />`}
          </CodeBlock>
        </div>

        <h3 className="text-xl font-semibold mb-3 mt-8">FlexBasisValue</h3>
        <p className="mb-4">Flex basis size values (subset of SizeValue, no "fill" keyword).</p>
        <CodeBlock language="typescript">
          {`type FlexBasisValue =
  | number
  | 'auto'
  | \`\${number}%\`
  | \`\${number}px\`
  | \`\${number}vw\`
  | \`\${number}vh\`
  | \`calc(\${string})\``}
        </CodeBlock>

        <h3 className="text-xl font-semibold mb-3 mt-8">Display</h3>
        <p className="mb-4">Display mode for visibility control.</p>
        <CodeBlock language="typescript">
          {`type Display = 'visible' | 'invisible' | 'none'`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">visible</code>: Rendered and takes up
              layout space (default)
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">invisible</code>: Not rendered but
              takes up layout space (like CSS visibility: hidden)
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">none</code>: Not rendered and no
              layout space (like CSS display: none)
            </li>
          </ul>
        </div>
      </section>

      {/* LayoutProps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">LayoutProps</h2>
        <p className="mb-4">Layout properties for sizing, spacing, and layout participation.</p>

        <div className="space-y-8">
          {/* Visibility */}
          <div>
            <h3 className="text-xl font-semibold mb-3">visible</h3>
            <CodeBlock language="typescript">{`visible?: boolean | Display`}</CodeBlock>
            <p className="mt-2 mb-4">Controls visibility and layout participation.</p>
            <CodeBlock language="tsx">
              {`<View visible={true}>Always visible</View>
<View visible={false}>Hidden but occupies space</View>
<View visible="none">Hidden and no space</View>`}
            </CodeBlock>
          </div>

          {/* Headless */}
          <div>
            <h3 className="text-xl font-semibold mb-3">headless</h3>
            <CodeBlock language="typescript">{`headless?: boolean`}</CodeBlock>
            <p className="mt-2 mb-4">
              If true, object is rendered but excluded from layout calculations. Use for decorative
              elements, sprites, particles, or absolute-positioned objects.
            </p>
            <CodeBlock language="tsx">
              {`// Decorative sprite that doesn't affect layout
<Sprite texture="particle" headless={true} />

// Text that participates in layout
<Text text="Label" headless={false} />`}
            </CodeBlock>
          </div>

          {/* Sizing */}
          <div>
            <h3 className="text-xl font-semibold mb-3">width & height</h3>
            <CodeBlock language="typescript">
              {`width?: SizeValue | undefined
height?: SizeValue | undefined`}
            </CodeBlock>
            <p className="mt-2 mb-4">Width and height of the container.</p>
            <CodeBlock language="tsx">
              {`<View width={200} height={100} />
<View width="75%" height="50%" />
<View width="100vw" height="100vh" />
<View width="fill" height="auto" />
<View width="calc(100% - 20px)" height={undefined} />`}
            </CodeBlock>
          </div>

          {/* Constraints */}
          <div>
            <h3 className="text-xl font-semibold mb-3">minWidth, maxWidth, minHeight, maxHeight</h3>
            <CodeBlock language="typescript">
              {`minWidth?: SizeValue | undefined
maxWidth?: SizeValue | undefined
minHeight?: SizeValue | undefined
maxHeight?: SizeValue | undefined`}
            </CodeBlock>
            <p className="mt-2 mb-4">
              Size constraints that prevent elements from shrinking or growing beyond specified
              limits.
            </p>
            <CodeBlock language="tsx">
              {`// Fixed constraints
<View flex={1} minWidth={200} maxWidth={800} />

// Percentage constraints
<View width="100%" minWidth="20%" maxWidth="80%" />

// Viewport constraints
<View flex={1} minHeight="50vh" maxHeight="90vh" />

// Calc constraints
<View width="100%" minWidth="calc(50% - 20px)" />`}
            </CodeBlock>
          </div>

          {/* Spacing */}
          <div>
            <h3 className="text-xl font-semibold mb-3">margin & padding</h3>
            <CodeBlock language="typescript">
              {`margin?: number | EdgeInsets | undefined
padding?: number | EdgeInsets | undefined

interface EdgeInsets {
  top?: number
  right?: number
  bottom?: number
  left?: number
}`}
            </CodeBlock>
            <p className="mt-2 mb-4">Margin (outside) and padding (inside) spacing.</p>
            <CodeBlock language="tsx">
              {`// Uniform spacing
<View margin={20} padding={10} />

// Individual sides
<View
  margin={{ top: 10, bottom: 20 }}
  padding={{ left: 15, right: 15 }}
/>`}
            </CodeBlock>
          </div>

          {/* Direction */}
          <div>
            <h3 className="text-xl font-semibold mb-3">direction</h3>
            <CodeBlock language="typescript">{`direction?: 'row' | 'column' | 'stack'`}</CodeBlock>
            <p className="mt-2 mb-4">Layout direction for children.</p>
            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">column</code>: Stack children
                vertically (default, like VStack)
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">row</code>: Stack children
                horizontally (like HStack)
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded">stack</code>: Overlay children at
                same position (like ZStack)
              </li>
            </ul>
            <CodeBlock language="tsx">
              {`<View direction="column">Vertical stack</View>
<View direction="row">Horizontal row</View>
<View direction="stack">Overlapping layers</View>`}
            </CodeBlock>
          </div>

          {/* Gap */}
          <div>
            <h3 className="text-xl font-semibold mb-3">gap</h3>
            <CodeBlock language="typescript">
              {`gap?: number | GapInsets | undefined

interface GapInsets {
  horizontal?: number
  vertical?: number
}`}
            </CodeBlock>
            <p className="mt-2 mb-4">Gap between children.</p>
            <CodeBlock language="tsx">
              {`// Uniform gap
<View direction="column" gap={10}>
  <View />
  <View />
</View>

// Separate horizontal/vertical gaps
<View direction="row" gap={{ horizontal: 20, vertical: 10 }}>
  <View />
  <View />
</View>`}
            </CodeBlock>
          </div>

          {/* Alignment */}
          <div>
            <h3 className="text-xl font-semibold mb-3">justifyContent</h3>
            <CodeBlock language="typescript">
              {`justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'`}
            </CodeBlock>
            <p className="mt-2 mb-4">Main axis alignment (along direction).</p>
            <CodeBlock language="tsx">
              {`<View direction="row" justifyContent="center">Centered</View>
<View direction="column" justifyContent="space-between">Spaced</View>`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">alignItems</h3>
            <CodeBlock language="typescript">
              {`alignItems?: 'start' | 'center' | 'end' | 'stretch'`}
            </CodeBlock>
            <p className="mt-2 mb-4">Cross axis alignment (perpendicular to direction).</p>
            <CodeBlock language="tsx">
              {`<View direction="row" alignItems="center">Centered vertically</View>
<View direction="column" alignItems="stretch">Stretched horizontally</View>`}
            </CodeBlock>
          </div>

          {/* Flex */}
          <div>
            <h3 className="text-xl font-semibold mb-3">flex, flexShrink, flexBasis</h3>
            <CodeBlock language="typescript">
              {`flex?: number
flexShrink?: number
flexBasis?: FlexBasisValue | undefined`}
            </CodeBlock>
            <p className="mt-2 mb-4">Flex distribution properties.</p>
            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li>
                <strong>flex</strong>: Grow factor (0 = fixed size, 1+ = proportional growth)
              </li>
              <li>
                <strong>flexShrink</strong>: Shrink factor (0 = no shrink, 1+ = proportional shrink)
              </li>
              <li>
                <strong>flexBasis</strong>: Initial size before flex distribution
              </li>
            </ul>
            <CodeBlock language="tsx">
              {`// Sidebar fixed, main content fills
<View direction="row">
  <View width={200}>Sidebar</View>
  <View flex={1}>Main</View>
</View>

// Two columns, second twice as wide
<View direction="row">
  <View flex={1}>Col 1</View>
  <View flex={2}>Col 2</View>
</View>

// Flex basis with grow
<View flex={1} flexBasis={200}>Starts at 200px, then grows</View>`}
            </CodeBlock>
          </div>

          {/* Wrapping */}
          <div>
            <h3 className="text-xl font-semibold mb-3">flexWrap & alignContent</h3>
            <CodeBlock language="typescript">
              {`flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
alignContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'stretch'`}
            </CodeBlock>
            <p className="mt-2 mb-4">Wrapping behavior and multi-line alignment.</p>
            <CodeBlock language="tsx">
              {`// Auto-wrapping grid
<View direction="row" flexWrap="wrap" gap={10} width={400}>
  {items.map(item => <Card width={100} key={item.id} />)}
</View>

// Responsive card grid with line alignment
<View
  direction="row"
  flexWrap="wrap"
  alignContent="space-between"
  gap={15}
  height={600}
>
  {cards.map(card => (
    <View minWidth={180} flex={1} key={card.id}>{card}</View>
  ))}
</View>`}
            </CodeBlock>
          </div>

          {/* Overflow */}
          <div>
            <h3 className="text-xl font-semibold mb-3">overflow</h3>
            <CodeBlock language="typescript">{`overflow?: 'visible' | 'hidden'`}</CodeBlock>
            <p className="mt-2 mb-4">
              Controls how content that overflows the container is displayed.
            </p>
            <CodeBlock language="tsx">
              {`<View width={100} height={50} overflow="hidden">
  <Text text="This long text will be clipped" />
</View>`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* TransformProps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">TransformProps</h2>
        <p className="mb-4">Geometric transformation properties.</p>
        <CodeBlock language="typescript">
          {`interface TransformProps {
  x?: number
  y?: number
  rotation?: number
  scale?: number
  scaleX?: number
  scaleY?: number
}`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 className="font-semibold mb-2">Examples:</h4>
          <CodeBlock language="tsx">
            {`// Position
<View x={100} y={50} />

// Rotation (radians)
<View rotation={Math.PI / 4} />

// Scale
<View scale={1.5} />
<View scaleX={2} scaleY={0.5} />`}
          </CodeBlock>
        </div>
      </section>

      {/* PhaserProps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">PhaserProps</h2>
        <p className="mb-4">Phaser GameObject display properties.</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">alpha</h3>
            <CodeBlock language="typescript">{`alpha?: number`}</CodeBlock>
            <p className="mt-2 mb-4">
              Alpha transparency (0 = fully transparent, 1 = fully opaque).
            </p>
            <CodeBlock language="tsx">{`<View alpha={0.5}>Semi-transparent</View>`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">depth</h3>
            <CodeBlock language="typescript">{`depth?: number`}</CodeBlock>
            <p className="mt-2 mb-4">
              Depth (Z-index) in display list. Higher values rendered on top.
            </p>
            <CodeBlock language="tsx">
              {`<View direction="stack">
  <View depth={1}>Background</View>
  <View depth={2}>Content</View>
  <View depth={3}>Overlay</View>
</View>`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">onReady</h3>
            <CodeBlock language="typescript">
              {`onReady?: (node: Phaser.GameObjects.GameObject) => void`}
            </CodeBlock>
            <p className="mt-2 mb-4">
              Callback invoked when GameObject is created and fully initialized.
            </p>
            <CodeBlock language="tsx">
              {`// Display image dimensions
<Image
  texture="icon"
  onReady={(img) => console.log(\`\${img.width}x\${img.height}\`)}
/>

// Access View bounds
<View
  width={200}
  height={100}
  onReady={(view) => console.log(view.getBounds())}
/>`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">onTooltip</h3>
            <CodeBlock language="typescript">
              {`onTooltip?: (
  | (() => string | null | undefined)
  | (() => TooltipConfig | null | undefined)
)`}
            </CodeBlock>
            <p className="mt-2 mb-4">
              Tooltip configuration callback (desktop/mouse only). Not available on touch devices.
            </p>
            <CodeBlock language="tsx">
              {`// Simple text tooltip
<Button onTooltip={() => "Click to delete"} />

// Conditional tooltip
<Button onTooltip={() => isAdmin ? "Admin action" : null} />

// Full configuration
<Button onTooltip={() => ({
  content: "Delete item",
  position: "top",
  showDelay: 100
})} />`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* BackgroundProps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">BackgroundProps</h2>
        <p className="mb-4">Background styling properties.</p>
        <CodeBlock language="typescript">
          {`interface BackgroundProps {
  backgroundColor?: number | undefined
  backgroundAlpha?: number | undefined
  cornerRadius?: number | CornerRadiusInsets | undefined
  borderWidth?: number | undefined
  borderColor?: number | undefined
  borderAlpha?: number
}

interface CornerRadiusInsets {
  tl?: number  // top-left
  tr?: number  // top-right
  bl?: number  // bottom-left
  br?: number  // bottom-right
}`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 className="font-semibold mb-2">Examples:</h4>
          <CodeBlock language="tsx">
            {`// Solid background
<View backgroundColor={0xff0000} backgroundAlpha={1} />

// Uniform corner radius
<View backgroundColor={0x333333} cornerRadius={10} />

// Individual corner radii
<View
  backgroundColor={0x0000ff}
  cornerRadius={{ tl: 20, tr: 20, bl: 0, br: 0 }}
/>

// Border
<View
  borderWidth={2}
  borderColor={0x00ff00}
  borderAlpha={0.8}
/>`}
          </CodeBlock>
        </div>
      </section>

      {/* TextSpecificProps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">TextSpecificProps</h2>
        <p className="mb-4">Text-specific styling properties.</p>
        <CodeBlock language="typescript">
          {`interface TextSpecificProps {
  text: string | undefined
  maxWidth?: SizeValue  // Supports all size formats
}`}
        </CodeBlock>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h4 className="font-semibold mb-2">Examples:</h4>
          <CodeBlock language="tsx">
            {`// Text wrapping with fixed width
<Text text="Long text..." maxWidth={200} />

// Percentage max width
<Text text="Long text..." maxWidth="80%" />

// Viewport max width
<Text text="Long text..." maxWidth="50vw" />`}
          </CodeBlock>
        </div>
      </section>

      {/* GestureProps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">GestureProps</h2>
        <p className="mb-4">High-level gesture props for unified touch and mouse interaction.</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">enableGestures</h3>
            <CodeBlock language="typescript">{`enableGestures?: boolean`}</CodeBlock>
            <p className="mt-2 mb-4">
              Enable gesture system for this container. Must be true to receive any gesture events.
              Default: false (no overhead for non-interactive containers).
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Touch Events</h3>
            <CodeBlock language="typescript">
              {`onTouch?: (data: GestureEventData) => void
onTouchOutside?: (data: GestureEventData) => void
onTouchMove?: (data: GestureEventData) => void
onDoubleTap?: (data: GestureEventData) => void
onLongPress?: (data: GestureEventData) => void`}
            </CodeBlock>
            <ul className="list-disc ml-6 space-y-2 mt-4">
              <li>
                <strong>onTouch</strong>: Click/tap (pointer down + up on same target)
              </li>
              <li>
                <strong>onTouchOutside</strong>: Pointer up outside container (click-outside
                detection)
              </li>
              <li>
                <strong>onTouchMove</strong>: Pointer movement with dx/dy deltas
              </li>
              <li>
                <strong>onDoubleTap</strong>: Double click/tap within configured delay
              </li>
              <li>
                <strong>onLongPress</strong>: Pointer held down for configured duration
              </li>
            </ul>
            <CodeBlock language="tsx">
              {`<View
  enableGestures
  onTouch={(e) => console.log('Clicked', e.x, e.y)}
  onTouchMove={(e) => console.log('Dragging', e.dx, e.dy)}
  onDoubleTap={(e) => console.log('Double tapped')}
/>`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Hover Events (Desktop Only)</h3>
            <CodeBlock language="typescript">
              {`onHoverStart?: (data: HoverEventData) => void
onHoverEnd?: (data: HoverEventData) => void`}
            </CodeBlock>
            <p className="mt-2 mb-4">
              Hover events for desktop/mouse only. Do not work on touch devices (iPhone, iPad).
            </p>
            <CodeBlock language="tsx">
              {`<View
  enableGestures
  onHoverStart={() => console.log('Mouse entered')}
  onHoverEnd={() => console.log('Mouse left')}
/>`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Keyboard & Input Events</h3>
            <CodeBlock language="typescript">
              {`onKeyDown?: (data: KeyboardEventData) => void
onKeyUp?: (data: KeyboardEventData) => void
onInput?: (data: InputEventData) => void
onFocus?: (data: FocusEventData) => void
onBlur?: (data: FocusEventData) => void`}
            </CodeBlock>
            <CodeBlock language="tsx">
              {`<View
  enableGestures
  onKeyDown={(e) => console.log('Key pressed:', e.key)}
  onInput={(e) => console.log('Input value:', e.value)}
  onFocus={() => console.log('Focused')}
/>`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Wheel Events (Desktop Only)</h3>
            <CodeBlock language="typescript">
              {`onWheel?: (data: WheelEventData) => void`}
            </CodeBlock>
            <p className="mt-2 mb-4">
              Mouse wheel scroll events for desktop only. Do not work on touch devices.
            </p>
            <CodeBlock language="tsx">
              {`<View
  enableGestures
  onWheel={(e) => console.log('Scrolled:', e.deltaX, e.deltaY)}
/>`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Gesture Configuration</h3>
            <CodeBlock language="typescript">
              {`longPressDuration?: number    // Default: 500ms
doubleTapDelay?: number       // Default: 300ms
maxTouchDuration?: number     // Default: 500ms`}
            </CodeBlock>
            <CodeBlock language="tsx">
              {`<View
  enableGestures
  longPressDuration={1000}
  doubleTapDelay={200}
  maxTouchDuration={800}
  onLongPress={(e) => console.log('Long pressed')}
/>`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Best Practices</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Size Value Selection</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Use <strong>fixed pixels</strong> for icons, avatars, and UI elements with known
                sizes
              </li>
              <li>
                Use <strong>percentages</strong> for proportional layouts relative to parent
              </li>
              <li>
                Use <strong>viewport units</strong> for full-screen overlays and responsive layouts
              </li>
              <li>
                Use <strong>fill</strong> keyword when element should take all available space
              </li>
              <li>
                Use <strong>auto</strong> for content-based sizing
              </li>
              <li>
                Use <strong>calc()</strong> for complex responsive calculations
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Layout Performance</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Minimize nesting depth - flat layouts perform better</li>
              <li>
                Use <code>headless={true}</code> for decorative elements to exclude from layout
              </li>
              <li>
                Prefer <code>visible={false}</code> over conditional rendering for animations
              </li>
              <li>
                Use <code>overflow="hidden"</code> to clip content rather than complex masking
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Gesture Optimization</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Only set <code>enableGestures={true}</code> on interactive elements
              </li>
              <li>Avoid adding gesture handlers to every child in large lists</li>
              <li>
                Use <code>onTouchOutside</code> for click-outside detection instead of full-screen
                listeners
              </li>
              <li>Remember hover/wheel events don't work on mobile devices</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Type Safety</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Leverage TypeScript's type inference with SizeValue</li>
              <li>Use EdgeInsets interface for structured spacing</li>
              <li>Prefer typed GestureEventData over generic event types</li>
              <li>Compose prop interfaces using &amp; for custom components</li>
            </ul>
          </div>
        </div>
      </section>
    </DocLayout>
  )
}
