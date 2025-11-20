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
  direction?: 'left' | 'right' | 'up' | 'down'
  angle?: number
  onComplete?: () => void
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
  originalRotation: number
  originX: number
  originY: number
  effectCount: number
  scaleOffsetX: number
  scaleOffsetY: number
  rotationOffset: number
  initialized: boolean
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
      originalRotation: obj.rotation,
      originX: obj.originX ?? 0,
      originY: obj.originY ?? 0,
      effectCount: 0,
      scaleOffsetX: 0,
      scaleOffsetY: 0,
      rotationOffset: 0,
      initialized: false,
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
 * Stores original values only on first effect to prevent race conditions
 * @param obj - Game object
 */
function incrementEffectCount(obj: Phaser.GameObjects.Container): void {
  const state = getPositionState(obj)

  // Store original values only when first effect starts
  if (state.effectCount === 0 && !state.initialized) {
    state.originalX = obj.x
    state.originalY = obj.y
    state.originalAlpha = obj.alpha
    state.originalScaleX = obj.scaleX
    state.originalScaleY = obj.scaleY
    state.originalRotation = obj.rotation
    state.originX = obj.originX ?? 0
    state.originY = obj.originY ?? 0
    state.initialized = true
  }

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

  // Reset to original position, scale, alpha and rotation when all effects are done
  if (state.effectCount <= 0) {
    obj.setPosition(state.originalX, state.originalY)
    obj.setScale(state.originalScaleX, state.originalScaleY)
    obj.setAlpha(state.originalAlpha)
    obj.setRotation(state.originalRotation)
    state.effectCount = 0
    state.scaleOffsetX = 0
    state.scaleOffsetY = 0
    state.rotationOffset = 0
    state.initialized = false
  }
}

/**
 * Calculate position offset for origin-aware scaling
 * @param obj - Game object
 * @param state - Position state
 * @param currentScaleX - Current X scale
 * @param currentScaleY - Current Y scale
 * @returns Position offsets {x, y}
 */
function calculateScaleOffset(
  obj: Phaser.GameObjects.Container,
  state: PositionState,
  currentScaleX: number,
  currentScaleY: number
): { x: number; y: number } {
  const width = obj.width
  const height = obj.height

  // Calculate offset based on origin (default 0,0 = top-left)
  const offsetX = width * (currentScaleX - state.originalScaleX) * state.originX
  const offsetY = height * (currentScaleY - state.originalScaleY) * state.originY

  return { x: offsetX, y: offsetY }
}

/**
 * Apply origin-aware scale to object
 * @param obj - Game object
 * @param state - Position state
 * @param scaleX - Target X scale
 * @param scaleY - Target Y scale
 */
