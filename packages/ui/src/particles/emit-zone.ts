/**
 * Emit zone helpers for particle emitters
 */
import Phaser from 'phaser'
import type { SizeValue } from '../core-props'

/**
 * Supported zone shapes
 */
export type ParticleZoneShape = 'rect' | 'circle' | 'ellipse' | 'line'

/**
 * Emit zone config
 */
export interface ParticleZoneConfig {
  shape: ParticleZoneShape
  type?: 'random' | 'edge'
  width?: number
  height?: number
  radius?: number
  x?: number
  y?: number
  endX?: number
  endY?: number
}

export type EmitZoneConfig = {
  type: 'random' | 'edge'
  source: Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Ellipse | Phaser.Geom.Line
}

type ZoneSize = { width?: number; height?: number }

function resolveNumericSize(value?: SizeValue): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function resolveZoneSize(zone: ParticleZoneConfig, fallback: ZoneSize): ZoneSize {
  const size: ZoneSize = {}
  const width = zone.width ?? fallback.width
  const height = zone.height ?? fallback.height
  if (width !== undefined) size.width = width
  if (height !== undefined) size.height = height
  return size
}

/**
 * Build a Phaser emitZone config from a lightweight zone definition
 */
export function buildEmitZone(
  zone: ParticleZoneConfig,
  fallbackSize: ZoneSize = {}
): EmitZoneConfig | undefined {
  const type = zone.type ?? 'random'
  const baseX = zone.x ?? 0
  const baseY = zone.y ?? 0
  const { width, height } = resolveZoneSize(zone, fallbackSize)

  switch (zone.shape) {
    case 'rect': {
      const rect = new Phaser.Geom.Rectangle(baseX, baseY, width ?? 1, height ?? 1)
      return { type, source: rect }
    }
    case 'circle': {
      const circle = new Phaser.Geom.Circle(baseX, baseY, zone.radius ?? 1)
      return { type, source: circle }
    }
    case 'ellipse': {
      const ellipse = new Phaser.Geom.Ellipse(baseX, baseY, width ?? 1, height ?? 1)
      return { type, source: ellipse }
    }
    case 'line': {
      const line = new Phaser.Geom.Line(
        baseX,
        baseY,
        zone.endX ?? baseX + (width ?? 1),
        zone.endY ?? baseY + (height ?? 1)
      )
      return { type, source: line }
    }
    default:
      return undefined
  }
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
