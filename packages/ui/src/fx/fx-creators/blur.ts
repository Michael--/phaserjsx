/**
 * Blur FX creator (Box & Gaussian Blur)
 */
import type { FXConfig, FXCreatorFn } from '../use-fx'

/**
 * Blur FX configuration
 */
export interface BlurFXConfig extends FXConfig {
  /** The quality of the blur effect. Can be either 0 for Low Quality, 1 for Medium Quality or 2 for High Quality */
  quality?: number
  /** The horizontal offset of the blur effect */
  x?: number
  /** The vertical offset of the blur effect */
  y?: number
  /** The strength of the blur effect */
  strength?: number
  /** The color of the blur, as a hex value */
  color?: number
  /** The number of steps to run the blur effect for. This value should always be an integer */
  steps?: number
}

/**
 * Create blur FX
 * @param obj - GameObject
 * @param config - Blur configuration
 * @param type - 'post' or 'pre' FX
 * @returns Blur controller
 *
 * @example
 * ```tsx
 * applyFX(createBlurFX, {
 *   quality: 1,
 *   x: 4,
 *   y: 4,
 *   strength: 2
 * })
 * ```
 */
export const createBlurFX: FXCreatorFn<BlurFXConfig> = (obj, config, type = 'post') => {
  const { quality = 0, x = 2, y = 2, strength = 1, color = 0xffffff, steps = 4 } = config

  const pipeline = type === 'post' ? obj.postFX : obj.preFX
  if (!pipeline) {
    console.warn('[createBlurFX] FX pipeline not available on this GameObject')
    return null
  }

  // Phaser API: addBlur(quality, x, y, strength, color, steps)
  const blur = pipeline.addBlur(quality, x, y, strength, color, steps)

  return blur
}
