/**
 * Responsive Design Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Responsive Design guide page
 */
export function ResponsiveDesignPage() {
  return (
    <DocLayout>
      <h1>Responsive Design</h1>
      <DocDescription>
        Build adaptive UIs that work across different screen sizes and resolutions. PhaserJSX
        provides flexible sizing units, constraints, and layout strategies for creating responsive
        game interfaces.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          Responsive design in PhaserJSX uses a combination of flexible sizing units, min/max
          constraints, and viewport-relative values.
        </SectionDescription>

        <h3>Sizing Philosophy</h3>
        <p>
          Unlike traditional web development with CSS media queries, game UIs typically scale
          smoothly across resolutions rather than "snapping" to breakpoints. PhaserJSX embraces this
          approach with:
        </p>

        <ul>
          <li>
            <strong>Relative Units</strong> - Percentages, <code>fill</code>, viewport units (vw/vh)
          </li>
          <li>
            <strong>Min/Max Constraints</strong> - Flexible sizing with boundaries
          </li>
          <li>
            <strong>Flex Layout</strong> - Automatic space distribution
          </li>
          <li>
            <strong>Calc Expressions</strong> - Complex size calculations
          </li>
        </ul>

        <p>
          This system lets you design once and have your UI adapt gracefully from small mobile
          screens (320x568) to large desktop displays (2560x1440+).
        </p>
      </Section>

      <Section title="Sizing Units">
        <SectionDescription>
          PhaserJSX supports multiple sizing units for width and height properties.
        </SectionDescription>

        <h3>Fixed Pixels</h3>
        <p>Absolute size in pixels. Simple and predictable but not responsive:</p>

        <CodeBlock language="tsx">
          {`<View width={200} height={100}>
  <Text text="Fixed 200x100" />
</View>`}
        </CodeBlock>

        <h3>Percentage</h3>
        <p>
          Relative to parent's content area (parent size minus padding). Essential for proportional
          layouts:
        </p>

        <CodeBlock language="tsx">
          {`<View width={800} height={600} padding={20}>
  {/* 80% of parent's content area = 80% of (800 - 40) = 608px */}
  <View width="80%" height="50%">
    <Text text="Relative sizing" />
  </View>
</View>`}
        </CodeBlock>

        <p>
          <strong>Note:</strong> Percentages resolve against the parent's <em>content area</em>{' '}
          (size after subtracting padding), not the total size. This prevents unexpected shrinking.
        </p>

        <h3>Fill</h3>
        <p>
          Expands to fill parent's content area (parent size minus padding). Equivalent to{' '}
          <code>100%</code> but semantically clearer:
        </p>

        <CodeBlock language="tsx">
          {`<View width={400} padding={10}>
  {/* Fills parent: 400 - 20 (padding) = 380px */}
  <View width="fill">
    <Text text="Fills parent" />
  </View>
</View>`}
        </CodeBlock>

        <p>
          Use <code>fill</code> for single children that should consume all available space. For
          multiple children, use flex layout instead.
        </p>

        <h3>Viewport Units</h3>
        <p>
          Relative to the game canvas/viewport dimensions. Useful for overlays, modals, and
          full-screen elements:
        </p>

        <CodeBlock language="tsx">
          {`// Viewport is 1920x1080
<View width="50vw" height="100vh">  {/* 960x1080 */}
  <Text text="Half screen width, full height" />
</View>

// Combine with max constraints for safety
<View width="90vw" maxWidth={1200}>
  <Text text="90% of viewport but never >1200px" />
</View>`}
        </CodeBlock>

        <ul>
          <li>
            <strong>vw</strong> - 1vw = 1% of viewport width
          </li>
          <li>
            <strong>vh</strong> - 1vh = 1% of viewport height
          </li>
        </ul>

        <p>
          <strong>Setup required:</strong> Viewport units need dimensions passed to{' '}
          <code>mountJSX()</code>:
        </p>

        <CodeBlock language="tsx">
          {`const scene = this.scene
const { width, height } = scene.scale

mountJSX(<App />, scene, { width, height })`}
        </CodeBlock>

        <h3>Auto</h3>
        <p>
          Size determined by content. The component measures its children and sets its own size
          accordingly:
        </p>

        <CodeBlock language="tsx">
          {`<View width="auto" height="auto">
  <Text text="Content determines size" />
  <View width={200} height={50} />
  {/* View automatically sizes to fit text + nested View */}
</View>`}
        </CodeBlock>

        <p>
          <code>auto</code> is the default when width/height are omitted. Use for components that
          should wrap their content naturally.
        </p>

        <h3>Calc Expressions</h3>
        <p>Combine units with arithmetic for precise control:</p>

        <CodeBlock language="tsx">
          {`<View width="calc(100% - 40px)">  {/* Parent width minus 40px */}
  <Text text="Calculated size" />
</View>

<View width="calc(50vw + 100px)">  {/* Half viewport + 100px */}
  <Text text="Viewport-based calc" />
</View>

<View height="calc(80% / 2)">  {/* Half of 80% parent height */}
  <Text text="Division calc" />
</View>`}
        </CodeBlock>

        <p>Supported operators: +, -, *, /</p>
      </Section>

      <Section title="Min/Max Constraints">
        <SectionDescription>
          Control size boundaries for responsive layouts that adapt within defined ranges.
        </SectionDescription>

        <h3>Basic Constraints</h3>
        <p>
          Set minimum and maximum boundaries for flexible sizing. Constraints work with all sizing
          units:
        </p>

        <CodeBlock language="tsx">
          {`// Button that fills width but stays between 80px and 200px
<View width="100%" minWidth={80} maxWidth={200}>
  <Text text="Responsive Button" />
</View>

// Sidebar with minimum width
<View flex={1} minWidth={200}>
  <Text text="Sidebar never shrinks below 200px" />
</View>

// Content area with maximum width for readability
<View width="fill" maxWidth={800}>
  <Text text="Wide screens get comfortable reading width" />
</View>`}
        </CodeBlock>

        <h3>Constraints with Percentages</h3>
        <p>Mix relative sizing with fixed boundaries:</p>

        <CodeBlock language="tsx">
          {`<View width="80%" minWidth={300} maxWidth={1000}>
  <Text text="80% of parent, but between 300-1000px" />
</View>`}
        </CodeBlock>

        <h3>Constraints with Viewport Units</h3>
        <p>Responsive to screen size with safety limits:</p>

        <CodeBlock language="tsx">
          {`// Modal: 90% of viewport but constrained
<View width="90vw" maxWidth={800} height="80vh" maxHeight={600}>
  <Text text="Modal Dialog" />
</View>

// Full-screen with minimum
<View width="100vw" minWidth={320}>
  <Text text="Never smaller than 320px (iPhone SE)" />
</View>`}
        </CodeBlock>

        <h3>Height Constraints</h3>
        <p>Same principles apply to height:</p>

        <CodeBlock language="tsx">
          {`// Flexible height with boundaries
<View height="auto" minHeight={100} maxHeight={400}>
  <Text text="Content-sized but bounded" />
</View>

// Viewport-relative height
<View height="50vh" minHeight={300}>
  <Text text="Half screen, minimum 300px" />
</View>`}
        </CodeBlock>

        <p>
          <strong>Tip:</strong> Use <code>minHeight</code> on scrollable containers to prevent them
          from collapsing when content is small.
        </p>
      </Section>

      <Section title="Flex Layout Strategies">
        <SectionDescription>
          Distribute space automatically using flex properties for adaptive layouts.
        </SectionDescription>

        <h3>Basic Flex Distribution</h3>
        <p>
          The <code>flex</code> prop distributes available space among children. Higher flex values
          get proportionally more space:
        </p>

        <CodeBlock language="tsx">
          {`<View direction="row" width={600} height={400}>
  {/* Sidebar: 1 part (150px if total is 600) */}
  <View flex={1} backgroundColor={0x3498db}>
    <Text text="Sidebar" />
  </View>

  {/* Main: 3 parts (450px if total is 600) */}
  <View flex={3} backgroundColor={0xe74c3c}>
    <Text text="Main Content" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Flex with Constraints</h3>
        <p>Combine flex growth with min/max boundaries:</p>

        <CodeBlock language="tsx">
          {`<View direction="row" width="fill">
  {/* Flexible sidebar with minimum */}
  <View flex={1} minWidth={200}>
    <Text text="Sidebar (min 200px)" />
  </View>

  {/* Flexible content with maximum for readability */}
  <View flex={2} maxWidth={900}>
    <Text text="Content (max 900px)" />
  </View>

  {/* Fixed-size panel */}
  <View width={250}>
    <Text text="Fixed Panel (250px)" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Responsive Columns</h3>
        <p>Create adaptive column layouts that adjust to available space:</p>

        <CodeBlock language="tsx">
          {`// Three-column layout with equal spacing
<View direction="row" width="fill" gap={20}>
  <View flex={1} minWidth={200}>
    <Text text="Column 1" />
  </View>
  <View flex={1} minWidth={200}>
    <Text text="Column 2" />
  </View>
  <View flex={1} minWidth={200}>
    <Text text="Column 3" />
  </View>
</View>`}
        </CodeBlock>

        <p>
          If the parent width drops below <code>3 * 200 + 2 * 20 = 640px</code>, columns will be
          clamped to their minimum widths and may overflow or wrap (depending on parent settings).
        </p>

        <h3>Holy Grail Layout</h3>
        <p>Classic three-column layout with header and footer:</p>

        <CodeBlock language="tsx">
          {`<View width="100vw" height="100vh" direction="column">
  {/* Header - fixed height */}
  <View height={60} backgroundColor={0x2c3e50}>
    <Text text="Header" />
  </View>

  {/* Main area - fills remaining space */}
  <View flex={1} direction="row">
    {/* Left sidebar */}
    <View width={250} backgroundColor={0x34495e}>
      <Text text="Left Sidebar" />
    </View>

    {/* Content - flexible with max width */}
    <View flex={1} maxWidth={1200} backgroundColor={0xecf0f1}>
      <Text text="Main Content" />
    </View>

    {/* Right sidebar */}
    <View width={250} backgroundColor={0x34495e}>
      <Text text="Right Sidebar" />
    </View>
  </View>

  {/* Footer - fixed height */}
  <View height={40} backgroundColor={0x2c3e50}>
    <Text text="Footer" />
  </View>
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Responsive Patterns">
        <SectionDescription>
          Common layout patterns for building adaptive game interfaces.
        </SectionDescription>

        <h3>Centered Container with Max Width</h3>
        <p>Content that centers and constrains on large screens:</p>

        <CodeBlock language="tsx">
          {`<View width="fill" alignItems="center">
  <View width="90%" maxWidth={1200}>
    <Text text="Centered content, max 1200px wide" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Responsive Card Grid</h3>
        <p>Cards that fill space with minimum sizes:</p>

        <CodeBlock language="tsx">
          {`<View direction="row" flexWrap="wrap" gap={16} width="fill">
  {cards.map(card => (
    <View
      key={card.id}
      width="calc(33% - 16px)"  // Three columns with gap
      minWidth={250}
      height={200}
    >
      <Text text={card.title} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <p>
          On narrow screens, cards wrap and take <code>minWidth={250}</code>. On wide screens, they
          distribute evenly across three columns.
        </p>

        <h3>Aspect Ratio Containers</h3>
        <p>Maintain aspect ratios using calc:</p>

        <CodeBlock language="tsx">
          {`// 16:9 aspect ratio box
<View width="100%" height="calc(100% * 9 / 16)">
  <Text text="16:9 video player" />
</View>

// Square aspect ratio
<View width={400} height={400}>
  <Text text="Square content" />
</View>`}
        </CodeBlock>

        <h3>Responsive Padding/Spacing</h3>
        <p>Scale spacing with viewport size:</p>

        <CodeBlock language="tsx">
          {`// Small screens: less padding
<View
  padding="calc(2vw)"
  minPadding={10}
  maxPadding={40}
>
  <Text text="Responsive padding" />
</View>`}
        </CodeBlock>

        <p>
          <strong>Note:</strong> <code>minPadding</code> and <code>maxPadding</code> aren't built-in
          props, but you can use conditional rendering based on viewport size if needed.
        </p>

        <h3>Full-Screen Overlay</h3>
        <p>Modals and dialogs that cover the viewport:</p>

        <CodeBlock language="tsx">
          {`<Portal>
  {/* Backdrop */}
  <View
    width="100vw"
    height="100vh"
    backgroundColor={0x000000}
    backgroundAlpha={0.5}
  >
    {/* Centered modal */}
    <View
      width="90vw"
      maxWidth={600}
      height="80vh"
      maxHeight={400}
      backgroundColor={0xffffff}
    >
      <Text text="Modal Dialog" />
    </View>
  </View>
</Portal>`}
        </CodeBlock>
      </Section>

      <Section title="Viewport Setup">
        <SectionDescription>
          Configure viewport dimensions for vw/vh units to work correctly.
        </SectionDescription>

        <h3>Basic Setup</h3>
        <p>
          Pass viewport dimensions to <code>mountJSX()</code> when mounting your UI:
        </p>

        <CodeBlock language="tsx">
          {`import { mountJSX } from '@number10/phaserjsx'

class MainScene extends Phaser.Scene {
  create() {
    const { width, height } = this.scale

    mountJSX(
      <App />,
      this,
      { width, height }
    )
  }
}`}
        </CodeBlock>

        <h3>Handling Resize</h3>
        <p>Update viewport when window/game resizes:</p>

        <CodeBlock language="tsx">
          {`class MainScene extends Phaser.Scene {
  create() {
    this.scale.on('resize', this.handleResize, this)
    this.mountUI()
  }

  handleResize(gameSize: { width: number; height: number }) {
    // Remount UI with new dimensions
    this.mountUI()
  }

  mountUI() {
    const { width, height } = this.scale

    mountJSX(
      <App />,
      this,
      { width, height }
    )
  }
}`}
        </CodeBlock>

        <p>
          <strong>Important:</strong> Remounting recreates all UI elements. For performance-critical
          applications, consider maintaining fixed viewport dimensions and using Phaser's scale
          manager instead.
        </p>

        <h3>Responsive Scale Manager</h3>
        <p>Configure Phaser's scale manager for responsive canvas:</p>

        <CodeBlock language="tsx">
          {`const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,           // Fit to window
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,                      // Design width
    height: 1080,                     // Design height
    min: {
      width: 320,
      height: 568
    },
    max: {
      width: 2560,
      height: 1440
    }
  },
  scene: [MainScene]
}

const game = new Phaser.Game(config)`}
        </CodeBlock>

        <p>
          This configuration scales the entire canvas to fit the window while maintaining aspect
          ratio. UI built with viewport units will adapt automatically.
        </p>
      </Section>

      <Section title="Best Practices">
        <SectionDescription>
          Guidelines for building maintainable, performant responsive layouts.
        </SectionDescription>

        <h3>Design for Common Resolutions</h3>
        <p>Test your UI at these key breakpoints:</p>

        <ul>
          <li>
            <strong>Mobile (Portrait)</strong> - 375x667 (iPhone SE), 390x844 (iPhone 13)
          </li>
          <li>
            <strong>Mobile (Landscape)</strong> - 667x375, 844x390
          </li>
          <li>
            <strong>Tablet</strong> - 768x1024 (iPad), 1024x768 (landscape)
          </li>
          <li>
            <strong>Desktop (Small)</strong> - 1280x720, 1366x768
          </li>
          <li>
            <strong>Desktop (Medium)</strong> - 1920x1080 (Full HD)
          </li>
          <li>
            <strong>Desktop (Large)</strong> - 2560x1440 (2K), 3840x2160 (4K)
          </li>
        </ul>

        <h3>Prefer Relative Units</h3>
        <ul>
          <li>
            Use percentages and <code>fill</code> for components that should adapt to parent size
          </li>
          <li>Use viewport units (vw/vh) for full-screen or proportional elements</li>
          <li>Reserve fixed pixels for precise elements (icons, borders, small buttons)</li>
          <li>
            Use <code>auto</code> for content-driven sizing (text labels, dynamic lists)
          </li>
        </ul>

        <h3>Always Set Constraints</h3>
        <p>Even flexible layouts need boundaries:</p>

        <CodeBlock language="tsx">
          {`// ✓ Good: Flexible with safety limits
<View width="80%" minWidth={300} maxWidth={1200}>
  <Text text="Readable on all screens" />
</View>

// ✗ Bad: Can become too small or too large
<View width="80%">
  <Text text="Might be 30px or 3000px" />
</View>`}
        </CodeBlock>

        <h3>Avoid Deeply Nested Percentages</h3>
        <p>Each percentage level compounds rounding errors and complexity:</p>

        <CodeBlock language="tsx">
          {`// ✗ Avoid: Hard to predict final size
<View width="80%">
  <View width="90%">
    <View width="75%">
      <Text text="What size am I?" />
    </View>
  </View>
</View>

// ✓ Better: Direct sizing or flex
<View width="fill">
  <View width={600}>
    <Text text="Clear 600px" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Test Content Overflow</h3>
        <p>Ensure text and images handle size constraints gracefully:</p>

        <ul>
          <li>
            Set <code>maxWidth</code> on containers with text to prevent ultra-wide lines
          </li>
          <li>
            Use <code>minWidth</code> to prevent text containers from collapsing
          </li>
          <li>Consider word wrapping or truncation for constrained text</li>
          <li>Test with minimum supported resolution (usually 320px width)</li>
        </ul>

        <h3>Performance Considerations</h3>
        <ul>
          <li>
            <strong>Avoid frequent remounting:</strong> Changing viewport dimensions remounts the
            entire tree - expensive operation
          </li>
          <li>
            <strong>Cache calc expressions:</strong> Size calculations are automatically cached, but
            avoid generating new calc strings on every render
          </li>
          <li>
            <strong>Use fixed sizes for static elements:</strong> Icons, borders, and decorative
            elements don't need dynamic sizing
          </li>
          <li>
            <strong>Limit nested flex layouts:</strong> Each flex level adds layout calculation
            overhead
          </li>
        </ul>

        <h3>Accessibility</h3>
        <ul>
          <li>
            <strong>Minimum touch targets:</strong> 44x44 pixels minimum for interactive elements
          </li>
          <li>
            <strong>Readable text:</strong> Minimum 12px font size, maximum line length ~80
            characters
          </li>
          <li>
            <strong>Adequate spacing:</strong> Minimum 8px padding, 4px gaps between elements
          </li>
          <li>
            <strong>Contrast at all sizes:</strong> Ensure backgrounds remain distinguishable from
            content
          </li>
        </ul>
      </Section>

      <Section title="Examples">
        <SectionDescription>Study real-world responsive implementations.</SectionDescription>

        <h3>View Component Constraints</h3>
        <p>
          See the <a href="/components/view">View Component</a> documentation for min/max constraint
          examples and sizing demonstrations.
        </p>

        <h3>Test App Layouts</h3>
        <p>
          Study <code>apps/test-ui/src/examples/ConstraintsExample.tsx</code> for comprehensive
          constraint examples:
        </p>
        <ul>
          <li>Responsive buttons with min/max widths</li>
          <li>Flexible sidebars with minimum widths</li>
          <li>Readable content areas with maximum widths</li>
          <li>Image galleries with constrained heights</li>
          <li>Complex flex layouts with competing constraints</li>
          <li>Percentage-based constraints</li>
          <li>Viewport-based constraints (vw/vh)</li>
        </ul>

        <h3>ScrollView Adaptation</h3>
        <p>
          The <a href="/components/scroll-view">ScrollView Component</a> demonstrates responsive
          scrolling with viewport-relative sizing and dynamic content areas.
        </p>
      </Section>
    </DocLayout>
  )
}
