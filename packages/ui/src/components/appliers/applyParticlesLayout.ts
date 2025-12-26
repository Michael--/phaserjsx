/**
 * Layout applier for Particles components
 */
import type { LayoutProps } from '../../core-props'
import type { ParticlesHandle } from '../../particles/particle-types'
import type { ParticlesBaseProps } from '../primitives/particles'

/**
 * Applies layout props for Particles
 * Particles are always headless (minimal size)
 */
export function applyParticlesLayout(
  particles: ParticlesHandle & {
    __layoutProps?: ParticlesBaseProps
  },
  _prev: Partial<ParticlesBaseProps & LayoutProps>,
  next: Partial<ParticlesBaseProps & LayoutProps>
): void {
  particles.__layoutProps = next as ParticlesBaseProps
}
