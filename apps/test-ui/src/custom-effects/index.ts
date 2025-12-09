/**
 * Custom Effects Registry
 * Register custom effects to extend the built-in effect system
 */
import { EFFECT_REGISTRY } from '@number10/phaserjsx'
import { createSquashEffect } from './squash-effect'
import './types' // Import type augmentation

/**
 * Register custom effects in the global registry
 * This allows using them via effect="squash" in components
 */
export function registerCustomEffects() {
  // Dynamically extend the registry for custom effects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registry = EFFECT_REGISTRY as Record<string, any>
  registry['squash'] = createSquashEffect
}

// Export for direct usage
export { createSquashEffect }
