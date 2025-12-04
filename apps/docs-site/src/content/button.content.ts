/**
 * Button component documentation content
 */

export interface PropDefinition {
  name: string
  type: string
  default?: string
  description: string
}

export const buttonContent = {
  title: 'Button Component',
  description:
    'Interactive button component with multiple variants, states, and full theme support.',

  usage: `/** @jsxImportSource @phaserjsx/ui */
import { Button, Text } from '@phaserjsx/ui'

function MyComponent() {
  return (
    <Button onClick={() => console.log('Clicked!')}>
      <Text text="Click Me" />
    </Button>
  )
}`,

  variants: `<Button variant="primary">
  <Text text="Primary" />
</Button>

<Button variant="secondary">
  <Text text="Secondary" />
</Button>

<Button variant="outline">
  <Text text="Outline" />
</Button>

<Button variant="ghost">
  <Text text="Ghost" />
</Button>`,

  props: [
    {
      name: 'variant',
      type: 'string',
      default: '"primary"',
      description: 'Button style variant',
    },
    {
      name: 'onClick',
      type: 'function',
      default: '-',
      description: 'Click event handler',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable button interaction',
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
  ] satisfies PropDefinition[],
}
