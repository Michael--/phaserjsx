/**
 * Effect Repository - Centralized effect configuration and application
 * Provides reusable effect system for any component
 *
 * @example
 * ```typescript
 * // In component props/theme
 * interface MyComponentProps extends EffectDefinition {
 *   // ... other props
 * }
 *
 * // In component implementation
 * const { applyEffect } = useGameObjectEffect(ref)
 * const resolved = resolveEffect(props, theme)
 * applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
 * ```
 */
import {
  createBounceEffect,
  createFlashEffect,
  createPressEffect,
  createPulseEffect,
  createShakeEffect,
  type EffectConfig,
  type EffectFn,
} from './useGameObjectEffect'

/**
 * Available effect names
 */
export type EffectName = 'pulse' | 'shake' | 'bounce' | 'press' | 'flash' | 'none'

/**
 * Effect configuration with name and config
 */
export interface EffectDefinition {
  effect?: EffectName
  effectConfig?: EffectConfig
}

/**
 * Map of effect names to effect functions
 */
export const EFFECT_REGISTRY: Record<EffectName, EffectFn | null> = {
  pulse: createPulseEffect,
  shake: createShakeEffect,
  bounce: createBounceEffect,
  press: createPressEffect,
  flash: createFlashEffect,
  none: null,
}

/**
 * Default effect configuration
 */
export const DEFAULT_EFFECT: Required<EffectDefinition> = {
  effect: 'pulse',
  effectConfig: { intensity: 1.1, time: 100 },
}

/**
 * Apply an effect by name with configuration
 * @param applyEffect - The applyEffect function from useGameObjectEffect hook
 * @param effectName - Name of the effect to apply
 * @param effectConfig - Optional configuration for the effect
 * @returns true if effect was applied, false otherwise
 */
export function applyEffectByName(
  applyEffect: (effect: EffectFn, config?: EffectConfig) => void,
  effectName?: EffectName,
  effectConfig?: EffectConfig
): boolean {
  const name = effectName ?? DEFAULT_EFFECT.effect
  const config = effectConfig ?? DEFAULT_EFFECT.effectConfig
  const effectFn = EFFECT_REGISTRY[name]

  if (effectFn) {
    applyEffect(effectFn, config)
    return true
  }

  return false
}

/**
 * Resolve effect definition with priority: props > theme > default
 * @param props - Props-level effect definition
 * @param theme - Theme-level effect definition
 * @returns Resolved effect definition
 */
export function resolveEffect(
  props?: EffectDefinition,
  theme?: EffectDefinition
): Required<EffectDefinition> {
  return {
    effect: props?.effect ?? theme?.effect ?? DEFAULT_EFFECT.effect,
    effectConfig: props?.effectConfig ?? theme?.effectConfig ?? DEFAULT_EFFECT.effectConfig,
  }
}
