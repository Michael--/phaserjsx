/**
 * View component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  AlignmentViewExample,
  AlphaVisibilityViewExample,
  BasicLayoutViewExample,
  BordersStylingViewExample,
  DepthStackingViewExample,
  FillSizingViewExample,
  FlexDirectionViewExample,
  MinMaxConstraintsViewExample,
  NestedLayoutsViewExample,
  OverflowControlViewExample,
  PaddingVariationsViewExample,
  QuickStartViewExample,
  SpaceDistributionViewExample,
  WrapBehaviorViewExample,
} from '@/examples/view'
// Import source code as raw strings
import AlignmentViewExampleRaw from '@/examples/view/AlignmentExample.tsx?raw'
import AlphaVisibilityViewExampleRaw from '@/examples/view/AlphaVisibilityExample.tsx?raw'
import BasicLayoutViewExampleRaw from '@/examples/view/BasicLayoutExample.tsx?raw'
import BordersStylingViewExampleRaw from '@/examples/view/BordersStylingExample.tsx?raw'
import DepthStackingViewExampleRaw from '@/examples/view/DepthStackingExample.tsx?raw'
import FillSizingViewExampleRaw from '@/examples/view/FillSizingExample.tsx?raw'
import FlexDirectionViewExampleRaw from '@/examples/view/FlexDirectionExample.tsx?raw'
import MinMaxConstraintsViewExampleRaw from '@/examples/view/MinMaxConstraintsExample.tsx?raw'
import NestedLayoutsViewExampleRaw from '@/examples/view/NestedLayoutsExample.tsx?raw'
import OverflowControlViewExampleRaw from '@/examples/view/OverflowControlExample.tsx?raw'
import PaddingVariationsViewExampleRaw from '@/examples/view/PaddingVariationsExample.tsx?raw'
import QuickStartViewExampleRaw from '@/examples/view/QuickStartExample.tsx?raw'
import SpaceDistributionViewExampleRaw from '@/examples/view/SpaceDistributionExample.tsx?raw'
import WrapBehaviorViewExampleRaw from '@/examples/view/WrapBehaviorExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const viewContent: ComponentDocs = {
  title: 'View',
  description:
    'The fundamental layout container for PhaserJSX. View is the building block for all UI layouts, providing flexbox-like positioning, backgrounds, borders, and gesture support.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic View with background color and content. Note: An empty View without background is invisible.',
    component: QuickStartViewExample,
    height: SCENE_SIZES.compact,
    code: QuickStartViewExampleRaw,
  },

  examples: [
    {
      id: 'basic-layout',
      title: 'Basic Layout',
      description: 'Dimensions, padding, and nested Views',
      component: BasicLayoutViewExample,
      height: SCENE_SIZES.medium,
      code: BasicLayoutViewExampleRaw,
    },
    {
      id: 'flex-direction',
      title: 'Flex Direction',
      description: 'Row and column layouts with gap spacing',
      component: FlexDirectionViewExample,
      height: SCENE_SIZES.medium,
      code: FlexDirectionViewExampleRaw,
    },
    {
      id: 'alignment',
      title: 'Alignment',
      description: 'Positioning content with justifyContent and alignItems',
      component: AlignmentViewExample,
      height: SCENE_SIZES.large,
      code: AlignmentViewExampleRaw,
    },
    {
      id: 'borders-styling',
      title: 'Borders & Styling',
      description: 'Border width, color, corner radius, and transparency',
      component: BordersStylingViewExample,
      height: SCENE_SIZES.medium,
      code: BordersStylingViewExampleRaw,
    },
    {
      id: 'fill-sizing',
      title: 'Fill Width/Height',
      description: 'Using "fill" to take full available space in parent',
      component: FillSizingViewExample,
      height: SCENE_SIZES.large,
      code: FillSizingViewExampleRaw,
    },
    {
      id: 'min-max-constraints',
      title: 'Size Constraints',
      description: 'Min/max width and height for responsive boundaries',
      component: MinMaxConstraintsViewExample,
      height: SCENE_SIZES.medium,
      code: MinMaxConstraintsViewExampleRaw,
    },
    {
      id: 'padding-variations',
      title: 'Padding Variations',
      description: 'Individual padding for each side using EdgeInsets syntax',
      component: PaddingVariationsViewExample,
      height: SCENE_SIZES.medium,
      code: PaddingVariationsViewExampleRaw,
    },
    {
      id: 'space-distribution',
      title: 'Space Distribution',
      description: 'space-between, space-around, and space-evenly for even distribution',
      component: SpaceDistributionViewExample,
      height: SCENE_SIZES.large,
      code: SpaceDistributionViewExampleRaw,
    },
    {
      id: 'wrap-behavior',
      title: 'Flex Wrap',
      description: 'Wrapping children to next line with flexWrap',
      component: WrapBehaviorViewExample,
      height: SCENE_SIZES.large,
      code: WrapBehaviorViewExampleRaw,
    },
    {
      id: 'overflow-control',
      title: 'Overflow Control',
      description: 'Clipping content that exceeds container bounds',
      component: OverflowControlViewExample,
      height: SCENE_SIZES.large,
      code: OverflowControlViewExampleRaw,
    },
    {
      id: 'nested-layouts',
      title: 'Complex Nested Layouts',
      description: 'Building card-like structures with multiple View layers',
      component: NestedLayoutsViewExample,
      height: SCENE_SIZES.xl,
      code: NestedLayoutsViewExampleRaw,
    },
    {
      id: 'depth-stacking',
      title: 'Z-Index Stacking',
      description: 'Controlling render order with depth property for overlays and modals',
      component: DepthStackingViewExample,
      height: SCENE_SIZES.xl,
      code: DepthStackingViewExampleRaw,
    },
    {
      id: 'alpha-visibility',
      title: 'Opacity & Visibility',
      description: 'Controlling visibility with alpha and visible props',
      component: AlphaVisibilityViewExample,
      height: SCENE_SIZES.xl,
      code: AlphaVisibilityViewExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'direction',
      type: '"row" | "column" | "stack"',
      default: '"column"',
      description:
        'Layout direction: "column" stacks vertically, "row" stacks horizontally, "stack" overlays children (required for x/y positioning)',
    },
    {
      name: 'width',
      type: 'number | "fill" | "auto" | SizeValue',
      description:
        'Width: number (pixels), "fill" (available space), "auto" (content size), percentage ("50%"), viewport ("100vw"), calc',
    },
    {
      name: 'height',
      type: 'number | "fill" | "auto" | SizeValue',
      description:
        'Height: number (pixels), "fill" (available space), "auto" (content size), percentage ("50%"), viewport ("100vh"), calc',
    },
    {
      name: 'padding',
      type: 'number | EdgeInsets',
      description:
        'Inner spacing: uniform number or EdgeInsets object { top?, right?, bottom?, left? }',
    },
    {
      name: 'gap',
      type: 'number | GapInsets',
      description:
        'Spacing between children: uniform number or GapInsets { horizontal?, vertical? }',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description: 'Background color as hex number (0xRRGGBB format, e.g., 0x3498db for blue)',
    },
    {
      name: 'justifyContent',
      type: '"start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"',
      default: '"center"',
      description: 'Main axis alignment (along direction)',
    },
    {
      name: 'alignItems',
      type: '"start" | "center" | "end" | "stretch"',
      default: '"center"',
      description: 'Cross axis alignment (perpendicular to direction)',
    },
  ],

  propsComplete: [
    {
      name: 'direction',
      type: '"row" | "column" | "stack"',
      default: '"column"',
      description:
        'Layout direction: "column" (vertical), "row" (horizontal), "stack" (overlay, required for x/y offsets)',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width: number (pixels), "fill", "auto", percentage ("50%"), viewport ("100vw"), calc("50% + 10px")',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description:
        'Height: number (pixels), "fill", "auto", percentage ("50%"), viewport ("100vh"), calc("100% - 20px")',
    },
    {
      name: 'minWidth',
      type: 'SizeValue',
      description: 'Minimum width constraint - prevents shrinking below this size',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: 'Minimum height constraint - prevents shrinking below this size',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: 'Maximum width constraint - prevents growing beyond this size',
    },
    {
      name: 'maxHeight',
      type: 'SizeValue',
      description: 'Maximum height constraint - prevents growing beyond this size',
    },
    {
      name: 'padding',
      type: 'number | EdgeInsets',
      description: 'Inner spacing: uniform number or { top?, right?, bottom?, left? }',
    },
    {
      name: 'margin',
      type: 'number | EdgeInsets',
      description: 'Outer spacing: uniform number or { top?, right?, bottom?, left? }',
    },
    {
      name: 'gap',
      type: 'number | GapInsets',
      description: 'Spacing between children: uniform number or { horizontal?, vertical? }',
    },
    {
      name: 'justifyContent',
      type: '"start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"',
      default: '"center"',
      description: 'Main axis alignment (along direction)',
    },
    {
      name: 'alignItems',
      type: '"start" | "center" | "end" | "stretch"',
      default: '"center"',
      description: 'Cross axis alignment (perpendicular to direction)',
    },
    {
      name: 'alignContent',
      type: '"start" | "center" | "end" | "space-between" | "space-around" | "stretch"',
      default: '"stretch"',
      description: 'Alignment of wrapped lines in multi-line flex container (requires flexWrap)',
    },
    {
      name: 'flex',
      type: 'number',
      description:
        'Flex grow factor - how much remaining space to take (0 = fixed size, 1+ = proportional)',
    },
    {
      name: 'flexShrink',
      type: 'number',
      default: '1',
      description: 'Flex shrink factor - how much to shrink when space limited (0 = no shrink)',
    },
    {
      name: 'flexBasis',
      type: 'FlexBasisValue',
      description:
        'Initial size before flex distribution: number, "auto", percentage, viewport, calc',
    },
    {
      name: 'flexWrap',
      type: '"nowrap" | "wrap" | "wrap-reverse"',
      default: '"nowrap"',
      description: 'Whether children wrap to next line when space exhausted',
    },
    {
      name: 'overflow',
      type: '"visible" | "hidden"',
      default: '"visible"',
      description: 'Content clipping: "visible" (no clip), "hidden" (clip at bounds using mask)',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description: 'Background color as hex number (0xRRGGBB format, e.g., 0x3498db)',
    },
    {
      name: 'backgroundAlpha',
      type: 'number',
      default: '1',
      description: 'Background opacity: 0 (transparent) to 1 (opaque)',
    },
    {
      name: 'cornerRadius',
      type: 'number | CornerRadiusInsets',
      description:
        'Border radius: uniform number or { topLeft?, topRight?, bottomLeft?, bottomRight? }',
    },
    {
      name: 'borderWidth',
      type: 'number',
      description: 'Border thickness in pixels',
    },
    {
      name: 'borderColor',
      type: 'number',
      description: 'Border color as hex number (0xRRGGBB format)',
    },
    {
      name: 'borderAlpha',
      type: 'number',
      default: '1',
      description: 'Border opacity: 0 (transparent) to 1 (opaque)',
    },
    {
      name: 'x',
      type: 'number',
      description: 'X position offset in pixels (parent must use direction="stack")',
    },
    {
      name: 'y',
      type: 'number',
      description: 'Y position offset in pixels (parent must use direction="stack")',
    },
    {
      name: 'rotation',
      type: 'number',
      description: 'Rotation in radians',
    },
    {
      name: 'scale',
      type: 'number',
      description: 'Uniform scale factor',
    },
    {
      name: 'scaleX',
      type: 'number',
      description: 'Horizontal scale factor',
    },
    {
      name: 'scaleY',
      type: 'number',
      description: 'Vertical scale factor',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Overall opacity: 0 (invisible) to 1 (opaque), multiplies with parent alpha',
    },
    {
      name: 'depth',
      type: 'number',
      description: 'Z-index for render order - higher values render on top',
    },
    {
      name: 'visible',
      type: 'boolean | Display',
      default: 'true',
      description:
        'Visibility: true (visible), false (invisible but takes space), "none" (hidden, no space)',
    },
    {
      name: 'headless',
      type: 'boolean',
      default: 'false',
      description: 'If true, rendered but excluded from layout calculations (decorative elements)',
    },
    {
      name: 'enableGestures',
      type: 'boolean',
      default: 'false',
      description: 'Enable gesture system for touch/mouse interaction',
    },
    {
      name: 'onTouch',
      type: '(data: GestureEventData) => void',
      description: 'Click/tap event handler (requires enableGestures)',
    },
    {
      name: 'onTouchOutside',
      type: '(data: GestureEventData) => void',
      description: 'Click-outside event handler for dropdowns/modals (requires enableGestures)',
    },
    {
      name: 'onTouchMove',
      type: '(data: GestureEventData) => void',
      description: 'Pointer movement event with dx/dy deltas (requires enableGestures)',
    },
    {
      name: 'onDoubleTap',
      type: '(data: GestureEventData) => void',
      description: 'Double click/tap event (requires enableGestures)',
    },
    {
      name: 'onLongPress',
      type: '(data: GestureEventData) => void',
      description: 'Long press event after configured duration (requires enableGestures)',
    },
    {
      name: 'onHoverStart',
      type: '(data: HoverEventData) => void',
      description: 'Mouse enter event - desktop/mouse only (requires enableGestures)',
    },
    {
      name: 'onHoverEnd',
      type: '(data: HoverEventData) => void',
      description: 'Mouse leave event - desktop/mouse only (requires enableGestures)',
    },
    {
      name: 'onWheel',
      type: '(data: WheelEventData) => void',
      description: 'Mouse wheel scroll event - desktop/mouse only (requires enableGestures)',
    },
    {
      name: 'children',
      type: 'VNode | VNode[]',
      description: 'Child components',
    },
  ],

  inherits: [],
}
