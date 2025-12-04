/**
 * Glow FX creator (Outer Glow)
 */
import type { FXConfig, FXCreatorFn } from '../use-fx'

/**
 * Glow FX configuration
 */
export interface GlowFXConfig extends FXConfig {
  /** Glow color (hex number) */
  color?: number
  /** The strength of the glow outward from the edge */
  outerStrength?: number
  /** The strength of the glow inward from the edge */
  innerStrength?: number
  /** If true, only the glow is drawn, not the texture itself */
  knockout?: boolean
  /** Sets the quality of this Glow effect (PostFX only, cannot be changed post-creation) */
  quality?: number
  /** Sets the distance of this Glow effect (PostFX only, cannot be changed post-creation) */
  distance?: number
}

/**
 * Create glow FX
 * @param obj - GameObject
 * @param config - Glow configuration
 * @param type - 'post' or 'pre' FX
 * @returns Glow controller
 *
 * @example
 * ```tsx
 * applyFX(createGlowFX, {
 *   color: 0xff6600,
 *   outerStrength: 6,
 *   innerStrength: 2
 * })
 * ```
 */
export const createGlowFX: FXCreatorFn<GlowFXConfig> = (obj, config, type = 'post') => {
  const {
    color = 0xffffff,
    outerStrength = 4,
    innerStrength = 0,
    knockout = false,
    quality = 0.1,
    distance = 10,
  } = config

  const pipeline = type === 'post' ? obj.postFX : obj.preFX
  if (!pipeline) {
    console.warn('[createGlowFX] FX pipeline not available on this GameObject')
    return null
  }

  // Phaser API: addGlow(color, outerStrength, innerStrength, knockout, quality, distance)
  const glow = pipeline.addGlow(color, outerStrength, innerStrength, knockout, quality, distance)

  return glow
}
