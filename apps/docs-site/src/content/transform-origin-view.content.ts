/**
 * TransformOriginView component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  OriginComparisonTransformOriginViewExample,
  QuickStartTransformOriginViewExample,
  SpringTransformOriginViewExample,
} from '@/examples/transform-origin-view'
// Import source code as raw strings
import OriginComparisonTransformOriginViewExampleRaw from '@/examples/transform-origin-view/OriginComparisonExample.tsx?raw'
import QuickStartTransformOriginViewExampleRaw from '@/examples/transform-origin-view/QuickStartExample.tsx?raw'
import SpringTransformOriginViewExampleRaw from '@/examples/transform-origin-view/SpringExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const transformOriginViewContent: ComponentDocs = {
  title: 'TransformOriginView',
  description:
    'Declarative container for reactive transformations around a custom origin point. Apply rotation, scale, and visual props through standard props. Perfect for useSpring animations, state-driven effects, and reactive transforms. Use RefOriginView for imperative Phaser tweens instead.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Pass rotation/scale as props for declarative transforms. Combines perfectly with useSpring for physics-based animations.',
    component: QuickStartTransformOriginViewExample,
    height: SCENE_SIZES.compact,
    code: QuickStartTransformOriginViewExampleRaw,
  },

  examples: [
    {
      id: 'spring',
      title: 'Spring Animations',
      description:
        'useSpring creates smooth, physics-based animations. TransformOriginView applies the animated values declaratively.',
      component: SpringTransformOriginViewExample,
      height: SCENE_SIZES.medium,
      code: SpringTransformOriginViewExampleRaw,
    },
    {
      id: 'origin-comparison',
      title: 'Origin Comparison',
      description:
        'Different origin points create different rotation behaviors. All boxes share the same rotation value but pivot around different points.',
      component: OriginComparisonTransformOriginViewExample,
      height: SCENE_SIZES.medium,
      code: OriginComparisonTransformOriginViewExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'rotation',
      type: 'number',
      description:
        'Rotation in radians around the origin point. Use with useSpring for smooth animations.',
    },
    {
      name: 'scale',
      type: 'number',
      description: 'Uniform scale factor around the origin point. 1=normal, <1=shrink, >1=grow.',
    },
    {
      name: 'scaleX',
      type: 'number',
      description: 'Horizontal scale factor. Independent from scaleY for non-uniform scaling.',
    },
    {
      name: 'scaleY',
      type: 'number',
      description: 'Vertical scale factor. Independent from scaleX for non-uniform scaling.',
    },
    {
      name: 'originX',
      type: 'number',
      default: '0.5',
      description:
        'Horizontal origin point (0-1). 0=left, 0.5=center, 1=right. Determines the pivot point for transforms.',
    },
    {
      name: 'originY',
      type: 'number',
      default: '0.5',
      description:
        'Vertical origin point (0-1). 0=top, 0.5=center, 1=bottom. Determines the pivot point for transforms.',
    },
    {
      name: 'width',
      type: 'number',
      required: true,
      description:
        'Width in pixels. MUST be numeric - percentage/fill not supported. Required for origin calculation.',
    },
    {
      name: 'height',
      type: 'number',
      required: true,
      description:
        'Height in pixels. MUST be numeric - percentage/fill not supported. Required for origin calculation.',
    },
  ],

  propsComplete: [
    {
      name: 'x',
      type: 'number',
      description: 'X position of the container.',
    },
    {
      name: 'y',
      type: 'number',
      description: 'Y position of the container.',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description:
        'Background color (0xRRGGBB) applied to the rotating/scaling element. Visible through transforms.',
    },
    {
      name: 'backgroundAlpha',
      type: 'number',
      default: '1',
      description: 'Background opacity (0-1) for the transforming element.',
    },
    {
      name: 'cornerRadius',
      type: 'number | [number, number, number, number]',
      description:
        'Corner radius for the transforming element. Number applies to all corners, array is [topLeft, topRight, bottomRight, bottomLeft].',
    },
    {
      name: 'borderWidth',
      type: 'number',
      description: 'Border width in pixels for the transforming element.',
    },
    {
      name: 'borderColor',
      type: 'number',
      description: 'Border color (0xRRGGBB) for the transforming element.',
    },
    {
      name: 'borderAlpha',
      type: 'number',
      default: '1',
      description: 'Border opacity (0-1) for the transforming element.',
    },
    {
      name: 'enableGestures',
      type: 'boolean',
      description:
        'Enable touch/click interaction. Combine with onTouch for interactive transforms.',
    },
    {
      name: 'onTouch',
      type: '() => void',
      description: 'Click/tap handler. Useful for triggering state changes that drive transforms.',
    },
    {
      name: 'children',
      type: 'VNode',
      description: 'Child elements to render inside the transforming container.',
    },
  ],

  propsAdvanced: [
    {
      name: 'Declarative vs Imperative',
      type: 'Concept',
      description:
        'TransformOriginView is for DECLARATIVE transforms (props, useSpring, signals, state). For IMPERATIVE transforms (Phaser tweens, manual ref changes), use RefOriginView instead.',
    },
    {
      name: 'useSpring Integration',
      type: 'Best Practice',
      description:
        'Perfect companion for useSpring: const [rotation, setRotation] = useSpring(0, "wobbly"); <TransformOriginView rotation={rotation.value} />. The spring handles physics, TransformOriginView applies the result.',
    },
    {
      name: 'Numeric Dimensions Required',
      type: 'Limitation',
      description:
        'width and height MUST be numeric (no percentage, fill, or calc). This is required for accurate origin point calculation. Use numeric values or calculate dimensions beforehand.',
    },
    {
      name: 'Nested View Structure',
      type: 'Implementation Detail',
      description:
        'Uses 3 nested Views: Outer (bounding box) → Middle (pivot point, receives transforms) → Inner (content, offset). This enables transforms around custom origins without complex matrix math.',
    },
    {
      name: 'When to Use',
      type: 'Best Practice',
      description:
        'Use TransformOriginView for: State-driven rotations, spring animations, reactive scales, interactive hover effects. Use RefOriginView for: Complex Phaser tween sequences, timeline animations, particle systems, imperative game logic.',
    },
  ],
}
