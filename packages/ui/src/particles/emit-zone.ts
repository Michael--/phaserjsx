/**
 * Emit zone helpers for particle emitters
 */
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
 * Death zone config
 * Death zones use particle world positions for evaluation,
 * but coordinates should be specified relative to the emitter position
 */
export interface ParticleDeathZoneConfig extends ZoneConfigBase {
  /**
   * Death zone mode - evaluated using particle world positions.
   * - onEnter: remove particles when they enter the zone.
   * - onLeave: remove particles when they leave the zone.
   */
  mode?: ParticleDeathZoneMode
}

/**
 * @deprecated Use ParticleDeathZoneConfig.
 */
export type ParticleExclusionZoneConfig = ParticleDeathZoneConfig

type PointLike = { x: number; y: number }
type TransformMatrixLike = {
  applyInverse: (x: number, y: number) => PointLike
}
export type ParticleZoneTransformOwner = {
  getWorldTransformMatrix?: () => TransformMatrixLike
}

export type ParticleZoneSource = {
  x?: number
  y?: number
  width?: number
  height?: number
  radius?: number
  contains: (x: number, y: number) => boolean
  getRandomPoint: (point?: PointLike) => PointLike
  getPoints: (quantity?: number, stepRate?: number) => PointLike[]
}

export type EmitZoneConfig = {
  type: 'random' | 'edge'
  source: ParticleZoneSource
}

export type DeathZoneConfig = {
  type: ParticleDeathZoneMode
  source: ParticleZoneSource
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

function withPoint(point: PointLike | undefined, x: number, y: number): PointLike {
  if (point) {
    point.x = x
    point.y = y
    return point
  }

  return { x, y }
}

function createRectSource(x: number, y: number, width: number, height: number): ParticleZoneSource {
  return {
    x,
    y,
    width,
    height,
    contains: (px, py) => px >= x && px <= x + width && py >= y && py <= y + height,
    getRandomPoint: (point) =>
      withPoint(point, x + Math.random() * width, y + Math.random() * height),
    getPoints: (quantity = 1) => {
      const count = Math.max(1, quantity)
      return Array.from({ length: count }, (_, index) => {
        const progress = count === 1 ? 0 : index / (count - 1)
        const perimeter = 2 * (width + height)
        const distance = progress * perimeter

        if (distance <= width) return { x: x + distance, y }
        if (distance <= width + height) return { x: x + width, y: y + distance - width }
        if (distance <= width * 2 + height) {
          return { x: x + width - (distance - width - height), y: y + height }
        }
        return { x, y: y + height - (distance - width * 2 - height) }
      })
    },
  }
}

function createCircleSource(x: number, y: number, radius: number): ParticleZoneSource {
  return {
    x,
    y,
    radius,
    contains: (px, py) => {
      const dx = px - x
      const dy = py - y
      return dx * dx + dy * dy <= radius * radius
    },
    getRandomPoint: (point) => {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.sqrt(Math.random()) * radius
      return withPoint(point, x + Math.cos(angle) * distance, y + Math.sin(angle) * distance)
    },
    getPoints: (quantity = 1) => {
      const count = Math.max(1, quantity)
      return Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2
        return { x: x + Math.cos(angle) * radius, y: y + Math.sin(angle) * radius }
      })
    },
  }
}

function createEllipseSource(
  x: number,
  y: number,
  width: number,
  height: number
): ParticleZoneSource {
  const radiusX = width / 2
  const radiusY = height / 2

  return {
    x,
    y,
    width,
    height,
    contains: (px, py) => {
      const dx = (px - x) / radiusX
      const dy = (py - y) / radiusY
      return dx * dx + dy * dy <= 1
    },
    getRandomPoint: (point) => {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.sqrt(Math.random())
      return withPoint(
        point,
        x + Math.cos(angle) * radiusX * distance,
        y + Math.sin(angle) * radiusY * distance
      )
    },
    getPoints: (quantity = 1) => {
      const count = Math.max(1, quantity)
      return Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2
        return { x: x + Math.cos(angle) * radiusX, y: y + Math.sin(angle) * radiusY }
      })
    },
  }
}

