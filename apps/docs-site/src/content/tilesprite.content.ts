/**
 * TileSprite component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  preloadQuickStartTileSprite,
  preloadScalingTileSprite,
  preloadScrollingTileSprite,
  QuickStartTileSpriteExample,
  ScalingTileSpriteExample,
  ScrollingTileSpriteExample,
} from '@/examples/tilesprite'
import QuickStartTileSpriteExampleRaw from '@/examples/tilesprite/QuickStartExample.tsx?raw'
import ScalingTileSpriteExampleRaw from '@/examples/tilesprite/ScalingExample.tsx?raw'
import ScrollingTileSpriteExampleRaw from '@/examples/tilesprite/ScrollingExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const tileSpriteContent: ComponentDocs = {
  title: 'TileSprite',
  description:
    'Repeating texture area for scrolling backgrounds, patterned fills, parallax strips, and animated texture offsets.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Repeat a texture across a fixed rectangular area.',
    component: QuickStartTileSpriteExample,
    height: SCENE_SIZES.medium,
    code: QuickStartTileSpriteExampleRaw,
    preload: preloadQuickStartTileSprite,
  },

  examples: [
    {
      id: 'scrolling',
      title: 'Scrolling',
      description: 'Move tilePositionX to create scrolling background effects.',
      component: ScrollingTileSpriteExample,
      height: SCENE_SIZES.medium,
      code: ScrollingTileSpriteExampleRaw,
      preload: preloadScrollingTileSprite,
    },
    {
      id: 'scaling',
      title: 'Tile Scale',
      description: 'Adjust tileScaleX and tileScaleY without resizing the display area.',
      component: ScalingTileSpriteExample,
      height: SCENE_SIZES.medium,
      code: ScalingTileSpriteExampleRaw,
      preload: preloadScalingTileSprite,
    },
  ],

  propsEssential: [
    { name: 'texture', type: 'string', description: 'Texture key loaded in Phaser.' },
    { name: 'width', type: 'number', description: 'Width of the repeated texture area.' },
    { name: 'height', type: 'number', description: 'Height of the repeated texture area.' },
    { name: 'tilePositionX', type: 'number', default: '0', description: 'Horizontal tile offset.' },
    { name: 'tilePositionY', type: 'number', default: '0', description: 'Vertical tile offset.' },
  ],

  propsComplete: [
    { name: 'texture', type: 'string', description: 'Texture key loaded in Phaser.' },
    { name: 'frame', type: 'string | number', description: 'Optional atlas frame.' },
    { name: 'width', type: 'number', description: 'Width of the repeated texture area.' },
    { name: 'height', type: 'number', description: 'Height of the repeated texture area.' },
    { name: 'tilePositionX', type: 'number', default: '0', description: 'Horizontal tile offset.' },
    { name: 'tilePositionY', type: 'number', default: '0', description: 'Vertical tile offset.' },
    { name: 'tileScaleX', type: 'number', default: '1', description: 'Horizontal tile scale.' },
    { name: 'tileScaleY', type: 'number', default: '1', description: 'Vertical tile scale.' },
    { name: 'tint', type: 'number', description: 'Tint color as hex number.' },
    { name: 'originX', type: 'number', default: '0', description: 'TileSprite origin X.' },
    { name: 'originY', type: 'number', default: '0', description: 'TileSprite origin Y.' },
  ],

  inherits: [
    {
      component: 'Core Props',
      link: '/api/core-props',
      description: 'TileSprite supports transform and Phaser display props.',
    },
  ],
}
