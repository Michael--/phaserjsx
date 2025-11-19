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
 * Position state manager for effects that need to track original position
 * Allows multiple position-based effects to run synchronously
 */
interface PositionState {
  originalX: number
  originalY: number
  originalAlpha: number
  originalScaleX: number
  originalScaleY: number
  effectCount: number
  scaleOffsetX: number
  scaleOffsetY: number
}

/**
 * WeakMap to store position state for game objects
 * This allows multiple effects to share the same position data
 */
const positionStates = new WeakMap<Phaser.GameObjects.Container, PositionState>()

/**
 * Get or create position state for a game object
 * @param obj - Game object
 * @returns Position state
 */
function getPositionState(obj: Phaser.GameObjects.Container): PositionState {
  if (!positionStates.has(obj)) {
    positionStates.set(obj, {
      originalX: obj.x,
      originalY: obj.y,
      originalAlpha: obj.alpha,
      originalScaleX: obj.scaleX,
      originalScaleY: obj.scaleY,
      effectCount: 0,
      scaleOffsetX: 0,
      scaleOffsetY: 0,
    })
  }
  const state = positionStates.get(obj)
  if (!state) {
    throw new Error('Position state not found')
  }
  return state
}

/**
 * Increment effect count (called when effect starts)
 * @param obj - Game object
 */
function incrementEffectCount(obj: Phaser.GameObjects.Container): void {
  const state = getPositionState(obj)
  state.effectCount++
}

/**
 * Decrement effect count (called when effect completes)
 * Resets to original position when count reaches 0
 * @param obj - Game object
 */
function decrementEffectCount(obj: Phaser.GameObjects.Container): void {
  const state = getPositionState(obj)
  state.effectCount--

  // Reset to original position, scale and alpha when all effects are done
  if (state.effectCount <= 0) {
    obj.setPosition(state.originalX, state.originalY)
    obj.setScale(state.originalScaleX, state.originalScaleY)
    obj.setAlpha(state.originalAlpha)
    state.effectCount = 0
  }
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

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const start = 0
  const end = start + time
  // Start from the original position, not the current (affected by other effects)
  const baseX = state.originalX
  const baseY = state.originalY

  scene.tweens.add({
    targets: obj,
    duration: time,
    x: 0, // required for tween to start
    onUpdate: () => {
      const totalTime = end - start
      const remainingTime = end - 0
      const decayFactor = Math.pow(remainingTime / totalTime, 2)
      const mag = magnitude * decayFactor

      // Apply shake relative to original position, considering scale offset
      const newX = baseX + Phaser.Math.Between(-mag, mag) - state.scaleOffsetX
      const newY = baseY + Phaser.Math.Between(-mag, mag) - state.scaleOffsetY
      obj.setPosition(newX, newY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
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

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const width = obj.width
  const height = obj.height
  const baseX = state.originalX
  const baseY = state.originalY

  scene.tweens.add({
    targets: obj,
    scaleX: intensity * state.originalScaleX,
    scaleY: intensity * state.originalScaleY,
    duration: time / 2,
    ease: 'Quad.easeOut',
    yoyo: true,
    repeat: 0,
    onUpdate: (tween) => {
      // Calculate scale offset to center the scaling
      const currentScale = tween.getValue()
      if (currentScale === null) return
      const offsetX = (width * (currentScale - state.originalScaleX)) / 2
      const offsetY = (height * (currentScale - state.originalScaleY)) / 2

      // Update shared scale offset
      state.scaleOffsetX = offsetX
      state.scaleOffsetY = offsetY

      // Apply position with scale compensation
      obj.setPosition(baseX - offsetX, baseY - offsetY)
    },
    onComplete: () => {
      // Clear scale offset
      state.scaleOffsetX = 0
      state.scaleOffsetY = 0
      decrementEffectCount(obj)
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

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const originalAlpha = state.originalAlpha

  scene.tweens.add({
    targets: obj,
    alpha: originalAlpha * 0.5,
    duration: time / 2,
    ease: 'Quad.easeInOut',
    yoyo: true,
    repeat: 0,
    onComplete: () => {
      decrementEffectCount(obj)
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
