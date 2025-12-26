/**
 * Hook for imperative particle control
 */
import { useCallback } from '../hooks'
import type { RefObject } from '../types'
import { buildEmitZoneFromLayout, type ParticleZoneConfig } from './emit-zone'
import type { ParticleEmitter, ParticleEmitterManagerLike, ParticlesHandle } from './particle-types'
import type { ParticleEmitterConfig } from './preset-registry'
import { applyEmitZone, applyEmitterConfig, getFirstEmitter, isParticleEmitter } from './utils'

export function useParticles(ref: RefObject<ParticlesHandle | null>): {
  getManager: () => ParticlesHandle | null
  getEmitter: () => ParticleEmitter | null
  start: () => void
  stop: () => void
  explode: (count: number, x?: number, y?: number) => void
  setConfig: (config: ParticleEmitterConfig) => void
  setEmitZone: (zone: ParticleZoneConfig, width?: number, height?: number) => void
} {
  const getManager = useCallback(() => ref.current ?? null, [ref])
  const getEmitter = useCallback(() => {
    const current = ref.current
    if (!current) return null
    if (isParticleEmitter(current)) return current
    return getFirstEmitter(current as ParticleEmitterManagerLike)
  }, [ref])

  const start = useCallback(() => {
    const emitter = getEmitter()
    emitter?.start()
  }, [getEmitter])

  const stop = useCallback(() => {
    const emitter = getEmitter()
    emitter?.stop()
  }, [getEmitter])

  const explode = useCallback(
    (count: number, x?: number, y?: number) => {
      const emitter = getEmitter()
      emitter?.explode(count, x, y)
    },
    [getEmitter]
  )

  const setConfig = useCallback(
    (config: ParticleEmitterConfig) => {
      const emitter = getEmitter()
      applyEmitterConfig(emitter, config)
    },
    [getEmitter]
  )

  const setEmitZone = useCallback(
    (zone: ParticleZoneConfig, width?: number, height?: number) => {
      const emitter = getEmitter()
      const emitZone = buildEmitZoneFromLayout(zone, width, height)
      applyEmitZone(emitter, emitZone)
    },
    [getEmitter]
  )

  return { getManager, getEmitter, start, stop, explode, setConfig, setEmitZone }
}
