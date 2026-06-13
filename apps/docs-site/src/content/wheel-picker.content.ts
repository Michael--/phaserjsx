/**
 * WheelPicker component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { QuickStartWheelPickerExample } from '@/examples/wheel-picker/QuickStartExample'
import QuickStartWheelPickerExampleCode from '@/examples/wheel-picker/QuickStartExample.tsx?raw'
import { ThreeItemWheelPickerExample } from '@/examples/wheel-picker/ThreeItemsExample'
import ThreeItemWheelPickerExampleCode from '@/examples/wheel-picker/ThreeItemsExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const wheelPickerContent: ComponentDocs = {
  title: 'WheelPicker',
  description:
    'SwiftUI-style scrollable picker with snap-to-center behaviour, fade edges, and a selection highlight bar. Perfect for item selection with a tactile game feel.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'A 5-item wheel with difficulty levels. Scroll and snap to select.',
    component: QuickStartWheelPickerExample,
    height: SCENE_SIZES.medium,
    code: QuickStartWheelPickerExampleCode,
  },

  examples: [
    {
      id: 'three-items',
      title: '3-Item Wheel',
      description:
        'Compact 3-visible-items wheel for weapon selection — tighter layout with the same snap behaviour.',
      component: ThreeItemWheelPickerExample,
      height: SCENE_SIZES.medium,
      code: ThreeItemWheelPickerExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'items',
      type: 'WheelPickerItem[]',
      required: true,
      description: 'Array of { value: string; label: string; disabled?: boolean }.',
    },
    {
      name: 'value',
      type: 'string',
      default: undefined,
      description: 'Controlled selected value.',
    },
    {
      name: 'visibleItems',
      type: 'number',
      default: '5',
      description: 'Number of items visible at once. Odd numbers (3, 5, 7) look best.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Called when the snapped item changes.',
    },
  ],

  propsComplete: [
    {
      name: 'items',
      type: 'WheelPickerItem[]',
      required: true,
      description: '{ value, label, disabled? }.',
    },
    {
      name: 'value',
      type: 'string',
      default: undefined,
      description: 'Controlled selected value.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      default: undefined,
      description: 'Initial selected value for uncontrolled usage.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Selection callback on snap.',
    },
    {
      name: 'visibleItems',
      type: 'number',
      default: '5',
      description: 'Odd numbers work best — center item is always the selected one.',
    },
    {
      name: 'loop',
      type: 'boolean',
      default: 'false',
      description: 'Loop items infinitely (not yet implemented).',
    },
    {
      name: 'renderItem',
      type: '(props: WheelPickerItemRenderProps) => ChildrenType',
      default: undefined,
      description: 'Custom item renderer with selected, disabled, distanceFromCenter.',
    },
    {
      name: 'labels',
      type: 'WheelPickerLabels',
      default: "{ empty: 'No items' }",
      description: 'Localized empty-state text.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the entire picker.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Theme overrides for WheelPicker, ScrollView, Text, and Graphics slots.',
    },
  ],

  relatedLinks: [
    {
      title: 'ListBox',
      link: '/components/listbox',
      description: 'Flat selection list with hover — simpler alternative for larger item sets.',
    },
    {
      title: 'ScrollView',
      link: '/components/scroll-view',
      description: 'WheelPicker uses ScrollView with snap positions for the wheel behaviour.',
    },
    {
      title: 'SegmentedControl',
      link: '/components/segmented-control',
      description: 'Horizontal segment picker for small option counts.',
    },
  ],
}
