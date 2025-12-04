/**
 * FX Registry - string-based FX lookup
 * Similar to effect-registry.ts for animation effects
 */
import {
  createBlurFX,
  createColorMatrixFX,
  createGlowFX,
  createPixelateFX,
  createShadowFX,
  createVignetteFX,
  type BlurFXConfig,
  type ColorMatrixFXConfig,
  type GlowFXConfig,
  type PixelateFXConfig,
  type ShadowFXConfig,
  type VignetteFXConfig,
} from './fx-creators'
import type { FXConfig, FXCreatorFn } from './use-fx'

/**
 * Built-in FX names
 */
export type BuiltInFXName =
  | 'shadow'
  | 'glow'
  | 'blur'
  | 'pixelate'
  | 'vignette'
  | 'grayscale'
  | 'sepia'
  | 'negative'
  | 'blackWhite'
  | 'brown'
  | 'kodachrome'
  | 'technicolor'
  | 'polaroid'

/**
 * Extension point for custom FX (declaration merging)
 * @example
 * ```typescript
 * declare module '@phaserjsx/ui/fx' {
 *   interface FXNameExtensions {
 *     myCustomFX: 'myCustomFX'
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FXNameExtensions {}

/**
 * All available FX names (built-in + extensions)
 */
export type FXName =
  | BuiltInFXName
  | (keyof FXNameExtensions extends never ? never : keyof FXNameExtensions)

/**
 * FX definition with name and config
 */
export interface FXDefinition {
  name: FXName
  config?: FXConfig
}

/**
 * FX Registry mapping names to creator functions
 */
export const FX_REGISTRY: Record<BuiltInFXName, FXCreatorFn> = {
  shadow: createShadowFX,
  glow: createGlowFX,
  blur: createBlurFX,
  pixelate: createPixelateFX,
  vignette: createVignetteFX,
  grayscale: (obj, config, type) =>
    createColorMatrixFX(obj, { ...config, effect: 'grayscale' }, type),
  sepia: (obj, config, type) => createColorMatrixFX(obj, { ...config, effect: 'sepia' }, type),
  negative: (obj, config, type) =>
    createColorMatrixFX(obj, { ...config, effect: 'negative' }, type),
  blackWhite: (obj, config, type) =>
    createColorMatrixFX(obj, { ...config, effect: 'blackWhite' }, type),
  brown: (obj, config, type) => createColorMatrixFX(obj, { ...config, effect: 'brown' }, type),
  kodachrome: (obj, config, type) =>
    createColorMatrixFX(obj, { ...config, effect: 'kodachrome' }, type),
  technicolor: (obj, config, type) =>
    createColorMatrixFX(obj, { ...config, effect: 'technicolor' }, type),
  polaroid: (obj, config, type) =>
    createColorMatrixFX(obj, { ...config, effect: 'polaroid' }, type),
}

/**
 * Default FX (none)
 */
export const DEFAULT_FX: FXName = 'grayscale'

/**
 * Resolve FX by name or function
 * @param fxOrName - FX name string or creator function
 * @returns FX creator function or null
 */
export function resolveFX(fxOrName: FXName | FXCreatorFn): FXCreatorFn | null {
  if (typeof fxOrName === 'function') {
    return fxOrName
  }
  return FX_REGISTRY[fxOrName as BuiltInFXName] ?? null
}

/**
 * Apply FX by name (helper function)
 * @param applyFXFn - applyFX function from useFX hook
 * @param fxName - FX name
 * @param config - FX config
 *
 * @example
 * ```tsx
 * const { applyFX } = useFX(ref)
 * applyFXByName(applyFX, 'shadow', { offsetX: 4, offsetY: 4, blur: 8 })
 * ```
 */
export function applyFXByName(
  applyFXFn: ReturnType<typeof import('./use-fx').useFX>['applyFX'],
  fxName: FXName,
  config: FXConfig = {}
) {
  const creator = resolveFX(fxName)
  if (creator) {
    applyFXFn(creator, config)
  } else {
    console.warn(`[applyFXByName] FX "${fxName}" not found in registry`)
  }
}

// Re-export config types for convenience
export type {
  BlurFXConfig,
  ColorMatrixFXConfig,
  GlowFXConfig,
  PixelateFXConfig,
  ShadowFXConfig,
  VignetteFXConfig,
}
