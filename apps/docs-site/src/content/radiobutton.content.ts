/**
 * RadioButton Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { ControlledRadioButtonExample } from '@/examples/radiobutton/ControlledExample'
import ControlledRadioButtonExampleCode from '@/examples/radiobutton/ControlledExample.tsx?raw'
import { DirectionRadioButtonExample } from '@/examples/radiobutton/DirectionExample'
import DirectionRadioButtonExampleCode from '@/examples/radiobutton/DirectionExample.tsx?raw'
import { QuickStartRadioButtonExample } from '@/examples/radiobutton/QuickStartExample'
import QuickStartRadioButtonExampleCode from '@/examples/radiobutton/QuickStartExample.tsx?raw'
import { StandaloneRadioButtonExample } from '@/examples/radiobutton/StandaloneExample'
import StandaloneRadioButtonExampleCode from '@/examples/radiobutton/StandaloneExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * RadioButton component documentation configuration
 */
export const radiobuttonContent: ComponentDocs = {
  title: 'RadioButton',
  description:
    'Single-selection controls with circular indicators. RadioButton provides individual radio controls, while RadioGroup manages a group of options with automatic selection handling. RadioGroup is the recommended approach for most use cases.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic RadioGroup with options array. RadioGroup handles selection state automatically and provides onChange callback.',
    component: QuickStartRadioButtonExample,
    height: SCENE_SIZES.medium,
    code: QuickStartRadioButtonExampleCode,
  },

  examples: [
    {
      id: 'direction',
      title: 'Layout Direction',
      description: 'RadioGroup supports both column (vertical) and row (horizontal) layouts.',
      component: DirectionRadioButtonExample,
      height: SCENE_SIZES.large,
      code: DirectionRadioButtonExampleCode,
    },
    {
      id: 'standalone',
      title: 'Standalone RadioButton',
      description:
        'Using RadioButton component directly for manual control. RadioGroup is recommended for most cases.',
      component: StandaloneRadioButtonExample,
      height: SCENE_SIZES.large,
      code: StandaloneRadioButtonExampleCode,
    },
    {
      id: 'controlled',
      title: 'Controlled Mode',
      description: 'Multiple RadioGroups with controlled state management.',
      component: ControlledRadioButtonExample,
      height: SCENE_SIZES.large,
      code: ControlledRadioButtonExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'options',
      type: 'RadioGroupOption[]',
      default: undefined,
      description:
        'Array of options with value and label. RadioGroupOption: { value: string, label: string }',
    },
    {
      name: 'value',
      type: 'string',
      default: undefined,
      description: 'Currently selected value (controlled mode).',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Callback when selection changes, receives selected value.',
    },
    {
      name: 'direction',
      type: "'row' | 'column'",
      default: "'column'",
      description: 'Layout direction for options.',
    },
  ],

  propsComplete: [
    {
      name: 'options',
      type: 'RadioGroupOption[]',
      default: undefined,
      description:
        'Array of options to display. RadioGroupOption: { value: string, label: string }',
    },
    {
      name: 'value',
      type: 'string',
      default: undefined,
      description:
        'Currently selected value (controlled mode). When provided, RadioGroup becomes controlled.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Callback fired when selection changes. Receives the new selected value.',
    },
    {
      name: 'direction',
      type: "'row' | 'column'",
      default: "'column'",
      description: 'Layout direction for radio options. Column is vertical, row is horizontal.',
    },
  ],
}
