import * as Phaser from 'phaser'
import type { BackgroundProps } from '../core-props'

export type BackgroundImage = Phaser.GameObjects.Image & {
  __isBackground?: boolean
  __backgroundCacheKey?: string
  __backgroundTextureKey?: string
  __backgroundTextureReleased?: boolean
}

type BackgroundTextureCacheEntry = {
  textureKey: string
  refs: number
}

const sceneBackgroundTextureCaches = new WeakMap<
  Phaser.Scene,
  Map<string, BackgroundTextureCacheEntry>
>()

type CornerRadius = NonNullable<BackgroundProps['cornerRadius']>

function hasRenderableBackground(props: Partial<BackgroundProps>): boolean {
  const hasBackground = props.backgroundColor !== undefined
  const hasBorder = (props.borderWidth ?? 0) > 0 && props.borderColor !== undefined
  return hasBackground || hasBorder
}

function hasRoundedCorners(radius: CornerRadius): boolean {
  if (typeof radius === 'number') {
    return radius !== 0
  }

  return (
    (radius.tl ?? 0) !== 0 ||
    (radius.tr ?? 0) !== 0 ||
    (radius.bl ?? 0) !== 0 ||
    (radius.br ?? 0) !== 0
  )
}

function insetCornerRadius(radius: CornerRadius, inset: number): CornerRadius {
  const insetSingleRadius = (value: number | undefined): number => {
    const resolved = value ?? 0
    const sign = resolved < 0 ? -1 : 1
    return sign * Math.max(0, Math.abs(resolved) - inset)
  }

  if (typeof radius === 'number') {
    return insetSingleRadius(radius)
  }

  return {
    tl: insetSingleRadius(radius.tl),
    tr: insetSingleRadius(radius.tr),
    bl: insetSingleRadius(radius.bl),
    br: insetSingleRadius(radius.br),
  }
}

function drawBackground(
  graphics: Phaser.GameObjects.Graphics,
  props: Partial<BackgroundProps>,
  width: number,
  height: number
): void {
  const bgColor = props.backgroundColor
  const bgAlpha = props.backgroundAlpha ?? 1
  const cornerRadius = props.cornerRadius ?? 0
  const borderColor = props.borderColor
  const borderWidth = props.borderWidth ?? 0
  const borderAlpha = props.borderAlpha ?? 1
  const hasBorder = borderWidth > 0 && borderColor !== undefined
  const rounded = hasRoundedCorners(cornerRadius)

  if (bgColor !== undefined) {
    graphics.fillStyle(bgColor, bgAlpha)
  }

  if (hasBorder) {
    graphics.lineStyle(borderWidth, borderColor, borderAlpha)
  }

  if (rounded) {
    if (bgColor !== undefined) {
      graphics.fillRoundedRect(0, 0, width, height, cornerRadius)
    }
    if (hasBorder) {
      const inset = borderWidth / 2
      graphics.strokeRoundedRect(
        inset,
        inset,
        Math.max(0, width - borderWidth),
        Math.max(0, height - borderWidth),
        insetCornerRadius(cornerRadius, inset)
      )
    }
  } else {
    if (bgColor !== undefined) {
      graphics.fillRect(0, 0, width, height)
    }
    if (hasBorder) {
      const inset = borderWidth / 2
      graphics.strokeRect(
        inset,
        inset,
        Math.max(0, width - borderWidth),
        Math.max(0, height - borderWidth)
      )
    }
  }
}

function getSceneBackgroundTextureCache(
  scene: Phaser.Scene
): Map<string, BackgroundTextureCacheEntry> {
  let cache = sceneBackgroundTextureCaches.get(scene)

  if (!cache) {
    cache = new Map()
    sceneBackgroundTextureCaches.set(scene, cache)
  }

  return cache
}

function hashCacheKey(value: string): string {
  let hash = 2166136261

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0).toString(36)
}

function normalizeCornerRadius(radius: BackgroundProps['cornerRadius']): string {
  if (typeof radius === 'number') {
    return String(radius)
  }

  if (!radius) {
    return '0'
  }

  return `${radius.tl ?? 0},${radius.tr ?? 0},${radius.bl ?? 0},${radius.br ?? 0}`
}

export function getBackgroundImageCacheKey(
  props: Partial<BackgroundProps>,
  width: number,
  height: number
): string {
  const textureWidth = Math.max(1, Math.ceil(width))
  const textureHeight = Math.max(1, Math.ceil(height))
  return [
    textureWidth,
    textureHeight,
    props.backgroundColor ?? 'none',
    props.backgroundAlpha ?? 1,
    normalizeCornerRadius(props.cornerRadius),
    props.borderWidth ?? 0,
    props.borderColor ?? 'none',
    props.borderAlpha ?? 1,
  ].join('|')
}

export function createBackgroundImage(
  scene: Phaser.Scene,
  props: Partial<BackgroundProps>,
  width: number,
  height: number
): BackgroundImage | undefined {
  if (!hasRenderableBackground(props)) {
    return undefined
  }

  const textureWidth = Math.max(1, Math.ceil(width))
  const textureHeight = Math.max(1, Math.ceil(height))
  const cacheKey = getBackgroundImageCacheKey(props, textureWidth, textureHeight)
  const textureKey = `__phaserjsx_bg_${hashCacheKey(cacheKey)}`
  const cache = getSceneBackgroundTextureCache(scene)
  let entry = cache.get(cacheKey)

  if (!entry || !scene.textures.exists(entry.textureKey)) {
    const graphics = scene.add.graphics()

    drawBackground(graphics, props, textureWidth, textureHeight)
    graphics.generateTexture(textureKey, textureWidth, textureHeight)
    graphics.destroy()

    entry = { textureKey, refs: 0 }
    cache.set(cacheKey, entry)
  }

  entry.refs++

  const background = scene.add.image(0, 0, entry.textureKey) as BackgroundImage
  background.setOrigin(0, 0)
  background.__isBackground = true
  background.__backgroundCacheKey = cacheKey
  background.__backgroundTextureKey = entry.textureKey
  background.once('destroy', () => releaseBackgroundImageTexture(background))

  return background
}

function releaseBackgroundImageTexture(background: BackgroundImage): void {
  if (background.__backgroundTextureReleased) {
    return
  }

  const scene = background.scene
  const cacheKey = background.__backgroundCacheKey

  background.__backgroundTextureReleased = true

  if (!scene || !cacheKey) {
    return
  }

  const cache = sceneBackgroundTextureCaches.get(scene)
  const entry = cache?.get(cacheKey)

  if (!cache || !entry) {
    return
  }

  entry.refs--

  if (entry.refs <= 0) {
    if (scene.textures.exists(entry.textureKey)) {
      scene.textures.remove(entry.textureKey)
    }
    cache.delete(cacheKey)
  }
}

export function destroyBackgroundImage(background: BackgroundImage): void {
  background.destroy()
}
