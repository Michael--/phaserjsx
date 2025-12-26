/**
 * Particle utilities shared across hooks/components
 */
import type Phaser from 'phaser'
import type { EmitZoneConfig } from './emit-zone'
import type { ParticleEmitter, ParticleEmitterManagerLike, ParticlesHandle } from './particle-types'
import type { ParticleEmitterConfig } from './preset-registry'

export function isParticleEmitter(target: ParticlesHandle | null): target is ParticleEmitter {
  return !!target && typeof (target as ParticleEmitter).explode === 'function'
}

export function getFirstEmitter(
  manager: ParticleEmitterManagerLike | null
): ParticleEmitter | null {
  if (!manager) return null
  if (manager.__emitter) return manager.__emitter
  const emitters = (manager as unknown as { emitters?: { list?: unknown[] } | unknown[] }).emitters
  if (Array.isArray(emitters)) {
    return (emitters[0] as ParticleEmitter) ?? null
  }
  if (emitters && 'list' in emitters && Array.isArray(emitters.list)) {
    return (emitters.list[0] as ParticleEmitter) ?? null
  }
  return null
}

export function applyEmitterConfig(
  emitter: ParticleEmitter | null,
  config: ParticleEmitterConfig
): void {
  if (!emitter) return
  const withConfig = emitter as Phaser.GameObjects.Particles.ParticleEmitter & {
    setConfig?: (config: ParticleEmitterConfig) => void
    fromJSON?: (config: ParticleEmitterConfig) => void
  }

  if (withConfig.setConfig) {
    withConfig.setConfig(config)
    return
  }

  if (withConfig.fromJSON) {
    withConfig.fromJSON(config)
    return
  }

  Object.assign(emitter, config)
}

export function applyEmitZone(
  emitter: ParticleEmitter | null,
  emitZone: EmitZoneConfig | undefined
): void {
  if (!emitter || !emitZone) return
  const withZone = emitter as Phaser.GameObjects.Particles.ParticleEmitter & {
    setEmitZone?: (config: EmitZoneConfig) => void
  }

  if (withZone.setEmitZone) {
    withZone.setEmitZone(emitZone)
    return
  }
}
