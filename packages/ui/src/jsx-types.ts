/**
 * Global JSX type definitions for all components
 * This file must be imported to register JSX IntrinsicElements
 */
import type { GraphicsProps } from './components/graphics'
import type { ImageProps } from './components/image'
import type { NineSliceProps } from './components/nineslice'
import type { SpriteProps } from './components/sprite'
import type { TextProps } from './components/text'
import type { TileSpriteProps } from './components/tilesprite'
import type { ViewProps } from './components/view'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      View: ViewProps
      Text: TextProps
      NineSlice: NineSliceProps
      Sprite: SpriteProps
      Image: ImageProps
      Graphics: GraphicsProps
      TileSprite: TileSpriteProps
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// This export is needed to make this a module
export {}
