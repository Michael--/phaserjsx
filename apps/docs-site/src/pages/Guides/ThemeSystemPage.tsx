/**
 * Theme System Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import '@/styles/docs.css'

/**
 * Theme System guide page
 */
export function ThemeSystemPage() {
  return (
    <DocLayout>
      <h1>Theme System</h1>
      <DocDescription>
        A comprehensive, type-safe theme system that enables centralized styling, automatic
        inheritance, and dynamic color modes. Customize your entire UI from a single source or
        override styles at any component level.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          PhaserJSX's theme system provides consistent, maintainable styling across your entire
          application.
        </SectionDescription>

        <h3>Key Capabilities</h3>
        <ul>
          <li>
            <strong>Global Theme Registry</strong> - Define default styles for all components in one
            place
          </li>
          <li>
            <strong>Local Theme Overrides</strong> - Override themes at any component level with
            automatic inheritance
          </li>
          <li>
            <strong>Type-Safe Configuration</strong> - Full TypeScript support with autocomplete for
            all theme properties
          </li>
          <li>
            <strong>Nested Component Theming</strong> - Theme child components directly from parent
            definitions
          </li>
          <li>
            <strong>Color System</strong> - Pre-built color presets with light/dark mode support
          </li>
          <li>
            <strong>Custom Component Support</strong> - Extend the theme system for your own
            components via module augmentation
          </li>
        </ul>

        <h3>Priority System</h3>
        <p>When multiple sources define the same property, PhaserJSX applies this precedence:</p>
        <ol>
          <li>
            <strong>Explicit Props</strong> - Props passed directly to components (highest priority)
          </li>
          <li>
            <strong>Local Theme</strong> - Theme provided via <code>theme</code> prop on parent
            components
          </li>
          <li>
            <strong>Global Theme</strong> - Theme defined in the global registry
          </li>
          <li>
            <strong>Component Defaults</strong> - Built-in default values (lowest priority)
          </li>
        </ol>

        <p>
          This system ensures explicit control when needed while providing sensible defaults
          everywhere else.
        </p>
      </Section>

      <Section title="Global Theme Configuration">
        <SectionDescription>
          Set application-wide defaults using the theme registry and color presets.
        </SectionDescription>

        <h3>Using Color Presets</h3>
        <p>
          PhaserJSX includes three built-in color presets: <code>oceanBlue</code> (professional
          blue), <code>forestGreen</code> (nature-inspired), and <code>midnight</code> (dark
          elegance). Each preset provides semantic color tokens for consistent UI design:
        </p>

        <ul>
          <li>
            <strong>Brand colors</strong> - primary, secondary, accent
          </li>
          <li>
            <strong>Feedback colors</strong> - success, warning, error, info
          </li>
          <li>
            <strong>Neutral colors</strong> - background, surface, text, border
          </li>
        </ul>

        <p>
          Each color token includes five shades: <code>lightest</code>, <code>light</code>,{' '}
          <code>medium</code>, <code>dark</code>, <code>darkest</code>, plus a <code>DEFAULT</code>{' '}
          alias pointing to <code>medium</code>.
        </p>

        <CodeBlock language="tsx">
          {`import { createTheme, getPresetWithMode } from '@number10/phaserjsx'

// Get preset with color mode
const preset = getPresetWithMode('oceanBlue', 'light')
const { colors } = preset

// Create theme using color tokens
const theme = createTheme({
  Text: {
    style: {
      color: colors.text.DEFAULT.toString(),  // Semantic token
      fontSize: '16px',
      fontFamily: 'Arial'
    }
  },
  View: {
    backgroundColor: colors.surface.light.toNumber(),
    borderColor: colors.border.medium.toNumber(),
    cornerRadius: 8
  },
  Button: {
    backgroundColor: colors.primary.DEFAULT.toNumber(),
    borderColor: colors.primary.dark.toNumber(),
    textStyle: {
      color: colors.text.lightest.toString()
    }
  }
})`}
        </CodeBlock>

        <h3>Light and Dark Mode</h3>
        <p>
          Color presets automatically adjust neutral colors (background, surface, text, border)
          based on the mode parameter. Brand and feedback colors remain consistent across modes for
          visual identity:
        </p>

        <CodeBlock language="tsx">
          {`// Light mode - bright backgrounds, dark text
const lightPreset = getPresetWithMode('oceanBlue', 'light')
// background.DEFAULT -> #e0e0e0 (light gray)
// text.DEFAULT -> #616161 (dark gray)

// Dark mode - dark backgrounds, light text
const darkPreset = getPresetWithMode('oceanBlue', 'dark')
// background.DEFAULT -> #212121 (dark gray)
// text.DEFAULT -> #bdbdbd (light gray)

// Primary color unchanged
// lightPreset.colors.primary === darkPreset.colors.primary`}
        </CodeBlock>

        <p>
          This ensures consistent branding while optimizing readability for each mode. Switch modes
          dynamically using <code>setColorMode()</code> to trigger re-theming across your
          application.
        </p>

        <h3>Nested Component Themes</h3>
        <p>
          Theme definitions support nesting to style child components directly from parent
          configurations. This pattern is particularly powerful for custom components that need
          consistent internal styling:
        </p>

        <CodeBlock language="tsx">
          {`const theme = createTheme({
  // Global theme affects all Sidebar components
  Sidebar: {
    backgroundColor: colors.surface.dark.toNumber(),
    padding: 10,
    gap: 10,

    // Nested: affects Text components INSIDE Sidebar
    Text: {
      style: {
        color: colors.text.light.toString(),
        fontSize: '18px'
      }
    },

    // Nested: affects View components INSIDE Sidebar
    View: {
      gap: 5,
      cornerRadius: 4
    }
  }
})`}
        </CodeBlock>

        <p>
          When <code>Sidebar</code> renders, it extracts the nested <code>Text</code> and{' '}
          <code>View</code> themes using <code>getThemedProps()</code>, then passes them to child
          components via the <code>theme</code> prop. This creates a cascading theme hierarchy
          without manual prop threading.
        </p>

        <p>
          <strong>See the pattern in action:</strong> Check <code>apps/test-ui/src/Theme.tsx</code>{' '}
          for a complete example using nested themes with color presets.
        </p>
      </Section>

      <Section title="Local Theme Overrides">
        <SectionDescription>
          Override global themes at any component level for localized customization.
        </SectionDescription>

        <h3>Basic Override Pattern</h3>
        <p>
          Pass a <code>theme</code> prop to any component to override the global theme for that
          component and all its descendants:
        </p>

        <CodeBlock language="tsx">
          {`import { createTheme } from '@number10/phaserjsx'

// This View and all children use the custom theme
<View
  theme={createTheme({
    Text: {
      style: { color: '#00ff00', fontSize: '24px' }
    },
    View: {
      backgroundColor: 0x333333,
      cornerRadius: 10
    }
  })}
>
  <Text text="Green, 24px text" />
  <View>
    <Text text="Also green, 24px" />
  </View>
</View>`}
        </CodeBlock>

        <h3>Theme Inheritance</h3>
        <p>
          Themes cascade down the component tree. Child components inherit their parent's theme
          unless they specify their own:
        </p>

        <CodeBlock language="tsx">
          {`<View>
  {/* Global theme (e.g., white text) */}
  <Text text="Global theme" />

  <View theme={createTheme({ Text: { style: { color: '#00ff00' } } })}>
    {/* Green from local override */}
    <Text text="Green text" />

    <View theme={createTheme({ Text: { style: { color: '#ff0000' } } })}>
      {/* Red from nested override */}
      <Text text="Red text" />
    </View>

    {/* Back to green (parent's theme) */}
    <Text text="Green again" />
  </View>

  {/* Back to global theme */}
  <Text text="Global theme again" />
</View>`}
        </CodeBlock>

        <h3>Partial Overrides</h3>
        <p>
          Local themes merge with global themes - you only need to specify the properties you want
          to change:
        </p>

        <CodeBlock language="tsx">
          {`// Global theme defines: fontSize: '16px', color: '#ffffff', fontFamily: 'Arial'

<View theme={createTheme({ Text: { style: { color: '#ff0000' } } })}>
  {/* Result: color: '#ff0000', fontSize: '16px', fontFamily: 'Arial' */}
  <Text text="Only color overridden" />
</View>`}
        </CodeBlock>

        <h3>Explicit Props Override Everything</h3>
        <p>
          Props passed directly to a component always take precedence over any theme, global or
          local:
        </p>

        <CodeBlock language="tsx">
          {`<View theme={createTheme({ Text: { style: { color: '#00ff00' } } })}>
  {/* Green from theme */}
  <Text text="Themed green" />

  {/* Yellow from explicit prop (overrides theme) */}
  <Text text="Explicit yellow" style={{ color: '#ffff00' }} />
</View>`}
        </CodeBlock>
      </Section>

      <Section title="Custom Component Theming">
        <SectionDescription>
          Extend the theme system for your own components with type-safe module augmentation.
        </SectionDescription>

        <h3>Why Custom Component Themes?</h3>
        <p>
          Custom components often have configurable styling beyond the built-in primitives. Instead
          of passing dozens of style props individually, define a theme interface that captures all
          customization points. This centralizes configuration, enables global defaults, and
          maintains type safety.
        </p>

        <h3>The Three-Step Pattern</h3>
        <p>
          Custom component theming requires three coordinated steps: extend the type system,
          register default values, and consume themed props in your component.
        </p>

        <h4>Step 1: Module Augmentation</h4>
        <p>
          Extend the <code>CustomComponentThemes</code> interface to add your component's theme
          definition. This provides full TypeScript support with autocomplete and type checking:
        </p>

        <CodeBlock language="tsx">
          {`// In your component file (e.g., Checkbox.tsx)
import type * as PhaserJSX from '@number10/phaserjsx'

declare module '@number10/phaserjsx' {
  interface CustomComponentThemes {
    Checkbox: {
      color?: number
      labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
      checkedIcon?: IconType
      gap?: number
      size?: number
    } & PhaserJSX.NestedComponentThemes  // Enable nested theming
  }
}`}
        </CodeBlock>

        <p>
          <strong>Include NestedComponentThemes:</strong> Adding{' '}
          <code>& PhaserJSX.NestedComponentThemes</code> allows your component to theme child
          components like <code>Text</code>, <code>View</code>, and <code>Icon</code> through nested
          properties.
        </p>

        <h4>Step 2: Component Implementation</h4>
        <p>
          Use <code>getThemedProps()</code> to merge global theme, local theme, and explicit props.
          This function returns themed props plus nested themes to pass to children:
        </p>

        <CodeBlock language="tsx">
          {`import { getThemedProps, useTheme, View, Text } from '@number10/phaserjsx'

export function Checkbox(props: CheckboxProps) {
  const localTheme = useTheme()

  // Merge all theme sources + extract nested themes
  const { props: themed, nestedTheme } = getThemedProps(
    'Checkbox',     // Component name (matches augmentation)
    localTheme,     // Local theme from parent
    props.theme ?? {}  // Explicit theme override
  )

  const size = themed.size ?? 32

  return (
    <View
      gap={themed.gap}
      theme={nestedTheme}  // CRITICAL: propagate nested theme
    >
      <Icon type={themed.checkedIcon ?? 'check'} size={size} />
      <Text text={props.label} style={themed.labelStyle} />
    </View>
  )
}`}
        </CodeBlock>

        <p>
          <strong>Nested Theme Propagation:</strong> Passing <code>theme=nestedTheme</code> to child
          components enables the nested theme configuration. Without this, nested themes like{' '}
          <code>Checkbox: Icon: size: 42</code> won't reach child components.
        </p>

        <h4>Step 3: Theme Configuration</h4>
        <p>Once your component supports theming, configure it globally or locally:</p>

        <CodeBlock language="tsx">
          {`// Global configuration
const theme = createTheme({
  Checkbox: {
    size: 24,
    gap: 10,
    color: colors.border.medium.toNumber(),
    labelStyle: { fontSize: '16px', color: colors.text.DEFAULT.toString() },

    // Nested theme: applies to Icons inside Checkbox
    Icon: {
      size: 20,
      tint: colors.primary.DEFAULT.toNumber()
    }
  }
})

// Usage - all Checkboxes get themed automatically
<Checkbox label="Accept terms" checked={true} />

// Local override
<Checkbox
  label="Large checkbox"
  theme={createTheme({ Checkbox: { size: 32, gap: 15 } })}
/>`}
        </CodeBlock>

        <h3>Real-World Example</h3>
        <p>
          The <code>Checkbox</code> component in{' '}
          <code>apps/test-ui/src/components/Checkbox.tsx</code> demonstrates this pattern
          completely. It defines a theme interface with styling props, uses{' '}
          <code>getThemedProps()</code> to merge theme sources, and propagates nested themes to{' '}
          <code>Icon</code> and <code>Text</code> children.
        </p>

        <p>
          <strong>Study the pattern:</strong> Read the Checkbox source to see module augmentation,
          theme consumption, and nested theme propagation working together.
        </p>
      </Section>

      <Section title="Color System">
        <SectionDescription>
          Built-in color presets and semantic tokens for consistent, accessible design.
        </SectionDescription>

        <h3>Semantic Color Tokens</h3>
        <p>
          Instead of hardcoding colors like <code>0x2196f3</code>, use semantic tokens that convey
          intent and adapt to different contexts:
        </p>

        <ul>
          <li>
            <strong>primary</strong> - Main brand color (buttons, links, emphasis)
          </li>
          <li>
            <strong>secondary</strong> - Supporting brand color (accents, secondary actions)
          </li>
          <li>
            <strong>accent</strong> - Highlight color (focus states, badges, notifications)
          </li>
          <li>
            <strong>success</strong> - Positive feedback (confirmations, completed states)
          </li>
          <li>
            <strong>warning</strong> - Caution indicator (alerts, pending actions)
          </li>
          <li>
            <strong>error</strong> - Error state (validation failures, destructive actions)
          </li>
          <li>
            <strong>info</strong> - Informational messages (tips, neutral notifications)
          </li>
          <li>
            <strong>background</strong> - Page/canvas background
          </li>
          <li>
            <strong>surface</strong> - Component backgrounds (cards, panels, modals)
          </li>
          <li>
            <strong>text</strong> - Text content (body text, labels, headings)
          </li>
          <li>
            <strong>border</strong> - Dividers and outlines
          </li>
        </ul>

        <h3>Using Color Tokens</h3>
        <p>
          Access color tokens from presets and use the appropriate conversion method for your
          context:
        </p>

        <CodeBlock language="tsx">
          {`const preset = getPresetWithMode('oceanBlue', 'light')
const { colors } = preset

// For number-based props (backgroundColor, tint, borderColor)
const bgColor = colors.surface.light.toNumber()  // 0xf5f5f5

// For string-based props (Text style color)
const textColor = colors.text.DEFAULT.toString()  // '#616161'

// Access shades
colors.primary.lightest  // Lightest shade
colors.primary.light     // Light shade
colors.primary.medium    // Medium shade (also .DEFAULT)
colors.primary.dark      // Dark shade
colors.primary.darkest   // Darkest shade`}
        </CodeBlock>

        <h3>Available Presets</h3>

        <h4>Ocean Blue</h4>
        <p>Professional, clean blue-based palette suitable for business applications:</p>
        <ul>
          <li>Primary: Material Blue (#2196f3)</li>
          <li>Secondary: Blue Grey (#607d8b)</li>
          <li>Accent: Cyan (#00bcd4)</li>
        </ul>

        <h4>Forest Green</h4>
        <p>Nature-inspired green palette for environmental or health-focused applications:</p>
        <ul>
          <li>Primary: Green (#4caf50)</li>
          <li>Secondary: Teal (#009688)</li>
          <li>Accent: Lime (#cddc39)</li>
        </ul>

        <h4>Midnight</h4>
        <p>Elegant dark purple palette for creative or premium applications:</p>
        <ul>
          <li>Primary: Deep Purple (#673ab7)</li>
          <li>Secondary: Indigo (#3f51b5)</li>
          <li>Accent: Pink (#e91e63)</li>
        </ul>

        <h3>Dynamic Color Mode Switching</h3>
        <p>
          For applications with day/night modes, use the preset manager to switch modes at runtime:
        </p>

        <CodeBlock language="tsx">
          {`import { setColorPreset, setColorMode } from '@number10/phaserjsx'

// Initial setup with light mode
setColorPreset('oceanBlue')

// User toggles dark mode
function toggleDarkMode(isDark: boolean) {
  setColorMode(isDark ? 'dark' : 'light')
  // Triggers re-theming with adjusted neutral colors
}

// Switch entire color scheme
function changeTheme(preset: 'oceanBlue' | 'forestGreen' | 'midnight') {
  setColorPreset(preset)
  // Preserves current color mode (light/dark)
}`}
        </CodeBlock>

        <p>
          <strong>Implementation note:</strong> Mode switching updates the theme registry and
          notifies subscribers. Components using <code>useTheme()</code> or{' '}
          <code>getThemedProps()</code> will receive updated color values automatically on next
          render.
        </p>

        <h3>Custom Color Presets</h3>
        <p>
          Create your own presets by defining brand colors and using{' '}
          <code>generateColorScale()</code> to create shade variations:
        </p>

        <CodeBlock language="tsx">
          {`import { generateColorScale, type ColorPreset } from '@number10/phaserjsx'

export const myCustomPreset: ColorPreset = {
  name: 'myCustom',
  colors: {
    primary: generateColorScale('#ff6b35'),    // Coral
    secondary: generateColorScale('#004e89'),  // Navy
    accent: generateColorScale('#f7c59f'),     // Peach

    // Include all required tokens...
    success: generateColorScale('#4caf50'),
    warning: generateColorScale('#ff9800'),
    error: generateColorScale('#f44336'),
    info: generateColorScale('#2196f3'),

    // Neutrals will be overridden by light/dark mode
    background: generateColorScale('#ffffff'),
    surface: generateColorScale('#f5f5f5'),
    text: generateColorScale('#212121'),
    border: generateColorScale('#e0e0e0')
  }
}`}
        </CodeBlock>

        <p>
          <code>generateColorScale()</code> automatically creates five shades (lightest to darkest)
          from your base color using lightness adjustments.
        </p>
      </Section>

      <Section title="Advanced Patterns">
        <SectionDescription>
          Advanced techniques for complex theming scenarios and architectural considerations.
        </SectionDescription>

        <h3>Variant-Based Theming</h3>
        <p>
          For components with multiple visual variants (e.g., <code>Button</code> with primary,
          secondary, outline styles), define variant-specific sub-themes:
        </p>

        <CodeBlock language="tsx">
          {`// Theme definition with variants
const theme = createTheme({
  Button: {
    // Base styles
    padding: 8,
    cornerRadius: 6,
    gap: 8,

    // Variant overrides
    primary: {
      backgroundColor: colors.primary.DEFAULT.toNumber(),
      borderColor: colors.primary.dark.toNumber()
    },
    secondary: {
      backgroundColor: colors.secondary.DEFAULT.toNumber(),
      borderColor: colors.secondary.dark.toNumber()
    },
    outline: {
      backgroundColor: 0x000000,
      backgroundAlpha: 0.0,
      borderColor: colors.accent.DEFAULT.toNumber(),
      borderWidth: 2
    }
  }
})

// Component implementation
function Button(props: ButtonProps) {
  const { props: themed } = getThemedProps('Button', localTheme, {})

  // Merge base + variant styles
  const variantStyles = themed[props.variant ?? 'primary'] ?? {}
  const finalStyles = { ...themed, ...variantStyles }

  return <View {...finalStyles}>{props.children}</View>
}`}
        </CodeBlock>

        <p>
          This pattern allows global configuration of all variants while keeping component usage
          simple: <code>&lt;Button variant="outline"&gt;</code>.
        </p>

        <h3>Theme Composition</h3>
        <p>
          Build complex themes by composing smaller theme objects. Useful for theming different
          sections of your application:
        </p>

        <CodeBlock language="tsx">
          {`const baseTheme = createTheme({
  Text: { style: { fontFamily: 'Arial', fontSize: '16px' } },
  View: { cornerRadius: 8 }
})

const headerTheme = createTheme({
  ...baseTheme,
  Text: { style: { fontSize: '24px', fontWeight: 'bold' } },
  View: { backgroundColor: colors.surface.dark.toNumber() }
})

const footerTheme = createTheme({
  ...baseTheme,
  Text: { style: { fontSize: '14px', color: colors.text.light.toString() } },
  View: { backgroundColor: colors.surface.darkest.toNumber() }
})`}
        </CodeBlock>

        <h3>Conditional Theming</h3>
        <p>Apply different themes based on application state (user preferences, feature flags):</p>

        <CodeBlock language="tsx">
          {`function App(props: AppProps) {
  const userPreferences = useUserPreferences()

  const theme = createTheme(
    userPreferences.highContrast
      ? highContrastTheme
      : standardTheme
  )

  return (
    <View theme={theme}>
      {/* Entire app uses conditional theme */}
    </View>
  )
}`}
        </CodeBlock>

        <h3>Performance Considerations</h3>
        <p>
          Theme resolution happens during component creation, not on every render. For optimal
          performance:
        </p>

        <ul>
          <li>
            <strong>Avoid inline theme objects:</strong> Create theme objects outside render
            functions to prevent unnecessary recreations
          </li>
          <li>
            <strong>Use global themes for common styles:</strong> Reduces prop passing and
            per-component configuration
          </li>
          <li>
            <strong>Local overrides are cheap:</strong> Only override what changes - merged shallow
            copy is fast
          </li>
          <li>
            <strong>Theme changes require remount:</strong> Changing global theme doesn't trigger
            re-renders; recreate components to apply new theme
          </li>
        </ul>

        <h3>Debugging Themes</h3>
        <p>Enable theme debugging to see theme resolution in console:</p>

        <CodeBlock language="tsx">
          {`import { DebugLogger } from '@number10/phaserjsx'

// Enable theme logging
DebugLogger.enable('theme')

// Now see theme merges in console:
// "Updated Text theme: { style: { color: '#ffffff', ... } }"`}
        </CodeBlock>
      </Section>

      <Section title="API Reference">
        <SectionDescription>
          Core functions and types for working with the theme system.
        </SectionDescription>

        <h3>createTheme</h3>
        <CodeBlock language="tsx">
          {`function createTheme(
  theme: PartialTheme,
  preset?: ColorPreset
): PartialTheme`}
        </CodeBlock>
        <p>
          Create a type-safe theme object. Optional <code>preset</code> parameter stores color
          preset metadata for dynamic mode switching.
        </p>

        <h3>getThemedProps</h3>
        <CodeBlock language="tsx">
          {`function getThemedProps<K extends keyof ComponentThemes>(
  componentName: K,
  localTheme: PartialTheme | undefined,
  explicitTheme: Partial<ComponentThemes[K]>
): {
  props: ComponentThemes[K],
  nestedTheme: PartialTheme
}`}
        </CodeBlock>
        <p>
          Merge global theme, local theme, and explicit props with correct priority. Returns merged
          props and extracted nested themes for children.
        </p>

        <h3>useTheme</h3>
        <CodeBlock language="tsx">{`function useTheme(): PartialTheme | undefined`}</CodeBlock>
        <p>
          Hook to access current theme context. Returns the theme provided by nearest parent
          component with <code>theme</code> prop, or <code>undefined</code> if no local theme
          exists.
        </p>

        <h3>themeRegistry</h3>
        <p>Global singleton managing theme state:</p>
        <CodeBlock language="tsx">
          {`// Update global theme (merge)
themeRegistry.updateGlobalTheme(partialTheme)

// Replace entire global theme
themeRegistry.setGlobalTheme(completeTheme)

// Reset to defaults
themeRegistry.resetGlobalTheme()

// Get current global theme
const theme = themeRegistry.getGlobalTheme()

// Get specific component theme
const textTheme = themeRegistry.getComponentTheme('Text')`}
        </CodeBlock>

        <h3>Color System Functions</h3>
        <CodeBlock language="tsx">
          {`// Get preset with mode
getPresetWithMode(name: PresetName, mode: 'light' | 'dark'): ColorPreset

// Set active preset globally
setColorPreset(name: PresetName): void

// Switch color mode
setColorMode(mode: 'light' | 'dark'): void

// Get current mode
getCurrentColorMode(): 'light' | 'dark'

// Generate color scale from base
generateColorScale(baseColor: string): ColorShade`}
        </CodeBlock>
      </Section>

      <Section title="Best Practices">
        <SectionDescription>
          Guidelines for effective theme system usage and maintainable code.
        </SectionDescription>

        <h3>Theme Organization</h3>
        <ul>
          <li>
            <strong>Single source of truth:</strong> Define global theme in one dedicated file
            (e.g., <code>theme.ts</code>)
          </li>
          <li>
            <strong>Use semantic colors:</strong> Prefer <code>colors.primary</code> over{' '}
            <code>0x2196f3</code> for maintainability
          </li>
          <li>
            <strong>Document custom components:</strong> Add JSDoc comments to module augmentation
            declarations
          </li>
          <li>
            <strong>Namespace variants:</strong> Use nested objects for variants (
            <code>Button.primary</code>, <code>Button.secondary</code>)
          </li>
        </ul>

        <h3>When to Use Local Themes</h3>
        <ul>
          <li>
            <strong>Section-specific styling:</strong> Different visual treatment for header,
            content, footer
          </li>
          <li>
            <strong>Component instances:</strong> One-off style variations without creating new
            components
          </li>
          <li>
            <strong>Temporary overrides:</strong> Modal dialogs, overlays, or popups with distinct
            styling
          </li>
          <li>
            <strong>Avoid for one prop:</strong> Don't wrap in theme object for single prop changes
            - use explicit props
          </li>
        </ul>

        <h3>Type Safety Tips</h3>
        <ul>
          <li>
            <strong>Always augment CustomComponentThemes:</strong> Provides autocomplete and type
            checking
          </li>
          <li>
            <strong>Use NestedComponentThemes:</strong> Enables nested theme support with type
            safety
          </li>
          <li>
            <strong>Define all theme props as optional:</strong> Allows partial theme overrides
          </li>
          <li>
            <strong>Use Phaser types:</strong> Reference{' '}
            <code>Phaser.Types.GameObjects.Text.TextStyle</code> for consistency
          </li>
        </ul>

        <h3>Accessibility</h3>
        <ul>
          <li>
            <strong>Contrast ratios:</strong> Ensure text/background combinations meet WCAG AA
            (4.5:1 for normal text)
          </li>
          <li>
            <strong>Test both modes:</strong> Verify readability in light and dark modes
          </li>
          <li>
            <strong>Feedback colors:</strong> Don't rely solely on color - combine with icons or
            text labels
          </li>
          <li>
            <strong>Focus indicators:</strong> Use accent colors for visible focus states
          </li>
        </ul>
      </Section>

      <Section title="Examples">
        <SectionDescription>Learn from real-world implementations.</SectionDescription>

        <h3>Complete Application Theme</h3>
        <p>
          Study <code>apps/test-ui/src/Theme.tsx</code> for a comprehensive theme using color
          presets, nested themes, and custom component theming. This file demonstrates:
        </p>
        <ul>
          <li>Color preset integration with semantic tokens</li>
          <li>Global theme configuration for all built-in components</li>
          <li>Custom component themes with nested child styling</li>
          <li>Variant-based theming for Button and IconButton</li>
          <li>Dynamic preset and mode switching</li>
        </ul>

        <h3>Custom Component Example</h3>
        <p>
          See <code>apps/test-ui/src/components/Checkbox.tsx</code> for the complete custom
          component pattern:
        </p>
        <ul>
          <li>Module augmentation for type-safe theme interface</li>
          <li>
            <code>getThemedProps()</code> usage for theme resolution
          </li>
          <li>Nested theme propagation to Icon and Text children</li>
          <li>Default fallback values for unconfigured properties</li>
        </ul>

        <h3>Icon System Integration</h3>
        <p>
          The <a href="/guides/custom-icon-component">Custom Icon Component</a> guide shows theme
          integration for icon components, including module augmentation and nested theme patterns.
        </p>
      </Section>
    </DocLayout>
  )
}
