/**
 * Type augmentation for custom effects
 * Import this file in your main.ts to enable type-safe custom effect names
 */

declare module '@phaserjsx/ui' {
  interface EffectNameExtensions {
    squash: 'squash'
  }
}

// Re-export to ensure module is loaded
export {}
