/**
 * Badge and Tag component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { QuickStartBadgeExample, TagsBadgeExample, VariantsBadgeExample } from '@/examples/badge'
import QuickStartBadgeExampleRaw from '@/examples/badge/QuickStartExample.tsx?raw'
import TagsBadgeExampleRaw from '@/examples/badge/TagsExample.tsx?raw'
import VariantsBadgeExampleRaw from '@/examples/badge/VariantsExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const badgeContent: ComponentDocs = {
  title: 'Badge / Tag',
  description:
    'Compact status labels for counts, notifications, inventory metadata, filters, and selected categories.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Use Badge for counts/status and Tag for filter-like labels.',
    component: QuickStartBadgeExample,
    height: SCENE_SIZES.medium,
    code: QuickStartBadgeExampleRaw,
  },

  examples: [
    {
      id: 'variants',
      title: 'Variants and Tones',
      description: 'Solid, soft, and outline styles across semantic tones and sizes.',
      component: VariantsBadgeExample,
      height: SCENE_SIZES.large,
      code: VariantsBadgeExampleRaw,
    },
    {
      id: 'tags',
      title: 'Tags',
      description: 'Selected, disabled, and removable tags for filters or item metadata.',
      component: TagsBadgeExample,
      height: SCENE_SIZES.medium,
      code: TagsBadgeExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'label',
      type: 'string | number',
      description: 'Text or number shown inside the badge or tag.',
    },
    {
      name: 'count',
      type: 'number',
      description: 'Numeric Badge count. Values above maxCount render as maxCount+.',
    },
    {
      name: 'tone',
      type: '"neutral" | "primary" | "success" | "warning" | "danger" | "info"',
      default: '"neutral"',
      description: 'Semantic color tone.',
    },
    {
      name: 'variant',
      type: '"solid" | "soft" | "outline"',
      default: '"solid" for Badge, "soft" for Tag',
      description: 'Visual treatment.',
    },
    {
      name: 'size',
      type: '"small" | "medium" | "large"',
      default: '"medium"',
      description: 'Size preset for height, padding, corner radius, and text size.',
    },
    {
      name: 'dot',
      type: 'boolean',
      default: 'false',
      description: 'Render Badge as a compact status dot without text.',
    },
  ],

  propsComplete: [
    {
      name: 'children',
      type: 'ChildrenType',
      description: 'Custom content rendered inside the Badge or Tag.',
    },
    {
      name: 'label',
      type: 'string | number',
      description: 'Text or number shown inside the badge or tag.',
    },
    {
      name: 'count',
      type: 'number',
      description: 'Numeric Badge count. Takes precedence over label.',
    },
    {
      name: 'maxCount',
      type: 'number',
      default: '99',
      description: 'Maximum count before compact overflow formatting is used.',
    },
    {
      name: 'dot',
      type: 'boolean',
      default: 'false',
      description: 'Render Badge as a compact status dot without text.',
    },
    {
      name: 'tone',
      type: '"neutral" | "primary" | "success" | "warning" | "danger" | "info"',
      default: '"neutral"',
      description: 'Semantic color tone.',
    },
    {
      name: 'variant',
      type: '"solid" | "soft" | "outline"',
      default: '"solid"',
      description: 'Visual treatment.',
    },
    {
      name: 'size',
      type: '"small" | "medium" | "large"',
      default: '"medium"',
      description: 'Size preset for height, padding, corner radius, and text size.',
    },
    {
      name: 'textStyle',
      type: 'Phaser.Types.GameObjects.Text.TextStyle',
      description: 'Text style override for generated label/count content.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Applies disabled alpha styling.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'Tag only: active state, defaults to primary solid styling.',
    },
    {
      name: 'onRemove',
      type: '() => void',
      description: 'Tag only: shows a small remove control and calls this handler on click.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      description: 'Theme overrides for tone, variant, size, text style, and disabled alpha.',
    },
  ],

  inherits: [
    {
      component: 'Core Props',
      link: '/api/core-props',
      description:
        'Badge and Tag are composed from View and Text and support shared layout, position, alpha, margin, and theme props. Use stack layout with x/y for badge overlays.',
    },
  ],
}
