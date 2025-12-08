/**
 * Spring animation hook
 * Provides physics-based animations using signals for direct updates
 */
import { computed, type Signal } from '@preact/signals-core'
import Phaser from 'phaser'
import { getCurrent, useEffect, useRef } from '../hooks'
import type { ParentType } from '../types'
import { animatedSignal, type AnimatedSignal } from './animated-signal'
import {
  SPRING_PRESETS,
  SpringPhysics,
  type SpringConfig,
  type SpringState,
} from './spring-physics'

/**
 * Spring animation hook
 * Creates an animated signal that smoothly transitions to target values
 *
 * @param initialValue - Initial value
 * @param config - Spring configuration or preset name
 * @returns Tuple of [animated signal, setter function]
 *
 * @example
 * ```tsx
 * // ✓ SAFE - leaf node
 * const [x, setX] = useSpring(0, 'wobbly')
 * <View x={x} width={50} height={50} backgroundColor={0xff0000} />
 *
 * // ✓ SAFE - transform properties
 * const [scale, setScale] = useSpring(1, 'default')
 * <View scale={scale}><Text text="Hello" /></View>
 *
 * // ✗ UNSAFE - container with percentage children
 * const [width, setWidth] = useSpring(200, 'wobbly')
 * <View width={width}><NineSlice width="100%" /></View> // BREAKS!
 * ```
 */
export function useSpring(
  initialValue: number,
  config?: SpringConfig | keyof typeof SPRING_PRESETS,
  onComplete?: () => void
): [AnimatedSignal, (target: number | ((prev: number) => number)) => void] {
  // Resolve config
  const resolvedConfig =
    typeof config === 'string' ? SPRING_PRESETS[config] : (config ?? SPRING_PRESETS.default)

  // Create animated signal
  const valueSignal = useRef<AnimatedSignal | null>(null)
  if (valueSignal.current === null) {
    valueSignal.current = animatedSignal(initialValue)
  }

  // Get scene from render context (DURING RENDER, while getCurrent() is available)
  const ctx = getCurrent() as { parent: ParentType } | null
  const scene = ctx
    ? ctx.parent instanceof Phaser.Scene
      ? ctx.parent
      : (ctx.parent as Phaser.GameObjects.GameObject).scene
    : null

  // Physics state
  const state = useRef<SpringState>({ value: initialValue, velocity: 0 })
  const target = useRef<Signal<number>>({ value: initialValue } as Signal<number>)
  const physics = useRef(new SpringPhysics(resolvedConfig))
  const updateListenerRef = useRef<((time: number, delta: number) => void) | null>(null)
  const sceneRef = useRef<Phaser.Scene | null>(scene)
  const wasAtRest = useRef<boolean>(true) // Track if previously at rest

  // Update scene ref if it changes (shouldn't happen, but defensive)
  if (scene && sceneRef.current !== scene) {
    sceneRef.current = scene
  }

  // Setter function - stable reference across renders
  const setValue = (newTarget: number | ((prev: number) => number)) => {
    const nextTarget = typeof newTarget === 'function' ? newTarget(target.current.value) : newTarget
    target.current.value = nextTarget
  }

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) {
      console.warn('useSpring: Phaser scene not found in context')
      return
    }

    // Physics update loop
    const updateListener = (_time: number, delta: number) => {
      const currentTarget = target.current.value
      const currentState = state.current

      // Check if at rest
      const atRest = physics.current.isAtRest(currentState, currentTarget)

      // Call onComplete if just reached rest
      if (atRest && !wasAtRest.current && onComplete) {
        onComplete()
      }
      wasAtRest.current = atRest

      // Skip if already at rest
      if (atRest) {
        // Snap to target
        const snapped = physics.current.snapIfAtRest(currentState, currentTarget)
        if (snapped.value !== currentState.value && valueSignal.current) {
          state.current = snapped
          valueSignal.current.value = snapped.value
        }
        return
      }

      // Perform physics step
      const deltaSeconds = delta / 1000
      const newState = physics.current.step(currentState, currentTarget, deltaSeconds)

      // Update state and signal
      if (valueSignal.current) {
        state.current = newState
        valueSignal.current.value = newState.value
      }
    }

    updateListenerRef.current = updateListener
    scene.events.on('update', updateListener)

    // Cleanup
    return () => {
      if (sceneRef.current && updateListenerRef.current) {
        sceneRef.current.events.off('update', updateListenerRef.current)
      }
    }
  }, [])

  if (!valueSignal.current) {
    throw new Error('useSpring: Failed to initialize animated signal')
  }

  return [valueSignal.current, setValue]
}

