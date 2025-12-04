/**
 * Button component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  EffectsButtonExample,
  IconsButtonExample,
  QuickStartButtonExample,
  SizingButtonExample,
  StatesButtonExample,
  VariantsButtonExample,
} from '@/examples/button'
import type { ComponentDocs } from '@/types/docs'

export const buttonContent: ComponentDocs = {
  title: 'Button',
  description:
    'Interactive button component with multiple variants, states, and full theme support.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic button with click handler',
    component: QuickStartButtonExample,
    height: SCENE_SIZES.compact,
    code: `/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

export function MyComponent() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      <Button onClick={() => console.log('Button clicked!')}>
        <Text text="Click Me" />
      </Button>
    </View>
  )
}`,
  },

  examples: [
    {
      id: 'variants',
      title: 'Variants',
      description: 'Different visual styles for buttons',
      component: VariantsButtonExample,
      height: SCENE_SIZES.small,
      code: `/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

export function VariantsExample() {
  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <Button variant="primary">
        <Text text="Primary" />
      </Button>

      <Button variant="secondary">
        <Text text="Secondary" />
      </Button>

      <Button variant="outline">
        <Text text="Outline" />
      </Button>
    </View>
  )
}`,
    },
    {
      id: 'states',
      title: 'States',
      description: 'Interactive states and disabled buttons',
      component: StatesButtonExample,
      height: SCENE_SIZES.small,
      code: `/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View, useState } from '@phaserjsx/ui'

export function StatesExample() {
  const [clickCount, setClickCount] = useState(0)

  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <Button onClick={() => setClickCount(clickCount + 1)}>
        <Text text={\`Clicked \${clickCount} times\`} />
      </Button>

      <Button disabled>
        <Text text="Disabled Button" />
      </Button>
    </View>
  )
}`,
    },
    {
      id: 'icons',
      title: 'With Icons',
      description: 'Combining buttons with icon components',
      component: IconsButtonExample,
      height: SCENE_SIZES.small,
      code: `/** @jsxImportSource @phaserjsx/ui */
import { Button, Icon, Text, View } from '@phaserjsx/ui'

export function IconsExample() {
  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <Button>
        <View direction="row" gap={8} alignItems="center">
          <Icon name="play" size={20} />
          <Text text="Play" />
        </View>
      </Button>

      <Button variant="secondary">
        <View direction="row" gap={8} alignItems="center">
          <Icon name="settings" size={20} />
          <Text text="Settings" />
        </View>
      </Button>
    </View>
  )
}`,
    },
    {
      id: 'sizing',
      title: 'Sizing & Layout',
      description: 'Size variants and custom dimensions',
      component: SizingButtonExample,
      height: SCENE_SIZES.medium,
      code: `/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

export function SizingExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* Size variants */}
      <View direction="row" gap={12} alignItems="center">
        <Button size="small">
          <Text text="Small" />
        </Button>
        <Button size="medium">
          <Text text="Medium" />
        </Button>
        <Button size="large">
          <Text text="Large" />
        </Button>
      </View>

      {/* Custom dimensions */}
      <Button width={250} height={60}>
        <Text text="Custom Size (250x60)" />
      </Button>

      {/* Full width */}
      <View width={300}>
        <Button width="fill">
          <Text text="Full Width Button" />
        </Button>
      </View>
    </View>
  )
}`,
    },
    {
      id: 'effects',
      title: 'Effects',
      description: 'Phaser-powered hover and click animations',
      component: EffectsButtonExample,
      height: SCENE_SIZES.medium,
      code: `/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

export function EffectsExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      <Button effect="tada" effectConfig={{ time: 500 }}>
        <Text text="Tada Effect" />
      </Button>

      <Button effect="bounce" effectConfig={{ time: 600 }} variant="secondary">
        <Text text="Bounce Effect" />
      </Button>

      <Button effect="pulse" effectConfig={{ time: 800 }} variant="outline">
        <Text text="Pulse Effect" />
      </Button>

      <Button effect="fade" effectConfig={{ time: 400 }}>
        <Text text="Fade Effect" />
      </Button>
    </View>
  )
}`,
    },
  ],

  propsEssential: [
    {
      name: 'variant',
      type: '"primary" | "secondary" | "outline"',
      default: '"primary"',
      description: 'Visual style variant',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click event handler',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables interaction and applies disabled styling',
    },
    {
      name: 'size',
      type: '"small" | "medium" | "large"',
      default: '"medium"',
      description: 'Predefined size variant',
    },
    {
      name: 'children',
      type: 'VNode',
      description: 'Button content (Text, Icon, or View composition)',
    },
  ],

  propsComplete: [
    {
      name: 'variant',
      type: '"primary" | "secondary" | "outline"',
      default: '"primary"',
      description: 'Visual style variant',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click event handler',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables interaction and applies disabled styling',
    },
    {
      name: 'size',
      type: '"small" | "medium" | "large"',
      default: '"medium"',
      description: 'Predefined size variant',
    },
    {
      name: 'effect',
      type: 'string',
      description: 'Phaser animation effect (tada, bounce, pulse, fade, etc.)',
    },
    {
      name: 'effectConfig',
      type: 'EffectConfig',
      description: 'Configuration for the effect (time, scale, etc.)',
    },
    {
      name: 'disabledColor',
      type: 'number',
      description: 'Text color when button is disabled (hex number)',
    },
    {
      name: 'textStyle',
      type: 'TextStyle',
      description: 'Override default text styling (color, fontSize, fontFamily, etc.)',
    },
    {
      name: 'children',
      type: 'VNode',
      description: 'Button content (Text, Icon, or View composition)',
    },
  ],

  inherits: [
    {
      component: 'View',
      link: '/components/view',
      description:
        'Button extends View and inherits all layout and styling props including width, height, padding, backgroundColor, cornerRadius, borderWidth, borderColor, and more.',
    },
  ],
}
