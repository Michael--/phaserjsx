/**
 * Built-in component implementations
 * Exports creators, patchers, props and registration function for all components
 */
import { register } from '../host'
import { graphicsCreator, graphicsPatcher } from './primitives/graphics'
import { imageCreator, imagePatcher } from './primitives/image'
import { nineSliceCreator, nineSlicePatcher } from './primitives/nineslice'
import { particlesCreator, particlesPatcher } from './primitives/particles'
import { spriteCreator, spritePatcher } from './primitives/sprite'
import { textCreator, textPatcher } from './primitives/text'
import { tileSpriteCreator, tileSpritePatcher } from './primitives/tilesprite'
import { viewCreator, viewPatcher } from './primitives/view'

/**
 * Component type constants for JSX usage (legacy primitives)
 * Note: All primitive components now have custom wrappers
 * Use lowercase primitives internally or import wrappers from custom
 */

/**
 * Registers all built-in components with the host
 * This should be called during library initialization
 */
export function registerBuiltins() {
  // Register primitives (lowercase) - internal use
  register('view' as 'View', { create: viewCreator, patch: viewPatcher })
  register('text' as 'Text', { create: textCreator, patch: textPatcher })
  register('nineslice' as 'NineSlice', { create: nineSliceCreator, patch: nineSlicePatcher })
  register('particles' as 'Particles', { create: particlesCreator, patch: particlesPatcher })
  register('sprite' as 'Sprite', { create: spriteCreator, patch: spritePatcher })
  register('image' as 'Image', { create: imageCreator, patch: imagePatcher })
  register('graphics' as 'Graphics', { create: graphicsCreator, patch: graphicsPatcher })
  register('tilesprite' as 'TileSprite', { create: tileSpriteCreator, patch: tileSpritePatcher })

  // Register uppercase variants for backward compatibility
  register('View', { create: viewCreator, patch: viewPatcher })
  register('Text', { create: textCreator, patch: textPatcher })
  register('NineSlice', { create: nineSliceCreator, patch: nineSlicePatcher })
  register('Particles', { create: particlesCreator, patch: particlesPatcher })
  register('Sprite', { create: spriteCreator, patch: spritePatcher })
  register('Image', { create: imageCreator, patch: imagePatcher })
  register('Graphics', { create: graphicsCreator, patch: graphicsPatcher })
  register('TileSprite', { create: tileSpriteCreator, patch: tileSpritePatcher })

  // Register internal SceneWrapper component (for mountJSX auto-sizing)
  // SceneWrapper is a function component, not a primitive, so it doesn't need creators
  // It will be handled by the function component path in mount()
}

// Re-export layout types
export { type LayoutSize } from './../layout/types'

// Re-export custom components (public API)
export {
  Badge,
  Tag,
  formatBadgeCount,
  getBadgeSizeConfig,
  getBadgeText,
  resolveBadgeTextStyle,
  type BadgeFormatOptions,
  type BadgeProps,
  type BadgeSize,
  type BadgeSizeConfig,
  type BadgeTextStyleOptions,
  type BadgeTone,
  type BadgeToneColors,
  type BadgeVariant,
  type TagProps,
} from './custom/Badge'
export { Button, type ButtonProps } from './custom/Button'
export {
  Checkbox,
  type CheckboxIndicatorRenderProps,
  type CheckboxLabelPosition,
  type CheckboxProps,
  type CheckboxState,
} from './custom/Checkbox'
export {
  ColorPicker,
  type ColorPickerLabels,
  type ColorPickerProps,
  type ColorPickerState,
  type ColorPickerTone,
} from './custom/ColorPicker'
export {
  DebugPanel,
  type DebugMetricKey,
  type DebugPanelPreset,
  type DebugPanelProps,
} from './custom/DebugPanel'
export { Graphics, type GraphicsProps } from './custom/Graphics'
export {
  NumberInput,
  NumberInputIndicator,
  getNextNumberInputValue,
  getNumberInputPrecision,
  normalizeNumberInputValue,
  type NumberInputButtonAction,
  type NumberInputButtonDirection,
  type NumberInputButtonPlacement,
  type NumberInputButtonRenderProps,
  type NumberInputIndicatorDirection,
  type NumberInputIndicatorProps,
  type NumberInputIndicatorVariant,
  type NumberInputLabelPosition,
  type NumberInputLabels,
  type NumberInputProps,
  type NumberInputValueOptions,
} from './custom/NumberInput'
export { RadioButton, type RadioButtonProps } from './custom/RadioButton'
export { RadioGroup, type RadioGroupOption, type RadioGroupProps } from './custom/RadioGroup'
export { Sprite, type SpriteProps } from './custom/Sprite'
export { Text, type TextProps } from './custom/Text'
export { TileSprite, type TileSpriteProps } from './custom/TileSprite'
export { View, type ViewProps } from './custom/View'
export { Particles, type ParticlesProps } from './custom/Particles'
export {
  ContextMenu,
  Popover,
  calculateOverlayPosition,
  type ContextMenuItem,
  type ContextMenuProps,
  type OverlayAnchorRect,
  type OverlayContentSize,
  type OverlayPosition,
  type OverlayPositionOptions,
  type PopoverPlacement,
  type PopoverProps,
} from './custom/Popover'
export {
  ProgressBar,
  clampProgressValue,
  getProgressRatio,
  type ProgressBarFormatProps,
  type ProgressBarLabelPosition,
  type ProgressBarOrientation,
  type ProgressBarProps,
} from './custom/ProgressBar'

// Re-export primitive creators/patchers for advanced use cases
export { textCreator, textPatcher, type TextBaseProps } from './primitives/text'
export { viewCreator, viewPatcher, type ViewBaseProps } from './primitives/view'

// Re-export NineSlice primitive (internal use only - prefer custom wrapper)
export {
  nineSliceCreator,
  nineSlicePatcher,
  type NineSliceBaseProps,
  type NineSliceInnerBounds,
  type NineSlicePrimitiveProps,
  type NineSliceRef,
} from './primitives/nineslice'

// Re-export Sprite primitive (internal use only - prefer custom wrapper)
export { spriteCreator, spritePatcher, type SpriteBaseProps } from './primitives/sprite'
export { particlesCreator, particlesPatcher, type ParticlesBaseProps } from './primitives/particles'

// Re-export Image primitive (internal use only - prefer custom wrapper)
export {
  imageCreator,
  imagePatcher,
  type ImageBaseProps,
  type ImagePrimitiveProps,
} from './primitives/image'

// Re-export Graphics primitive (internal use only - prefer custom wrapper)
export { graphicsCreator, graphicsPatcher, type GraphicsBaseProps } from './primitives/graphics'

// Re-export TileSprite primitive (internal use only - prefer custom wrapper)
export {
  tileSpriteCreator,
  tileSpritePatcher,
  type TileSpriteBaseProps,
} from './primitives/tilesprite'
