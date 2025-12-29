/**
 * Emit zone helpers for particle emitters
 */
import * as Phaser from 'phaser'
import type { SizeValue } from '../core-props'

/**
 * Supported zone shapes
 */
export type ParticleZoneShape = 'rect' | 'circle' | 'ellipse' | 'line'

/**
 * Supported death zone modes
 */
export type ParticleDeathZoneMode = 'onEnter' | 'onLeave'

type ZoneConfigBase = {
  shape: ParticleZoneShape
  width?: number
  height?: number
  radius?: number
  x?: number
  y?: number
  endX?: number
  endY?: number
}

/**
 * Emit zone config
 */
export interface ParticleZoneConfig extends ZoneConfigBase {
  type?: 'random' | 'edge'
}

/**
 * Exclusion zone config
 * Death zones use particle world positions for evaluation,
 * but coordinates should be specified relative to the emitter position
 */
export interface ParticleExclusionZoneConfig extends ZoneConfigBase {
  /**
   * Death zone mode - evaluated using particle world positions
   */
  mode?: ParticleDeathZoneMode
}

export type EmitZoneConfig = {
  type: 'random' | 'edge'
  source: Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Ellipse | Phaser.Geom.Line
}

export type DeathZoneConfig = {
  type: ParticleDeathZoneMode
  source: Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Ellipse | Phaser.Geom.Line
}

type ZoneSize = { width?: number; height?: number }

function resolveNumericSize(value?: SizeValue): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function resolveZoneSize(zone: ZoneConfigBase, fallback: ZoneSize): ZoneSize {
  const size: ZoneSize = {}
  const width = zone.width ?? fallback.width
  const height = zone.height ?? fallback.height
  if (width !== undefined) size.width = width
  if (height !== undefined) size.height = height
  return size
}

function buildZoneSource(
  zone: ZoneConfigBase,
  fallbackSize: ZoneSize
): Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Ellipse | Phaser.Geom.Line | undefined {
  const baseX = zone.x ?? 0
  const baseY = zone.y ?? 0
  const { width, height } = resolveZoneSize(zone, fallbackSize)

  switch (zone.shape) {
    case 'rect':
      return new Phaser.Geom.Rectangle(baseX, baseY, width ?? 1, height ?? 1)
    case 'circle':
      return new Phaser.Geom.Circle(baseX, baseY, zone.radius ?? 1)
    case 'ellipse':
      return new Phaser.Geom.Ellipse(baseX, baseY, width ?? 1, height ?? 1)
    case 'line':
      return new Phaser.Geom.Line(
        baseX,
        baseY,
        zone.endX ?? baseX + (width ?? 1),
        zone.endY ?? baseY + (height ?? 1)
      )
    default:
      return undefined
  }
}

/**
 * Build a Phaser emitZone config from a lightweight zone definition
 */
export function buildEmitZone(
  zone: ParticleZoneConfig,
  fallbackSize: ZoneSize = {}
): EmitZoneConfig | undefined {
  const type = zone.type ?? 'random'
  const source = buildZoneSource(zone, fallbackSize)

  if (!source) return undefined

  return { type, source }
}

/**
 * Create an emit zone using layout size as a fallback
 */
export function buildEmitZoneFromLayout(
  zone: ParticleZoneConfig,
  width?: SizeValue,
  height?: SizeValue
): EmitZoneConfig | undefined {
  const fallback: ZoneSize = {}
  const resolvedWidth = resolveNumericSize(width)
  const resolvedHeight = resolveNumericSize(height)
  if (resolvedWidth !== undefined) fallback.width = resolvedWidth
  if (resolvedHeight !== undefined) fallback.height = resolvedHeight
  return buildEmitZone(zone, fallback)
}

/**
 * Build a Phaser deathZone config from a lightweight exclusion definition
 */
export function buildDeathZone(
  zone: ParticleExclusionZoneConfig,
  fallbackSize: ZoneSize = {}
): DeathZoneConfig | undefined {
  const type = zone.mode ?? 'onEnter'

  // Zones are in container-relative coordinates
  // No need to adjust since emitter is at container origin (0,0) with origin(0,0)
  const source = buildZoneSource(zone, fallbackSize)

  if (!source) return undefined

  return { type, source }
}

/**
 * Create death zones using layout size as a fallback
 */
export function buildDeathZonesFromLayout(
  zones: ParticleExclusionZoneConfig | ParticleExclusionZoneConfig[] | undefined,
  width?: SizeValue,
  height?: SizeValue
): DeathZoneConfig[] | undefined {
  if (!zones) return undefined
  const list = Array.isArray(zones) ? zones : [zones]
  const fallback: ZoneSize = {}
  const resolvedWidth = resolveNumericSize(width)
  const resolvedHeight = resolveNumericSize(height)
  if (resolvedWidth !== undefined) fallback.width = resolvedWidth
  if (resolvedHeight !== undefined) fallback.height = resolvedHeight

  const deathZones = list
    .map((zone) => buildDeathZone(zone, fallback))
    .filter((zone): zone is DeathZoneConfig => Boolean(zone))

  return deathZones.length > 0 ? deathZones : undefined
}
