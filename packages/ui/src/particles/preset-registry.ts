/**
 * Particle preset registry - typed presets with extension support
 */
import type Phaser from 'phaser'

/**
 * Built-in particle preset names
 */
export type BuiltInParticlePresetName = 'explosion' | 'trail' | 'rain' | 'snow' | 'sparkle'

/**
 * Extension point for custom particle preset names
 * Use declaration merging to add custom presets:
 * @example
 * ```typescript
 * declare module '@number10/phaserjsx' {
 *   interface ParticlePresetExtensions {
 *     myPreset: 'myPreset'
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ParticlePresetExtensions {}

/**
 * Available particle preset names (built-in + extensions)
 */
export type ParticlePresetName =
  | BuiltInParticlePresetName
  | (keyof ParticlePresetExtensions extends never ? never : keyof ParticlePresetExtensions)

/**
 * Phaser emitter config alias
 */
export type ParticleEmitterConfig = Phaser.Types.GameObjects.Particles.ParticleEmitterConfig

/**
 * Preset definition for component/theme props
 */
export interface ParticlePresetDefinition {
  preset?: ParticlePresetName
  config?: ParticleEmitterConfig
}

/**
 * Map of built-in particle presets to emitter configs
 */
export const PARTICLE_PRESET_REGISTRY: Record<BuiltInParticlePresetName, ParticleEmitterConfig> = {
  explosion: {
    speed: { min: 120, max: 320 },
    scale: { start: 1, end: 0 },
    alpha: { start: 1, end: 0 },
    lifespan: 600,
    quantity: 24,
    blendMode: 'ADD',
  },
  trail: {
    speed: { min: 30, max: 80 },
    scale: { start: 0.6, end: 0 },
    alpha: { start: 0.8, end: 0 },
    lifespan: 700,
    frequency: 40,
  },
  rain: {
    speed: { min: 320, max: 520 },
    angle: { min: 80, max: 100 },
    scale: { start: 0.5, end: 0.2 },
    alpha: { start: 0.6, end: 0.1 },
    lifespan: 1000,
    frequency: 20,
  },
  snow: {
    speed: { min: 40, max: 120 },
    angle: { min: 80, max: 100 },
    gravityY: 8,
    scale: { start: 0.6, end: 0.6 },
    alpha: { start: 0.8, end: 0.3 },
    lifespan: 2600,
    frequency: 80,
  },
  sparkle: {
    speed: { min: 20, max: 60 },
    scale: { start: 0.4, end: 0 },
    alpha: { start: 1, end: 0 },
    lifespan: 500,
    frequency: 60,
    blendMode: 'ADD',
  },
}

/**
 * Resolve a preset name with optional overrides
 * @param preset - Preset name (built-in or extension)
 * @param config - Optional overrides applied last
 * @returns Resolved emitter config
 */
export function resolveParticlePreset(
  preset?: ParticlePresetName,
  config: ParticleEmitterConfig = {}
): ParticleEmitterConfig {
  const base = preset ? PARTICLE_PRESET_REGISTRY[preset as BuiltInParticlePresetName] : undefined

  if (preset && !base) {
    console.warn(`[Particles] Preset "${String(preset)}" not found in registry`)
  }

  return {
    ...(base ?? {}),
    ...config,
  }
}
