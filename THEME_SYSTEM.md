# Theme System

A flexible, type-safe theme system for PhaserJSX that provides global and local styling with automatic inheritance through the VDOM tree.

## Features

- **Global Theme Registry**: Define default styles for all components
- **Local Theme Overrides**: Override themes at any point in the component tree
- **Automatic Inheritance**: Child components automatically inherit parent themes
- **Type-Safe**: Full TypeScript support with autocomplete
- **Priority System**: Explicit props > Local theme > Global theme
- **Extensible**: Custom components can register their own theme definitions
- **Hook Support**: Access current theme context with `useTheme()`

## Basic Usage

### Setting a Global Theme

```tsx
import { themeRegistry, createTheme } from '@phaserjsx/ui'

// Set global theme for built-in components
themeRegistry.updateGlobalTheme(
  createTheme({
    Text: {
      style: {
        color: '#ffffff',
        fontSize: '16px',
        fontFamily: 'Arial',
      },
    },
    View: {
      backgroundColor: 0x333333,
      cornerRadius: 8,
    },
  })
)
```

### Local Theme Overrides

```tsx
<View
  theme={createTheme({
    Text: {
      style: {
        color: '#0000ff',
        fontSize: '20px',
      },
    },
  })}
>
  <Text text="This text is blue with 20px font" />
  <Text text="This inherits the blue theme too" />
</View>
```

### Nested Themes

```tsx
<View>
  <Text text="Global theme (white)" />

  <View theme={createTheme({ Text: { style: { color: '#00ff00' } } })}>
    <Text text="Green text" />

    <View theme={createTheme({ Text: { style: { color: '#ff0000' } } })}>
      <Text text="Red text" />
    </View>
  </View>

  <Text text="Back to global theme (white)" />
</View>
```

### Explicit Props Override

```tsx
<View theme={createTheme({ Text: { style: { color: '#00ff00' } } })}>
  <Text text="Green (from theme)" />
  <Text text="Yellow (explicit)" style={{ color: '#ffff00' }} />
</View>
```

## Advanced Usage

### Using the useTheme Hook

```tsx
import { useTheme } from '@phaserjsx/ui'

function ThemedComponent() {
  const theme = useTheme()

  return (
    <View>
      <Text text={`Theme active: ${theme ? 'Yes' : 'No'}`} />
    </View>
  )
}
```

### Registering Custom Components

Custom components can extend the theme system via module augmentation:

```tsx
// 1. Extend the theme interface
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Button: {
      backgroundColor?: number
      textColor?: number
      fontSize?: number
    }
  }
}

// 2. Register default theme values
import { themeRegistry } from '@phaserjsx/ui'

themeRegistry.registerCustomComponent('Button', {
  backgroundColor: 0x0000ff,
  textColor: 0xffffff,
  fontSize: 16,
})

// 3. Use themed props in your component
import { getThemedProps } from '@phaserjsx/ui'

function Button(props: ButtonProps) {
  const themed = getThemedProps('Button', undefined, props)

  return (
    <View backgroundColor={themed.backgroundColor}>
      <Text
        text={props.text}
        style={{
          color: `#${themed.textColor?.toString(16)}`,
          fontSize: `${themed.fontSize}px`,
        }}
      />
    </View>
  )
}
```

## API Reference

### `themeRegistry`

Global theme registry singleton.

**Methods:**

- `updateGlobalTheme(theme: PartialTheme)` - Merge theme with global theme
- `setGlobalTheme(theme: Theme)` - Replace entire global theme
- `resetGlobalTheme()` - Reset to default theme
- `getGlobalTheme()` - Get current global theme
- `getComponentTheme(name)` - Get theme for specific component
- `registerCustomComponent(name, defaults)` - Register custom component theme

### `createTheme(theme: PartialTheme)`

Helper to create a partial theme with type safety.

### `getThemedProps(componentName, localTheme, explicitProps)`

Merge global theme, local theme override, and explicit props.

**Priority:** explicit props > local theme > global theme

### `useTheme()`

Hook to access current theme context in function components.

### `mergeThemes(base, override)`

Deep merge two theme objects.

## Built-in Component Themes

### View

- `backgroundColor?: number`
- `cornerRadius?: number`
- `borderWidth?: number`
- `borderColor?: number`
- `alpha?: number`
- `visible?: boolean`
- All `TransformProps` and `LayoutProps`

### Text

- `text: string`
- `align?: 'left' | 'center' | 'right'`
- `alpha?: number`
- `visible?: boolean`
- `style?: Phaser.Types.GameObjects.Text.TextStyle`
- All `TransformProps`

### NineSlice

- `alpha?: number`
- `visible?: boolean`
- All `TransformProps`

## Examples

See `apps/test-ui/src/examples/ThemeExample.tsx` for a complete working example.

## How It Works

1. **JSX Runtime**: The `theme` prop is extracted and stored on `VNode.__theme`
2. **VDOM Mount**: Themes propagate down the tree during mounting
3. **Component Creation**: `getThemedProps()` merges global + local + explicit props
4. **Inheritance**: Children without themes inherit parent's `__theme`
5. **Context**: Function components can access theme via `useTheme()` hook

## Performance

- Theme resolution happens once during component creation
- No runtime overhead for components without themes
- Shallow merging for performance
- No re-renders triggered by theme changes (must remount)