/**
 * Multi-spring animation hook
 * Creates multiple animated signals that share the same configuration
 * @param initialValues - Object with initial values
 * @param config - Spring configuration or preset name
 * @returns Tuple of [animated signals object, setter function]
 *
 * @example
 * ```tsx
 * const [pos, setPos] = useSprings({ x: 0, y: 0 }, 'wobbly')
 * <View x={pos.x} y={pos.y} />
 * setPos({ x: 100, y: 200 })
 * ```
 */
export function useSprings<T extends Record<string, number>>(
  initialValues: T,
  config?: SpringConfig | keyof typeof SPRING_PRESETS
): [
  { [K in keyof T]: AnimatedSignal },
  (values: Partial<{ [K in keyof T]: number | ((prev: number) => number) }>) => void,
] {
  const keys = Object.keys(initialValues) as (keyof T)[]
  const springsMap = useRef<
    Map<
      keyof T,
      {
        signal: AnimatedSignal
        target: { value: number }
        state: SpringState
        physics: SpringPhysics
      }
    >
  >(new Map())
  const updateListenerRef = useRef<((time: number, delta: number) => void) | null>(null)
  const sceneRef = useRef<Phaser.Scene | null>(null)

  // Resolve config
  const resolvedConfig =
    typeof config === 'string' ? SPRING_PRESETS[config] : (config ?? SPRING_PRESETS.default)

  // Initialize springs manually (can't use hooks in loops!)
  keys.forEach((key) => {
    if (!springsMap.current.has(key)) {
      const initialValue = initialValues[key] as number
      const signal = animatedSignal(initialValue)
      const target = { value: initialValue }
      const state = { value: initialValue, velocity: 0 }
      const physics = new SpringPhysics(resolvedConfig)
      springsMap.current.set(key, { signal, target, state, physics })
    }
  })

  // Get scene from render context (DURING RENDER, while getCurrent() is available)
  const ctx = getCurrent() as { parent: ParentType } | null
  const scene = ctx
    ? ctx.parent instanceof Phaser.Scene
      ? ctx.parent
      : (ctx.parent as Phaser.GameObjects.GameObject).scene
    : null

  // Update scene ref if it changes (shouldn't happen, but defensive)
  if (scene && sceneRef.current !== scene) {
    sceneRef.current = scene
  }

  // Setup physics update loop
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) {
      console.warn('useSprings: Phaser scene not found in context')
      return
    }

    const updateListener = (_time: number, delta: number) => {
      const deltaSeconds = delta / 1000

      springsMap.current.forEach((spring) => {
        const currentTarget = spring.target.value
        const currentState = spring.state

        // Skip if already at rest
        if (spring.physics.isAtRest(currentState, currentTarget)) {
          const snapped = spring.physics.snapIfAtRest(currentState, currentTarget)
          if (snapped.value !== currentState.value) {
            spring.state = snapped
            spring.signal.value = snapped.value
          }
          return
        }

        // Perform physics step
        const newState = spring.physics.step(currentState, currentTarget, deltaSeconds)
        spring.state = newState
        spring.signal.value = newState.value
      })
    }

    updateListenerRef.current = updateListener
    scene.events.on('update', updateListener)

    return () => {
      if (sceneRef.current && updateListenerRef.current) {
        sceneRef.current.events.off('update', updateListenerRef.current)
      }
    }
  }, [])

  // Build result object
  const signals = {} as { [K in keyof T]: AnimatedSignal }
  keys.forEach((key) => {
    const spring = springsMap.current.get(key)
    if (spring) {
      signals[key] = spring.signal
    }
  })

  // Setter function
  const setValues = (values: Partial<{ [K in keyof T]: number | ((prev: number) => number) }>) => {
    Object.entries(values).forEach(([key, value]) => {
      const spring = springsMap.current.get(key as keyof T)
      if (spring) {
        const nextTarget = typeof value === 'function' ? value(spring.target.value) : value
        spring.target.value = nextTarget as number
      }
    })
  }

  return [signals, setValues]
}

/**
 * Export presets for convenience
 */
export { computed, SPRING_PRESETS }
