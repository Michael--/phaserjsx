/**
 * Particle utilities shared across hooks/components
 */
import type * as Phaser from 'phaser'
import type { DeathZoneConfig, EmitZoneConfig } from './emit-zone'
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

export function applyDeathZone(
  emitter: ParticleEmitter | null,
  deathZone: DeathZoneConfig | DeathZoneConfig[] | undefined
): void {
  if (!emitter) return
  const withZone = emitter as Phaser.GameObjects.Particles.ParticleEmitter & {
    setDeathZone?: (config: DeathZoneConfig | DeathZoneConfig[]) => void
    addDeathZone?: (config: DeathZoneConfig | DeathZoneConfig[]) => void
    clearDeathZones?: () => void
    deathZones?: unknown[]
  }

  const isDefined = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined
  const normalized = Array.isArray(deathZone)
    ? deathZone.filter(isDefined)
    : deathZone
      ? [deathZone]
      : []
  const hasZone = normalized.length > 0

  if (hasZone && withZone.setDeathZone) {
    withZone.setDeathZone(normalized)
    return
  }

  if (!hasZone) {
    if (withZone.clearDeathZones) {
      withZone.clearDeathZones()
      return
    }
    if (withZone.deathZones) {
      withZone.deathZones = []
    }
    return
  }

  if (withZone.clearDeathZones) {
    withZone.clearDeathZones()
  }
  if (withZone.addDeathZone) {
    withZone.addDeathZone(normalized)
    return
  }
  if (withZone.deathZones) {
    ;(withZone as unknown as { deathZones?: unknown[] }).deathZones = normalized
  }
}

export function mergeDeathZones(
  base: unknown | unknown[] | undefined,
  extra: unknown[] | undefined
): unknown[] | undefined {
  const baseList = Array.isArray(base) ? base : base ? [base] : []
  const extraList = extra ?? []
  const merged = [...baseList, ...extraList]
  return merged.length > 0 ? merged : undefined
}
