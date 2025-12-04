/**
 * Global JSX type definitions for all components
 * This file must be imported to register JSX IntrinsicElements
 */
import type { ButtonProps } from './components/custom/Button'
import type { TextProps as CustomTextProps } from './components/custom/Text'
import type { ViewProps as CustomViewProps } from './components/custom/View'
import type { GraphicsProps } from './components/primitives/graphics'
import type { ImageProps } from './components/primitives/image'
import type { NineSliceProps } from './components/primitives/nineslice'
import type { SpriteProps } from './components/primitives/sprite'
import type { TextProps as PrimitiveTextProps } from './components/primitives/text'
import type { TileSpriteProps } from './components/primitives/tilesprite'
import type { ViewProps as PrimitiveViewProps } from './components/primitives/view'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Primitives (lowercase) - internal use only
      view: PrimitiveViewProps
      text: PrimitiveTextProps
      nineslice: NineSliceProps
      sprite: SpriteProps
      image: ImageProps
      graphics: GraphicsProps
      tilesprite: TileSpriteProps
      // Public API (uppercase) - custom wrappers with strict types
      View: CustomViewProps
      Text: CustomTextProps
      Button: ButtonProps
      // Legacy uppercase primitives - for backward compatibility
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
