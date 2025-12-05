/**
 * Toggle Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { ControlledToggleExample } from '@/examples/toggle/ControlledExample'
import ControlledToggleExampleCode from '@/examples/toggle/ControlledExample.tsx?raw'
import { LabelPositionToggleExample } from '@/examples/toggle/LabelPositionExample'
import LabelPositionToggleExampleCode from '@/examples/toggle/LabelPositionExample.tsx?raw'
import { QuickStartToggleExample } from '@/examples/toggle/QuickStartExample'
import QuickStartToggleExampleCode from '@/examples/toggle/QuickStartExample.tsx?raw'
import { StatesToggleExample } from '@/examples/toggle/StatesExample'
import StatesToggleExampleCode from '@/examples/toggle/StatesExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

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
      id: 'controlled',
      title: 'Controlled Mode',
      description: 'Manage toggle state externally with controlled/uncontrolled patterns.',
      component: ControlledToggleExample,
      height: SCENE_SIZES.large,
      code: ControlledToggleExampleCode,
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
  ],
}
