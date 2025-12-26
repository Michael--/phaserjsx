/**
 * Particles component - Phaser ParticleEmitterManager wrapper
 * Status: IMPLEMENTED ✅
 *
 * Design Overview:
 * ================
 * - Always headless (does not affect layout)
 * - Emits particles via a single emitter (configurable)
 * - Optional emit zone support (rect, circle, ellipse, line)
 */
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import type { HostCreator, HostPatcher } from '../../host'
import type { PropsDefaultExtension } from '../../types'
import { buildEmitZoneFromLayout } from '../../particles/emit-zone'
import type { ParticleEmitterManagerLike, ParticlesHandle } from '../../particles/particle-types'
import type { ParticleEmitterConfig, ParticlePresetName } from '../../particles/preset-registry'
import { resolveParticlePreset } from '../../particles/preset-registry'
import { getFirstEmitter, isParticleEmitter } from '../../particles/utils'
import { applyParticlesProps } from '../appliers/applyParticles'
import { applyParticlesLayout } from '../appliers/applyParticlesLayout'
import { applyPhaserProps } from '../appliers/applyPhaser'
import { applyTransformProps } from '../appliers/applyTransform'
import { createParticlesLayout } from '../creators/createParticlesLayout'
import { createPhaser } from '../creators/createPhaser'
import { createTransform } from '../creators/createTransform'
import type { ParticleZoneConfig } from '../../particles/emit-zone'

/**
 * Base props for Particles component
 */
export interface ParticlesBaseProps extends TransformProps, PhaserProps, LayoutProps {
  /** Texture key (loaded via Phaser's texture manager) */
  texture: string

  /** Optional frame from texture atlas or spritesheet */
  frame?: string | number

  /** Built-in preset name */
  preset?: ParticlePresetName

  /** Optional emitter config overrides */
  config?: ParticleEmitterConfig

  /** Optional emit zone */
  zone?: ParticleZoneConfig
}

/**
 * Props for primitive Particles component (internal use only)
 */
export interface ParticlesPrimitiveProps
  extends ParticlesBaseProps,
    PropsDefaultExtension<ParticlesHandle> {}

/**
 * Particles creator - creates a Phaser ParticleEmitterManager with a single emitter
 */
export const particlesCreator: HostCreator<'Particles'> = (scene, props) => {
  const resolvedConfig = {
    ...resolveParticlePreset(props.preset, props.config),
  } as ParticleEmitterConfig

  if (props.zone) {
    const emitZone = buildEmitZoneFromLayout(props.zone, props.width, props.height)
    if (emitZone) {
      const configWithZone = resolvedConfig as unknown as { emitZone?: unknown }
      configWithZone.emitZone = emitZone
    }
  }

  const particles = scene.add.particles(
    props.x ?? 0,
    props.y ?? 0,
    props.texture,
    resolvedConfig
  ) as unknown as ParticlesHandle
  if (props.frame !== undefined) {
    const configWithFrame = resolvedConfig as unknown as { frame?: string | number }
    configWithFrame.frame = props.frame
    if ('setTexture' in particles && particles.setTexture) {
      particles.setTexture(props.texture, props.frame)
    }
  }

  const emitter = isParticleEmitter(particles)
    ? particles
    : getFirstEmitter(particles as ParticleEmitterManagerLike)

  if (!isParticleEmitter(particles)) {
    ;(particles as ParticleEmitterManagerLike).__emitter = emitter
  }

  // Apply transform props
  createTransform(particles, props)

  // Apply Phaser display props (alpha, depth, visible)
  createPhaser(particles, props)

  // Setup layout system (headless)
  createParticlesLayout(particles, props)

  // Call onReady callback if provided
  if (props.onReady) {
    props.onReady(particles)
  }

  return particles
}

/**
 * Particles patcher - updates ParticleEmitterManager properties
 */
export const particlesPatcher: HostPatcher<'Particles'> = (node, prev, next) => {
  // Apply transform props
  applyTransformProps(node, prev, next)

  // Apply Phaser display props
  applyPhaserProps(node, prev, next)

  // Apply particle-specific props
  applyParticlesProps(node, prev, next)

  // Apply layout props
  applyParticlesLayout(node, prev, next)
}
