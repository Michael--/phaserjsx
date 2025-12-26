/**
 * Applier for Particles-specific properties
 */
import { buildDeathZonesFromLayout, buildEmitZoneFromLayout } from '../../particles/emit-zone'
import type {
  ParticleEmitter,
  ParticleEmitterManagerLike,
  ParticlesHandle,
} from '../../particles/particle-types'
import { resolveParticlePreset } from '../../particles/preset-registry'
import {
  applyDeathZone,
  applyEmitZone,
  applyEmitterConfig,
  getFirstEmitter,
  isParticleEmitter,
  mergeDeathZones,
} from '../../particles/utils'
import type { ParticlesBaseProps } from '../primitives/particles'

/**
 * Applies particle props updates (texture, emitter config, emit zone)
 */
export function applyParticlesProps(
  manager: ParticlesHandle,
  prev: Partial<ParticlesBaseProps>,
  next: Partial<ParticlesBaseProps>
): void {
  if (!manager) return

  const textureChanged = prev.texture !== next.texture || prev.frame !== next.frame
  if (textureChanged && next.texture && 'setTexture' in manager && manager.setTexture) {
    manager.setTexture(next.texture, next.frame)
  }

  const configChanged =
    prev.preset !== next.preset ||
    prev.config !== next.config ||
    prev.zone !== next.zone ||
    prev.excludeZones !== next.excludeZones ||
    prev.width !== next.width ||
    prev.height !== next.height

  if (configChanged) {
    const resolvedConfig = resolveParticlePreset(next.preset, next.config)
    let emitter: ParticleEmitter | null = null

    if (isParticleEmitter(manager)) {
      emitter = manager
    } else {
      const managerLike = manager as ParticleEmitterManagerLike
      emitter = managerLike.__emitter ?? getFirstEmitter(managerLike)
      if (!emitter && managerLike.createEmitter) {
        const created = managerLike.createEmitter(resolvedConfig)
        emitter = (created as ParticleEmitter | void) ?? null
      }
      managerLike.__emitter = emitter
    }

    if (!emitter) return

    applyEmitterConfig(emitter, resolvedConfig)

    if (next.zone) {
      const emitZone = buildEmitZoneFromLayout(next.zone, next.width, next.height)
      if (emitZone) {
        applyEmitZone(emitter, emitZone)
      }
    }

    const deathZones = buildDeathZonesFromLayout(next.excludeZones, next.width, next.height)
    const combined = mergeDeathZones(
      (resolvedConfig as unknown as { deathZone?: unknown }).deathZone,
      deathZones
    ) as Parameters<typeof applyDeathZone>[1]
    applyDeathZone(emitter, combined)
  }
}
