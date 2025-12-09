/**
 * Gestures & Interaction Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Gestures & Interaction guide page
 */
export function GesturesPage() {
  return (
    <DocLayout>
      <h1>Gestures & Interaction</h1>
      <DocDescription>
        Cross-platform gesture detection system with unified mouse and touch support. Handle clicks,
        taps, drags, long press, double tap, hover, and scroll with simple, type-safe callbacks.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          PhaserJSX provides a high-level gesture system that abstracts away the differences between
          mouse and touch input.
        </SectionDescription>

        <h3>Why Gestures?</h3>
        <p>
          Phaser's built-in pointer events (<code>pointerdown</code>, <code>pointerup</code>) are
          low-level and require manual gesture detection. PhaserJSX's gesture system provides:
        </p>

        <ul>
          <li>
            <strong>Unified mouse/touch API</strong> - Same callbacks work for desktop and mobile
          </li>
          <li>
            <strong>Automatic gesture recognition</strong> - Double tap, long press, drag with
            configurable thresholds
          </li>
          <li>
            <strong>Event bubbling</strong> - DOM-style propagation with{' '}
            <code>stopPropagation()</code> support
          </li>
          <li>
            <strong>Position tracking</strong> - Local coordinates, deltas, inside/outside state
          </li>
          <li>
            <strong>No registration overhead</strong> - Gestures only active when callbacks present
          </li>
        </ul>

        <h3>Enabling Gestures</h3>
        <p>
          Set <code>enableGestures=true</code> on any <code>View</code> to enable gesture detection.
          The system auto-enables when gesture callbacks are present, but explicit enabling is
          recommended for clarity:
        </p>

        <CodeBlock language="tsx">
          {`<View
  enableGestures={true}
  onTouch={() => console.log('Clicked!')}
>
  <Text text="Click Me" />
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Basic Gestures">
        <SectionDescription>
          Common interaction patterns for buttons, links, and clickable elements.
        </SectionDescription>

        <h3>onTouch - Click/Tap</h3>
        <p>
          Fires when pointer goes down and up on the same element. Works for both mouse clicks and
          touch taps. Respects <code>maxTouchDuration</code> to prevent triggering after long holds:
        </p>

        <CodeBlock language="tsx">
          {`<View
  enableGestures={true}
  maxTouchDuration={500}  // Default: 500ms
  onTouch={(data) => {
    console.log('Clicked at:', data.localX, data.localY)
  }}
>
  <Text text="Button" />
</View>`}
        </CodeBlock>

        <h3>onDoubleTap - Double Click/Tap</h3>
        <p>
          Detects two taps/clicks within the configured delay. Useful for zoom, selection, or
          special actions:
        </p>

        <CodeBlock language="tsx">
          {`<View
  enableGestures={true}
  doubleTapDelay={300}  // Default: 300ms between taps
  onDoubleTap={(data) => {
    console.log('Double tapped!')
  }}
>
  <Text text="Double Tap to Zoom" />
</View>`}
        </CodeBlock>

        <h3>onLongPress - Press and Hold</h3>
        <p>
          Triggers when pointer is held down for the configured duration. Prevents{' '}
          <code>onTouch</code> from firing after long press:
        </p>

        <CodeBlock language="tsx">
          {`<View
  enableGestures={true}
  longPressDuration={800}  // Default: 500ms
  onTouch={() => console.log('Quick tap')}
  onLongPress={() => console.log('Long press - onTouch will NOT fire')}
>
  <Text text="Hold for Context Menu" />
</View>`}
        </CodeBlock>

        <p>
          <strong>Important:</strong> <code>onTouch</code> and <code>onLongPress</code> are mutually
          exclusive. If long press triggers, the touch event is suppressed.
        </p>
      </Section>

      <Section title="Drag & Movement">
        <SectionDescription>
          Track pointer movement for dragging, scrolling, and continuous input.
        </SectionDescription>

        <h3>onTouchMove - Drag Tracking</h3>
        <p>
          Fires continuously during pointer movement with delta values and state information.
          Continues tracking even when pointer moves outside the component:
        </p>

        <CodeBlock language="tsx">
          {`function DraggableBox() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <View
      x={position.x}
      y={position.y}
      enableGestures={true}
      onTouchMove={(data) => {
        if (data.state === 'start') {
          console.log('Drag started')
        }

        // Update position with deltas
        setPosition(pos => ({
          x: pos.x + (data.dx ?? 0),
          y: pos.y + (data.dy ?? 0)
        }))

        // Check if still inside
        console.log('Inside:', data.isInside)

        if (data.state === 'end') {
          console.log('Drag ended')
        }

        // Prevent parent from receiving this event
        data.stopPropagation()
      }}
    >
      <Text text="Drag Me!" />
    </View>
  )
}`}
        </CodeBlock>

        <h3>Move State Tracking</h3>
        <p>
          <code>onTouchMove</code> provides a <code>state</code> field for managing drag lifecycle:
        </p>

        <ul>
          <li>
            <strong>'start'</strong> - First movement after pointer down (useful for grabbing visual
            feedback)
          </li>
          <li>
            <strong>'move'</strong> - Continuous movement while pointer is down
          </li>
          <li>
            <strong>'end'</strong> - Final event when pointer is released
          </li>
        </ul>

        <h3>Inside/Outside Tracking</h3>
        <p>
          The <code>isInside</code> flag indicates whether the pointer is currently within the
          component's bounds. Useful for visual feedback during drag operations:
        </p>

        <CodeBlock language="tsx">
          {`<View
  enableGestures={true}
  backgroundColor={isInside ? 0x00ff00 : 0xff0000}
  onTouchMove={(data) => {
    setIsInside(data.isInside ?? true)
  }}
>
  <Text text={isInside ? 'Inside' : 'Outside'} />
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Desktop-Only Gestures">
        <SectionDescription>
          Mouse-specific interactions that don't work on touch devices.
        </SectionDescription>

        <h3>onHoverStart / onHoverEnd</h3>
        <p>
          Mouse enter/leave events for hover effects. Not available on touch devices (iPhone, iPad):
        </p>

        <CodeBlock language="tsx">
          {`function HoverButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <View
      enableGestures={true}
      backgroundColor={isHovered ? 0x0088ff : 0x0044ff}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Text text="Hover Me" />
    </View>
  )
}`}
        </CodeBlock>

        <h3>onWheel - Mouse Wheel</h3>
        <p>Scroll wheel events for zooming or custom scrolling. Desktop/mouse only:</p>

        <CodeBlock language="tsx">
          {`function ZoomableView() {
  const [zoom, setZoom] = useState(1.0)

  return (
    <View
      enableGestures={true}
      onWheel={(data) => {
        // deltaY: positive = scroll down, negative = scroll up
        const delta = data.deltaY > 0 ? -0.1 : 0.1
        setZoom(z => Math.max(0.5, Math.min(3.0, z + delta)))

        // Prevent page scroll
        data.preventDefault()
      }}
    >
      <Text text={\`Zoom: \${zoom.toFixed(1)}x\`} />
    </View>
  )
}`}
        </CodeBlock>

        <p>
          <strong>Platform note:</strong> Hover and wheel events only work on desktop. They're
          ignored on touch devices, so your UI should not rely on them for essential functionality.
        </p>
      </Section>

      <Section title="Event Propagation">
        <SectionDescription>
          Control event bubbling with DOM-style propagation methods.
        </SectionDescription>

        <h3>stopPropagation Pattern</h3>
        <p>
          By default, gesture events bubble up to parent containers. Call{' '}
          <code>stopPropagation()</code> to prevent parents from receiving the event:
        </p>

        <CodeBlock language="tsx">
          {`<View
  enableGestures={true}
  onTouch={() => console.log('Parent touched')}
>
  <View
    enableGestures={true}
    onTouch={(data) => {
      console.log('Child touched')
      data.stopPropagation()  // Parent's onTouch will NOT fire
    }}
  >
    <Text text="Child Button" />
  </View>
</View>`}
        </CodeBlock>

        <h3>When to Stop Propagation</h3>
        <ul>
          <li>
            <strong>Buttons inside scrollable areas</strong> - Prevent scroll container from
            handling the touch
          </li>
          <li>
            <strong>Nested interactive elements</strong> - Inner element handles the gesture, outer
            ignores it
          </li>
          <li>
            <strong>Modal dialogs</strong> - Prevent clicks from reaching background elements
          </li>
          <li>
            <strong>Custom drag operations</strong> - Stop parent containers from interpreting
            movement
          </li>
        </ul>

        <h3>onTouchOutside - Click-Outside Detection</h3>
        <p>
          Special callback that fires when the pointer is released outside the component. Useful for
          dropdowns, modals, and tooltips:
        </p>

        <CodeBlock language="tsx">
          {`function Dropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View>
      <View
        enableGestures={true}
        onTouch={() => setIsOpen(true)}
      >
        <Text text="Open Menu" />
      </View>

      {isOpen && (
        <View
          enableGestures={true}
          onTouchOutside={() => setIsOpen(false)}
        >
          <Text text="Menu Item 1" />
          <Text text="Menu Item 2" />
        </View>
      )}
    </View>
  )
}`}
        </CodeBlock>
      </Section>

      <Section title="GestureEventData">
        <SectionDescription>
          Understanding the data provided to gesture callbacks.
        </SectionDescription>

        <h3>Common Properties</h3>
        <p>All gesture callbacks receive a data object with these properties:</p>

        <ul>
          <li>
            <strong>pointer</strong> - Phaser pointer object (access <code>pointer.x</code>,{' '}
            <code>pointer.y</code> for world coordinates)
          </li>
          <li>
            <strong>localX, localY</strong> - Coordinates relative to component origin (0,0)
          </li>
          <li>
            <strong>width, height</strong> - Component's hit area dimensions
          </li>
          <li>
            <strong>isInside</strong> - Whether pointer is currently inside component bounds
            (optional, mainly for <code>onTouchMove</code>)
          </li>
        </ul>

        <h3>onTouchMove-Specific Properties</h3>
        <p>Move events provide additional tracking information:</p>

        <ul>
          <li>
            <strong>dx, dy</strong> - Delta movement since last move event (pixels)
          </li>
          <li>
            <strong>state</strong> - Move lifecycle: <code>'start'</code> | <code>'move'</code> |{' '}
            <code>'end'</code>
          </li>
        </ul>

        <h3>Methods</h3>
        <ul>
          <li>
            <strong>stopPropagation()</strong> - Prevent event from bubbling to parent containers
          </li>
          <li>
            <strong>isPropagationStopped()</strong> - Check if propagation was stopped
          </li>
        </ul>

        <CodeBlock language="tsx">
          {`onTouch={(data) => {
  console.log('World:', data.pointer.x, data.pointer.y)
  console.log('Local:', data.localX, data.localY)
  console.log('Size:', data.width, data.height)
  console.log('Inside:', data.isInside)

  data.stopPropagation()
}`}
        </CodeBlock>
      </Section>

      <Section title="Configuration">
        <SectionDescription>Customize gesture detection thresholds and timing.</SectionDescription>

        <h3>Timing Configuration</h3>
        <p>Adjust gesture detection parameters for different interaction styles:</p>

        <CodeBlock language="tsx">
          {`<View
  enableGestures={true}

  // Long press threshold (default: 500ms)
  longPressDuration={800}

  // Double tap window (default: 300ms)
  doubleTapDelay={400}

  // Max touch duration for valid tap (default: 500ms)
  maxTouchDuration={600}

  onTouch={...}
  onDoubleTap={...}
  onLongPress={...}
>
  <Text text="Configurable Gestures" />
</View>`}
        </CodeBlock>

        <h3>maxTouchDuration</h3>
        <p>
          Prevents <code>onTouch</code> from firing after long holds. If the user holds the pointer
          down longer than <code>maxTouchDuration</code>, releasing won't trigger{' '}
          <code>onTouch</code>. This avoids accidental taps after dragging or long press:
        </p>

        <CodeBlock language="tsx">
          {`// Quick tap = onTouch fires
// Hold >500ms = onTouch does NOT fire
<View
  enableGestures={true}
  maxTouchDuration={500}
  onTouch={() => console.log('Quick tap only')}
/>`}
        </CodeBlock>
      </Section>

      <Section title="Best Practices">
        <SectionDescription>Guidelines for effective gesture implementation.</SectionDescription>

        <h3>Performance</h3>
        <ul>
          <li>
            <strong>Only enable where needed:</strong> Gesture system has minimal overhead but only
            enable on interactive elements
          </li>
          <li>
            <strong>Use stopPropagation:</strong> Prevent unnecessary event processing in parent
            containers
          </li>
          <li>
            <strong>Avoid expensive operations in onTouchMove:</strong> Movement events fire
            continuously (~60fps)
          </li>
          <li>
            <strong>Disable unused gestures:</strong> Don't add callbacks for gestures you don't use
            (e.g., skip <code>onDoubleTap</code> if not needed)
          </li>
        </ul>

        <h3>Mobile Considerations</h3>
        <ul>
          <li>
            <strong>Touch targets:</strong> Minimum 44x44 pixels for comfortable tapping
          </li>
          <li>
            <strong>No hover fallbacks:</strong> Don't rely on hover for essential functionality on
            touch devices
          </li>
          <li>
            <strong>Test on real devices:</strong> Simulator touch behavior differs from actual
            hardware
          </li>
          <li>
            <strong>Long press feedback:</strong> Provide visual indication during long press
            (progress ring, color change)
          </li>
        </ul>

        <h3>Accessibility</h3>
        <ul>
          <li>
            <strong>Large touch targets:</strong> 44x44 minimum, 48x48 recommended for better
            accessibility
          </li>
          <li>
            <strong>Visual feedback:</strong> Change appearance on touch/hover to confirm
            interactivity
          </li>
          <li>
            <strong>Alternative inputs:</strong> Consider keyboard navigation for desktop
            applications
          </li>
        </ul>

        <h3>Common Patterns</h3>

        <h4>Button with Press Effect</h4>
        <CodeBlock language="tsx">
          {`function PressButton() {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <View
      enableGestures={true}
      scale={isPressed ? 0.95 : 1.0}
      onTouchMove={(data) => {
        if (data.state === 'start') setIsPressed(true)
        if (data.state === 'end') setIsPressed(false)
      }}
      onTouch={() => console.log('Clicked!')}
    >
      <Text text="Press Me" />
    </View>
  )
}`}
        </CodeBlock>

        <h4>Draggable with Constraints</h4>
        <CodeBlock language="tsx">
          {`function ConstrainedDrag() {
  const [x, setX] = useState(0)
  const maxX = 200

  return (
    <View
      x={x}
      enableGestures={true}
      onTouchMove={(data) => {
        const newX = x + (data.dx ?? 0)
        // Constrain to bounds
        setX(Math.max(0, Math.min(maxX, newX)))
        data.stopPropagation()
      }}
    >
      <Text text="Drag Horizontally" />
    </View>
  )
}`}
        </CodeBlock>

        <h4>Context Menu on Long Press</h4>
        <CodeBlock language="tsx">
          {`function ContextMenuTarget() {
  const [menuVisible, setMenuVisible] = useState(false)

  return (
    <View>
      <View
        enableGestures={true}
        onTouch={() => console.log('Quick tap')}
        onLongPress={() => setMenuVisible(true)}
      >
        <Text text="Long Press for Menu" />
      </View>

      {menuVisible && (
        <View
          enableGestures={true}
          onTouchOutside={() => setMenuVisible(false)}
        >
          {/* Context menu items */}
        </View>
      )}
    </View>
  )
}`}
        </CodeBlock>
      </Section>

      <Section title="Examples">
        <SectionDescription>Learn from real-world implementations.</SectionDescription>

        <h3>Complete Gesture Demo</h3>
        <p>
          See <code>apps/test-ui/src/examples/GestureExample.tsx</code> for comprehensive examples
          of all gesture types:
        </p>
        <ul>
          <li>Touch/Click with maxTouchDuration</li>
          <li>Double tap detection</li>
          <li>Long press vs touch (mutual exclusivity)</li>
          <li>Drag with state tracking and isInside</li>
        </ul>

        <h3>Component Integration</h3>
        <p>Study how built-in components use gestures:</p>
        <ul>
          <li>
            <strong>Button</strong> - <code>onTouch</code> with press effects
          </li>
          <li>
            <strong>Slider</strong> - <code>onTouchMove</code> for dragging thumb
          </li>
          <li>
            <strong>ScrollView</strong> - <code>onTouchMove</code> with momentum scrolling
          </li>
          <li>
            <strong>Dropdown</strong> - <code>onTouchOutside</code> for auto-close
          </li>
        </ul>
      </Section>
    </DocLayout>
  )
}
