/**
 * Layout Patterns Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Layout Patterns guide page
 */
export function LayoutPatternsPage() {
  return (
    <DocLayout>
      <h1>Layout Patterns</h1>
      <DocDescription>
        Master common layout patterns using PhaserJSX's flexbox-inspired system. Learn direction,
        alignment, spacing, wrapping, and flex distribution for building complex UIs.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          PhaserJSX uses a flexbox-inspired layout engine with familiar concepts from web
          development and native frameworks.
        </SectionDescription>

        <h3>Core Concepts</h3>
        <p>The layout system revolves around four fundamental properties:</p>

        <ul>
          <li>
            <strong>direction</strong> - Main axis: <code>row</code>, <code>column</code>, or{' '}
            <code>stack</code>
          </li>
          <li>
            <strong>justifyContent</strong> - Main axis alignment (start, center, end,
            space-between, space-around, space-evenly)
          </li>
          <li>
            <strong>alignItems</strong> - Cross axis alignment (start, center, end, stretch)
          </li>
          <li>
            <strong>gap</strong> - Spacing between children
          </li>
        </ul>

        <p>
          These combine with <code>flex</code>, <code>flexWrap</code>, and <code>alignContent</code>{' '}
          for advanced layouts.
        </p>

        <h3>Terminology</h3>
        <ul>
          <li>
            <strong>Main Axis</strong> - Primary direction of layout (horizontal for row, vertical
            for column)
          </li>
          <li>
            <strong>Cross Axis</strong> - Perpendicular to main axis (vertical for row, horizontal
            for column)
          </li>
          <li>
            <strong>Content Area</strong> - Container size minus padding
          </li>
          <li>
            <strong>Line</strong> - Row of children (when wrapping enabled)
          </li>
        </ul>
      </Section>

      <Section title="Direction & Stacking">
        <SectionDescription>
          Control the primary layout axis with the <code>direction</code> property.
        </SectionDescription>

        <h3>Column (Vertical)</h3>
        <p>
          Default direction. Stacks children vertically like SwiftUI's <code>VStack</code>:
        </p>

        <CodeBlock language="tsx">
          {`<View direction="column" gap={10}>
  <View height={50} backgroundColor={0x3498db}>
    <Text text="First" />
  </View>
  <View height={50} backgroundColor={0xe74c3c}>
    <Text text="Second" />
  </View>
  <View height={50} backgroundColor={0x2ecc71}>
    <Text text="Third" />
  </View>
</View>`}
        </CodeBlock>

        <p>Main axis: vertical (top to bottom). Cross axis: horizontal (left to right).</p>

        <h3>Row (Horizontal)</h3>
        <p>
          Stacks children horizontally like SwiftUI's <code>HStack</code>:
        </p>

        <CodeBlock language="tsx">
          {`<View direction="row" gap={10}>
  <View width={80} height={60} backgroundColor={0x3498db}>
    <Text text="First" />
  </View>
  <View width={80} height={60} backgroundColor={0xe74c3c}>
    <Text text="Second" />
  </View>
  <View width={80} height={60} backgroundColor={0x2ecc71}>
    <Text text="Third" />
  </View>
</View>`}
        </CodeBlock>

        <p>Main axis: horizontal (left to right). Cross axis: vertical (top to bottom).</p>

        <h3>Stack (Overlay)</h3>
        <p>
          Overlays children at the same position like SwiftUI's <code>ZStack</code>:
        </p>

        <CodeBlock language="tsx">
          {`<View direction="stack" width={200} height={200}>
  {/* Background */}
  <View width={200} height={200} backgroundColor={0x3498db} />

  {/* Icon overlay */}
  <Icon name="star" size={64} color={0xffffff} />

  {/* Badge overlay */}
  <View
    width={30}
    height={30}
    backgroundColor={0xe74c3c}
    x={170}
    y={0}
  >
    <Text text="5" />
  </View>
</View>`}
        </CodeBlock>

        <p>
          Children are positioned at (0, 0) by default. Use <code>x</code> and <code>y</code> props
          for custom positioning within the stack.
        </p>
      </Section>

      <Section title="Main Axis Alignment">
        <SectionDescription>
          The <code>justifyContent</code> property controls how children are distributed along the
          main axis.
        </SectionDescription>

        <h3>Start, Center, End</h3>
        <p>Basic alignment positions:</p>

        <CodeBlock language="tsx">
          {`// Pack to start (left for row, top for column)
<View direction="row" justifyContent="start" width={400}>
  <Box /><Box /><Box />
</View>

// Center children
<View direction="row" justifyContent="center" width={400}>
  <Box /><Box /><Box />
</View>

// Pack to end (right for row, bottom for column)
<View direction="row" justifyContent="end" width={400}>
  <Box /><Box /><Box />
</View>`}
        </CodeBlock>

        <h3>Space Distribution</h3>
        <p>Distribute space between and around children:</p>

        <CodeBlock language="tsx">
          {`// First at start, last at end, equal space between
<View direction="row" justifyContent="space-between" width={400}>
  <Box /><Box /><Box />
</View>

// Equal space around each child
<View direction="row" justifyContent="space-around" width={400}>
  <Box /><Box /><Box />
</View>

// Equal space between and around all children
<View direction="row" justifyContent="space-evenly" width={400}>
  <Box /><Box /><Box />
</View>`}
        </CodeBlock>

        <p>
          <strong>Visual differences:</strong>
        </p>
        <ul>
          <li>
            <strong>space-between:</strong> <code>[Box]___[Box]___[Box]</code>
          </li>
          <li>
            <strong>space-around:</strong> <code>_[Box]__[Box]__[Box]_</code>
          </li>
          <li>
            <strong>space-evenly:</strong> <code>__[Box]__[Box]__[Box]__</code>
          </li>
        </ul>

        <p>
          <strong>Note:</strong> Space distribution only applies when there's extra space available.
          Use with fixed container sizes or flex parents.
        </p>

        <h3>Vertical Distribution</h3>
        <p>Same properties work for column direction to distribute children vertically:</p>

        <CodeBlock language="tsx">
          {`<View direction="column" justifyContent="space-between" height={400}>
  <View height={60} backgroundColor={0x3498db}>
    <Text text="Header" />
  </View>
  <View height={60} backgroundColor={0xe74c3c}>
    <Text text="Content" />
  </View>
  <View height={60} backgroundColor={0x2ecc71}>
    <Text text="Footer" />
  </View>
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Cross Axis Alignment">
        <SectionDescription>
          The <code>alignItems</code> property controls how children align perpendicular to the main
          axis.
        </SectionDescription>

        <h3>Basic Alignment</h3>
        <p>
          For row direction, <code>alignItems</code> controls vertical alignment:
        </p>

        <CodeBlock language="tsx">
          {`// Align to top
<View direction="row" alignItems="start" height={100}>
  <View width={60} height={40} backgroundColor={0x3498db} />
  <View width={60} height={60} backgroundColor={0xe74c3c} />
  <View width={60} height={30} backgroundColor={0x2ecc71} />
</View>

// Center vertically (default)
<View direction="row" alignItems="center" height={100}>
  <View width={60} height={40} backgroundColor={0x3498db} />
  <View width={60} height={60} backgroundColor={0xe74c3c} />
  <View width={60} height={30} backgroundColor={0x2ecc71} />
</View>

// Align to bottom
<View direction="row" alignItems="end" height={100}>
  <View width={60} height={40} backgroundColor={0x3498db} />
  <View width={60} height={60} backgroundColor={0xe74c3c} />
  <View width={60} height={30} backgroundColor={0x2ecc71} />
</View>`}
        </CodeBlock>

        <h3>Stretch</h3>
        <p>Make children fill the cross axis:</p>

        <CodeBlock language="tsx">
          {`// Children stretch to container height
<View direction="row" alignItems="stretch" height={120}>
  <View width={60} backgroundColor={0x3498db}>
    <Text text="Stretched" />
  </View>
  <View width={60} backgroundColor={0xe74c3c}>
    <Text text="To" />
  </View>
  <View width={60} backgroundColor={0x2ecc71}>
    <Text text="120px" />
  </View>
</View>`}
        </CodeBlock>

        <p>
          <strong>Important:</strong> <code>stretch</code> requires the container to have a fixed
          size on the cross axis. Otherwise, children use their intrinsic sizes.
        </p>

        <h3>Column Direction</h3>
        <p>
          For column direction, <code>alignItems</code> controls horizontal alignment:
        </p>

        <CodeBlock language="tsx">
          {`// Align to left
<View direction="column" alignItems="start" width={200}>
  <View width={80} height={40} backgroundColor={0x3498db} />
  <View width={120} height={40} backgroundColor={0xe74c3c} />
  <View width={60} height={40} backgroundColor={0x2ecc71} />
</View>

// Center horizontally
<View direction="column" alignItems="center" width={200}>
  <View width={80} height={40} backgroundColor={0x3498db} />
  <View width={120} height={40} backgroundColor={0xe74c3c} />
  <View width={60} height={40} backgroundColor={0x2ecc71} />
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Flex Distribution">
        <SectionDescription>
          The <code>flex</code> property enables dynamic space distribution among children.
        </SectionDescription>

        <h3>Basic Flex Growth</h3>
        <p>
          Children with <code>flex</code> share remaining space proportionally:
        </p>

        <CodeBlock language="tsx">
          {`// Fixed + flexible layout
<View direction="row" width={600} gap={10}>
  {/* Fixed width sidebar */}
  <View width={150} backgroundColor={0x3498db}>
    <Text text="Sidebar" />
  </View>

  {/* Fills remaining space (600 - 150 - 10 = 440px) */}
  <View flex={1} backgroundColor={0xe74c3c}>
    <Text text="Content" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Proportional Distribution</h3>
        <p>Use different flex values for proportional sharing:</p>

        <CodeBlock language="tsx">
          {`// Three columns with 1:2:3 ratio
<View direction="row" width={600} gap={10}>
  <View flex={1} backgroundColor={0x3498db}>
    <Text text="1 part" />  {/* 100px */}
  </View>
  <View flex={2} backgroundColor={0xe74c3c}>
    <Text text="2 parts" />  {/* 200px */}
  </View>
  <View flex={3} backgroundColor={0x2ecc71}>
    <Text text="3 parts" />  {/* 300px */}
  </View>
</View>`}
        </CodeBlock>

        <p>
          Calculation: Total flex sum = 1 + 2 + 3 = 6. Each flex unit = (600 - 20 gap) / 6 ≈
          96.67px. Flex 1 ≈ 97px, flex 2 ≈ 193px, flex 3 ≈ 290px.
        </p>

        <h3>Spacer Pattern</h3>
        <p>
          Use <code>flex={1}</code> as a spacer to push elements apart:
        </p>

        <CodeBlock language="tsx">
          {`<View direction="row" width="fill">
  {/* Left side */}
  <View width={80} backgroundColor={0x3498db}>
    <Text text="Logo" />
  </View>

  {/* Spacer - fills remaining space */}
  <View flex={1} />

  {/* Right side - pushed to the end */}
  <View width={100} backgroundColor={0xe74c3c}>
    <Text text="Menu" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Flex with Constraints</h3>
        <p>Combine flex growth with min/max boundaries:</p>

        <CodeBlock language="tsx">
          {`<View direction="row" width="fill" gap={10}>
  {/* Flexible sidebar with minimum */}
  <View flex={1} minWidth={200} maxWidth={300} backgroundColor={0x3498db}>
    <Text text="Sidebar: 200-300px" />
  </View>

  {/* Flexible content with maximum for readability */}
  <View flex={2} maxWidth={800} backgroundColor={0xe74c3c}>
    <Text text="Content: max 800px" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Vertical Flex</h3>
        <p>Flex works the same way for column direction:</p>

        <CodeBlock language="tsx">
          {`<View direction="column" height={600} gap={10}>
  {/* Fixed header */}
  <View height={60} backgroundColor={0x3498db}>
    <Text text="Header" />
  </View>

  {/* Flexible content - fills remaining space */}
  <View flex={1} backgroundColor={0xe74c3c}>
    <Text text="Main Content" />
  </View>

  {/* Fixed footer */}
  <View height={40} backgroundColor={0x2ecc71}>
    <Text text="Footer" />
  </View>
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Wrapping Layouts">
        <SectionDescription>
          Enable multi-line layouts with <code>flexWrap</code> for responsive grid patterns.
        </SectionDescription>

        <h3>Basic Wrapping</h3>
        <p>Items wrap to next line when space runs out:</p>

        <CodeBlock language="tsx">
          {`<View direction="row" flexWrap="wrap" gap={10} width={400}>
  {Array.from({ length: 12 }).map((_, i) => (
    <View
      key={i}
      width={90}
      height={90}
      backgroundColor={0x3498db}
    >
      <Text text={\`\${i + 1}\`} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <p>
          With width 400px and 90px items + 10px gaps: 3 items fit per line (90 + 10 + 90 + 10 + 90
          = 280px). Fourth item wraps to new line.
        </p>

        <h3>Wrap Reverse</h3>
        <p>Lines appear in reverse order (bottom to top for row, right to left for column):</p>

        <CodeBlock language="tsx">
          {`<View direction="row" flexWrap="wrap-reverse" gap={10} width={300}>
  {[1, 2, 3, 4, 5, 6].map(n => (
    <View key={n} width={80} height={60} backgroundColor={0x3498db}>
      <Text text={\`\${n}\`} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <p>Result: Lines render from bottom to top. Second line appears above first line.</p>

        <h3>Responsive Card Grid</h3>
        <p>Variable-width cards that wrap automatically:</p>

        <CodeBlock language="tsx">
          {`<View
  direction="row"
  flexWrap="wrap"
  gap={15}
  width="fill"
  justifyContent="center"
>
  {products.map(product => (
    <View
      key={product.id}
      width={180}
      height={200}
      backgroundColor={0x3498db}
      padding={10}
    >
      <Text text={product.name} />
      <Text text={\`$\${product.price}\`} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <h3>Column Wrapping</h3>
        <p>Wrap vertically when height is constrained:</p>

        <CodeBlock language="tsx">
          {`<View
  direction="column"
  flexWrap="wrap"
  height={250}
  width="fill"
  gap={10}
>
  {Array.from({ length: 10 }).map((_, i) => (
    <View
      key={i}
      width={100}
      height={50}
      backgroundColor={0x3498db}
    >
      <Text text={\`Item \${i + 1}\`} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <p>
          Items stack vertically until height limit (250px), then wrap to next column horizontally.
        </p>
      </Section>

      <Section title="Multi-Line Alignment">
        <SectionDescription>
          Use <code>alignContent</code> to control distribution of wrapped lines along the cross
          axis.
        </SectionDescription>

        <h3>Understanding alignContent</h3>
        <p>
          When wrapping creates multiple lines, <code>alignContent</code> controls how those lines
          are distributed:
        </p>

        <ul>
          <li>
            <strong>alignItems:</strong> Aligns items within each line
          </li>
          <li>
            <strong>alignContent:</strong> Aligns the lines themselves
          </li>
        </ul>

        <p>
          <strong>Requires:</strong> <code>flexWrap="wrap"</code> and fixed container size on cross
          axis.
        </p>

        <h3>Space Between Lines</h3>
        <p>First line at start, last line at end, equal space between:</p>

        <CodeBlock language="tsx">
          {`<View
  direction="row"
  flexWrap="wrap"
  alignContent="space-between"
  width={300}
  height={250}
  gap={10}
>
  {Array.from({ length: 9 }).map((_, i) => (
    <View
      key={i}
      width={80}
      height={60}
      backgroundColor={0x3498db}
    >
      <Text text={\`\${i + 1}\`} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <p>
          With 3 items per line (3 lines total), first line aligns to top, last to bottom, middle
          line centered.
        </p>

        <h3>Center Lines</h3>
        <p>All lines centered in the container:</p>

        <CodeBlock language="tsx">
          {`<View
  direction="row"
  flexWrap="wrap"
  alignContent="center"
  width={300}
  height={250}
  gap={10}
>
  {Array.from({ length: 6 }).map((_, i) => (
    <View
      key={i}
      width={90}
      height={70}
      backgroundColor={0xe74c3c}
    >
      <Text text={\`\${i + 1}\`} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <h3>Space Around Lines</h3>
        <p>Equal space around each line:</p>

        <CodeBlock language="tsx">
          {`<View
  direction="row"
  flexWrap="wrap"
  alignContent="space-around"
  width={300}
  height={300}
  gap={10}
>
  {items.map(item => (
    <View key={item.id} width={85} height={65} backgroundColor={0x2ecc71}>
      <Text text={item.name} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <h3>Stretch Lines</h3>
        <p>
          Lines stretch to fill available cross-axis space (default <code>alignContent</code>{' '}
          behavior):
        </p>

        <CodeBlock language="tsx">
          {`<View
  direction="row"
  flexWrap="wrap"
  alignContent="stretch"
  width={300}
  height={400}
  gap={10}
>
  {Array.from({ length: 8 }).map((_, i) => (
    <View
      key={i}
      width={80}
      backgroundColor={0xf39c12}
    >
      <Text text={\`\${i + 1}\`} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <p>Each line expands vertically to fill equal portions of the 400px height.</p>
      </Section>

      <Section title="Common Patterns">
        <SectionDescription>
          Practical layout patterns for building game interfaces.
        </SectionDescription>

        <h3>Header-Content-Footer</h3>
        <p>Classic three-section vertical layout:</p>

        <CodeBlock language="tsx">
          {`<View direction="column" width="fill" height="100vh">
  {/* Header - fixed height */}
  <View height={60} backgroundColor={0x2c3e50}>
    <Text text="Game Title" />
  </View>

  {/* Content - fills remaining space */}
  <View flex={1} backgroundColor={0x34495e}>
    <Text text="Game Area" />
  </View>

  {/* Footer - fixed height */}
  <View height={40} backgroundColor={0x2c3e50}>
    <Text text="Controls" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Sidebar Layout</h3>
        <p>Fixed sidebar with flexible content:</p>

        <CodeBlock language="tsx">
          {`<View direction="row" width="fill" height="fill">
  {/* Sidebar - fixed width */}
  <View width={250} backgroundColor={0x2c3e50}>
    <Text text="Navigation" />
  </View>

  {/* Main content - fills remaining space */}
  <View flex={1} backgroundColor={0xecf0f1}>
    <Text text="Content Area" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Holy Grail Layout</h3>
        <p>Header, footer, three columns:</p>

        <CodeBlock language="tsx">
          {`<View direction="column" width="100vw" height="100vh">
  {/* Header */}
  <View height={60} backgroundColor={0x2c3e50}>
    <Text text="Header" />
  </View>

  {/* Three-column content */}
  <View flex={1} direction="row">
    <View width={200} backgroundColor={0x34495e}>
      <Text text="Left Sidebar" />
    </View>
    <View flex={1} backgroundColor={0xecf0f1}>
      <Text text="Main Content" />
    </View>
    <View width={200} backgroundColor={0x34495e}>
      <Text text="Right Sidebar" />
    </View>
  </View>

  {/* Footer */}
  <View height={40} backgroundColor={0x2c3e50}>
    <Text text="Footer" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Centered Modal</h3>
        <p>Center content both horizontally and vertically:</p>

        <CodeBlock language="tsx">
          {`<View
  width="100vw"
  height="100vh"
  justifyContent="center"
  alignItems="center"
  backgroundColor={0x000000}
  backgroundAlpha={0.5}
>
  <View
    width={400}
    height={300}
    backgroundColor={0xffffff}
    padding={20}
  >
    <Text text="Modal Dialog" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Toolbar with Actions</h3>
        <p>Left-aligned items with right-aligned actions:</p>

        <CodeBlock language="tsx">
          {`<View direction="row" width="fill" height={50} padding={10} gap={10}>
  {/* Left side items */}
  <View width={40} backgroundColor={0x3498db}>
    <Icon name="menu" />
  </View>
  <Text text="Title" />

  {/* Spacer - pushes right items to the end */}
  <View flex={1} />

  {/* Right side actions */}
  <View width={40} backgroundColor={0xe74c3c}>
    <Icon name="search" />
  </View>
  <View width={40} backgroundColor={0x2ecc71}>
    <Icon name="settings" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Badge Overlay</h3>
        <p>Position badge on top-right of an icon:</p>

        <CodeBlock language="tsx">
          {`<View direction="stack" width={64} height={64}>
  {/* Main icon */}
  <Icon name="bell" size={64} color={0x3498db} />

  {/* Badge overlay */}
  <View
    width={20}
    height={20}
    backgroundColor={0xe74c3c}
    x={44}
    y={0}
    justifyContent="center"
    alignItems="center"
  >
    <Text text="3" style={{ fontSize: '12px' }} />
  </View>
</View>`}
        </CodeBlock>

        <h3>Uniform Grid</h3>
        <p>Fixed-size items in a wrapping grid:</p>

        <CodeBlock language="tsx">
          {`<View
  direction="row"
  flexWrap="wrap"
  gap={10}
  width={400}
  padding={10}
>
  {inventory.map(item => (
    <View
      key={item.id}
      width={85}
      height={85}
      backgroundColor={0x34495e}
      justifyContent="center"
      alignItems="center"
    >
      <Icon name={item.icon} size={48} />
      <Text text={\`x\${item.count}\`} />
    </View>
  ))}
</View>`}
        </CodeBlock>

        <h3>Responsive Columns</h3>
        <p>Equal-width columns that adapt to container size:</p>

        <CodeBlock language="tsx">
          {`<View direction="row" width="fill" gap={20}>
  <View flex={1} minWidth={200} backgroundColor={0x3498db}>
    <Text text="Column 1" />
  </View>
  <View flex={1} minWidth={200} backgroundColor={0xe74c3c}>
    <Text text="Column 2" />
  </View>
  <View flex={1} minWidth={200} backgroundColor={0x2ecc71}>
    <Text text="Column 3" />
  </View>
</View>`}
        </CodeBlock>

        <p>Each column gets equal width, but never shrinks below 200px.</p>
      </Section>

      <Section title="Best Practices">
        <SectionDescription>Guidelines for maintainable, performant layouts.</SectionDescription>

        <h3>Choose the Right Direction</h3>
        <ul>
          <li>
            Use <code>column</code> for vertical stacks (menus, lists, forms)
          </li>
          <li>
            Use <code>row</code> for horizontal arrangements (toolbars, button groups, tabs)
          </li>
          <li>
            Use <code>stack</code> for overlays (badges, tooltips, backgrounds)
          </li>
          <li>Avoid deep nesting - flatten when possible</li>
        </ul>

        <h3>Prefer Gap Over Margin</h3>
        <p>Use container gap instead of margins on children:</p>

        <CodeBlock language="tsx">
          {`// ✓ Good: Gap on container
<View direction="row" gap={10}>
  <Box />
  <Box />
  <Box />
</View>

// ✗ Avoid: Margins on children
<View direction="row">
  <Box margin={{ right: 10 }} />
  <Box margin={{ right: 10 }} />
  <Box />
</View>`}
        </CodeBlock>

        <p>
          Gap is clearer, more maintainable, and handles edge cases (first/last child)
          automatically.
        </p>

        <h3>Use Flex for Dynamic Sizing</h3>
        <p>Combine fixed and flexible elements:</p>

        <CodeBlock language="tsx">
          {`// ✓ Good: Fixed sidebar + flexible content
<View direction="row" width="fill">
  <View width={200}>Sidebar</View>
  <View flex={1}>Content</View>
</View>

// ✗ Avoid: Hardcoded widths
<View direction="row" width="fill">
  <View width={200}>Sidebar</View>
  <View width={1720}>Content</View>  {/* Breaks at other resolutions */}
</View>`}
        </CodeBlock>

        <h3>Wrapping for Responsive Grids</h3>
        <p>Enable wrapping for items that should flow:</p>

        <CodeBlock language="tsx">
          {`// ✓ Good: Auto-wrapping grid
<View direction="row" flexWrap="wrap" gap={10} width="fill">
  {items.map(item => (
    <View key={item.id} width={100} height={100}>
      {item.content}
    </View>
  ))}
</View>

// ✗ Avoid: Fixed row count
<View direction="row" gap={10}>
  {items.slice(0, 5).map(item => <View>{item.content}</View>)}
</View>`}
        </CodeBlock>

        <h3>AlignContent vs AlignItems</h3>
        <p>Use the right property for your needs:</p>

        <ul>
          <li>
            <strong>alignItems:</strong> Align children within their line (single-line or
            multi-line)
          </li>
          <li>
            <strong>alignContent:</strong> Distribute multiple lines within container (requires
            wrapping)
          </li>
        </ul>

        <CodeBlock language="tsx">
          {`// alignItems: Centers each item vertically in its row
<View direction="row" alignItems="center" height={100}>
  <Box height={30} />
  <Box height={60} />
  <Box height={40} />
</View>

// alignContent: Centers all lines together vertically
<View
  direction="row"
  flexWrap="wrap"
  alignContent="center"
  height={300}
  width={200}
>
  {/* Multiple lines of boxes */}
</View>`}
        </CodeBlock>

        <h3>Performance Tips</h3>
        <ul>
          <li>
            Avoid deeply nested layouts (&gt;5 levels) - impacts layout calculation performance
          </li>
          <li>
            Use <code>direction="stack"</code> sparingly - doesn't benefit from layout engine
            optimizations
          </li>
          <li>Prefer fixed sizes over auto when dimensions are known</li>
          <li>Minimize use of percentage sizing on deeply nested elements</li>
          <li>
            Use <code>flexWrap="nowrap"</code> (default) unless wrapping is required
          </li>
        </ul>

        <h3>Debugging Layouts</h3>
        <p>Add temporary backgrounds to visualize layout structure:</p>

        <CodeBlock language="tsx">
          {`// During development
<View
  direction="row"
  backgroundColor={0xff0000}  // Red background shows bounds
  backgroundAlpha={0.3}        // Semi-transparent
>
  <View width={200} backgroundColor={0x00ff00} backgroundAlpha={0.3}>
    Sidebar
  </View>
  <View flex={1} backgroundColor={0x0000ff} backgroundAlpha={0.3}>
    Content
  </View>
</View>`}
        </CodeBlock>

        <p>Remove backgrounds once layout is correct.</p>
      </Section>

      <Section title="Examples">
        <SectionDescription>Study real-world layout implementations.</SectionDescription>

        <h3>View Component Documentation</h3>
        <p>
          See the <a href="/components/view">View Component</a> documentation for interactive
          examples demonstrating:
        </p>
        <ul>
          <li>Flex direction (row, column, stack)</li>
          <li>Space distribution (space-between, space-around, space-evenly)</li>
          <li>Wrapping behavior (wrap, wrap-reverse)</li>
          <li>Cross-axis alignment</li>
        </ul>

        <h3>Test App Examples</h3>
        <p>Comprehensive layout examples in the test app:</p>
        <ul>
          <li>
            <code>FlexExample.tsx</code> - Flex distribution, proportional sizing, spacer pattern,
            vertical flex
          </li>
          <li>
            <code>FlexGridExample.tsx</code> - Wrapping grids, alignContent, responsive cards,
            column wrapping
          </li>
          <li>
            <code>StackExample.tsx</code> - Overlay patterns, badge positioning, layered backgrounds
          </li>
        </ul>

        <h3>Complex Layouts</h3>
        <p>Study complex real-world layouts in:</p>
        <ul>
          <li>
            <strong>Accordion:</strong> Nested flex layouts with expanding sections
          </li>
          <li>
            <strong>Dropdown:</strong> Overlay positioning with stack direction
          </li>
          <li>
            <strong>Modal:</strong> Centered overlay with backdrop
          </li>
          <li>
            <strong>ScrollView:</strong> Flex content areas with constrained scrolling
          </li>
        </ul>
      </Section>
    </DocLayout>
  )
}
