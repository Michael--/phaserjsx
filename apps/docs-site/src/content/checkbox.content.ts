/**
 * Checkbox component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  CustomizationCheckboxExample,
  QuickStartCheckboxExample,
  StatesCheckboxExample,
  TristateCheckboxExample,
} from '@/examples/checkbox'
import CustomizationCheckboxExampleRaw from '@/examples/checkbox/CustomizationExample.tsx?raw'
import QuickStartCheckboxExampleRaw from '@/examples/checkbox/QuickStartExample.tsx?raw'
import StatesCheckboxExampleRaw from '@/examples/checkbox/StatesExample.tsx?raw'
import TristateCheckboxExampleRaw from '@/examples/checkbox/TristateExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const checkboxContent: ComponentDocs = {
  title: 'Checkbox',
  description:
    'Binary or tristate selection control for settings, filters, permissions, and grouped option lists.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Controlled checkbox state with onChange.',
    component: QuickStartCheckboxExample,
    height: SCENE_SIZES.small,
    code: QuickStartCheckboxExampleRaw,
  },

  examples: [
    {
      id: 'states',
      title: 'States',
      description: 'Unchecked, checked, indeterminate, and disabled states.',
      component: StatesCheckboxExample,
      height: SCENE_SIZES.medium,
      code: StatesCheckboxExampleRaw,
    },
    {
      id: 'tristate',
      title: 'Tristate',
      description: 'Cycle between false, true, and indeterminate for select-all workflows.',
      component: TristateCheckboxExample,
      height: SCENE_SIZES.small,
      code: TristateCheckboxExampleRaw,
    },
    {
      id: 'customization',
      title: 'Customization',
      description: 'Theme size, colors, label style, and label position.',
      component: CustomizationCheckboxExample,
      height: SCENE_SIZES.large,
      code: CustomizationCheckboxExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'label',
      type: 'string',
      description: 'Optional label text rendered beside the checkbox indicator.',
    },
    {
      name: 'checked',
      type: 'boolean | "indeterminate"',
      description: 'Controlled checked state. Use "indeterminate" with tristate=true.',
    },
    {
      name: 'defaultChecked',
      type: 'boolean | "indeterminate"',
      default: 'false',
      description: 'Initial state for uncontrolled usage.',
    },
    {
      name: 'tristate',
      type: 'boolean',
      default: 'false',
      description: 'Enable unchecked -> checked -> indeterminate cycling.',
    },
    {
      name: 'onChange',
      type: '(checked: CheckboxState) => void',
      description: 'Called when the user toggles the checkbox.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables gestures and applies disabled alpha styling.',
    },
  ],

  propsComplete: [
    {
      name: 'label',
      type: 'string',
      description: 'Optional label text rendered beside the checkbox indicator.',
    },
    {
      name: 'checked',
      type: 'CheckboxState',
      description: 'Controlled state: boolean or "indeterminate".',
    },
    {
      name: 'defaultChecked',
      type: 'CheckboxState',
      default: 'false',
      description: 'Initial uncontrolled state.',
    },
    {
      name: 'tristate',
      type: 'boolean',
      default: 'false',
      description: 'Enable three-state cycling.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables interaction and lowers alpha.',
    },
    {
      name: 'labelPosition',
      type: '"left" | "right" | "none"',
      default: '"right"',
      description: 'Position of the label relative to the indicator.',
    },
    {
      name: 'indicator',
      type: 'ChildrenType',
      description: 'Optional custom indicator content.',
    },
    {
      name: 'renderIndicator',
      type: '(props: CheckboxIndicatorRenderProps) => ChildrenType',
      description: 'Render function for custom indicators with current state and theme colors.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      description: 'Theme overrides for size, gap, colors, label style, and label position.',
    },
    {
      name: 'onChange',
      type: '(checked: CheckboxState) => void',
      description: 'Called when checked state changes.',
    },
  ],

  inherits: [
    {
      component: 'Core Props',
      link: '/api/core-props',
      description:
        'Checkbox is composed from View, Text, and Graphics and supports the shared theme and gesture behavior of those primitives.',
    },
  ],
}
