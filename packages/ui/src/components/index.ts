/**
 * Built-in component implementations
 * Exports creators, patchers, props and registration function for all components
 */
import { register } from '../host'
import { graphicsCreator, graphicsPatcher } from './graphics'
import { imageCreator, imagePatcher } from './image'
import { nineSliceCreator, nineSlicePatcher } from './nineslice'
import { spriteCreator, spritePatcher } from './sprite'
import { textCreator, textPatcher } from './text'
import { tileSpriteCreator, tileSpritePatcher } from './tilesprite'
import { viewCreator, viewPatcher } from './view'

/**
 * Component type constants for JSX usage
 */
export const View = 'View' as const
export const Text = 'Text' as const
export const NineSlice = 'NineSlice' as const
export const Sprite = 'Sprite' as const
export const Image = 'Image' as const
export const Graphics = 'Graphics' as const
export const TileSprite = 'TileSprite' as const

/**
 * Registers all built-in components with the host
 * This should be called during library initialization
 * Note: Sprite, Image, Graphics, TileSprite are currently dummies (throw on use)
 */
export function registerBuiltins() {
  register('View', { create: viewCreator, patch: viewPatcher })
  register('Text', { create: textCreator, patch: textPatcher })
  register('NineSlice', { create: nineSliceCreator, patch: nineSlicePatcher })
  register('Sprite', { create: spriteCreator, patch: spritePatcher })
  register('Image', { create: imageCreator, patch: imagePatcher })
  register('Graphics', { create: graphicsCreator, patch: graphicsPatcher })
  register('TileSprite', { create: tileSpriteCreator, patch: tileSpritePatcher })
}

// Re-export View component
export { viewCreator, viewPatcher, type ViewBaseProps, type ViewProps } from './view'

// Re-export Text component
export { textCreator, textPatcher, type TextBaseProps, type TextProps } from './text'

// Re-export NineSlice component
export {
  nineSliceCreator,
  nineSlicePatcher,
  type NineSliceBaseProps,
  type NineSliceInnerBounds,
  type NineSliceProps,
  type NineSliceRef,
} from './nineslice'

// Re-export Sprite component (dummy)
export { spriteCreator, spritePatcher, type SpriteBaseProps, type SpriteProps } from './sprite'

// Re-export Image component (dummy)
export { imageCreator, imagePatcher, type ImageBaseProps, type ImageProps } from './image'

// Re-export Graphics component (dummy)
export {
  graphicsCreator,
  graphicsPatcher,
  type GraphicsBaseProps,
  type GraphicsProps,
} from './graphics'

// Re-export TileSprite component (dummy)
export {
  tileSpriteCreator,
  tileSpritePatcher,
  type TileSpriteBaseProps,
  type TileSpriteProps,
} from './tilesprite'
