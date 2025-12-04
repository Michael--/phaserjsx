/**
 * FX System for PhaserJSX
 * GPU-accelerated Phaser PostFX/PreFX pipeline effects
 *
 * @example Basic usage:
 * ```tsx
 * import { useFX, createShadowFX } from '@phaserjsx/ui/fx'
 *
 * function MyComponent() {
 *   const ref = useRef(null)
 *   const { applyFX } = useFX(ref)
 *
 *   const handleHover = () => {
 *     applyFX(createShadowFX, { offsetX: 4, offsetY: 4, blur: 8 })
 *   }
 *
 *   return <Image ref={ref} onHoverStart={handleHover} />
 * }
 * ```
 *
 * @example Convenience hooks:
 * ```tsx
 * import { useShadow } from '@phaserjsx/ui/fx'
 *
 * function MyComponent() {
 *   const ref = useRef(null)
 *   useShadow(ref, { offsetX: 4, offsetY: 4, blur: 8 })
 *
 *   return <View ref={ref}>Content</View>
 * }
 * ```
 *
 * @example Registry-based FX:
 * ```tsx
 * import { useFX, applyFXByName } from '@phaserjsx/ui/fx'
 *
 * function MyComponent() {
 *   const ref = useRef(null)
 *   const { applyFX } = useFX(ref)
 *
 *   const handleClick = () => {
 *     applyFXByName(applyFX, 'glow', { color: 0xff6600, distance: 10 })
 *   }
 * }
 * ```
 */

// Core hook and types
export {
  useFX,
  type FXCapableGameObject,
  type FXConfig,
  type FXCreatorFn,
  type FXType,
} from './use-fx'

// FX Registry
export {
  DEFAULT_FX,
  FX_REGISTRY,
  applyFXByName,
  resolveFX,
  type BuiltInFXName,
  type FXDefinition,
  type FXName,
  type FXNameExtensions,
} from './fx-registry'

// FX Creators (tree-shakeable)
export {
  createBlurFX,
  createColorMatrixFX,
  createGlowFX,
  createPixelateFX,
  createShadowFX,
  createVignetteFX,
  type BlurFXConfig,
  type ColorMatrixEffect,
  type ColorMatrixFXConfig,
  type GlowFXConfig,
  type PixelateFXConfig,
  type ShadowFXConfig,
  type VignetteFXConfig,
} from './fx-creators'

// Convenience Hooks
export { useBlur, useGlow, useShadow } from './convenience-hooks'
