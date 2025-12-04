/**
 * Scene background configuration types
 */

/**
 * Available background types
 */
export type SceneBackgroundType = 'grid' | 'logo' | 'gradient' | 'particles' | 'none'

/**
 * Animation patterns for backgrounds
 */
export type BackgroundAnimation = 'lemniscate' | 'wave' | 'pulse' | 'rotate' | 'static'

/**
 * Background configuration
 */
export interface BackgroundConfig {
  /** Background type */
  type: SceneBackgroundType
  /** Animation pattern */
  animation?: BackgroundAnimation
  /** Opacity (0-1) */
  opacity?: number
  /** Primary color (hex number) */
  color?: number
  /** Secondary color for gradients (hex number) */
  colorSecondary?: number
}

/**
 * Default background configuration
 */
export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'grid',
  animation: 'lemniscate',
  opacity: 0.15,
  color: 0x4a9eff,
}
