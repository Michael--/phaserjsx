/**
 * ScrollView component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  BothDirectionsScrollViewExample,
  NestedScrollViewExample,
  QuickStartScrollViewExample,
  SliderControlScrollViewExample,
  SnapScrollViewExample,
} from '@/examples/scrollview'
// Import source code as raw strings
import BothDirectionsScrollViewExampleRaw from '@/examples/scrollview/BothDirectionsExample.tsx?raw'
import NestedScrollViewExampleRaw from '@/examples/scrollview/NestedScrollViewExample.tsx?raw'
import QuickStartScrollViewExampleRaw from '@/examples/scrollview/QuickStartExample.tsx?raw'
import SliderControlScrollViewExampleRaw from '@/examples/scrollview/SliderControlExample.tsx?raw'
import SnapScrollViewExampleRaw from '@/examples/scrollview/SnapExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const scrollviewContent: ComponentDocs = {
  title: 'ScrollView',
  description:
    'A scrollable container component that provides vertical and horizontal scrolling with optional scroll sliders. Perfect for displaying content that exceeds the available viewport area.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic ScrollView with vertical scrolling. Scroll sliders appear automatically when content exceeds viewport.',
    component: QuickStartScrollViewExample,
    height: SCENE_SIZES.medium,
    code: QuickStartScrollViewExampleRaw,
  },

  examples: [
    {
      id: 'both-directions',
      title: 'Both Directions',
      description:
        'Enable both horizontal and vertical scrolling with showVerticalSlider and showHorizontalSlider props',
      component: BothDirectionsScrollViewExample,
      height: SCENE_SIZES.medium,
      code: BothDirectionsScrollViewExampleRaw,
    },
    {
      id: 'slider-control',
      title: 'Slider Control',
      description:
        'Control slider visibility: "auto" (default, shows when needed), true (always visible), or false (hidden)',
      component: SliderControlScrollViewExample,
      height: SCENE_SIZES.large,
      code: SliderControlScrollViewExampleRaw,
    },
    {
      id: 'snap-scrolling',
      title: 'Snap Scrolling',
      description:
        'Snap to specific positions when scrolling stops. Perfect for carousels and item lists.',
      component: SnapScrollViewExample,
      height: SCENE_SIZES.large,
      code: SnapScrollViewExampleRaw,
    },
    {
      id: 'nested-scrollview',
      title: 'Nested ScrollViews',
      description: 'ScrollViews containing other ScrollViews for complex layouts',
      component: NestedScrollViewExample,
      height: SCENE_SIZES.xl,
      code: NestedScrollViewExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'showVerticalSlider',
      type: 'boolean | "auto"',
      default: '"auto"',
      description: 'Show vertical scroll slider. "auto" shows only when content overflows.',
    },
    {
      name: 'showHorizontalSlider',
      type: 'boolean | "auto"',
      default: '"auto"',
      description: 'Show horizontal scroll slider. "auto" shows only when content overflows.',
    },
    {
      name: 'momentum',
      type: 'boolean',
      default: 'true',
      description:
        'Enable momentum scrolling - content continues to scroll after release with physics-based deceleration',
    },
    {
      name: 'snap',
      type: 'SnapMode | undefined',
      default: 'undefined',
      description:
        'Snap configuration: { positions: number[], threshold?: number }. Defines scroll positions to snap to.',
    },
    {
      name: 'snapAlignment',
      type: '"start" | "center" | "end"',
      default: '"start"',
      description: 'Alignment for snapping - where the snap target should align in the viewport',
    },
  ],

  propsComplete: [
    {
      name: 'showVerticalSlider',
      type: 'boolean | "auto"',
      default: '"auto"',
      description: 'Show vertical scroll slider. "auto" shows only when content overflows.',
    },
    {
      name: 'showHorizontalSlider',
      type: 'boolean | "auto"',
      default: '"auto"',
      description: 'Show horizontal scroll slider. "auto" shows only when content overflows.',
    },
    {
      name: 'sliderSize',
      type: 'SliderSize',
      default: 'undefined',
      description:
        "Size variant for scroll sliders (affects slider width/height): 'large' | 'medium' | 'small' | 'tiny' | undefined",
    },
    {
      name: 'scroll',
      type: '{ dx?: number; dy?: number; snapIndex?: number }',
      default: '{ dx: 0, dy: 0 }',
      description:
        'Scroll position control: dx/dy for direct positioning, snapIndex for programmatic snapping',
    },
    {
      name: 'momentum',
      type: 'boolean',
      default: 'true',
      description:
        'Enable momentum scrolling - content continues to scroll after release with physics-based deceleration',
    },
    {
      name: 'snap',
      type: 'SnapMode | undefined',
      default: 'undefined',
      description:
        'Snap configuration: { positions: number[], threshold?: number }. Array of scroll positions to snap to, with optional threshold for snap activation.',
    },
    {
      name: 'snapAlignment',
      type: '"start" | "center" | "end"',
      default: '"start"',
      description:
        'Alignment for snapping: "start" (top/left), "center" (middle), "end" (bottom/right)',
    },
    {
      name: 'snapThreshold',
      type: 'number',
      default: '20',
      description: 'Distance threshold in pixels for triggering snap behavior',
    },
    {
      name: 'onSnap',
      type: '(index: number) => void',
      default: 'undefined',
      description: 'Callback fired when scrolling snaps to a position. Receives the snap index.',
    },
    {
      name: 'onScrollInfoChange',
      type: '(info: ScrollInfo) => void',
      default: 'undefined',
      description:
        'Callback fired when scroll information changes. Provides viewport size, content size, scroll position, and max scroll values.',
    },
    {
      name: 'children',
      type: 'VNode | VNode[]',
      default: 'undefined',
      description: 'Content to display inside the scrollable area',
    },
  ],

  inherits: [
    {
      component: 'View',
      link: '/components/view',
      description:
        'ScrollView inherits all View props including width, height, padding, backgroundColor, and layout properties.',
    },
  ],
}
