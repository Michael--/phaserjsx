/**
 * Dropdown Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { FilterableDropdownExample } from '@/examples/dropdown/FilterableExample'
import FilterableDropdownExampleCode from '@/examples/dropdown/FilterableExample.tsx?raw'
import { MultiSelectDropdownExample } from '@/examples/dropdown/MultiSelectExample'
import MultiSelectDropdownExampleCode from '@/examples/dropdown/MultiSelectExample.tsx?raw'
import { QuickStartDropdownExample } from '@/examples/dropdown/QuickStartExample'
import QuickStartDropdownExampleCode from '@/examples/dropdown/QuickStartExample.tsx?raw'
import { StatesDropdownExample } from '@/examples/dropdown/StatesExample'
import StatesDropdownExampleCode from '@/examples/dropdown/StatesExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * Dropdown component documentation configuration
 */
export const dropdownContent: ComponentDocs = {
  title: 'Dropdown',
  description:
    'Select component for choosing options from a dropdown list. Supports single and multi-select modes, filtering, custom rendering, and flexible placement. Important: Parent container must use direction="stack" for proper overlay positioning.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic single-select dropdown with options array. Note the parent View uses direction="stack" which is required for the dropdown menu overlay to display correctly.',
    component: QuickStartDropdownExample,
    height: SCENE_SIZES.medium,
    code: QuickStartDropdownExampleCode,
  },

  examples: [
    {
      id: 'multiselect',
      title: 'Single and Multi-Select',
      description:
        'Dropdown supports both single-select and multi-select modes. Use multiple={true} for multi-select.',
      component: MultiSelectDropdownExample,
      height: SCENE_SIZES.large,
      code: MultiSelectDropdownExampleCode,
    },
    {
      id: 'filterable',
      title: 'Filterable Dropdown',
      description:
        'Enable filtering with isFilterable={true}. Users can type to filter options. Useful for large option lists.',
      component: FilterableDropdownExample,
      height: SCENE_SIZES.large,
      code: FilterableDropdownExampleCode,
    },
    {
      id: 'states',
      title: 'States and Placement',
      description:
        'Different states (disabled) and placement options (top/bottom) for dropdown menu positioning.',
      component: StatesDropdownExample,
      height: SCENE_SIZES.xl,
      code: StatesDropdownExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'options',
      type: 'DropdownOption[]',
      default: undefined,
      description:
        'Array of options. DropdownOption: { value: T, label: string, disabled?: boolean, prefix?: VNode, suffix?: VNode }',
    },
    {
      name: 'value',
      type: 'T | T[]',
      default: undefined,
      description:
        'Selected value (controlled mode). Single value for single-select, array for multi-select.',
    },
    {
      name: 'onChange',
      type: '(value: T | T[]) => void',
      default: undefined,
      description: 'Callback when selection changes. Receives value or array depending on mode.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: undefined,
      description: 'Placeholder text displayed when nothing is selected.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Enable multi-select mode. Value and onChange will use arrays.',
    },
    {
      name: 'isFilterable',
      type: 'boolean',
      default: 'false',
      description: 'Enable filtering. Shows input field to filter options by label.',
    },
  ],

  propsComplete: [
    {
      name: 'options',
      type: 'DropdownOption[]',
      default: undefined,
      description:
        'Array of selectable options. DropdownOption: { value: T, label: string, disabled?: boolean, prefix?: VNode, suffix?: VNode }',
    },
    {
      name: 'value',
      type: 'T | T[]',
      default: undefined,
      description:
        'Current selected value (controlled mode). Single value for single-select, array for multi-select.',
    },
    {
      name: 'defaultValue',
      type: 'T | T[]',
      default: undefined,
      description: 'Default selected value (uncontrolled mode). Dropdown manages state internally.',
    },
    {
      name: 'onChange',
      type: '(value: T | T[]) => void',
      default: undefined,
      description:
        'Callback fired when selection changes. Receives selected value or array of values.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: undefined,
      description: 'Placeholder text shown when no option is selected.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Enable multi-select mode. Changes value type to array.',
    },
    {
      name: 'isFilterable',
      type: 'boolean',
      default: 'false',
      description: 'Enable filtering with text input. Filters options by label.',
    },
    {
      name: 'filterInputPlaceholder',
      type: 'string',
      default: undefined,
      description: 'Placeholder for filter input field when isFilterable is true.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable interaction with the dropdown.',
    },
    {
      name: 'maxHeight',
      type: 'number',
      default: undefined,
      description: 'Maximum height of dropdown menu in pixels. Enables scrolling if exceeded.',
    },
    {
      name: 'placement',
      type: "'top' | 'bottom'",
      default: "'bottom'",
      description: 'Position of dropdown menu relative to trigger button.',
    },
    {
      name: 'renderValue',
      type: '(selected: DropdownOption | DropdownOption[] | null) => VNode',
      default: undefined,
      description: 'Custom renderer for selected value display in trigger button.',
    },
    {
      name: 'renderOption',
      type: '(option: DropdownOption, isSelected: boolean) => VNode',
      default: undefined,
      description: 'Custom renderer for individual options in dropdown menu.',
    },
    {
      name: 'arrow',
      type: 'VNode',
      default: undefined,
      description: 'Custom arrow/icon component for dropdown trigger button.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      default: undefined,
      description: 'Width of dropdown trigger button (not the menu).',
    },
  ],
}
