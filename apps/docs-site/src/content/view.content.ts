/**
 * View component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  AlignmentViewExample,
  BasicLayoutViewExample,
  FlexDirectionViewExample,
  QuickStartViewExample,
} from '@/examples/view'
// Import source code as raw strings
import AlignmentViewExampleRaw from '@/examples/view/AlignmentExample.tsx?raw'
import BasicLayoutViewExampleRaw from '@/examples/view/BasicLayoutExample.tsx?raw'
import FlexDirectionViewExampleRaw from '@/examples/view/FlexDirectionExample.tsx?raw'
import QuickStartViewExampleRaw from '@/examples/view/QuickStartExample.tsx?raw'
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
      height: SCENE_SIZES.medium,
      code: AlignmentViewExampleRaw,
    },
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
