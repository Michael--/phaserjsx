/**
 * Layout creator for Particles components
 */
import type { LayoutSize } from '../../layout/index'
import type { ParticlesHandle } from '../../particles/particle-types'
import type { ParticlesBaseProps } from '../primitives/particles'

/**
 * Creates layout infrastructure for a Particles component
 * Particles are always headless (minimal size)
 * @param particles - Phaser ParticleEmitterManager
 * @param props - Particle props
 */
export function createParticlesLayout(
  particles: ParticlesHandle & {
    __layoutProps?: ParticlesBaseProps
    __getLayoutSize?: () => LayoutSize
  },
  props: Partial<ParticlesBaseProps>
): void {
  particles.__layoutProps = props as ParticlesBaseProps
  particles.__getLayoutSize = () => ({ width: 0.01, height: 0.01 })
}
