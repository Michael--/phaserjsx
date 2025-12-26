/**
 * Particle system utilities and presets
 */
export {
  PARTICLE_PRESET_REGISTRY,
  resolveParticlePreset,
  type BuiltInParticlePresetName,
  type ParticleEmitterConfig,
  type ParticlePresetDefinition,
  type ParticlePresetExtensions,
  type ParticlePresetName,
} from './preset-registry'
export {
  buildEmitZone,
  buildEmitZoneFromLayout,
  type EmitZoneConfig,
  type ParticleZoneConfig,
  type ParticleZoneShape,
} from './emit-zone'
export type { ParticleEmitter, ParticleEmitterManagerLike, ParticlesHandle } from './particle-types'
export { useParticles } from './use-particles'
