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
import type { ParticleDeathZoneConfig, ParticleZoneConfig } from '../../particles/emit-zone'
import { buildDeathZonesFromLayout, buildEmitZoneFromLayout } from '../../particles/emit-zone'
import type { ParticleEmitterManagerLike, ParticlesHandle } from '../../particles/particle-types'
import type { ParticleEmitterConfig, ParticlePresetName } from '../../particles/preset-registry'
import { resolveParticlePreset } from '../../particles/preset-registry'
import {
  applyDeathZone,
  getFirstEmitter,
  isParticleEmitter,
  mergeDeathZones,
} from '../../particles/utils'
import type { PropsDefaultExtension } from '../../types'
import { applyParticlesProps } from '../appliers/applyParticles'
import { applyParticlesLayout } from '../appliers/applyParticlesLayout'
import { applyPhaserProps } from '../appliers/applyPhaser'
import { applyTransformProps } from '../appliers/applyTransform'
import { createParticlesLayout } from '../creators/createParticlesLayout'
import { createPhaser } from '../creators/createPhaser'
import { createTransform } from '../creators/createTransform'

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

  /** Optional emit zone: where particles are born */
  emitZone?: ParticleZoneConfig

  /**
   * Optional emit zone: where particles are born.
   * @deprecated Use emitZone.
   */
  zone?: ParticleZoneConfig

  /** Optional death zones: where particles are removed */
  deathZones?: ParticleDeathZoneConfig | ParticleDeathZoneConfig[] | undefined

  /**
   * Optional death zones: where particles are removed.
   * @deprecated Use deathZones.
   */
  excludeZones?: ParticleDeathZoneConfig | ParticleDeathZoneConfig[] | undefined
}

/**
 * Props for primitive Particles component (internal use only)
 */
export interface ParticlesPrimitiveProps
  extends ParticlesBaseProps, PropsDefaultExtension<ParticlesHandle> {}

/**
 * Particles creator - creates a Phaser ParticleEmitterManager with a single emitter
 */
export const particlesCreator: HostCreator<'Particles'> = (scene, props) => {
  const resolvedConfig = {
    ...resolveParticlePreset(props.preset, props.config),
  } as ParticleEmitterConfig

  const emitZoneProps = props.emitZone ?? props.zone
  const deathZoneProps = props.deathZones ?? props.excludeZones

  if (emitZoneProps) {
    const emitZone = buildEmitZoneFromLayout(emitZoneProps, props.width, props.height)
    if (emitZone) {
      const configWithZone = resolvedConfig as unknown as { emitZone?: unknown }
      configWithZone.emitZone = emitZone
    }
  }

  // Don't set death zones yet - will be applied after transform

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

  // Set origin to (0, 0) for consistent coordinate system (top-left)
  if ('setOrigin' in particles && typeof particles.setOrigin === 'function') {
    particles.setOrigin(0, 0)
  }

  // Apply transform props
  createTransform(particles, props)

  // Apply Phaser display props (alpha, depth, visible)
  createPhaser(particles, props)

  // Setup layout system (headless)
  createParticlesLayout(particles, props)

  // Now apply death zones with container-relative coordinates
  if (deathZoneProps && emitter) {
    const deathZones = buildDeathZonesFromLayout(deathZoneProps, props.width, props.height)
    const combinedDeathZones = mergeDeathZones(
      (resolvedConfig as unknown as { deathZone?: unknown }).deathZone,
      deathZones
    )
    if (combinedDeathZones) {
      applyDeathZone(emitter, combinedDeathZones as Parameters<typeof applyDeathZone>[1])
    }
  }

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
