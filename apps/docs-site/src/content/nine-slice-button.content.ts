/**
 * NineSliceButton component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  InteractiveNineSliceButtonExample,
  NineSliceUsageExample,
  QuickStartNineSliceButtonExample,
  SizingNineSliceButtonExample,
  preloadInteractiveNineSliceButton,
  preloadNineSliceUsage,
  preloadQuickStartNineSliceButton,
  preloadSizingNineSliceButton,
} from '@/examples/nine-slice-button'
// Import source code as raw strings
import InteractiveNineSliceButtonExampleRaw from '@/examples/nine-slice-button/InteractiveExample.tsx?raw'
import NineSliceUsageExampleRaw from '@/examples/nine-slice-button/NineSliceUsageExample.tsx?raw'
import QuickStartNineSliceButtonExampleRaw from '@/examples/nine-slice-button/QuickStartExample.tsx?raw'
import SizingNineSliceButtonExampleRaw from '@/examples/nine-slice-button/SizingExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const nineSliceButtonContent: ComponentDocs = {
  title: 'NineSliceButton',
  description:
    'Scalable button component using 9-slice texture scaling. Preserves corner quality while stretching the center. Perfect for buttons, panels, and UI containers that need to scale to any size.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'NineSliceButton combines a NineSlice background with automatic content layout. Slice dimensions must match your texture atlas design.',
    component: QuickStartNineSliceButtonExample,
    height: SCENE_SIZES.compact,
    code: QuickStartNineSliceButtonExampleRaw,
    preload: preloadQuickStartNineSliceButton,
  },

  examples: [
    {
      id: 'sizing',
      title: 'Scalable Buttons',
      description:
        'Buttons scale to any size while maintaining corner sharpness. The center stretches, but edges and corners stay crisp.',
      component: SizingNineSliceButtonExample,
      height: SCENE_SIZES.medium,
      code: SizingNineSliceButtonExampleRaw,
      preload: preloadSizingNineSliceButton,
    },
    {
      id: 'interactive',
      title: 'Interactive States',
      description:
        'Add click handlers and effects. Perfect for game UI, menus, and interactive elements.',
      component: InteractiveNineSliceButtonExample,
      height: SCENE_SIZES.medium,
      code: InteractiveNineSliceButtonExampleRaw,
      preload: preloadInteractiveNineSliceButton,
    },
    {
      id: 'nineslice-usage',
      title: 'NineSlice Primitive',
      description:
        'Use the NineSlice primitive directly for panels, decorative elements, and custom layouts without button behavior.',
      component: NineSliceUsageExample,
      height: SCENE_SIZES.medium,
      code: NineSliceUsageExampleRaw,
      preload: preloadNineSliceUsage,
    },
  ],

  propsEssential: [
    {
      name: 'texture',
      type: 'string',
      required: true,
      description:
        'Texture key registered in Phaser. Must be preloaded via scene.load.atlas() or scene.load.image().',
    },
    {
      name: 'frame',
      type: 'string | number',
      description:
        'Frame name or index within the texture atlas. Required for atlas textures, omit for single images.',
    },
    {
      name: 'leftWidth',
      type: 'number',
      required: true,
      description:
        'Width of left slice in SOURCE texture pixels. Defines the non-stretching left border/corner area.',
    },
    {
      name: 'rightWidth',
      type: 'number',
      required: true,
      description:
        'Width of right slice in SOURCE texture pixels. Defines the non-stretching right border/corner area.',
    },
    {
      name: 'topHeight',
      type: 'number',
      description:
        'Height of top slice in SOURCE texture pixels. Optional - omit for 3-slice (horizontal only) mode.',
    },
    {
      name: 'bottomHeight',
      type: 'number',
      description:
        'Height of bottom slice in SOURCE texture pixels. Optional - omit for 3-slice (horizontal only) mode.',
    },
    {
      name: 'width',
      type: 'number | SizeValue',
      required: true,
      description:
        'Final button width. Number for pixels, or "50%", "100vw", "fill" for responsive sizing. This is the SCALED size, not the source texture size.',
    },
    {
      name: 'height',
      type: 'number | SizeValue',
      required: true,
      description:
        'Final button height. Number for pixels, or "50%", "100vh", "fill" for responsive sizing. This is the SCALED size, not the source texture size.',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click/tap handler. Called when user interacts with the button.',
    },
  ],

  propsComplete: [
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description:
        'If true, button does not respond to clicks and onClick is not triggered. Useful for loading states or unavailable actions.',
    },
    {
      name: 'effect',
      type: 'EffectName',
      description:
        'Visual effect on click: "jello", "bounce", "fade", "pulse", "shake", etc. Provides tactile feedback.',
    },
    {
      name: 'effectConfig',
      type: 'EffectConfig',
      description:
        'Effect configuration like { time: 600, scale: 1.1 }. Customizes effect duration and intensity.',
    },
    {
      name: 'alignItems',
      type: "'start' | 'center' | 'end'",
      default: 'center',
      description:
        'Cross-axis alignment of button content. Controls vertical alignment for row direction, horizontal for column.',
    },
    {
      name: 'justifyContent',
      type: "'start' | 'center' | 'end' | 'space-between' | 'space-around'",
      default: 'center',
      description:
        'Main-axis alignment of button content. Controls horizontal alignment for row direction, vertical for column.',
    },
    {
      name: 'direction',
      type: "'row' | 'column' | 'stack'",
      default: 'column',
      description:
        'Content layout direction. row: horizontal, column: vertical, stack: overlapping layers.',
    },
    {
      name: 'gap',
      type: 'number',
      description: 'Spacing between child elements in pixels. Only applies to row/column layouts.',
    },
    {
      name: 'padding',
      type: 'number | [number, number, number, number]',
      description:
        'Inner padding in pixels. Number applies to all sides, array is [top, right, bottom, left].',
    },
    {
      name: 'visible',
      type: "boolean | 'none'",
      default: 'true',
      description:
        'Visibility. true: visible and takes space, false: hidden but takes space, "none": hidden and no space.',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Opacity from 0 (transparent) to 1 (opaque). Affects entire button uniformly.',
    },
    {
      name: 'x',
      type: 'number',
      description: 'X position override. Use with headless for absolute positioning.',
    },
    {
      name: 'y',
      type: 'number',
      description: 'Y position override. Use with headless for absolute positioning.',
    },
    {
      name: 'depth',
      type: 'number',
      description: 'Z-index for rendering order. Higher values render on top.',
    },
  ],

  propsAdvanced: [
    {
      name: 'NineSlice Primitive',
      type: 'Component',
      description:
        'For non-button use cases, use the <NineSlice> primitive directly. It supports all layout and transform props but without button behavior (no onClick, disabled, effects).',
    },
    {
      name: 'Slice Dimensions',
      type: 'Design Pattern',
      description:
        'CRITICAL: leftWidth + rightWidth must be less than source texture width. topHeight + bottomHeight must be less than source texture height. Inspect your texture atlas to determine correct values.',
    },
    {
      name: '3-Slice Mode',
      type: 'Usage Pattern',
      description:
        'Omit topHeight and bottomHeight for horizontal-only slicing. Useful for progress bars, horizontal dividers, or elements that only stretch horizontally.',
    },
  ],
}
