/**
 * Divider Component Documentation
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  LengthExample,
  OrientationExample,
  QuickStartExample,
  StylingExample,
} from '@/examples/divider'
import type { ComponentDocs } from '@/types/docs'
// Import source code as raw strings
import LengthExampleRaw from '@/examples/divider/LengthExample.tsx?raw'
import OrientationExampleRaw from '@/examples/divider/OrientationExample.tsx?raw'
import QuickStartExampleRaw from '@/examples/divider/QuickStartExample.tsx?raw'
import StylingExampleRaw from '@/examples/divider/StylingExample.tsx?raw'

export const dividerContent: ComponentDocs = {
  title: 'Divider',
  description:
    'A simple visual separator component that renders a horizontal or vertical line to divide content sections.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic divider usage to separate content sections',
    component: QuickStartExample,
    height: SCENE_SIZES.small,
    code: QuickStartExampleRaw,
  },

  examples: [
    {
      id: 'orientation',
      title: 'Orientation',
      description: 'Divider supports both horizontal and vertical orientations',
      component: OrientationExample,
      height: SCENE_SIZES.small,
      code: OrientationExampleRaw,
    },
    {
      id: 'styling',
      title: 'Styling',
      description: 'Customize thickness and color of the divider',
      component: StylingExample,
      height: SCENE_SIZES.medium,
      code: StylingExampleRaw,
    },
    {
      id: 'length',
      title: 'Length',
      description: 'Control the length of the divider with custom values',
      component: LengthExample,
      height: SCENE_SIZES.medium,
      code: LengthExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Orientation of the divider',
    },
    {
      name: 'thickness',
      type: 'number',
      default: '1',
      description: 'Thickness of the divider line in pixels',
    },
    {
      name: 'color',
      type: 'number',
      default: '0xcccccc',
      description: 'Color of the divider in hexadecimal format',
    },
    {
      name: 'length',
      type: 'number',
      default: 'undefined',
      description: 'Length of the divider. Defaults to 100% if not specified',
    },
  ],

  propsComplete: [],

  inherits: [],
}
