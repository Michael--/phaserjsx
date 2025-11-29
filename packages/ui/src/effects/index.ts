/**
 * Effect System for PhaserJSX
 * Provides reusable animation effects for game objects
 *
 * @example Basic usage:
 * ```tsx
 * import { useGameObjectEffect, createPulseEffect } from '@phaserjsx/ui/effects'
 *
 * function MyButton() {
 *   const ref = useRef(null)
 *   const { applyEffect } = useGameObjectEffect(ref)
 *
 *   const handleClick = () => {
 *     applyEffect(createPulseEffect, { intensity: 1.2, time: 300 })
 *   }
 *
 *   return <View ref={ref} onClick={handleClick}>Click me</View>
 * }
 * ```
 *
 * @example Using effect registry:
 * ```tsx
 * import { useGameObjectEffect, applyEffectByName } from '@phaserjsx/ui/effects'
 *
 * function MyComponent() {
 *   const ref = useRef(null)
 *   const { applyEffect } = useGameObjectEffect(ref)
 *
 *   const handleClick = () => {
 *     applyEffectByName(applyEffect, 'pulse', { intensity: 1.2 })
 *   }
 * }
 * ```
 *
 * @example Custom effects:
 * ```tsx
 * import { useGameObjectEffect, type EffectFn } from '@phaserjsx/ui/effects'
 *
 * const myCustomEffect: EffectFn = (obj, config) => {
 *   obj.scene.tweens.add({
 *     targets: obj,
 *     alpha: 0,
 *     duration: config.time ?? 300
 *   })
 * }
 *
 * function MyComponent() {
 *   const { applyEffect } = useGameObjectEffect(ref)
 *   applyEffect(myCustomEffect, { time: 500 })
 * }
 * ```
 */

// Core hook and types
export { useGameObjectEffect, type EffectConfig, type EffectFn } from './use-effect'

// Effect registry for string-based effect names
export {
  DEFAULT_EFFECT,
  EFFECT_REGISTRY,
  applyEffectByName,
  resolveEffect,
  type EffectDefinition,
  type EffectName,
} from './effect-registry'

// Individual effect creators - tree-shakeable
export {
  createBounceEffect,
  createBreatheEffect,
  createFadeEffect,
  createFlashEffect,
  createFlipInEffect,
  createFlipOutEffect,
  createFloatEffect,
  createJelloEffect,
  createNoneEffect,
  createPressEffect,
  createPulseEffect,
  createShakeEffect,
  createSlideInEffect,
  createSlideOutEffect,
  createSpinEffect,
  createSwingEffect,
  createTadaEffect,
  createWiggleEffect,
  createWobbleEffect,
  createZoomInEffect,
  createZoomOutEffect,
} from './use-effect'
