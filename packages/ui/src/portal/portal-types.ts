/**
 * Portal system types
 * Defines types for portal-based rendering system
 */
import type * as Phaser from 'phaser'
import type { VNode } from '../hooks'

/**
 * Portal tree instance
 */
export interface PortalTree {
  /** Unique portal ID */
  id: string
  /** Depth/z-index for stacking order (higher = foreground) */
  depth: number
  /** Root Phaser container for this portal */
  container: Phaser.GameObjects.Container
  /** Root VNode being rendered */
  vnode: VNode
  /** Scene this portal belongs to */
  scene: Phaser.Scene
  /** Mounted GameObject */
  mountedNode: Phaser.GameObjects.GameObject
}
