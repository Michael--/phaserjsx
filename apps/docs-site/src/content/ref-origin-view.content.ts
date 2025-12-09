/**
 * RefOriginView component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  OriginPointsRefOriginViewExample,
  QuickStartRefOriginViewExample,
  ScaleRefOriginViewExample,
} from '@/examples/ref-origin-view'
// Import source code as raw strings
import OriginPointsRefOriginViewExampleRaw from '@/examples/ref-origin-view/OriginPointsExample.tsx?raw'
import QuickStartRefOriginViewExampleRaw from '@/examples/ref-origin-view/QuickStartExample.tsx?raw'
import ScaleRefOriginViewExampleRaw from '@/examples/ref-origin-view/ScaleExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const refOriginViewContent: ComponentDocs = {
  title: 'RefOriginView',
  description:
    'Reference-based container for imperative transformations around a custom origin point. Returns a ref for manual manipulation with Phaser tweens or direct property changes. Use TransformOriginView for declarative/reactive transforms instead.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Access the ref to control rotation/scale imperatively with Phaser tweens. Origin point determines the pivot for transformations.',
    component: QuickStartRefOriginViewExample,
    height: SCENE_SIZES.compact,
    code: QuickStartRefOriginViewExampleRaw,
  },

  examples: [
    {
      id: 'origin-points',
      title: 'Origin Points',
      description:
        'Compare center (0.5, 0.5), top-left (0, 0), and bottom-right (1, 1) origins. Yellow dots show the pivot point.',
      component: OriginPointsRefOriginViewExample,
      height: SCENE_SIZES.medium,
      code: OriginPointsRefOriginViewExampleRaw,
    },
    {
      id: 'scale',
      title: 'Scale Transforms',
      description:
        'Scaling around different origin points. Useful for grow-from-center effects, expand-from-left menus, or bottom-anchored UI.',
      component: ScaleRefOriginViewExample,
      height: SCENE_SIZES.medium,
      code: ScaleRefOriginViewExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'ref',
      type: 'Ref<Phaser.GameObjects.Container>',
      required: true,
      description:
        'Ref to the pivot container. Use this ref to apply Phaser tweens or manual property changes (rotation, scale, position).',
    },
    {
      name: 'originX',
      type: 'number',
      default: '0.5',
      description:
        'Horizontal origin point (0-1). 0=left, 0.5=center, 1=right. Determines the pivot point for rotation and scale.',
    },
    {
      name: 'originY',
      type: 'number',
      default: '0.5',
      description:
        'Vertical origin point (0-1). 0=top, 0.5=center, 1=bottom. Determines the pivot point for rotation and scale.',
    },
    {
      name: 'width',
      type: 'number | SizeValue',
      required: true,
      description:
        'Width of the bounding box. Required for origin calculation. Use numeric values for best results.',
    },
    {
      name: 'height',
      type: 'number | SizeValue',
      required: true,
      description:
        'Height of the bounding box. Required for origin calculation. Use numeric values for best results.',
    },
  ],

  propsComplete: [
    {
      name: 'x',
      type: 'number',
      description: 'X position of the entire RefOriginView container.',
    },
    {
      name: 'y',
      type: 'number',
      description: 'Y position of the entire RefOriginView container.',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description:
        'Background color (0xRRGGBB) for the outer container. Useful for visualizing the bounding box.',
    },
    {
      name: 'backgroundAlpha',
      type: 'number',
      default: '1',
      description: 'Background opacity (0-1) for the outer container.',
    },
    {
      name: 'cornerRadius',
      type: 'number | [number, number, number, number]',
      description:
        'Corner radius for the outer container. Number applies to all corners, array is [topLeft, topRight, bottomRight, bottomLeft].',
    },
    {
      name: 'padding',
      type: 'number | [number, number, number, number]',
      description:
        'Padding inside the outer container. Affects the origin calculation by reducing the effective size.',
    },
    {
      name: 'children',
      type: 'VNode',
      description:
        'Single child element. Content is rendered inside the RefOriginView and transforms with the ref.',
    },
  ],

  propsAdvanced: [
    {
      name: 'Imperative vs Declarative',
      type: 'Concept',
      description:
        'RefOriginView is for IMPERATIVE transforms (Phaser tweens, manual ref changes). For DECLARATIVE transforms (props, useSpring, state), use TransformOriginView instead.',
    },
    {
      name: 'Nested View Structure',
      type: 'Implementation Detail',
      description:
        'Uses 3 nested Views internally: Outer (bounding box) → Middle (pivot point, receives ref) → Inner (content, offset by negative padding). This structure enables transforms around custom origins.',
    },
    {
      name: 'Dimension Calculation',
      type: 'Technical Note',
      description:
        'Origin point is calculated AFTER layout completes (via setTimeout). This ensures accurate pivot positioning based on actual rendered dimensions.',
    },
    {
      name: 'When to Use',
      type: 'Best Practice',
      description:
        'Use RefOriginView for: Complex Phaser tween sequences, chained animations, timeline-based effects, particle emitters attached to a pivot. Use TransformOriginView for: Simple reactive rotations, spring animations, state-driven transforms.',
    },
  ],
}
