/**
 * Built-in component implementations
 * Exports creators, patchers, props and registration function for all components
 */
import { register } from '../host'
import { graphicsCreator, graphicsPatcher } from './primitives/graphics'
import { imageCreator, imagePatcher } from './primitives/image'
import { nineSliceCreator, nineSlicePatcher } from './primitives/nineslice'
import { spriteCreator, spritePatcher } from './primitives/sprite'
import { textCreator, textPatcher } from './primitives/text'
import { tileSpriteCreator, tileSpritePatcher } from './primitives/tilesprite'
import { viewCreator, viewPatcher } from './primitives/view'

/**
 * Component type constants for JSX usage (legacy primitives)
 */
export const NineSlice = 'NineSlice' as const
export const Sprite = 'Sprite' as const
export const Image = 'Image' as const
export const Graphics = 'Graphics' as const
export const TileSprite = 'TileSprite' as const

/**
 * Registers all built-in components with the host
 * This should be called during library initialization
 * Note: TileSprite is currently dummy (throws on use)
 */
export function registerBuiltins() {
  // Register primitives (lowercase) - internal use
  register('view' as 'View', { create: viewCreator, patch: viewPatcher })
  register('text' as 'Text', { create: textCreator, patch: textPatcher })
  register('nineslice' as 'NineSlice', { create: nineSliceCreator, patch: nineSlicePatcher })
  register('sprite' as 'Sprite', { create: spriteCreator, patch: spritePatcher })
  register('image' as 'Image', { create: imageCreator, patch: imagePatcher })
  register('graphics' as 'Graphics', { create: graphicsCreator, patch: graphicsPatcher })
  register('tilesprite' as 'TileSprite', { create: tileSpriteCreator, patch: tileSpritePatcher })

  // Register uppercase variants for backward compatibility
  register('View', { create: viewCreator, patch: viewPatcher })
  register('Text', { create: textCreator, patch: textPatcher })
  register('NineSlice', { create: nineSliceCreator, patch: nineSlicePatcher })
  register('Sprite', { create: spriteCreator, patch: spritePatcher })
  register('Image', { create: imageCreator, patch: imagePatcher })
  register('Graphics', { create: graphicsCreator, patch: graphicsPatcher })
  register('TileSprite', { create: tileSpriteCreator, patch: tileSpritePatcher })
}

// Re-export layout types
export { type LayoutSize } from './../layout/types'

// Re-export custom components (public API)
export { Button, type ButtonProps } from './custom/Button'
export { RadioButton, type RadioButtonProps } from './custom/RadioButton'
export { RadioGroup, type RadioGroupOption, type RadioGroupProps } from './custom/RadioGroup'
export { Text, type TextProps } from './custom/Text'
export { View, type ViewProps } from './custom/View'

// Re-export primitive creators/patchers for advanced use cases
export { textCreator, textPatcher, type TextBaseProps } from './primitives/text'
export { viewCreator, viewPatcher, type ViewBaseProps } from './primitives/view'

// Re-export NineSlice component (no wrapper yet)
export {
  nineSliceCreator,
  nineSlicePatcher,
  type NineSliceBaseProps,
  type NineSliceInnerBounds,
  type NineSliceProps,
  type NineSliceRef,
} from './primitives/nineslice'

// Re-export Sprite component (dummy, no wrapper yet)
export {
  spriteCreator,
  spritePatcher,
  type SpriteBaseProps,
  type SpriteProps,
} from './primitives/sprite'

// Re-export Image component (dummy, no wrapper yet)
export {
  imageCreator,
  imagePatcher,
  type ImageBaseProps,
  type ImageProps,
} from './primitives/image'

// Re-export Graphics component (no wrapper yet)
export {
  graphicsCreator,
  graphicsPatcher,
  type GraphicsBaseProps,
  type GraphicsProps,
} from './primitives/graphics'

// Re-export TileSprite component (dummy, no wrapper yet)
export {
  tileSpriteCreator,
  tileSpritePatcher,
  type TileSpriteBaseProps,
  type TileSpriteProps,
} from './primitives/tilesprite'
