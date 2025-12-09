# @number10/phaserjsx

> Declarative Phaser3 UI framework with React-like components and TypeScript

A modern, type-safe framework for building game UIs in Phaser3 using JSX components, hooks, and a powerful theme system.

[![npm version](https://img.shields.io/npm/v/@number10/phaserjsx.svg)](https://www.npmjs.com/package/@number10/phaserjsx)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](../../LICENSE)

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
npm install @number10/phaserjsx phaser
# or
yarn add @number10/phaserjsx phaser
# or
pnpm add @number10/phaserjsx phaser
```

## 🚀 Quick Start

### 1. Configure TypeScript

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@number10/phaserjsx"
  }
}
```

### 2. Create a Component

```tsx
import { useState, View, Button, Text } from '@number10/phaserjsx'

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
import { mountJSX } from '@number10/phaserjsx'

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

Documentation site will be published on GitHub Pages soon. In the meantime, see usage examples below.

## 🎯 Examples

### Form with State Management

```tsx
import { useState, View, CharTextInput, Button, Text } from '@number10/phaserjsx'

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
import { View, Button, Text } from '@number10/phaserjsx'
import type { Theme } from '@number10/phaserjsx'

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
import { Button, Text } from '@number10/phaserjsx'

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
import type { IconGeneratorConfig } from '@number10/phaserjsx/scripts/icon-generator-config'

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
import { phaserjsxIconsPlugin } from '@number10/phaserjsx/vite-plugin-icons'

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

Contributions are welcome! Please visit the [main repository](https://github.com/number10/phaserjsx) for contribution guidelines.

## 📝 License

GPL-3.0-only. Commercial licensing available—contact Michael Rieck (Michael--) at mr@number10.de.

## 🔗 Links

- [GitHub Repository](https://github.com/number10/phaserjsx)
- [Issue Tracker](https://github.com/number10/phaserjsx/issues)
- [npm Package](https://www.npmjs.com/package/@number10/phaserjsx)
