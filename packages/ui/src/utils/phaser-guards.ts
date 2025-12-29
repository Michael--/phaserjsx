import type * as Phaser from 'phaser'

/**
 * Duck-typed Phaser guards to avoid instanceof issues when multiple Phaser copies exist.
 */
export function isPhaserScene(value: unknown): value is Phaser.Scene {
  if (!value || typeof value !== 'object') return false
  const maybe = value as Phaser.Scene & { sys?: unknown; add?: unknown }
  return typeof maybe.sys === 'object' && typeof maybe.add === 'object'
}

export function isPhaserContainer(value: unknown): value is Phaser.GameObjects.Container {
  if (!value || typeof value !== 'object') return false
  const maybe = value as Phaser.GameObjects.Container & {
    list?: unknown
    add?: unknown
    remove?: unknown
  }
  return (
    Array.isArray(maybe.list) &&
    typeof maybe.add === 'function' &&
    typeof maybe.remove === 'function'
  )
}
