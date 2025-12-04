/**
 * Standard scene size presets for documentation examples
 */

export const SCENE_SIZES = {
  /** 150px - Single element showcase */
  compact: 150,
  /** 200px - 2-3 elements */
  small: 200,
  /** 300px - Default, most examples */
  medium: 300,
  /** 400px - Complex layouts */
  large: 400,
  /** 600px - Full feature demos */
  xl: 600,
} as const

export type SceneSize = (typeof SCENE_SIZES)[keyof typeof SCENE_SIZES] | number
