# @phaserjsx/ui

> Declarative Phaser3 UI framework with React-like components and TypeScript

A modern, type-safe framework for building game UIs in Phaser3 using JSX components, hooks, and a powerful theme system.

[![npm version](https://img.shields.io/npm/v/@phaserjsx/ui.svg)](https://www.npmjs.com/package/@phaserjsx/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **React-like API** - Familiar JSX syntax with hooks (useState, useEffect, useMemo, etc.)
- 🎯 **Type-Safe** - Full TypeScript support with strict type checking
- 🎨 **Powerful Theme System** - Global and component-level theming with runtime switching
- 📦 **Rich Component Library** - Button, Text, Icon, Accordion, Dropdown, CharTextInput, and more
- 🎭 **Built-in Effects** - 23+ animation effects (pulse, shake, fade, bounce, etc.)
- 📱 **Responsive Design** - Flexible layout with multiple size value formats (px, %, vw/vh, fill, auto, calc)
- 🔧 **Custom Components** - Easy to create and integrate custom components
- 🎮 **Phaser Integration** - Seamless integration with Phaser3 game objects and scenes
- 📊 **SVG Support** - Convert SVG to Phaser textures with caching
- 🚀 **Performance** - Optimized VDOM reconciliation with smart dirty checking

## 📦 Installation

```bash
npm install @phaserjsx/ui phaser
# or
yarn add @phaserjsx/ui phaser
# or
pnpm add @phaserjsx/ui phaser
```

## 🚀 Quick Start

### 1. Configure TypeScript

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@phaserjsx/ui"
  }
}
```

### 2. Create a Component

```tsx
import { useState } from '@phaserjsx/ui'
import { View, Button, Text } from '@phaserjsx/ui/components'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <View direction="column" gap={20} padding={40} backgroundColor={0x222222}>
      <Text text={`Count: ${count}`} fontSize={32} color={0xffffff} />
      <Button onPress={() => setCount(count + 1)}>
        <Text text="Increment" fontSize={24} />
      </Button>
    </View>
  )
}
```

### 3. Mount in Phaser Scene

```tsx
import Phaser from 'phaser'
import { mountJSX } from '@phaserjsx/ui'

class GameScene extends Phaser.Scene {
  create() {
    mountJSX(this, Counter, {
      width: this.scale.width,
      height: this.scale.height,
    })
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene],
}

new Phaser.Game(config)
```

## 📖 Documentation

**Full documentation is available at:** [https://yourusername.github.io/phaserjsx](https://yourusername.github.io/phaserjsx)

### Core Concepts

- [Installation & Setup](https://yourusername.github.io/phaserjsx/installation)
- [Quick Start Guide](https://yourusername.github.io/phaserjsx/quick-start)
- [Layout Patterns](https://yourusername.github.io/phaserjsx/guides/layout-patterns)
- [Theme System](https://yourusername.github.io/phaserjsx/guides/theme-system)
- [Responsive Design](https://yourusername.github.io/phaserjsx/guides/responsive-design)

### API Reference

- [Hooks API](https://yourusername.github.io/phaserjsx/api/hooks)
- [Core Props](https://yourusername.github.io/phaserjsx/api/core-props)
- [Theme Types](https://yourusername.github.io/phaserjsx/api/theme-types)
- [Effect Registry](https://yourusername.github.io/phaserjsx/api/effects)

### Components

- [View](https://yourusername.github.io/phaserjsx/components/view) - Fundamental layout container
- [Text](https://yourusername.github.io/phaserjsx/components/text) - Styled text rendering
- [Button](https://yourusername.github.io/phaserjsx/components/button) - Interactive buttons with states
- [Icon](https://yourusername.github.io/phaserjsx/components/icon) - SVG icon system
- [Accordion](https://yourusername.github.io/phaserjsx/components/accordion) - Expandable sections
- [Dropdown](https://yourusername.github.io/phaserjsx/components/dropdown) - Select menus
- [CharTextInput](https://yourusername.github.io/phaserjsx/components/chartextinput) - Text input with character display
- [More Components...](https://yourusername.github.io/phaserjsx/components)

## 🎯 Examples

### Form with State Management

```tsx
import { useState } from '@phaserjsx/ui'
import { View, CharTextInput, Button, Text } from '@phaserjsx/ui/components'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    console.log('Login:', username, password)
  }

  return (
    <View direction="column" gap={16} padding={32}>
      <CharTextInput
        value={username}
        onChange={setUsername}
        placeholder="Username"
        maxLength={20}
      />
      <CharTextInput
        value={password}
        onChange={setPassword}
        placeholder="Password"
        isPassword
        maxLength={20}
      />
      <Button onPress={handleLogin}>
        <Text text="Login" />
      </Button>
    </View>
  )
}
```

### Themed Components

```tsx
import { View, Button, Text } from '@phaserjsx/ui/components'
import type { Theme } from '@phaserjsx/ui'

const customTheme: Theme = {
  Button: {
    backgroundColor: 0x4caf50,
    cornerRadius: 8,
    padding: { x: 24, y: 12 },
    Text: {
      fontSize: 18,
      color: 0xffffff,
    },
  },
}

function ThemedButton() {
  return (
    <View theme={customTheme}>
      <Button onPress={() => console.log('Clicked')}>
        <Text text="Themed Button" />
      </Button>
    </View>
  )
}
```

### Effects & Animations

```tsx
import { Button, Text } from '@phaserjsx/ui/components'

function AnimatedButton() {
  return (
    <Button
      effect="pulse"
      effectConfig={{ intensity: 1.1, time: 800, repeat: -1, yoyo: true }}
      onPress={() => console.log('Pressed')}
    >
      <Text text="Pulse Button" />
    </Button>
  )
}
```

## 🔌 Icon Generator

Generate custom icon components from SVG files:

```bash
# Generate icon components
npx generate-icons

# Generate TypeScript types
npx generate-icon-types
```

Configuration in `icon-generator.config.ts`:

```typescript
import type { IconGeneratorConfig } from '@phaserjsx/ui/scripts/icon-generator-config'

export default {
  inputDir: './src/assets/icons',
  outputFile: './src/custom-icons/generated-icons.tsx',
  typesFile: './src/custom-icons/icon-types.ts',
  componentName: 'CustomIcon',
  defaultSize: 24,
} satisfies IconGeneratorConfig
```

## 🎨 Vite Plugin

Automatic icon generation during development:

```typescript
import { defineConfig } from 'vite'
import { phaserjsxIconsPlugin } from '@phaserjsx/ui/vite-plugin-icons'

export default defineConfig({
  plugins: [
    phaserjsxIconsPlugin({
      inputDir: './src/assets/icons',
      outputFile: './src/custom-icons/generated-icons.tsx',
    }),
  ],
})
```

## 🤝 Contributing

Contributions are welcome! Please visit the [main repository](https://github.com/yourusername/phaserjsx) for contribution guidelines.

## 📝 License

MIT © [Your Name]

## 🔗 Links

- [Documentation](https://yourusername.github.io/phaserjsx)
- [GitHub Repository](https://github.com/yourusername/phaserjsx)
- [Issue Tracker](https://github.com/yourusername/phaserjsx/issues)
- [npm Package](https://www.npmjs.com/package/@phaserjsx/ui)
