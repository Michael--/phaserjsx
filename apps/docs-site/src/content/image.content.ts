/**
 * Image component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  AtlasImageExample,
  preloadAtlasImage,
  preloadQuickStartImage,
  preloadScalingImage,
  preloadTintingImage,
  QuickStartImageExample,
  ScalingImageExample,
  TintingImageExample,
} from '@/examples/image'
// Import source code as raw strings
import AtlasImageExampleRaw from '@/examples/image/AtlasExample.tsx?raw'
import QuickStartImageExampleRaw from '@/examples/image/QuickStartExample.tsx?raw'
import ScalingImageExampleRaw from '@/examples/image/ScalingExample.tsx?raw'
import TintingImageExampleRaw from '@/examples/image/TintingExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const imageContent: ComponentDocs = {
  title: 'Image',
  description:
    'Display Phaser textures as visual elements. Works with preloaded images, spritesheets, and texture atlas frames. Essential for sprites, backgrounds, and 9-slice components.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Images require Phaser asset loading. Use scene.load.image() in preload phase before mounting your component.',
    component: QuickStartImageExample,
    height: SCENE_SIZES.compact,
    code: QuickStartImageExampleRaw,
    preload: preloadQuickStartImage,
  },

  examples: [
    {
      id: 'scaling',
      title: 'Scaling & Sizing',
      description: 'Images scale to any dimensions - original, enlarged, or stretched',
      component: ScalingImageExample,
      height: SCENE_SIZES.medium,
      code: ScalingImageExampleRaw,
      preload: preloadScalingImage,
    },
    {
      id: 'tinting',
      title: 'Color Tinting',
      description: 'Apply multiplicative color tints to images',
      component: TintingImageExample,
      height: SCENE_SIZES.medium,
      code: TintingImageExampleRaw,
      preload: preloadTintingImage,
    },
    {
      id: 'atlas',
      title: 'Texture Atlas Frames',
      description:
        'Load atlas frames for sprites, UI components, and 9-slice elements. Essential for memory-efficient sprite management.',
      component: AtlasImageExample,
      height: SCENE_SIZES.small,
      code: AtlasImageExampleRaw,
      preload: preloadAtlasImage,
    },
  ],

  propsEssential: [
    {
      name: 'texture',
      type: 'string',
      required: true,
      description:
        'Texture key registered in Phaser. Must be preloaded via scene.load.image() or scene.load.atlas(). No type safety - raw Phaser API.',
    },
    {
      name: 'frame',
      type: 'string | number',
      description:
        'Atlas frame name or spritesheet index. Only used with texture atlases or spritesheets. Enables sprite animations and 9-slice components.',
    },
    {
      name: 'width',
      type: 'number',
      description:
        'Display width in pixels. Scales the image from its original size. Use with height for aspect ratio control.',
    },
    {
      name: 'height',
      type: 'number',
      description:
        'Display height in pixels. Scales the image from its original size. Independent from width for stretching.',
    },
  ],

  propsComplete: [
    {
      name: 'tint',
      type: 'number',
      description:
        'Hex color for multiplicative tinting (0xRRGGBB). White pixels become the tint color, black stays black. Example: 0xff0000 for red.',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Opacity from 0 (transparent) to 1 (opaque). Affects entire image uniformly.',
    },
    {
      name: 'flipX',
      type: 'boolean',
      default: 'false',
      description: 'Flip image horizontally. Useful for character direction changes.',
    },
    {
      name: 'flipY',
      type: 'boolean',
      default: 'false',
      description: 'Flip image vertically. Rarely needed, mostly for effects.',
    },
    {
      name: 'originX',
      type: 'number',
      default: '0.5',
      description:
        'X anchor point (0-1). 0=left, 0.5=center, 1=right. Affects rotation and scaling pivot.',
    },
    {
      name: 'originY',
      type: 'number',
      default: '0.5',
      description:
        'Y anchor point (0-1). 0=top, 0.5=center, 1=bottom. Affects rotation and scaling pivot.',
    },
  ],
}
