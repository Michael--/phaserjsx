/**
 * Global JSX type definitions for all components
 * This file must be imported to register JSX IntrinsicElements
 */
import type { ButtonProps } from './components/custom/Button'
import type { TextProps as CustomTextProps } from './components/custom/Text'
import type { ViewProps as CustomViewProps } from './components/custom/View'
import type { GraphicsProps } from './components/primitives/graphics'
import type { ImagePrimitiveProps } from './components/primitives/image'
import type { NineSlicePrimitiveProps } from './components/primitives/nineslice'
import type { ParticlesPrimitiveProps } from './components/primitives/particles'
import type { SpriteProps } from './components/primitives/sprite'
import type { TextProps as PrimitiveTextProps } from './components/primitives/text'
import type { TileSpriteProps } from './components/primitives/tilesprite'
import type { ViewProps as PrimitiveViewProps } from './components/primitives/view'
import type { VNodeLike } from './types'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    type Element = VNodeLike
    interface ElementChildrenAttribute {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      children: {}
    }
    interface IntrinsicElements {
      // Primitives (lowercase) - internal use only
      view: PrimitiveViewProps
      text: PrimitiveTextProps
      nineslice: NineSlicePrimitiveProps
      particles: ParticlesPrimitiveProps
      sprite: SpriteProps
      image: ImagePrimitiveProps
      graphics: GraphicsProps
      tilesprite: TileSpriteProps
      // Public API (uppercase) - custom wrappers with strict types
      View: CustomViewProps
      Text: CustomTextProps
      Button: ButtonProps
      // Legacy uppercase primitives - for backward compatibility
      NineSlice: NineSlicePrimitiveProps
      Particles: ParticlesPrimitiveProps
      Sprite: SpriteProps
      Image: ImagePrimitiveProps
      Graphics: GraphicsProps
      TileSprite: TileSpriteProps
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// This export is needed to make this a module
export {}
