/**
 * ProgressBar component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  QuickStartProgressBarExample,
  StatesProgressBarExample,
  VariantsProgressBarExample,
} from '@/examples/progressbar'
import QuickStartProgressBarExampleRaw from '@/examples/progressbar/QuickStartExample.tsx?raw'
import StatesProgressBarExampleRaw from '@/examples/progressbar/StatesExample.tsx?raw'
import VariantsProgressBarExampleRaw from '@/examples/progressbar/VariantsExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const progressbarContent: ComponentDocs = {
  title: 'ProgressBar',
  description:
    'Determinate progress indicator for health, loading, cooldowns, XP, stamina, and other bounded values.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'A controlled ProgressBar driven by a Slider value.',
    component: QuickStartProgressBarExample,
    height: SCENE_SIZES.medium,
    code: QuickStartProgressBarExampleRaw,
  },

  examples: [
    {
      id: 'states',
      title: 'States',
      description: 'Inside labels, disabled state, and value-dependent colors.',
      component: StatesProgressBarExample,
      height: SCENE_SIZES.large,
      code: StatesProgressBarExampleRaw,
    },
    {
      id: 'variants',
      title: 'Variants',
      description: 'Horizontal HUD bars and vertical ability charge indicators.',
      component: VariantsProgressBarExample,
      height: SCENE_SIZES.large,
      code: VariantsProgressBarExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'value',
      type: 'number',
      description: 'Current progress value.',
      required: true,
    },
    {
      name: 'min',
      type: 'number',
      default: '0',
      description: 'Minimum value used for normalization.',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      description: 'Maximum value used for normalization.',
    },
    {
      name: 'orientation',
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: 'Render direction of the progress fill.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Optional text prefix rendered with the value.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Show formatted progress text next to or inside the bar.',
    },
    {
      name: 'labelPosition',
      type: '"none" | "inside" | "top" | "bottom" | "left" | "right"',
      default: '"right" when label/showValue is set, otherwise "none"',
      description: 'Position of the label/value text.',
    },
  ],

  propsComplete: [
    {
      name: 'value',
      type: 'number',
      description: 'Current progress value. Values outside the range are clamped.',
      required: true,
    },
    {
      name: 'min',
      type: 'number',
      default: '0',
      description: 'Minimum value used for normalization.',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      description: 'Maximum value used for normalization.',
    },
    {
      name: 'orientation',
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: 'Horizontal bars fill left-to-right. Vertical bars fill bottom-to-top.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Optional text prefix rendered with the value.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Show formatted progress text.',
    },
    {
      name: 'labelPosition',
      type: '"none" | "inside" | "top" | "bottom" | "left" | "right"',
      default: '"right" when label/showValue is set, otherwise "none"',
      description: 'Position of the label/value text.',
    },
    {
      name: 'formatValue',
      type: '(props: ProgressBarFormatProps) => string',
      description: 'Custom formatter for value text. Receives value, min, max, ratio, and percent.',
    },
    {
      name: 'trackColor',
      type: 'number',
      description: 'Track/background color.',
    },
    {
      name: 'fillColor',
      type: 'number',
      description: 'Filled progress color.',
    },
    {
      name: 'borderColor',
      type: 'number',
      description: 'Border color around the track.',
    },
    {
      name: 'borderWidth',
      type: 'number',
      default: '1',
      description: 'Border width around the track.',
    },
    {
      name: 'cornerRadius',
      type: 'number',
      description: 'Track corner radius.',
    },
    {
      name: 'labelStyle',
      type: 'Phaser.Types.GameObjects.Text.TextStyle',
      description: 'Text style for the label/value.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Applies disabled alpha styling.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      description: 'Theme overrides for size, colors, label style, and defaults.',
    },
  ],

  inherits: [
    {
      component: 'Core Props',
      link: '/api/core-props',
      description:
        'ProgressBar is composed from View and Text and supports the shared layout, theme, alpha, margin, and positioning props.',
    },
  ],
}
