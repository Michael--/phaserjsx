/**
 * RatingBar component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { CustomIconRatingBarExample } from '@/examples/rating-bar/CustomIconExample'
import CustomIconRatingBarExampleCode from '@/examples/rating-bar/CustomIconExample.tsx?raw'
import { QuickStartRatingBarExample } from '@/examples/rating-bar/QuickStartExample'
import QuickStartRatingBarExampleCode from '@/examples/rating-bar/QuickStartExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const ratingBarContent: ComponentDocs = {
  title: 'RatingBar',
  description:
    'Star rating input (1–N) with tap-to-rate. Supports controlled/uncontrolled mode, custom icon rendering, and size presets.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'A 5-star bar with default ★/☆ characters.',
    component: QuickStartRatingBarExample,
    height: SCENE_SIZES.small,
    code: QuickStartRatingBarExampleCode,
  },

  examples: [
    {
      id: 'custom-icon',
      title: 'Custom Icons',
      description: 'Replace ★/☆ with Bootstrap Icons via renderIcon.',
      component: CustomIconRatingBarExample,
      height: SCENE_SIZES.small,
      code: CustomIconRatingBarExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Controlled rating value.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: '0',
      description: 'Initial rating for uncontrolled usage.',
    },
    {
      name: 'max',
      type: 'number',
      default: '5',
      description: 'Total number of stars.',
    },
    {
      name: 'onChange',
      type: '(value: number) => void',
      default: undefined,
      description: 'Called when a star is tapped.',
    },
  ],

  relatedLinks: [
    {
      title: 'Icon',
      link: '/components/icon',
      description: 'Use Bootstrap Icons with renderIcon for custom star graphics.',
    },
  ],
}
