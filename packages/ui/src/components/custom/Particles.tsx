/** @jsxImportSource ../.. */
/**
 * Particles component wrapper - typed wrapper around primitive particles
 */
import type { VNodeLike } from '@number10/phaserjsx/vdom'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import type { PropsDefaultExtension } from '../../types'
import type { ParticleEmitterConfig, ParticlePresetName } from '../../particles/preset-registry'
import type { ParticleZoneConfig } from '../../particles/emit-zone'
import type { ParticlesHandle } from '../../particles/particle-types'

export interface ParticlesProps
  extends TransformProps,
    PhaserProps,
    Omit<LayoutProps, 'direction' | 'justifyContent' | 'alignItems' | 'gap' | 'flexWrap'>,
    PropsDefaultExtension<ParticlesHandle> {
  texture: string
  frame?: string | number
  preset?: ParticlePresetName
  config?: ParticleEmitterConfig
  zone?: ParticleZoneConfig
}

export function Particles(props: ParticlesProps): VNodeLike {
  return <particles {...props} />
}
