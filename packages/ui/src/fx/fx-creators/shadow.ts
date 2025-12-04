/**
 * Shadow FX creator
 *
 * The shadow effect creates the illusion of depth by adding darker, offset silhouettes
 * beneath game objects, enhancing visual appeal and immersion.
 */
import type { FXConfig, FXCreatorFn } from '../use-fx'

/**
 * Shadow FX configuration
 * Maps to Phaser's addShadow(x, y, decay, power, color, samples, intensity)
 */
export interface ShadowFXConfig extends FXConfig {
  /** Horizontal offset of the shadow effect (default: 0) */
  x?: number
  /** Vertical offset of the shadow effect (default: 0) */
  y?: number
  /** Amount of decay for shadow effect (default: 0.1) */
  decay?: number
  /** Power of the shadow effect (default: 1) */
  power?: number
  /** Color of the shadow (default: 0x000000) */
  color?: number
  /** Number of samples (1-12, higher = better quality, default: 6) */
  samples?: number
  /** Intensity of the shadow effect (default: 1) */
  intensity?: number
}

/**
 * Create shadow FX
 * @param obj - GameObject
 * @param config - Shadow configuration
 * @param type - 'post' or 'pre' FX
 * @returns Shadow controller
 *
 * @example
 * ```tsx
 * applyFX(createShadowFX, {
 *   x: 0,
 *   y: 0,
 *   decay: 0.1,
 *   power: 1,
 *   color: 0x000000,
 *   samples: 6,
 *   intensity: 1
 * })
 * ```
 */
export const createShadowFX: FXCreatorFn<ShadowFXConfig> = (obj, config, type = 'post') => {
  const {
    x = 0,
    y = 1,
    decay = 0.05,
    power = 1,
    color = 0x000000,
    samples = 6,
    intensity = 1,
  } = config

  const pipeline = type === 'post' ? obj.postFX : obj.preFX
  if (!pipeline) {
    console.warn('[createShadowFX] FX pipeline not available on this GameObject')
    return null
  }

  // Phaser API: addShadow(x, y, decay, power, color, samples, intensity)
  const shadow = pipeline.addShadow(x, y, decay, power, color, samples, intensity)

  return shadow
}
