/**
 * ListBox component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { CustomRenderListBoxExample } from '@/examples/listbox/CustomRenderExample'
import CustomRenderListBoxExampleCode from '@/examples/listbox/CustomRenderExample.tsx?raw'
import { NoHoverListBoxExample } from '@/examples/listbox/NoHoverExample'
import NoHoverListBoxExampleCode from '@/examples/listbox/NoHoverExample.tsx?raw'
import { QuickStartListBoxExample } from '@/examples/listbox/QuickStartExample'
import QuickStartListBoxExampleCode from '@/examples/listbox/QuickStartExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const listboxContent: ComponentDocs = {
  title: 'ListBox',
  description:
    'Scrollable single-selection list with hover states. Supports controlled/uncontrolled mode, custom item rendering, and a max-visible-items height clamp.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Render a fixed-height list and react to selection changes.',
    component: QuickStartListBoxExample,
    height: SCENE_SIZES.medium,
    code: QuickStartListBoxExampleCode,
  },

  examples: [
    {
      id: 'custom-render',
      title: 'Custom Render',
      description:
        'Use renderItem to compose icons, status text, and other content inside each row.',
      component: CustomRenderListBoxExample,
      height: SCENE_SIZES.medium,
      code: CustomRenderListBoxExampleCode,
    },
    {
      id: 'no-hover',
      title: 'No Hover',
      description:
        'Disable hover tracking via hoverable={false} for click-only selection without hover highlights.',
      component: NoHoverListBoxExample,
      height: SCENE_SIZES.small,
      code: NoHoverListBoxExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'items',
      type: 'ListBoxItem[]',
      required: true,
      description: 'List items. Each has value, optional label, and optional disabled flag.',
    },
    {
      name: 'value',
      type: 'string',
      default: undefined,
      description: 'Selected value in controlled mode.',
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
      description: 'Called when a selectable item is clicked.',
    },
  ],

  propsComplete: [
    {
      name: 'items',
      type: 'ListBoxItem[]',
      required: true,
      description:
        'Array of { value: string; label?: string; disabled?: boolean }. Label falls back to value.',
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
      description: 'Initial value in uncontrolled mode. Falls back to first non-disabled item.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Selection callback.',
    },
    {
      name: 'renderItem',
      type: '(props: ListBoxItemRenderProps) => ChildrenType',
      default: undefined,
      description:
        'Custom row renderer receiving item, selected, disabled, hovered, index, and textStyle.',
    },
    {
      name: 'hoverable',
      type: 'boolean',
      default: 'true',
      description:
        'Enables hover state tracking and hover styling. Set to false for click-only interaction.',
    },
    {
      name: 'labels',
      type: 'ListBoxLabels',
      default: "{ empty: 'No items' }",
      description: 'Localized labels for empty state.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the entire list.',
    },
    {
      name: 'maxVisibleItems',
      type: 'number',
      default: undefined,
      description: 'Clamps visible height to a fixed number of rows; content scrolls beyond.',
    },
    {
      name: 'scrollViewProps',
      type: "Pick<ScrollViewProps, 'sliderSize' | 'momentum' | ...>",
      default: undefined,
      description:
        "Props forwarded to the underlying ScrollView. Use sliderSize to control scrollbar thickness ('large', 'medium', 'small', 'tiny', 'micro', 'nano').",
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Theme overrides for ListBox, ScrollView, and Text slots.',
    },
  ],

  relatedLinks: [
    {
      title: 'SegmentedControl',
      link: '/components/segmented-control',
      description: 'Compact alternative for small option sets with fixed-width segments.',
    },
    {
      title: 'Dropdown',
      link: '/components/dropdown',
      description: 'Use Dropdown for keyboard-filterable single-selection with a trigger button.',
    },
    {
      title: 'ScrollView',
      link: '/components/scroll-view',
      description:
        'ListBox wraps ScrollView to enable scrolling when items exceed maxVisibleItems.',
    },
  ],
}
