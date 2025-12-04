/**
 * Color Matrix FX creator (Grayscale, Sepia, Negative, etc.)
 */
import type { FXConfig, FXCreatorFn } from '../use-fx'

/**
 * Color Matrix effect types
 */
export type ColorMatrixEffect =
  | 'grayscale'
  | 'sepia'
  | 'negative'
  | 'blackWhite'
  | 'brown'
  | 'kodachrome'
  | 'technicolor'
  | 'polaroid'

/**
 * Color Matrix FX configuration
 */
export interface ColorMatrixFXConfig extends FXConfig {
  /** Effect type */
  effect?: ColorMatrixEffect
  /** Effect amount (0-1, for effects that support it like grayscale) */
  amount?: number
}

/**
 * Create color matrix FX
 * @param obj - GameObject
 * @param config - Color matrix configuration
 * @param type - 'post' or 'pre' FX
 * @returns Color matrix controller
 *
 * @example
 * ```tsx
 * applyFX(createColorMatrixFX, {
 *   effect: 'grayscale',
 *   amount: 1
 * })
 * ```
 */
export const createColorMatrixFX: FXCreatorFn<ColorMatrixFXConfig> = (
  obj,
  config,
  type = 'post'
) => {
  const { effect = 'grayscale', amount = 1 } = config

  const pipeline = type === 'post' ? obj.postFX : obj.preFX
  if (!pipeline) {
    console.warn('[createColorMatrixFX] FX pipeline not available on this GameObject')
    return null
  }

  const colorMatrix = pipeline.addColorMatrix()

  // Apply the selected effect
  switch (effect) {
    case 'grayscale':
      colorMatrix.grayscale(amount)
      break
    case 'sepia':
      colorMatrix.sepia()
      break
    case 'negative':
      colorMatrix.negative()
      break
    case 'blackWhite':
      colorMatrix.blackWhite()
      break
    case 'brown':
      colorMatrix.brown()
      break
    case 'kodachrome':
      colorMatrix.kodachrome()
      break
    case 'technicolor':
      colorMatrix.technicolor()
      break
    case 'polaroid':
      colorMatrix.polaroid()
      break
  }

  return colorMatrix
}
