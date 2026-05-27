import * as Phaser from 'phaser'
import type { BackgroundProps } from '../core-props'

export type BackgroundImage = Phaser.GameObjects.Image & {
  __isBackground?: boolean
  __backgroundTextureKey?: string
}

let backgroundTextureId = 0

function hasRenderableBackground(props: Partial<BackgroundProps>): boolean {
  const hasBackground = props.backgroundColor !== undefined
  const hasBorder = (props.borderWidth ?? 0) > 0 && props.borderColor !== undefined
  return hasBackground || hasBorder
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

  if (bgColor !== undefined) {
    graphics.fillStyle(bgColor, bgAlpha)
  }

  if (hasBorder) {
    graphics.lineStyle(borderWidth, borderColor, borderAlpha)
  }

  if (cornerRadius !== 0) {
    if (bgColor !== undefined) {
      graphics.fillRoundedRect(0, 0, width, height, cornerRadius)
    }
    if (hasBorder) {
      graphics.strokeRoundedRect(0, 0, width, height, cornerRadius)
    }
  } else {
    if (bgColor !== undefined) {
      graphics.fillRect(0, 0, width, height)
    }
    if (hasBorder) {
      graphics.strokeRect(0, 0, width, height)
    }
  }
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
  const textureKey = `__phaserjsx_bg_${backgroundTextureId++}`
  const graphics = scene.add.graphics()

  drawBackground(graphics, props, textureWidth, textureHeight)
  graphics.generateTexture(textureKey, textureWidth, textureHeight)
  graphics.destroy()

  const background = scene.add.image(0, 0, textureKey) as BackgroundImage
  background.setOrigin(0, 0)
  background.__isBackground = true
  background.__backgroundTextureKey = textureKey

  return background
}

export function destroyBackgroundImage(background: BackgroundImage): void {
  const scene = background.scene
  const textureKey = background.__backgroundTextureKey

  background.destroy()

  if (scene && textureKey && scene.textures.exists(textureKey)) {
    scene.textures.remove(textureKey)
  }
}
