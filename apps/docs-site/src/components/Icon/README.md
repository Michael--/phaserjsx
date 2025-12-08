# Icon Component

Type-safe Icon component for docs-site using Bootstrap Icons with automatic tree-shaking.

## Features

- ✅ **Type-Safe**: IntelliSense for all 2078+ Bootstrap Icons
- ✅ **Tree-Shaking**: Only used icons are bundled
- ✅ **Lazy Loading**: Icons are code-split and loaded on demand
- ✅ **Caching**: Icons are cached after first load
- ✅ **Theme Support**: Integrates with PhaserJSX theme system

## Usage

```tsx
import { Icon } from '@/components/Icon'

function MyComponent() {
  return (
    <View>
      <Icon type="check" size={24} />
      <Icon type="gear" size={32} tint={0xff0000} />
    </View>
  )
}
```

## Available Icons

All Bootstrap Icons are available with full type safety:

- `'check'`, `'gear'`, `'house'`, `'star'`, ...
- Full list: https://icons.getbootstrap.com/

## Preloading Icons

Use the `useIcon` hook to preload icons before displaying:

```tsx
import { useIcon, Icon } from '@/components/Icon'

function MyComponent() {
  const iconReady = useIcon('check')

  return iconReady ? <Icon type="check" /> : <Text text="Loading..." />
}
```

## Theme Integration

Configure default icon size in your theme:

```tsx
const theme = {
  Icon: {
    size: 48, // Default icon size
  },
}
```

## Generated Files

The following files are auto-generated and should not be edited:

- `icon-types.generated.ts` - TypeScript types for all available icons
- `icon-loaders.generated.ts` - Dynamic imports for used icons

Run `pnpm run generate-icons` to regenerate these files.

## Configuration

See `icon-generator.config.ts` in the project root for configuration options.
