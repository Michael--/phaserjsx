/**
 * Custom hook for Phaser game object effects (shake, pulse, etc.)
 * Manages multiple concurrent effects with proper cleanup
 */
import { useEffect, useRef, type RefObject } from '@phaserjsx/ui'

/**
 * Effect configuration
 */
export interface EffectConfig {
  magnitude?: number
  time?: number
  intensity?: number
  duration?: number
}

/**
 * Effect callback function
 * @param obj - The Phaser game object to apply effect to
 * @param config - Effect configuration
 */
export type EffectFn = (obj: Phaser.GameObjects.Container, config: EffectConfig) => void

/**
 * Create a shake effect
 * @param obj - Game object to shake
 * @param config - Effect config (magnitude, time)
 */
export const createShakeEffect: EffectFn = (obj, config) => {
  const { magnitude = 5, time = 200 } = config

  const refWithPos = obj as Phaser.GameObjects.Container & {
    __originalX?: number
    __originalY?: number
  }

  // Store original position on first shake
  const isFirstShake = refWithPos.__originalX === undefined || refWithPos.__originalY === undefined

  if (isFirstShake) {
    refWithPos.__originalX = obj.x
    refWithPos.__originalY = obj.y
  }

  const scene = obj.scene
  const start = 0
  const end = start + time

  scene.tweens.add({
    targets: obj,
    duration: time,
    x: 0, // required for tween to start
    onUpdate: () => {
      const totalTime = end - start
      const remainingTime = end - 0
      const decayFactor = Math.pow(remainingTime / totalTime, 2)
      const mag = magnitude * decayFactor

      const baseX = refWithPos.__originalX ?? 0
      const baseY = refWithPos.__originalY ?? 0
      obj.setPosition(
        baseX + Phaser.Math.Between(-mag, mag),
        baseY + Phaser.Math.Between(-mag, mag)
      )
    },
    onComplete: () => {
      // Reset to original position if no other shakes are active
      const activeTweens = scene.tweens
        .getTweensOf(obj)
        .filter((tween: Phaser.Tweens.Tween) => tween.isActive())

      if (activeTweens.length === 0) {
        const baseX = refWithPos.__originalX ?? 0
        const baseY = refWithPos.__originalY ?? 0
        obj.setPosition(baseX, baseY)

        // Clear stored position
        delete refWithPos.__originalX
        delete refWithPos.__originalY
      }
    },
  })
}

/**
 * Create a pulse effect (scale animation)
 * @param obj - Game object to pulse
 * @param config - Effect config (intensity, time)
 */
export const createPulseEffect: EffectFn = (obj, config) => {
  const { intensity = 1.2, time = 300 } = config

  const scene = obj.scene
  const originalScaleX = obj.scaleX
  const originalScaleY = obj.scaleY
  const originalX = obj.x
  const originalY = obj.y
  const width = obj.width
  const height = obj.height

  scene.tweens.add({
    targets: obj,
    scaleX: intensity,
    scaleY: intensity,
    duration: time / 2,
    ease: 'Quad.easeOut',
    yoyo: true,
    repeat: 0,
    onUpdate: (tween) => {
      // Adjust position to scale from center
      const scale = tween.getValue()
      if (scale === null) return
      const offsetX = (width * (scale - originalScaleX)) / 2
      const offsetY = (height * (scale - originalScaleY)) / 2
      obj.setPosition(originalX - offsetX, originalY - offsetY)
    },
    onComplete: () => {
      // Restore original position and scale
      obj.setPosition(originalX, originalY)
      obj.setScale(originalScaleX, originalScaleY)
    },
  })
}

/**
 * Create a fade effect
 * @param obj - Game object to fade
 * @param config - Effect config (time, duration)
 */
export const createFadeEffect: EffectFn = (obj, config) => {
  const { time = 300 } = config
  const scene = obj.scene
  const originalAlpha = obj.alpha

  scene.tweens.add({
    targets: obj,
    alpha: originalAlpha * 0.5,
    duration: time / 2,
    ease: 'Quad.easeInOut',
    yoyo: true,
    repeat: 0,
    onComplete: () => {
      obj.setAlpha(originalAlpha)
    },
  })
}

/**
 * Hook for applying effects to game objects
 * Handles cleanup of tweens on unmount
 * @param ref - RefObject pointing to a Phaser game object
 * @returns Function to trigger effects
 */
export function useGameObjectEffect(ref: RefObject<Phaser.GameObjects.Container | null>) {
  const tweenIdsRef = useRef<Phaser.Tweens.Tween[]>([])

  /**
   * Apply an effect to the game object
   * @param effect - Effect function to apply
   * @param config - Effect configuration
   */
  const applyEffect = (effect: EffectFn, config: EffectConfig = {}) => {
    if (!ref.current) return

    // Store tween reference for cleanup
    const scene = ref.current.scene
    const tweenCountBefore = scene.tweens.getTweensOf(ref.current).length

    effect(ref.current, config)

    const tweenCountAfter = scene.tweens.getTweensOf(ref.current).length
    if (tweenCountAfter > tweenCountBefore) {
      const newTweens = scene.tweens.getTweensOf(ref.current).slice(tweenCountBefore)
      tweenIdsRef.current.push(...newTweens)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      tweenIdsRef.current.forEach((tween) => {
        if (!tween.isDestroyed()) {
          tween.stop()
        }
      })
      tweenIdsRef.current = []
    }
  }, [])

  return { applyEffect }
}
