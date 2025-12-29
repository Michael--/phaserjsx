/**
 * Applier for Image-specific properties
 */
import type * as Phaser from 'phaser'
import type { ImageBaseProps } from '../primitives/image'

/**
 * Calculates scale factors for fit modes
 * @param image - Phaser Image object
 * @param targetWidth - Desired width
 * @param targetHeight - Desired height
 * @param fit - Fit mode
 * @returns Scale factors for x and y
 */
function calculateFitScale(
  image: Phaser.GameObjects.Image,
  targetWidth: number,
  targetHeight: number,
  fit: 'fill' | 'contain' | 'cover' = 'fill'
): { scaleX: number; scaleY: number } {
  const textureWidth = image.width
  const textureHeight = image.height

  if (textureWidth === 0 || textureHeight === 0) {
    return { scaleX: 1, scaleY: 1 }
  }

  if (fit === 'fill') {
    // Stretch to fill (may distort aspect ratio)
    return {
      scaleX: targetWidth / textureWidth,
      scaleY: targetHeight / textureHeight,
    }
  }

  const targetAspect = targetWidth / targetHeight
  const textureAspect = textureWidth / textureHeight

  if (fit === 'contain') {
    // Scale to fit within bounds, preserve aspect ratio
    const scale =
      targetAspect > textureAspect ? targetHeight / textureHeight : targetWidth / textureWidth
    return { scaleX: scale, scaleY: scale }
  }

  if (fit === 'cover') {
    // Scale to cover bounds, preserve aspect ratio (may crop)
    const scale =
      targetAspect < textureAspect ? targetHeight / textureHeight : targetWidth / textureWidth
    return { scaleX: scale, scaleY: scale }
  }

  return { scaleX: 1, scaleY: 1 }
}

/**
 * Applies Image-specific properties (texture, frame, tint, displaySize, fit)
 * @param image - Phaser Image object
 * @param prev - Previous props
 * @param next - New props
 */
export function applyImageProps(
  image: Phaser.GameObjects.Image,
  prev: Partial<ImageBaseProps>,
  next: Partial<ImageBaseProps>
): void {
  // Check if texture or frame changed
  const textureChanged = prev.texture !== next.texture || prev.frame !== next.frame
  if (textureChanged && next.texture) {
    image.setTexture(next.texture, next.frame)
  }

  // Apply tint
  if (prev.tint !== next.tint) {
    if (typeof next.tint === 'number') {
      image.setTint(next.tint)
    } else {
      image.clearTint()
    }
  }

  // Apply origin if specified
  if (prev.originX !== next.originX || prev.originY !== next.originY) {
    const originX = next.originX ?? image.originX
    const originY = next.originY ?? image.originY
    image.setOrigin(originX, originY)
  }

  // Apply displayWidth/displayHeight with fit mode
  const displayWidthChanged = prev.displayWidth !== next.displayWidth
  const displayHeightChanged = prev.displayHeight !== next.displayHeight
  const fitChanged = prev.fit !== next.fit

  if (displayWidthChanged || displayHeightChanged || fitChanged || textureChanged) {
    if (typeof next.displayWidth === 'number' && typeof next.displayHeight === 'number') {
      const { scaleX, scaleY } = calculateFitScale(
        image,
        next.displayWidth,
        next.displayHeight,
        next.fit
      )
      image.setScale(scaleX, scaleY)
    } else if (typeof next.displayWidth === 'number') {
      // Only width specified - preserve aspect ratio
      const scale = next.displayWidth / image.width
      image.setScale(scale)
    } else if (typeof next.displayHeight === 'number') {
      // Only height specified - preserve aspect ratio
      const scale = next.displayHeight / image.height
      image.setScale(scale, scale)
    }
  }
}
