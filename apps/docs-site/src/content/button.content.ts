/**
 * Button component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  IconsButtonExample,
  QuickStartButtonExample,
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
  ],

  propsEssential: [
    {
      name: 'variant',
      type: 'string',
      default: '"primary"',
      description: 'Button style variant (primary, secondary, outline)',
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
      description: 'Disable button interaction',
    },
    {
      name: 'children',
      type: 'VNode',
      description: 'Button content (usually Text or View with Icon)',
    },
  ],

  propsComplete: [
    {
      name: 'variant',
      type: 'string',
      default: '"primary"',
      description: 'Button style variant (primary, secondary, outline)',
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
      description: 'Disable button interaction',
    },
    {
      name: 'children',
      type: 'VNode',
      description: 'Button content (usually Text or View with Icon)',
    },
    {
      name: 'width',
      type: 'number',
      default: 'auto',
      description: 'Button width in pixels',
    },
    {
      name: 'height',
      type: 'number',
      default: 'auto',
      description: 'Button height in pixels',
    },
    {
      name: 'padding',
      type: 'number | Padding',
      description: 'Inner spacing (number or {top, right, bottom, left})',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description: 'Background color (hex number)',
    },
    {
      name: 'cornerRadius',
      type: 'number',
      default: '8',
      description: 'Border radius in pixels',
    },
    {
      name: 'borderWidth',
      type: 'number',
      description: 'Border thickness',
    },
    {
      name: 'borderColor',
      type: 'number',
      description: 'Border color (hex number)',
    },
  ],
}
