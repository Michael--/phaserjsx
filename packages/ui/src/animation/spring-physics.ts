/**
 * Spring physics engine for smooth, natural animations
 * Based on spring-damper system with configurable tension, friction, and mass
 */

/**
 * Configuration for spring physics behavior
 */
export interface SpringConfig {
  /** Spring stiffness (higher = faster, snappier). Default: 170 */
  tension?: number
  /** Damping force (higher = less oscillation). Default: 26 */
  friction?: number
  /** Mass of the animated object (higher = slower). Default: 1 */
  mass?: number
  /** Velocity threshold below which animation stops. Default: 0.01 */
  restVelocity?: number
  /** Distance threshold below which animation stops. Default: 0.01 */
  restDelta?: number
  /** Clamp values to prevent overshoot. Default: false */
  clamp?: boolean
}

/**
 * Spring physics state
 */
export interface SpringState {
  /** Current value */
  value: number
  /** Current velocity */
  velocity: number
}

/**
 * Default spring configuration (similar to react-spring)
 */
export const DEFAULT_SPRING_CONFIG: Required<SpringConfig> = {
  tension: 170,
  friction: 26,
  mass: 1,
  restVelocity: 0.01,
  restDelta: 0.01,
  clamp: false,
}

/**
 * Preset spring configurations for common use cases
 * Note: clamp prevents overshoot but can make animations feel less natural
 * For UI animations, consider enabling clamp to prevent visual artifacts
 */
export const SPRING_PRESETS = {
  /** Gentle, slow animation */
  gentle: { tension: 120, friction: 14 },
  /** Moderate, balanced animation (default) */
  default: { tension: 170, friction: 26 },
  /** Fast, snappy animation */
  wobbly: { tension: 180, friction: 12 },
  /** Very fast, bouncy animation */
  stiff: { tension: 210, friction: 20 },
  /** Slow, smooth animation */
  slow: { tension: 280, friction: 60 },
  /** Instant, no animation */
  instant: { tension: 1000, friction: 100 },
} as const

/**
 * Type for animation preset keys
 */
export type AnimationPreset = keyof typeof SPRING_PRESETS
/**
 * Type for animation configuration (preset name or custom config)
 */
export type AnimationConfig = AnimationPreset | SpringConfig

/**
 * Spring physics engine
 * Implements spring-damper physics for smooth, natural animations
 */
export class SpringPhysics {
  private config: Required<SpringConfig>

  /**
   * Creates a new spring physics engine
   * @param config - Spring configuration
   */
  constructor(config: SpringConfig = {}) {
    this.config = { ...DEFAULT_SPRING_CONFIG, ...config }
  }

  /**
   * Updates spring configuration
   * @param config - Partial config to merge with current
   */
  updateConfig(config: Partial<SpringConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Performs one physics step
   * Uses semi-implicit Euler integration for stability
   * @param state - Current spring state
   * @param target - Target value
   * @param deltaTime - Time delta in seconds
   * @returns New spring state
   */
  step(state: SpringState, target: number, deltaTime: number): SpringState {
    const { tension, friction, mass, clamp } = this.config

    // Calculate spring force (Hooke's law)
    const springForce = -tension * (state.value - target)

    // Calculate damping force
    const dampingForce = -friction * state.velocity

    // Calculate acceleration (F = ma → a = F/m)
    const acceleration = (springForce + dampingForce) / mass

    // Update velocity (semi-implicit Euler)
    const newVelocity = state.velocity + acceleration * deltaTime

    // Update position
    let newValue = state.value + newVelocity * deltaTime

    // Clamp if enabled
    if (clamp) {
      const min = Math.min(state.value, target)
      const max = Math.max(state.value, target)
      newValue = Math.max(min, Math.min(max, newValue))
    }

    return {
      value: newValue,
      velocity: newVelocity,
    }
  }

  /**
   * Checks if spring has reached rest state
   * @param state - Current spring state
   * @param target - Target value
   * @returns True if spring is at rest
   */
  isAtRest(state: SpringState, target: number): boolean {
    const { restVelocity, restDelta } = this.config
    const isVelocitySmall = Math.abs(state.velocity) <= restVelocity
    const isDisplacementSmall = Math.abs(state.value - target) <= restDelta
    return isVelocitySmall && isDisplacementSmall
  }

  /**
   * Snaps spring to target if at rest
   * @param state - Current spring state
   * @param target - Target value
   * @returns Adjusted state (snapped if at rest)
   */
  snapIfAtRest(state: SpringState, target: number): SpringState {
    if (this.isAtRest(state, target)) {
      return { value: target, velocity: 0 }
    }
    return state
  }
}
