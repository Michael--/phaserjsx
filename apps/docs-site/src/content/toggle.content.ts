/**
 * Toggle Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { AnimationToggleExample } from '@/examples/toggle/AnimationExample'
import { ControlledToggleExample } from '@/examples/toggle/ControlledExample'
import { LabelPositionToggleExample } from '@/examples/toggle/LabelPositionExample'
import { QuickStartToggleExample } from '@/examples/toggle/QuickStartExample'
import { StatesToggleExample } from '@/examples/toggle/StatesExample'
import { ThemingToggleExample } from '@/examples/toggle/ThemingExample'
import type { ComponentDocs } from '@/types/docs'
import AnimationToggleExampleCode from '@/examples/toggle/AnimationExample.tsx?raw'
import ControlledToggleExampleCode from '@/examples/toggle/ControlledExample.tsx?raw'
import LabelPositionToggleExampleCode from '@/examples/toggle/LabelPositionExample.tsx?raw'
import QuickStartToggleExampleCode from '@/examples/toggle/QuickStartExample.tsx?raw'
import StatesToggleExampleCode from '@/examples/toggle/StatesExample.tsx?raw'
import ThemingToggleExampleCode from '@/examples/toggle/ThemingExample.tsx?raw'

/**
 * Toggle component documentation configuration
 */
export const toggleContent: ComponentDocs = {
  title: 'Toggle',
  description:
    'A binary on/off switch control with smooth animations. Toggle provides an intuitive way to enable or disable features, settings, or states with an animated thumb that slides between positions.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic toggle with label and onChange handler. Toggle supports both controlled and uncontrolled modes with smooth Phaser animations.',
    component: QuickStartToggleExample,
    height: SCENE_SIZES.medium,
    code: QuickStartToggleExampleCode,
  },

  examples: [
    {
      id: 'labelPosition',
      title: 'Label Positioning',
      description: 'Position labels on the left, right, or hide them completely.',
      component: LabelPositionToggleExample,
      height: SCENE_SIZES.medium,
      code: LabelPositionToggleExampleCode,
    },
    {
      id: 'states',
      title: 'Toggle States',
      description: 'Interactive and disabled states with checked variations.',
      component: StatesToggleExample,
      height: SCENE_SIZES.large,
      code: StatesToggleExampleCode,
    },
    {
      id: 'animation',
      title: 'Animation Duration',
      description: 'Control animation speed with custom duration values.',
      component: AnimationToggleExample,
      height: SCENE_SIZES.large,
      code: AnimationToggleExampleCode,
    },
    {
      id: 'controlled',
      title: 'Controlled Mode',
      description: 'Manage toggle state externally with controlled/uncontrolled patterns.',
      component: ControlledToggleExample,
      height: SCENE_SIZES.large,
      code: ControlledToggleExampleCode,
    },
    {
      id: 'theming',
      title: 'Custom Theming',
      description: 'Customize colors, sizes, and appearance with theme overrides.',
      component: ThemingToggleExample,
      height: SCENE_SIZES.large,
      code: ThemingToggleExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      description: 'Whether the toggle is checked/on. For controlled mode.',
    },
    {
      name: 'onChange',
      type: '(checked: boolean) => void',
      default: undefined,
      description: 'Callback fired when toggle state changes.',
    },
    {
      name: 'label',
      type: 'string',
      default: undefined,
      description: 'Optional label text displayed next to toggle.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables interaction and applies reduced opacity.',
    },
  ],

  propsComplete: [
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      description:
        'Whether the toggle is checked/on. For controlled mode, manage state externally.',
    },
    {
      name: 'onChange',
      type: '(checked: boolean) => void',
      default: undefined,
      description: 'Callback fired when toggle state changes. Receives new checked state.',
    },
    {
      name: 'label',
      type: 'string',
      default: undefined,
      description: 'Optional label text displayed next to the toggle switch.',
    },
    {
      name: 'labelPosition',
      type: "'left' | 'right' | 'none'",
      default: "'right'",
      description: 'Position of label relative to toggle. Use "none" to hide label.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables interaction, applies 0.5 alpha, and shows disabledColor from theme.',
    },
    {
      name: 'prefix',
      type: 'VNode',
      default: undefined,
      description: 'Element to render before the toggle (e.g., icon).',
    },
    {
      name: 'suffix',
      type: 'VNode',
      default: undefined,
      description: 'Element to render after the toggle (e.g., icon).',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description:
        'Theme overrides for Toggle appearance. Available theme keys: width (50), height (28), thumbSize (24), trackColorOff, trackColorOn, thumbColor, disabledColor, padding (2), duration (200ms), gap (8), labelStyle, labelPosition.',
    },
  ],
}
