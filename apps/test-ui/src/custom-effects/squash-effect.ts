/**
 * Custom effect: Squash animation
 * Demonstrates how to create and register custom effects
 */
import type { EffectFn } from '@number10/phaserjsx'

/**
 * Squash effect - Compresses and stretches the object
 * @param obj - Game object to animate
 * @param config - Effect configuration
 */
export const createSquashEffect: EffectFn = (obj, config = {}) => {
  const scene = obj.scene
  const time = config.time ?? 200
  const intensity = config.intensity ?? 1.5

  const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
    targets: obj,
    scaleX: intensity,
    scaleY: 1 / intensity,
    duration: time / 2,
    yoyo: true,
    ease: 'Sine.easeInOut',
  }

  if (config.onComplete) {
    tweenConfig.onComplete = config.onComplete
  }

  scene.tweens.add(tweenConfig)
}
