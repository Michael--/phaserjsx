/**
 * Vignette FX creator
 */
import type { FXConfig, FXCreatorFn } from '../use-fx'

/**
 * Vignette FX configuration
 */
export interface VignetteFXConfig extends FXConfig {
  /** The horizontal offset of the vignette effect. This value is normalized to the range 0 to 1 */
  x?: number
  /** The vertical offset of the vignette effect. This value is normalized to the range 0 to 1 */
  y?: number
  /** The radius of the vignette effect. This value is normalized to the range 0 to 1 */
  radius?: number
  /** The strength of the vignette effect */
  strength?: number
}

/**
 * Create vignette FX
 * @param obj - GameObject
 * @param config - Vignette configuration
 * @param type - 'post' or 'pre' FX
 * @returns Vignette controller
 *
 * @example
 * ```tsx
 * applyFX(createVignetteFX, {
 *   x: 0.5,
 *   y: 0.5,
 *   radius: 0.5,
 *   strength: 0.7
 * })
 * ```
 */
export const createVignetteFX: FXCreatorFn<VignetteFXConfig> = (obj, config, type = 'post') => {
  const { strength = 0.5, radius = 0.5, x = 0.5, y = 0.5 } = config

  const pipeline = type === 'post' ? obj.postFX : obj.preFX
  if (!pipeline) {
    console.warn('[createVignetteFX] FX pipeline not available on this GameObject')
    return null
  }

  // Phaser Vignette: addVignette(x, y, radius, strength)
  const vignette = pipeline.addVignette(x, y, radius, strength)

  return vignette
}
