/**
 * Applier for Sprite-specific properties
 */
import type Phaser from 'phaser'
import type { SpriteBaseProps } from '../sprite'

/**
 * Calculates scale factors for fit modes
 * @param sprite - Phaser Sprite object
 * @param targetWidth - Desired width
 * @param targetHeight - Desired height
 * @param fit - Fit mode
 * @returns Scale factors for x and y
 */
function calculateFitScale(
  sprite: Phaser.GameObjects.Sprite,
  targetWidth: number,
  targetHeight: number,
  fit: 'fill' | 'contain' | 'cover' = 'fill'
): { scaleX: number; scaleY: number } {
  const textureWidth = sprite.width
  const textureHeight = sprite.height

  if (textureWidth === 0 || textureHeight === 0) {
    return { scaleX: 1, scaleY: 1 }
  }

  if (fit === 'fill') {
    return {
      scaleX: targetWidth / textureWidth,
      scaleY: targetHeight / textureHeight,
    }
  }

  const targetAspect = targetWidth / targetHeight
  const textureAspect = textureWidth / textureHeight

  if (fit === 'contain') {
    const scale =
      targetAspect > textureAspect ? targetHeight / textureHeight : targetWidth / textureWidth
    return { scaleX: scale, scaleY: scale }
  }

  if (fit === 'cover') {
    const scale =
      targetAspect < textureAspect ? targetHeight / textureHeight : targetWidth / textureWidth
    return { scaleX: scale, scaleY: scale }
  }

  return { scaleX: 1, scaleY: 1 }
}

/**
 * Applies Sprite-specific properties (texture, frame, tint, displaySize, fit, animations)
 * @param sprite - Phaser Sprite object
 * @param prev - Previous props
 * @param next - New props
 */
export function applySpriteProps(
  sprite: Phaser.GameObjects.Sprite,
  prev: Partial<SpriteBaseProps>,
  next: Partial<SpriteBaseProps>
): void {
  // Check if texture or frame changed
  const textureChanged = prev.texture !== next.texture || prev.frame !== next.frame
  if (textureChanged && next.texture) {
    sprite.setTexture(next.texture, next.frame)
  }

  // Apply tint
  if (prev.tint !== next.tint) {
    if (typeof next.tint === 'number') {
      sprite.setTint(next.tint)
    } else {
      sprite.clearTint()
    }
  }

  // Apply origin if specified
  if (prev.originX !== next.originX || prev.originY !== next.originY) {
    const originX = next.originX ?? sprite.originX
    const originY = next.originY ?? sprite.originY
    sprite.setOrigin(originX, originY)
  }

  // Apply displayWidth/displayHeight with fit mode
  const displayWidthChanged = prev.displayWidth !== next.displayWidth
  const displayHeightChanged = prev.displayHeight !== next.displayHeight
  const fitChanged = prev.fit !== next.fit

  if (displayWidthChanged || displayHeightChanged || fitChanged || textureChanged) {
    if (typeof next.displayWidth === 'number' && typeof next.displayHeight === 'number') {
      const { scaleX, scaleY } = calculateFitScale(
        sprite,
        next.displayWidth,
        next.displayHeight,
        next.fit
      )
      sprite.setScale(scaleX, scaleY)
    } else if (typeof next.displayWidth === 'number') {
      const scale = next.displayWidth / sprite.width
      sprite.setScale(scale)
    } else if (typeof next.displayHeight === 'number') {
      const scale = next.displayHeight / sprite.height
      sprite.setScale(scale, scale)
    }
  }

  // Handle animation changes
  const animationChanged =
    prev.animationKey !== next.animationKey ||
    prev.loop !== next.loop ||
    prev.repeatDelay !== next.repeatDelay

  if (animationChanged) {
    // Stop previous animation if playing
    if (sprite.anims.isPlaying) {
      sprite.anims.stop()
    }

    // Play new animation if specified
    if (next.animationKey) {
      sprite.anims.play({
        key: next.animationKey,
        repeat: next.loop ? -1 : 0,
        repeatDelay: next.repeatDelay ?? 0,
      })
    }
  }

  // Update animation callbacks
  const callbacksChanged =
    prev.onAnimationStart !== next.onAnimationStart ||
    prev.onAnimationComplete !== next.onAnimationComplete ||
    prev.onAnimationRepeat !== next.onAnimationRepeat ||
    prev.onAnimationUpdate !== next.onAnimationUpdate

  if (callbacksChanged) {
    // Remove old listeners
    sprite.off('animationstart')
    sprite.off('animationcomplete')
    sprite.off('animationrepeat')
    sprite.off('animationupdate')

    // Add new listeners
    if (next.onAnimationStart) {
      sprite.on('animationstart', (anim: Phaser.Animations.Animation) => {
        next.onAnimationStart?.(anim.key)
      })
    }

    if (next.onAnimationComplete) {
      sprite.on('animationcomplete', (anim: Phaser.Animations.Animation) => {
        next.onAnimationComplete?.(anim.key)
      })
    }

    if (next.onAnimationRepeat) {
      sprite.on('animationrepeat', (anim: Phaser.Animations.Animation) => {
        next.onAnimationRepeat?.(anim.key)
      })
    }

    if (next.onAnimationUpdate) {
      sprite.on(
        'animationupdate',
        (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
          next.onAnimationUpdate?.(anim.key, frame)
        }
      )
    }
  }
}
