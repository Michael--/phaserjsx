/**
 * Sprite component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  preloadQuickStartSprite,
  preloadSizingSprite,
  preloadTintingSprite,
  preloadTransformsSprite,
  QuickStartSpriteExample,
  SizingSpriteExample,
  TintingSpriteExample,
  TransformsSpriteExample,
} from '@/examples/sprite'
import QuickStartSpriteExampleRaw from '@/examples/sprite/QuickStartExample.tsx?raw'
import SizingSpriteExampleRaw from '@/examples/sprite/SizingExample.tsx?raw'
import TintingSpriteExampleRaw from '@/examples/sprite/TintingExample.tsx?raw'
import TransformsSpriteExampleRaw from '@/examples/sprite/TransformsExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const spriteContent: ComponentDocs = {
  title: 'Sprite',
  description:
    'Typed wrapper around Phaser Sprite for texture-backed game objects, transforms, tinting, refs, and Phaser animation integration.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Render a preloaded Phaser texture as a sprite.',
    component: QuickStartSpriteExample,
    height: SCENE_SIZES.medium,
    code: QuickStartSpriteExampleRaw,
    preload: preloadQuickStartSprite,
  },

  examples: [
    {
      id: 'transforms',
      title: 'Transforms',
      description: 'Update rotation and scale via state.',
      component: TransformsSpriteExample,
      height: SCENE_SIZES.medium,
      code: TransformsSpriteExampleRaw,
      preload: preloadTransformsSprite,
    },
    {
      id: 'tinting',
      title: 'Tinting',
      description: 'Apply tint colors to a sprite.',
      component: TintingSpriteExample,
      height: SCENE_SIZES.medium,
      code: TintingSpriteExampleRaw,
      preload: preloadTintingSprite,
    },
    {
      id: 'sizing',
      title: 'Sizing & Fit',
      description: 'Scale sprites into fixed display bounds with fill, contain, and cover.',
      component: SizingSpriteExample,
      height: SCENE_SIZES.medium,
      code: SizingSpriteExampleRaw,
      preload: preloadSizingSprite,
    },
  ],

  propsEssential: [
    {
      name: 'texture',
      type: 'string',
      description: 'Texture key loaded in the Phaser texture manager.',
    },
    {
      name: 'frame',
      type: 'string | number',
      description: 'Optional atlas or spritesheet frame.',
    },
    {
      name: 'animationKey',
      type: 'string',
      description: 'Pre-registered Phaser animation key to play.',
    },
    {
      name: 'fit',
      type: '"fill" | "contain" | "cover"',
      default: '"fill"',
      description: 'How to fit the sprite into displayWidth/displayHeight.',
    },
    {
      name: 'tint',
      type: 'number',
      description: 'Tint color as hex number.',
    },
  ],

  propsComplete: [
    { name: 'texture', type: 'string', description: 'Texture key loaded in Phaser.' },
    { name: 'frame', type: 'string | number', description: 'Optional atlas/spritesheet frame.' },
    { name: 'displayWidth', type: 'number', description: 'Display width used for fit modes.' },
    { name: 'displayHeight', type: 'number', description: 'Display height used for fit modes.' },
    {
      name: 'fit',
      type: '"fill" | "contain" | "cover"',
      default: '"fill"',
      description: 'Scale behavior when display dimensions are set.',
    },
    { name: 'animationKey', type: 'string', description: 'Animation key to play.' },
    { name: 'loop', type: 'boolean', default: 'false', description: 'Loop animation playback.' },
    { name: 'repeatDelay', type: 'number', default: '0', description: 'Delay between repeats.' },
    { name: 'tint', type: 'number', description: 'Tint color as hex number.' },
    { name: 'originX', type: 'number', default: '0.5', description: 'Sprite origin X.' },
    { name: 'originY', type: 'number', default: '0.5', description: 'Sprite origin Y.' },
    {
      name: 'onAnimationStart',
      type: '(key: string) => void',
      description: 'Called when animation starts.',
    },
    {
      name: 'onAnimationComplete',
      type: '(key: string) => void',
      description: 'Called when animation completes.',
    },
    {
      name: 'onAnimationRepeat',
      type: '(key: string) => void',
      description: 'Called when animation repeats.',
    },
  ],

  inherits: [
    {
      component: 'Core Props',
      link: '/api/core-props',
      description: 'Sprite supports transform and Phaser display props, plus layout sizing props.',
    },
  ],
}
