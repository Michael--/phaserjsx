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
// Import source code as raw strings
import EffectsButtonExampleRaw from '@/examples/button/EffectsExample.tsx?raw'
import IconsButtonExampleRaw from '@/examples/button/IconsExample.tsx?raw'
import QuickStartButtonExampleRaw from '@/examples/button/QuickStartExample.tsx?raw'
import SizingButtonExampleRaw from '@/examples/button/SizingExample.tsx?raw'
import StatesButtonExampleRaw from '@/examples/button/StatesExample.tsx?raw'
import VariantsButtonExampleRaw from '@/examples/button/VariantsExample.tsx?raw'
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
    code: QuickStartButtonExampleRaw,
  },

  examples: [
    {
      id: 'variants',
      title: 'Variants',
      description: 'Different visual styles for buttons',
      component: VariantsButtonExample,
      height: SCENE_SIZES.small,
      code: VariantsButtonExampleRaw,
    },
    {
      id: 'states',
      title: 'States',
      description: 'Interactive states and disabled buttons',
      component: StatesButtonExample,
      height: SCENE_SIZES.small,
      code: StatesButtonExampleRaw,
    },
    {
      id: 'icons',
      title: 'With Icons',
      description: 'Combining buttons with icon components',
      component: IconsButtonExample,
      height: SCENE_SIZES.small,
      code: IconsButtonExampleRaw,
    },
    {
      id: 'sizing',
      title: 'Sizing & Layout',
      description: 'Size variants and custom dimensions',
      component: SizingButtonExample,
      height: SCENE_SIZES.medium,
      code: SizingButtonExampleRaw,
    },
    {
      id: 'effects',
      title: 'Effects',
      description: 'Phaser-powered hover and click animations',
      component: EffectsButtonExample,
      height: SCENE_SIZES.medium,
      code: EffectsButtonExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'variant',
      type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
      default: '"primary"',
      description: 'Visual style variant - determines color scheme and appearance',
    },
    {
      name: 'label',
      type: 'string | number',
      description: 'Convenience label rendered with the Button textStyle theme',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click/tap event handler - called after effect animation completes',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description:
        'Disables interaction (no gestures), reduces opacity to 0.5, applies disabled color',
    },
    {
      name: 'size',
      type: '"small" | "medium" | "large"',
      default: '"medium"',
      description:
        'Predefined size variant - controls padding, font size, and dimensions via theme',
    },
    {
      name: 'children',
      type: 'VNode | VNode[]',
      description: 'Button content - Text, Icon, or any combination in a row layout',
    },
  ],

  propsComplete: [
    {
      name: 'variant',
      type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
      default: '"primary"',
      description: 'Visual style variant - determines color scheme and appearance from theme',
    },
    {
      name: 'size',
      type: '"small" | "medium" | "large"',
      default: '"medium"',
      description:
        'Predefined size variant - controls padding, font size, and dimensions via theme',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description:
        'Disables interaction, applies disabledColor, disabledAlpha, and disabled text/icon colors from theme',
    },
    {
      name: 'onClick',
      type: '() => void',
      description:
        'Click/tap event handler - triggered after effect animation (ignored when disabled)',
    },
    {
      name: 'effect',
      type: 'EffectName',
      description:
        'Animation effect: "pulse", "bounce", "shake", "press", "flash", "jello", "fade", "wobble", "tada", "swing", "wiggle", "slideIn", "slideOut", "zoomIn", "zoomOut", "flipIn", "flipOut", "float", "breathe", "spin"',
    },
    {
      name: 'effectConfig',
      type: 'EffectConfig',
      description:
        'Effect configuration: { time?, scale?, distance?, rotation?, alpha?, etc. } - varies per effect',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Button width - overrides theme size (number, "fill", "auto", percentage, viewport, calc)',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description:
        'Button height - overrides theme size (number, "fill", "auto", percentage, viewport, calc)',
    },
    {
      name: 'children',
      type: 'VNode | VNode[]',
      description: 'Button content - rendered in row layout with center alignment',
    },
    {
      name: 'label',
      type: 'string | number',
      description: 'Generated text content. Ignored when children are provided.',
    },
    {
      name: 'text',
      type: 'string | number',
      description: 'Backward-compatible alias for label.',
    },
    {
      name: 'textStyle',
      type: 'Phaser.Types.GameObjects.Text.TextStyle',
      description:
        'Overrides generated label style and sets the nested Text theme for child Text components.',
    },
    {
      name: 'iconSize',
      type: 'number',
      description: 'Sets the nested Icon theme size for icon children.',
    },
    {
      name: 'disabledAlpha',
      type: 'number',
      default: '0.48',
      description:
        'Background alpha applied while disabled, configurable through the Button theme.',
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
