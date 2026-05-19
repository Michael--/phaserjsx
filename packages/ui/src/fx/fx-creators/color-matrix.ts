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
  type = 'internal'
) => {
  const { effect = 'grayscale', amount = 1 } = config

  obj.enableFilters()
  const filters = obj.filters
  if (!filters) {
    console.warn('[createColorMatrixFX] Filters not available on this GameObject')
    return null
  }

  const pipeline = type === 'internal' ? filters.internal : filters.external
  if (!pipeline) {
    console.warn('[createColorMatrixFX] FX pipeline not available on this GameObject')
    return null
  }

  const colorMatrixFilter = pipeline.addColorMatrix()
  const cm = colorMatrixFilter.colorMatrix

  // Apply the selected effect
  switch (effect) {
    case 'grayscale':
      cm.grayscale(amount)
      break
    case 'sepia':
      cm.sepia()
      break
    case 'negative':
      cm.negative()
      break
    case 'blackWhite':
      cm.blackWhite()
      break
    case 'brown':
      cm.brown()
      break
    case 'kodachrome':
      cm.kodachrome()
      break
    case 'technicolor':
      cm.technicolor()
      break
    case 'polaroid':
      cm.polaroid()
      break
  }

  return colorMatrixFilter
}
