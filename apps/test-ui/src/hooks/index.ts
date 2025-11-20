/**
 * Custom hooks for test-ui components
 */

export {
  createBounceEffect,
  createBreatheEffect,
  createFadeEffect,
  createFlashEffect,
  createFlipInEffect,
  createFlipOutEffect,
  createFloatEffect,
  createJelloEffect,
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
  useGameObjectEffect,
} from './useGameObjectEffect'

export type { EffectConfig, EffectFn } from './useGameObjectEffect'

export {
  DEFAULT_EFFECT,
  EFFECT_REGISTRY,
  applyEffectByName,
  resolveEffect,
} from './effectRepository'

export type { EffectDefinition, EffectName } from './effectRepository'