function createLineSource(x: number, y: number, endX: number, endY: number): ParticleZoneSource {
  return {
    x,
    y,
    contains: (px, py) => {
      const lengthSquared = (endX - x) ** 2 + (endY - y) ** 2
      if (lengthSquared === 0) return px === x && py === y

      const progress = Math.max(
        0,
        Math.min(1, ((px - x) * (endX - x) + (py - y) * (endY - y)) / lengthSquared)
      )
      const closestX = x + progress * (endX - x)
      const closestY = y + progress * (endY - y)
      return Math.hypot(px - closestX, py - closestY) <= 0.5
    },
    getRandomPoint: (point) => {
      const progress = Math.random()
      return withPoint(point, x + (endX - x) * progress, y + (endY - y) * progress)
    },
    getPoints: (quantity = 1) => {
      const count = Math.max(1, quantity)
      return Array.from({ length: count }, (_, index) => {
        const progress = count === 1 ? 0 : index / (count - 1)
        return { x: x + (endX - x) * progress, y: y + (endY - y) * progress }
      })
    },
  }
}

function buildZoneSource(
  zone: ZoneConfigBase,
  fallbackSize: ZoneSize
): ParticleZoneSource | undefined {
  const baseX = zone.x ?? 0
  const baseY = zone.y ?? 0
  const { width, height } = resolveZoneSize(zone, fallbackSize)

  switch (zone.shape) {
    case 'rect':
      return createRectSource(baseX, baseY, width ?? 1, height ?? 1)
    case 'circle':
      return createCircleSource(baseX, baseY, zone.radius ?? 1)
    case 'ellipse':
      return createEllipseSource(baseX, baseY, width ?? 1, height ?? 1)
    case 'line':
      return createLineSource(
        baseX,
        baseY,
        zone.endX ?? baseX + (width ?? 1),
        zone.endY ?? baseY + (height ?? 1)
      )
    default:
      return undefined
  }
}

function getTransformOwner(value: unknown): ParticleZoneTransformOwner | undefined {
  if (!value || typeof value !== 'object') return undefined
  if (typeof (value as ParticleZoneTransformOwner).getWorldTransformMatrix !== 'function') {
    return undefined
  }
  return value as ParticleZoneTransformOwner
}

function createLocalDeathZoneSource(
  source: ParticleZoneSource,
  owner?: unknown
): ParticleZoneSource {
  const transformOwner = getTransformOwner(owner)
  if (!transformOwner) return source

  return {
    ...source,
    contains: (worldX, worldY) => {
      const matrix = transformOwner.getWorldTransformMatrix?.()
      if (!matrix) return source.contains(worldX, worldY)

      const localPoint = matrix.applyInverse(worldX, worldY)
      return source.contains(localPoint.x, localPoint.y)
    },
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
 * Build a Phaser deathZone config from a lightweight death zone definition
 */
export function buildDeathZone(
  zone: ParticleDeathZoneConfig,
  fallbackSize: ZoneSize = {},
  owner?: unknown
): DeathZoneConfig | undefined {
  const type = zone.mode ?? 'onEnter'
  const source = buildZoneSource(zone, fallbackSize)

  if (!source) return undefined

  return { type, source: createLocalDeathZoneSource(source, owner) }
}

/**
 * Create death zones using layout size as a fallback
 */
export function buildDeathZonesFromLayout(
  zones: ParticleDeathZoneConfig | ParticleDeathZoneConfig[] | undefined,
  width?: SizeValue,
  height?: SizeValue,
  owner?: unknown
): DeathZoneConfig[] | undefined {
  if (!zones) return undefined
  const list = Array.isArray(zones) ? zones : [zones]
  const fallback: ZoneSize = {}
  const resolvedWidth = resolveNumericSize(width)
  const resolvedHeight = resolveNumericSize(height)
  if (resolvedWidth !== undefined) fallback.width = resolvedWidth
  if (resolvedHeight !== undefined) fallback.height = resolvedHeight

  const deathZones = list
    .map((zone) => buildDeathZone(zone, fallback, owner))
    .filter((zone): zone is DeathZoneConfig => Boolean(zone))

  return deathZones.length > 0 ? deathZones : undefined
}