function applyScaleWithOrigin(
  obj: Phaser.GameObjects.Container,
  state: PositionState,
  scaleX: number,
  scaleY: number
): void {
  const newOffset = calculateScaleOffset(obj, state, scaleX, scaleY)

  // Calculate the delta from previous offset to preserve other tween effects
  const deltaX = newOffset.x - state.scaleOffsetX
  const deltaY = newOffset.y - state.scaleOffsetY

  state.scaleOffsetX = newOffset.x
  state.scaleOffsetY = newOffset.y

  obj.setScale(scaleX, scaleY)
  // Adjust position by delta to preserve other effects (like Float changing Y)
  obj.setPosition(obj.x - deltaX, obj.y - deltaY)
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
  const { magnitude = 5, time = 200, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const baseX = state.originalX
  const baseY = state.originalY

  scene.tweens.add({
    targets: obj,
    duration: time,
    x: 0, // required for tween to start
    onUpdate: (tween) => {
      // Use tween progress (0 to 1) for decay calculation
      const progress = tween.progress
      const decayFactor = Math.pow(1 - progress, 2)
      const mag = magnitude * decayFactor

      // Apply shake relative to original position, considering scale offset
      const newX = baseX + Phaser.Math.Between(-mag, mag) - state.scaleOffsetX
      const newY = baseY + Phaser.Math.Between(-mag, mag) - state.scaleOffsetY
      obj.setPosition(newX, newY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a pulse effect (scale animation)
 * @param obj - Game object to pulse
 * @param config - Effect config (intensity, time)
 */
export const createPulseEffect: EffectFn = (obj, config) => {
  const { intensity = 1.2, time = 300, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const targetScaleX = intensity * state.originalScaleX
  const targetScaleY = intensity * state.originalScaleY

  scene.tweens.add({
    targets: obj,
    scaleX: targetScaleX,
    scaleY: targetScaleY,
    duration: time / 2,
    ease: 'Quad.easeOut',
    yoyo: true,
    repeat: 0,
    onUpdate: () => {
      // Use helper function for origin-aware scaling
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a fade effect
 * @param obj - Game object to fade
 * @param config - Effect config (time, duration)
 */
export const createFadeEffect: EffectFn = (obj, config) => {
  const { time = 300, onComplete: userOnComplete } = config

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
      userOnComplete?.()
    },
  })
}

/**
 * Create a bounce effect (elastic bounce feedback)
 * @param obj - Game object to bounce
 * @param config - Effect config (intensity, time)
 */
export const createBounceEffect: EffectFn = (obj, config) => {
  const { intensity = 1.3, time = 600, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const targetScaleX = intensity * state.originalScaleX
  const targetScaleY = intensity * state.originalScaleY

  scene.tweens.add({
    targets: obj,
    scaleX: targetScaleX,
    scaleY: targetScaleY,
    duration: time,
    ease: 'Elastic.easeOut',
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a flash effect (quick scale pulse for visibility)
 * @param obj - Game object to flash
 * @param config - Effect config (time, intensity)
 */
export const createFlashEffect: EffectFn = (obj, config) => {
  const { time = 200, intensity = 1.15, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const targetScaleX = intensity * state.originalScaleX
  const targetScaleY = intensity * state.originalScaleY

  scene.tweens.add({
    targets: obj,
    scaleX: targetScaleX,
    scaleY: targetScaleY,
    duration: time / 2,
    ease: 'Quad.easeOut',
    yoyo: true,
    repeat: 0,
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a wobble effect (rotation-based shake)
 * @param obj - Game object to wobble
 * @param config - Effect config (magnitude, time)
 */
export const createWobbleEffect: EffectFn = (obj, config) => {
  const { magnitude = 0.1, time = 400, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const baseRotation = state.originalRotation

  scene.tweens.add({
    targets: obj,
    rotation: baseRotation + magnitude,
    duration: time / 4,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      obj.setRotation(baseRotation)
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a jello effect (squash & stretch)
 * @param obj - Game object for jello effect
 * @param config - Effect config (intensity, time)
 */
export const createJelloEffect: EffectFn = (obj, config) => {
  const { intensity = 0.15, time = 600, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const baseScaleX = state.originalScaleX
  const baseScaleY = state.originalScaleY

  let step = 0
  const steps = [
    { scaleX: baseScaleX * (1 + intensity), scaleY: baseScaleY * (1 - intensity * 0.5) },
    { scaleX: baseScaleX * (1 - intensity * 0.5), scaleY: baseScaleY * (1 + intensity) },
    { scaleX: baseScaleX * (1 + intensity * 0.3), scaleY: baseScaleY * (1 - intensity * 0.3) },
    { scaleX: baseScaleX, scaleY: baseScaleY },
  ]

  const runStep = () => {
    if (step >= steps.length) {
      decrementEffectCount(obj)
      userOnComplete?.()
      return
    }

    const currentStep = steps[step]
    if (!currentStep) return

    scene.tweens.add({
      targets: obj,
      scaleX: currentStep.scaleX,
      scaleY: currentStep.scaleY,
      duration: time / steps.length,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
      },
      onComplete: () => {
        step++
        runStep()
      },
    })
  }

  runStep()
}

/**
 * Create a press effect (scale down + bounce back, like button press)
 * @param obj - Game object to press
 * @param config - Effect config (intensity, time)
 */
export const createPressEffect: EffectFn = (obj, config) => {
  const { intensity = 0.9, time = 200, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const targetScaleX = intensity * state.originalScaleX
  const targetScaleY = intensity * state.originalScaleY

  scene.tweens.add({
    targets: obj,
    scaleX: targetScaleX,
    scaleY: targetScaleY,
    duration: time / 2,
    ease: 'Quad.easeIn',
    yoyo: true,
    repeat: 0,
    easeReturn: 'Back.easeOut',
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a tada effect (attention grabber with scale + rotation)
 * @param obj - Game object for tada effect
 * @param config - Effect config (intensity, time)
 */
export const createTadaEffect: EffectFn = (obj, config) => {
  const { intensity = 1.1, time = 600, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const baseRotation = state.originalRotation
  const baseScaleX = state.originalScaleX
  const baseScaleY = state.originalScaleY

  scene.tweens.add({
    targets: obj,
    rotation: baseRotation + 0.05,
    scaleX: intensity * baseScaleX,
    scaleY: intensity * baseScaleY,
    duration: time / 6,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: 2,
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      obj.setRotation(baseRotation)
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a swing effect (pendulum animation)
 * @param obj - Game object to swing
 * @param config - Effect config (magnitude, time)
 */
export const createSwingEffect: EffectFn = (obj, config) => {
  const { magnitude = 0.15, time = 800, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const baseRotation = state.originalRotation

  scene.tweens.add({
    targets: obj,
    rotation: baseRotation + magnitude,
    duration: time / 4,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      obj.setRotation(baseRotation)
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a wiggle effect (gentle horizontal shake)
 * @param obj - Game object to wiggle
 * @param config - Effect config (magnitude, time)
 */
export const createWiggleEffect: EffectFn = (obj, config) => {
  const { magnitude = 3, time = 400, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const baseX = state.originalX

  scene.tweens.add({
    targets: obj,
    x: baseX + magnitude,
    duration: time / 6,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: 2,
    onComplete: () => {
      obj.setPosition(baseX, state.originalY)
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a slide-in effect
 * @param obj - Game object to slide in
 * @param config - Effect config (direction, time)
 */
export const createSlideInEffect: EffectFn = (obj, config) => {
  const { direction = 'left', time = 400, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const targetX = state.originalX
  const targetY = state.originalY

  // Calculate start position based on direction
  let startX = targetX
  let startY = targetY
  const distance = 200

  switch (direction) {
    case 'left':
      startX = targetX - distance
      break
    case 'right':
      startX = targetX + distance
      break
    case 'up':
      startY = targetY - distance
      break
    case 'down':
      startY = targetY + distance
      break
  }

  obj.setPosition(startX, startY)

  scene.tweens.add({
    targets: obj,
    x: targetX,
    y: targetY,
    duration: time,
    ease: 'Quad.easeOut',
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a slide-out effect
 * @param obj - Game object to slide out
 * @param config - Effect config (direction, time)
 */
export const createSlideOutEffect: EffectFn = (obj, config) => {
  const { direction = 'right', time = 400, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const startX = state.originalX
  const startY = state.originalY
  const distance = 200

  // Calculate target position based on direction
  let targetX = startX
  let targetY = startY

  switch (direction) {
    case 'left':
      targetX = startX - distance
      break
    case 'right':
      targetX = startX + distance
      break
    case 'up':
      targetY = startY - distance
      break
    case 'down':
      targetY = startY + distance
      break
  }

  scene.tweens.add({
    targets: obj,
    x: targetX,
    y: targetY,
    duration: time,
    ease: 'Quad.easeIn',
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a zoom-in effect (scale from 0 to 1)
 * @param obj - Game object to zoom in
 * @param config - Effect config (time)
 */
export const createZoomInEffect: EffectFn = (obj, config) => {
  const { time = 400, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const targetScaleX = state.originalScaleX
  const targetScaleY = state.originalScaleY

  obj.setScale(0, 0)

  scene.tweens.add({
    targets: obj,
    scaleX: targetScaleX,
    scaleY: targetScaleY,
    duration: time,
    ease: 'Back.easeOut',
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a zoom-out effect (scale from 1 to 0)
 * @param obj - Game object to zoom out
 * @param config - Effect config (time)
 */
export const createZoomOutEffect: EffectFn = (obj, config) => {
  const { time = 400, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene

  scene.tweens.add({
    targets: obj,
    scaleX: 0,
    scaleY: 0,
    duration: time,
    ease: 'Back.easeIn',
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a flip-in effect (3D flip from edge)
 * @param obj - Game object to flip in
 * @param config - Effect config (time)
 */
export const createFlipInEffect: EffectFn = (obj, config) => {
  const { time = 500, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene
  const targetScaleX = state.originalScaleX

  obj.setScale(0, state.originalScaleY)

  scene.tweens.add({
    targets: obj,
    scaleX: targetScaleX,
    duration: time,
    ease: 'Back.easeOut',
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a flip-out effect (3D flip to edge)
 * @param obj - Game object to flip out
 * @param config - Effect config (time)
 */
export const createFlipOutEffect: EffectFn = (obj, config) => {
  const { time = 500, onComplete: userOnComplete } = config

  const state = getPositionState(obj)
  incrementEffectCount(obj)

  const scene = obj.scene

  scene.tweens.add({
    targets: obj,
    scaleX: 0,
    duration: time,
    ease: 'Back.easeIn',
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
    onComplete: () => {
      decrementEffectCount(obj)
      userOnComplete?.()
    },
  })
}

/**
 * Create a float effect (gentle up/down motion, for idle items)
 * @param obj - Game object to float
 * @param config - Effect config (magnitude, time)
 */
export const createFloatEffect: EffectFn = (obj, config) => {
  const { magnitude = 10, time = 2000 } = config

  const state = getPositionState(obj)
  // Initialize original values if not done yet (without incrementing count)
  if (!state.initialized) {
    state.originalX = obj.x
    state.originalY = obj.y
    state.originalAlpha = obj.alpha
    state.originalScaleX = obj.scaleX
    state.originalScaleY = obj.scaleY
    state.originalRotation = obj.rotation
    state.originX = obj.originX ?? 0
    state.originY = obj.originY ?? 0
    state.initialized = true
  }

  const scene = obj.scene
  const baseY = state.originalY

  scene.tweens.add({
    targets: obj,
    y: baseY - magnitude,
    duration: time,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: -1, // infinite loop
    onUpdate: () => {
      // Keep x position stable, considering scale offset
      obj.setX(state.originalX - state.scaleOffsetX)
    },
  })

  // Note: For infinite effects, user must manually stop tween or unmount component
}

/**
 * Create a breathe effect (slow pulsing for idle/important objects)
 * @param obj - Game object to breathe
 * @param config - Effect config (intensity, time)
 */
export const createBreatheEffect: EffectFn = (obj, config) => {
  const { intensity = 1.05, time = 2000 } = config

  const state = getPositionState(obj)
  // Initialize original values if not done yet (without incrementing count)
  if (!state.initialized) {
    state.originalX = obj.x
    state.originalY = obj.y
    state.originalAlpha = obj.alpha
    state.originalScaleX = obj.scaleX
    state.originalScaleY = obj.scaleY
    state.originalRotation = obj.rotation
    state.originX = obj.originX ?? 0
    state.originY = obj.originY ?? 0
    state.initialized = true
  }

  const scene = obj.scene
  const targetScaleX = intensity * state.originalScaleX
  const targetScaleY = intensity * state.originalScaleY

  scene.tweens.add({
    targets: obj,
    scaleX: targetScaleX,
    scaleY: targetScaleY,
    duration: time,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: -1, // infinite loop
    onUpdate: () => {
      applyScaleWithOrigin(obj, state, obj.scaleX, obj.scaleY)
    },
  })

  // Note: For infinite effects, user must manually stop tween or unmount component
}

/**
 * Create a spin effect (continuous rotation)
 * @param obj - Game object to spin
 * @param config - Effect config (time for one full rotation)
 */
export const createSpinEffect: EffectFn = (obj, config) => {
  const { time = 2000 } = config

  const state = getPositionState(obj)
  // Initialize original values if not done yet (without incrementing count)
  if (!state.initialized) {
    state.originalX = obj.x
    state.originalY = obj.y
    state.originalAlpha = obj.alpha
    state.originalScaleX = obj.scaleX
    state.originalScaleY = obj.scaleY
    state.originalRotation = obj.rotation
    state.originX = obj.originX ?? 0
    state.originY = obj.originY ?? 0
    state.initialized = true
  }

  const scene = obj.scene
  const baseRotation = state.originalRotation

  scene.tweens.add({
    targets: obj,
    rotation: baseRotation + Math.PI * 2,
    duration: time,
    ease: 'Linear',
    repeat: -1, // infinite loop
  })

  // Note: For infinite effects, user must manually stop tween or unmount component
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

  /**
   * Stop all active effects/tweens
   */
  const stopEffects = () => {
    if (!ref.current) return

    const scene = ref.current.scene
    const tweens = scene.tweens.getTweensOf(ref.current)

    tweens.forEach((tween) => {
      if (!tween.isDestroyed()) {
        tween.stop()
        tween.remove()
      }
    })

    tweenIdsRef.current = []

    // Reset to original state if there's a state
    const obj = ref.current
    if (positionStates.has(obj)) {
      const state = positionStates.get(obj)
      if (state) {
        obj.setPosition(state.originalX, state.originalY)
        obj.setScale(state.originalScaleX, state.originalScaleY)
        obj.setAlpha(state.originalAlpha)
        obj.setRotation(state.originalRotation)
        state.effectCount = 0
        state.scaleOffsetX = 0
        state.scaleOffsetY = 0
        state.rotationOffset = 0
        state.initialized = false
      }
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

  return { applyEffect, stopEffects }
}
