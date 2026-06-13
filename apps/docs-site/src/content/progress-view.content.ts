/**
 * ProgressView component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { IndeterminateProgressViewExample } from '@/examples/progress-view/IndeterminateExample'
import IndeterminateProgressViewExampleCode from '@/examples/progress-view/IndeterminateExample.tsx?raw'
import { QuickStartProgressViewExample } from '@/examples/progress-view/QuickStartExample'
import QuickStartProgressViewExampleCode from '@/examples/progress-view/QuickStartExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const progressViewContent: ComponentDocs = {
  title: 'ProgressView',
  description:
    'Composite progress indicator that renders a determinate ProgressBar or an indeterminate ActivityIndicator, with optional label, percentage, and cancel button.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Animated determinate bar auto-incrementing from 0 to 100 with percentage and custom fill color.',
    component: QuickStartProgressViewExample,
    height: SCENE_SIZES.small,
    code: QuickStartProgressViewExampleCode,
  },

  examples: [
    {
      id: 'indeterminate',
      title: 'Indeterminate',
      description:
        'Seamless transition from indeterminate spinner to determinate bar on cancel or completion — one ProgressView, no hard cut.',
      component: IndeterminateProgressViewExample,
      height: SCENE_SIZES.small,
      code: IndeterminateProgressViewExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current progress value. When set, renders a ProgressBar.',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Switch to ActivityIndicator when true, ignoring value.',
    },
    {
      name: 'label',
      type: 'string',
      default: undefined,
      description: 'Text above the bar (determinate) or below the indicator (indeterminate).',
    },
    {
      name: 'showPercentage',
      type: 'boolean',
      default: 'false',
      description: 'Show percentage text next to the label.',
    },
  ],

  propsComplete: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Progress value between min and max.',
    },
    {
      name: 'min',
      type: 'number',
      default: '0',
      description: 'Minimum value.',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      description: 'Maximum value.',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description:
        'When true, renders ActivityIndicator instead of ProgressBar. Label text moves below the indicator.',
    },
    {
      name: 'label',
      type: 'string',
      default: undefined,
      description: 'Visible text. Falls back to labels.loading in indeterminate mode.',
    },
    {
      name: 'showPercentage',
      type: 'boolean',
      default: 'false',
      description: 'Show calculated percentage in a right-aligned text slot (determinate only).',
    },
    {
      name: 'showCancel',
      type: 'boolean',
      default: 'false',
      description: 'Show a ghost cancel button below the indicator.',
    },
    {
      name: 'onCancel',
      type: '() => void',
      default: undefined,
      description: 'Cancel callback. Required for the cancel button to appear.',
    },
    {
      name: 'labels',
      type: 'ProgressViewLabels',
      default: "{ cancel: 'Cancel', loading: 'Loading...' }",
      description: 'Localized text for cancel button and indeterminate fallback.',
    },
    {
      name: 'progressBarProps',
      type: 'Omit<ProgressBarProps, ...>',
      default: undefined,
      description:
        'Props forwarded to the underlying ProgressBar (orientation, trackColor, fillColor, etc.).',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description:
        'Theme overrides for ProgressView, ProgressBar, ActivityIndicator, Button, and Text slots.',
    },
  ],

  relatedLinks: [
    {
      title: 'ProgressBar',
      link: '/components/progressbar',
      description: 'The underlying determinate bar. Use directly for minimal setups.',
    },
    {
      title: 'ActivityIndicator',
      link: '/components/activity-indicator',
      description: 'The underlying indeterminate spinner used in indeterminate mode.',
    },
  ],
}
