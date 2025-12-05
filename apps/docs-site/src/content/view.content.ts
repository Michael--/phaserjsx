/**
 * View component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  AlignmentViewExample,
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
    // ========================================
    // PLANNED EXAMPLES (To be implemented)
    // ========================================

    // --- BASIC FEATURES (Simple, frequently used) ---

    // --- INTERMEDIATE FEATURES (More complex use cases) ---

    // {
    //   id: 'position-offset',
    //   title: 'Position Offsets',
    //   description: 'Fine-tuning position with x/y offsets',
    //   // Show: x, y props for manual positioning adjustments
    //   // Useful for: Pixel-perfect positioning, animations
    // },

    // {
    //   id: 'alpha-visibility',
    //   title: 'Opacity & Visibility',
    //   description: 'Controlling visibility with alpha and visible props',
    //   // Show: alpha for fade effects, visible for show/hide
    //   // Useful for: Fade transitions, conditional rendering
    // },

    // --- ADVANCED FEATURES (Better documented elsewhere) ---
    // NOTE: These features should be documented in separate guides:

    // Gestures & Interaction
    // → Better in: /guides/gestures or /guides/interaction
    // - enableGestures, onTouch, onTouchMove, onTouchOutside
    // - onDoubleTap, onLongPress, gesture configuration
    // Reason: Complex topic, needs dedicated space for patterns

    // Theme Integration
    // → Better in: /guides/theming
    // - theme prop, nested themes, component-level styling
    // - getThemedProps usage, theme inheritance
    // Reason: Theme system is cross-cutting, needs holistic view

    // Responsive Design
    // → Better in: /guides/responsive-design
    // - Viewport units (vw, vh), percentage sizes
    // - calc() expressions, dynamic sizing strategies
    // - maxWidth with viewport units for breakpoints
    // Reason: Responsive patterns span multiple components

    // Layout Patterns
    // → Better in: /guides/layout-patterns
    // - Common patterns: Holy Grail, Sidebar, Grid-like structures
    // - Flexbox equivalents (stretch, flex-grow behavior)
    // - Centering strategies, sticky footers
    // Reason: Patterns involve multiple components and techniques

    // Performance Considerations
    // → Better in: /guides/performance
    // - When to use headless, layout recalculation triggers
    // - Nested View overhead, optimization tips
    // Reason: Performance is a cross-cutting concern
  ],

  propsEssential: [
    {
      name: 'direction',
      type: '"row" | "column"',
      default: '"column"',
      description: 'Flex direction for child layout',
    },
    {
      name: 'width',
      type: 'number | "fill"',
      description: 'Width in pixels or "fill" to take full available width',
    },
    {
      name: 'height',
      type: 'number | "fill"',
      description: 'Height in pixels or "fill" to take full available height',
    },
    {
      name: 'padding',
      type: 'number',
      description: 'Inner spacing on all sides',
    },
    {
      name: 'gap',
      type: 'number',
      description: 'Spacing between child elements',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description: 'Background color as hex number (e.g., 0x3498db)',
    },
    {
      name: 'justifyContent',
      type: '"flex-start" | "center" | "flex-end" | "space-between" | "space-around"',
      default: '"center"',
      description: 'Main axis alignment',
    },
    {
      name: 'alignItems',
      type: '"flex-start" | "center" | "flex-end" | "stretch"',
      default: '"center"',
      description: 'Cross axis alignment',
    },
  ],

  propsComplete: [
    {
      name: 'direction',
      type: '"row" | "column"',
      default: '"column"',
      description: 'Flex direction for child layout',
    },
    {
      name: 'width',
      type: 'number | "fill"',
      description: 'Width in pixels or "fill" to take full available width',
    },
    {
      name: 'height',
      type: 'number | "fill"',
      description: 'Height in pixels or "fill" to take full available height',
    },
    {
      name: 'minWidth',
      type: 'number',
      description: 'Minimum width constraint',
    },
    {
      name: 'minHeight',
      type: 'number',
      description: 'Minimum height constraint',
    },
    {
      name: 'maxWidth',
      type: 'number',
      description: 'Maximum width constraint',
    },
    {
      name: 'maxHeight',
      type: 'number',
      description: 'Maximum height constraint',
    },
    {
      name: 'padding',
      type: 'number',
      description: 'Inner spacing on all sides',
    },
    {
      name: 'paddingTop',
      type: 'number',
      description: 'Top padding',
    },
    {
      name: 'paddingRight',
      type: 'number',
      description: 'Right padding',
    },
    {
      name: 'paddingBottom',
      type: 'number',
      description: 'Bottom padding',
    },
    {
      name: 'paddingLeft',
      type: 'number',
      description: 'Left padding',
    },
    {
      name: 'gap',
      type: 'number',
      description: 'Spacing between child elements',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description: 'Background color as hex number (e.g., 0x3498db)',
    },
    {
      name: 'backgroundAlpha',
      type: 'number',
      default: '1',
      description: 'Background opacity (0-1)',
    },
    {
      name: 'cornerRadius',
      type: 'number',
      description: 'Border radius for rounded corners',
    },
    {
      name: 'borderWidth',
      type: 'number',
      description: 'Border thickness',
    },
    {
      name: 'borderColor',
      type: 'number',
      description: 'Border color as hex number',
    },
    {
      name: 'borderAlpha',
      type: 'number',
      default: '1',
      description: 'Border opacity (0-1)',
    },
    {
      name: 'justifyContent',
      type: '"flex-start" | "center" | "flex-end" | "space-between" | "space-around"',
      default: '"center"',
      description: 'Main axis alignment',
    },
    {
      name: 'alignItems',
      type: '"flex-start" | "center" | "flex-end" | "stretch"',
      default: '"center"',
      description: 'Cross axis alignment',
    },
    {
      name: 'wrap',
      type: '"wrap" | "nowrap"',
      default: '"nowrap"',
      description: 'Whether children should wrap to next line',
    },
    {
      name: 'overflow',
      type: '"visible" | "hidden"',
      default: '"visible"',
      description: 'How to handle content that exceeds bounds',
    },
    {
      name: 'enableGestures',
      type: 'boolean',
      default: 'false',
      description: 'Enable touch/click gesture detection',
    },
    {
      name: 'onTouch',
      type: '() => void',
      description: 'Touch/click event handler (requires enableGestures)',
    },
    {
      name: 'x',
      type: 'number',
      description: 'X position offset',
    },
    {
      name: 'y',
      type: 'number',
      description: 'Y position offset',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Overall opacity (0-1)',
    },
    {
      name: 'visible',
      type: 'boolean',
      default: 'true',
      description: 'Whether the View is visible',
    },
    {
      name: 'children',
      type: 'VNode | VNode[]',
      description: 'Child components',
    },
  ],

  inherits: [],
}
