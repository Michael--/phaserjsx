/** @jsxImportSource ../.. */
/**
 * Particles component wrapper - typed wrapper around primitive particles
 */
import type { VNodeLike } from '@number10/phaserjsx/vdom'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import type { ParticleDeathZoneConfig, ParticleZoneConfig } from '../../particles/emit-zone'
import type { ParticlesHandle } from '../../particles/particle-types'
import type { ParticleEmitterConfig, ParticlePresetName } from '../../particles/preset-registry'
import type { PropsDefaultExtension } from '../../types'

export interface ParticlesProps
  extends
    TransformProps,
    PhaserProps,
    Omit<LayoutProps, 'direction' | 'justifyContent' | 'alignItems' | 'gap' | 'flexWrap'>,
    PropsDefaultExtension<ParticlesHandle> {
  texture: string
  frame?: string | number
  preset?: ParticlePresetName
  config?: ParticleEmitterConfig
  /** Where particles are born */
  emitZone?: ParticleZoneConfig
  /**
   * Where particles are born.
   * @deprecated Use emitZone.
   */
  zone?: ParticleZoneConfig
  /** Where particles are removed */
  deathZones?: ParticleDeathZoneConfig | ParticleDeathZoneConfig[] | undefined
  /**
   * Where particles are removed.
   * @deprecated Use deathZones.
   */
  excludeZones?: ParticleDeathZoneConfig | ParticleDeathZoneConfig[] | undefined
}

export function Particles(props: ParticlesProps): VNodeLike {
  return <particles {...props} />
}
