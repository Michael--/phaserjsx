/**
 * Pixelate FX creator
 */
import type { FXConfig, FXCreatorFn } from '../use-fx'

/**
 * Pixelate FX configuration
 */
export interface PixelateFXConfig extends FXConfig {
  /** The amount of pixelation to apply */
  amount?: number
}

/**
 * Create pixelate FX
 * @param obj - GameObject
 * @param config - Pixelate configuration
 * @param type - 'post' or 'pre' FX
 * @returns Pixelate controller
 *
 * @example
 * ```tsx
 * applyFX(createPixelateFX, {
 *   amount: 8
 * })
 * ```
 */
export const createPixelateFX: FXCreatorFn<PixelateFXConfig> = (obj, config, type = 'internal') => {
  const { amount = 1 } = config

  obj.enableFilters()
  const filters = obj.filters
  if (!filters) {
    console.warn('[createPixelateFX] Filters not available on this GameObject')
    return null
  }

  const pipeline = type === 'internal' ? filters.internal : filters.external
  if (!pipeline) {
    console.warn('[createPixelateFX] FX pipeline not available on this GameObject')
    return null
  }

  // Phaser API: addPixelate(amount)
  const pixelate = pipeline.addPixelate(amount)

  return pixelate
}
