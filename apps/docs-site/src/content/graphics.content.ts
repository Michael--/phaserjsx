/**
 * Graphics component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  ComplexShapeExample,
  DependencyRedrawExample,
  HeadlessCircleExample,
  LayoutAwareRectangleExample,
} from '@/examples/graphics'
// Import source code as raw strings
import ComplexShapeExampleRaw from '@/examples/graphics/ComplexShapeExample.tsx?raw'
import DependencyRedrawExampleRaw from '@/examples/graphics/DependencyRedrawExample.tsx?raw'
import HeadlessCircleExampleRaw from '@/examples/graphics/HeadlessCircleExample.tsx?raw'
import LayoutAwareRectangleExampleRaw from '@/examples/graphics/LayoutAwareRectangleExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const graphicsContent: ComponentDocs = {
  title: 'Graphics',
  description:
    "The Graphics component provides access to Phaser's powerful drawing API for creating custom shapes, visualizations, and decorative elements. Supports both headless (layout-independent) and layout-aware modes.",

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      "Basic Graphics with custom drawing. By default, Graphics are headless (don't affect layout).",
    component: HeadlessCircleExample,
    height: SCENE_SIZES.medium,
    code: HeadlessCircleExampleRaw,
  },

  examples: [
    {
      id: 'headless-graphics',
      title: 'Headless Graphics',
      description: "Decorative shapes that don't participate in layout (default behavior)",
      component: HeadlessCircleExample,
      height: SCENE_SIZES.medium,
      code: HeadlessCircleExampleRaw,
    },
    {
      id: 'layout-aware',
      title: 'Layout-Aware Graphics',
      description:
        'Graphics that participate in layout by setting headless=false and providing dimensions',
      component: LayoutAwareRectangleExample,
      height: SCENE_SIZES.medium,
      code: LayoutAwareRectangleExampleRaw,
    },
    {
      id: 'dependency-redraw',
      title: 'Dependency-Based Redraw',
      description: 'Graphics that redraw only when specified dependencies change',
      component: DependencyRedrawExample,
      height: SCENE_SIZES.large,
      code: DependencyRedrawExampleRaw,
    },
    {
      id: 'complex-shapes',
      title: 'Complex Shapes',
      description: 'Advanced drawing with paths, fills, and strokes',
      component: ComplexShapeExample,
      height: SCENE_SIZES.medium,
      code: ComplexShapeExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'onDraw',
      type: '(graphics: Phaser.GameObjects.Graphics, props: GraphicsProps) => void',
      description:
        'Callback function that receives the Phaser Graphics instance for custom drawing',
    },
    {
      name: 'headless',
      type: 'boolean',
      default: 'true',
      description:
        "If true, Graphics don't participate in layout. If false, requires width/height props",
    },
    {
      name: 'width',
      type: 'number',
      description: 'Width for layout-aware Graphics (required when headless=false)',
    },
    {
      name: 'height',
      type: 'number',
      description: 'Height for layout-aware Graphics (required when headless=false)',
    },
    {
      name: 'dependencies',
      type: 'unknown[]',
      description: 'Array of values that trigger redraw when changed (similar to React useEffect)',
    },
    {
      name: 'autoClear',
      type: 'boolean',
      default: 'true',
      description: 'If true, clears the graphics before each onDraw call',
    },
  ],

  propsComplete: [
    {
      name: 'onDraw',
      type: '(graphics: Phaser.GameObjects.Graphics, props: GraphicsProps) => void',
      description:
        'Callback function that receives the Phaser Graphics instance for custom drawing',
    },
    {
      name: 'headless',
      type: 'boolean',
      default: 'true',
      description:
        "If true, Graphics don't participate in layout. If false, requires width/height props",
    },
    {
      name: 'width',
      type: 'number',
      description: 'Width for layout-aware Graphics (required when headless=false)',
    },
    {
      name: 'height',
      type: 'number',
      description: 'Height for layout-aware Graphics (required when headless=false)',
    },
    {
      name: 'dependencies',
      type: 'unknown[]',
      description: 'Array of values that trigger redraw when changed (similar to React useEffect)',
    },
    {
      name: 'autoClear',
      type: 'boolean',
      default: 'true',
      description: 'If true, clears the graphics before each onDraw call',
    },
    {
      name: 'x',
      type: 'number',
      description: 'X position offset (relative to parent)',
    },
    {
      name: 'y',
      type: 'number',
      description: 'Y position offset (relative to parent)',
    },
    {
      name: 'scaleX',
      type: 'number',
      default: '1',
      description: 'Horizontal scale factor',
    },
    {
      name: 'scaleY',
      type: 'number',
      default: '1',
      description: 'Vertical scale factor',
    },
    {
      name: 'rotation',
      type: 'number',
      description: 'Rotation angle in radians',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Opacity (0 = transparent, 1 = opaque)',
    },
    {
      name: 'visible',
      type: 'boolean | "visible" | "invisible" | "none"',
      default: 'true',
      description: 'Visibility state',
    },
    {
      name: 'depth',
      type: 'number',
      description: 'Rendering depth (higher = foreground)',
    },
  ],
}
