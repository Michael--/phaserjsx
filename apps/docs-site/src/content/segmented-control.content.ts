/**
 * SegmentedControl Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { IconSegmentsSegmentedControlExample } from '@/examples/segmented-control/IconSegmentsExample'
import IconSegmentsSegmentedControlExampleCode from '@/examples/segmented-control/IconSegmentsExample.tsx?raw'
import { QuickStartSegmentedControlExample } from '@/examples/segmented-control/QuickStartExample'
import QuickStartSegmentedControlExampleCode from '@/examples/segmented-control/QuickStartExample.tsx?raw'
import { VerticalThemingSegmentedControlExample } from '@/examples/segmented-control/VerticalThemingExample'
import VerticalThemingSegmentedControlExampleCode from '@/examples/segmented-control/VerticalThemingExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const segmentedControlContent: ComponentDocs = {
  title: 'SegmentedControl',
  description:
    'Compact single-selection control for short mode, filter, and toolbar choices. SegmentedControl supports controlled and uncontrolled usage, disabled options, custom segment rendering, and theme-based sizing and styling.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Controlled SegmentedControl with three short text options.',
    component: QuickStartSegmentedControlExample,
    height: SCENE_SIZES.medium,
    code: QuickStartSegmentedControlExampleCode,
  },

  examples: [
    {
      id: 'icon-segments',
      title: 'Icon Segments',
      description:
        'Use renderOption for icon and label layouts while preserving the built-in selection behavior.',
      component: IconSegmentsSegmentedControlExample,
      height: SCENE_SIZES.medium,
      code: IconSegmentsSegmentedControlExampleCode,
    },
    {
      id: 'vertical-theming',
      title: 'Vertical and Themed',
      description:
        'Switch orientation, disable individual options, add a localized group label, and override the SegmentedControl theme slot.',
      component: VerticalThemingSegmentedControlExample,
      height: SCENE_SIZES.medium,
      code: VerticalThemingSegmentedControlExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'options',
      type: 'SegmentedControlOption[]',
      required: true,
      description:
        'Segments to render. Each option has value plus optional label, icon, children, and disabled.',
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
      default: 'first enabled option',
      description: 'Initial selected value in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Callback fired when a selectable segment is selected.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Segment layout direction.',
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      default: "'medium'",
      description: 'Size preset for segment height, padding, text, and icon sizing.',
    },
    {
      name: 'variant',
      type: "'solid' | 'soft' | 'outline'",
      default: "'solid'",
      description: 'Visual treatment for the shared control frame and selected segment.',
    },
  ],

  propsComplete: [
    {
      name: 'options',
      type: 'SegmentedControlOption[]',
      required: true,
      description:
        'Segments to render. SegmentedControlOption: { value: string; label?: string; icon?: VNode; children?: VNode; disabled?: boolean }.',
    },
    {
      name: 'value',
      type: 'string',
      default: undefined,
      description:
        'Selected value in controlled mode. Unknown values render with no selected segment.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      default: 'first enabled option',
      description: 'Initial selected value in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Callback fired when a selectable segment is selected.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Segment layout direction.',
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      default: "'medium'",
      description: 'Size preset for segment height, padding, text, and icon sizing.',
    },
    {
      name: 'variant',
      type: "'solid' | 'soft' | 'outline'",
      default: "'solid'",
      description: 'Visual treatment for the shared control frame and selected segment.',
    },
    {
      name: 'label',
      type: 'string',
      default: undefined,
      description: 'Optional visible group label. Takes precedence over labels.group.',
    },
    {
      name: 'labelPosition',
      type: "'left' | 'top' | 'none'",
      default: "'none'",
      description: 'Position of the optional visible group label.',
    },
    {
      name: 'labels',
      type: 'SegmentedControlLabels',
      default: "{ group: 'Options' }",
      description: 'Localized fallback labels for visible group text.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the whole control and prevents selection changes.',
    },
    {
      name: 'segmentWidth',
      type: 'ViewProps["width"]',
      default: 'theme.segmentWidth',
      description: 'Fixed segment width. Use with short labels to avoid layout jumps.',
    },
    {
      name: 'segmentHeight',
      type: 'ViewProps["height"]',
      default: 'theme.segmentHeight',
      description: 'Fixed segment height.',
    },
    {
      name: 'renderOption',
      type: '(props: SegmentedControlOptionRenderProps) => VNode',
      default: undefined,
      description:
        'Render custom segment content with selected, disabled, hovered, and index state.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Local theme overrides, including the SegmentedControl component theme slot.',
    },
  ],

  inherits: [
    {
      component: 'View',
      link: '/components/view',
      description:
        'SegmentedControl forwards layout, transform, background, border, and gesture props to its root View.',
    },
  ],

  relatedLinks: [
    {
      title: 'RadioButton',
      link: '/components/radiobutton',
      description:
        'Use RadioGroup when the choices should read as a traditional form field instead of a compact segmented switch.',
    },
    {
      title: 'Tabs',
      link: '/components/tabs',
      description:
        'Use Tabs when selection changes larger panels of content; use SegmentedControl for compact modes and filters.',
    },
  ],
}
