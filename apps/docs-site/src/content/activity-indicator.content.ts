/**
 * ActivityIndicator component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { QuickStartActivityIndicatorExample } from '@/examples/activity-indicator/QuickStartExample'
import QuickStartActivityIndicatorExampleCode from '@/examples/activity-indicator/QuickStartExample.tsx?raw'
import { VariantsActivityIndicatorExample } from '@/examples/activity-indicator/VariantsExample'
import VariantsActivityIndicatorExampleCode from '@/examples/activity-indicator/VariantsExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const activityIndicatorContent: ComponentDocs = {
  title: 'ActivityIndicator',
  description:
    'Indeterminate loading indicator with spinner, dots, and pulse variants. Ideal for async operations, scene transitions, and network waits.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'A minimal spinner renders with sensible defaults.',
    component: QuickStartActivityIndicatorExample,
    height: SCENE_SIZES.small,
    code: QuickStartActivityIndicatorExampleCode,
  },

  examples: [
    {
      id: 'variants',
      title: 'Variants',
      description:
        'Spinner (rotating arc), dots (sequential fill), and pulse (breathing circle) with custom colors and optional labels.',
      component: VariantsActivityIndicatorExample,
      height: SCENE_SIZES.small,
      code: VariantsActivityIndicatorExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'variant',
      type: "'spinner' | 'dots' | 'pulse'",
      default: "'spinner'",
      description: 'Visual style of the indicator.',
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      default: "'medium'",
      description: 'Size preset (20 / 32 / 48 px).',
    },
    {
      name: 'label',
      type: 'string',
      default: undefined,
      description: 'Optional text below the indicator. Falls back to labels.loading.',
    },
    {
      name: 'color',
      type: 'number',
      default: 'primary',
      description: 'Foreground color of the spinner/dots/pulse.',
    },
  ],

  propsComplete: [
    {
      name: 'variant',
      type: "'spinner' | 'dots' | 'pulse'",
      default: "'spinner'",
      description: 'Spinner = rotating arc, dots = sequential fill, pulse = breathing circle.',
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      default: "'medium'",
      description: 'Controls overall dimensions and line/dot sizes.',
    },
    {
      name: 'color',
      type: 'number',
      default: 'theme primary',
      description: 'Arc/dots/pulse fill color.',
    },
    {
      name: 'trackColor',
      type: 'number',
      default: 'same as color',
      description: 'Background ring color for the spinner variant.',
    },
    {
      name: 'label',
      type: 'string',
      default: undefined,
      description: 'Visible text below the indicator.',
    },
    {
      name: 'labels',
      type: 'ActivityIndicatorLabels',
      default: "{ loading: 'Loading...' }",
      description: 'Localized loading text used when label is not set.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Theme overrides for ActivityIndicator, Graphics, and Text slots.',
    },
  ],

  relatedLinks: [
    {
      title: 'ProgressBar',
      link: '/components/progressbar',
      description: 'Use ProgressBar for determinate progress (health, XP, loading percentage).',
    },
    {
      title: 'ProgressView',
      link: '/components/coming-soon',
      description: 'Composite that switches between ProgressBar and ActivityIndicator.',
    },
    {
      title: 'Portal',
      link: '/components/portal',
      description: 'Render ActivityIndicator in a portal overlay for full-screen loading states.',
    },
  ],
}
