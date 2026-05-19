/**
 * Hook for applying Phaser PostFX/PreFX pipeline effects
 * Manages FX lifecycle with proper cleanup
 */
import { useEffect, useRef } from '../hooks'

/**
 * Ref object type
 */
type RefObject<T> = { current: T | null }

/**
 * FX configuration base type
 */
export interface FXConfig {
  intensity?: number
  quality?: number
  onComplete?: () => void
}

/**
 * FX type discriminator (internal vs external filter context)
 */
export type FXType = 'internal' | 'external'

/**
 * GameObject with FX pipeline support
 */
export type FXCapableGameObject =
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Text
  | Phaser.GameObjects.TileSprite
  | Phaser.GameObjects.NineSlice
  | Phaser.GameObjects.RenderTexture
  | Phaser.GameObjects.Video

/**
 * FX creator function signature
 * @param obj - GameObject with FX pipeline
 * @param config - Effect-specific configuration
 * @param type - 'post' or 'pre' FX pipeline
 * @returns Cleanup function or FX controller (or any Phaser.FX effect)
 */
export type FXCreatorFn<TConfig extends FXConfig = FXConfig> = (
  obj: FXCapableGameObject,
  config: TConfig,
  type?: FXType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (() => void) | Phaser.Filters.Controller | any | null

/**
 * Hook for applying FX to GameObject
 * @param ref - Ref to GameObject
 * @returns Object with applyFX and clearFX methods
 *
 * @example
 * ```tsx
 * const ref = useRef(null)
 * const { applyFX, clearFX } = useFX(ref)
 *
 * const handleClick = () => {
 *   applyFX(createShadowFX, { offsetX: 4, offsetY: 4, blur: 8 })
 * }
 *
 * return <View ref={ref} onClick={handleClick}>Click me</View>
 * ```
 */
export function useFX<T extends FXCapableGameObject>(ref: RefObject<T>) {
  const activeEffectsRef = useRef<Set<(() => void) | Phaser.Filters.Controller>>(new Set())

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeEffectsRef.current.forEach((cleanup) => {
        if (typeof cleanup === 'function') {
          cleanup()
        } else if (cleanup?.destroy) {
          cleanup.destroy()
        }
      })
      activeEffectsRef.current.clear()
    }
  }, [])

  const applyFX = <TConfig extends FXConfig>(
    fxCreator: FXCreatorFn<TConfig>,
    config: TConfig,
    type: FXType = 'internal'
  ) => {
    const obj = ref.current
    if (!obj) {
      console.warn('[useFX] No object found in ref')
      return
    }

    const cleanupOrController = fxCreator(obj, config, type)
    if (cleanupOrController) {
      activeEffectsRef.current.add(cleanupOrController)
    }
  }

  const clearFX = () => {
    activeEffectsRef.current.forEach((cleanup) => {
      if (typeof cleanup === 'function') {
        cleanup()
      } else if (cleanup?.destroy) {
        cleanup.destroy()
      }
    })
    activeEffectsRef.current.clear()

    // Clear filters
    const obj = ref.current
    if (obj?.filters) {
      obj.filters.internal.clear()
      obj.filters.external.clear()
    }
  }

  return { applyFX, clearFX }
}
