/**
 * Portal registry - manages portal trees and depth ordering
 */
import type Phaser from 'phaser'
import type { VNode } from '../hooks'
import type { PortalTree } from './portal-types'

/**
 * Global portal registry
 * Manages all portal trees across scenes with depth-based ordering
 */
class PortalRegistry {
  private portals: Map<string, PortalTree> = new Map()
  private idCounter = 0
  private portalRoots: Map<Phaser.Scene, Phaser.GameObjects.Container> = new Map()

  /**
   * Generate unique portal ID
   * @returns Unique portal ID
   */
  generateId(): string {
    return `portal-${++this.idCounter}`
  }

  /**
   * Get or create portal root container for scene
   * This container sits at very high depth to ensure portals are above regular content
   * @param scene - Phaser scene
   * @returns Portal root container
   */
  private getOrCreatePortalRoot(scene: Phaser.Scene): Phaser.GameObjects.Container {
    let root = this.portalRoots.get(scene)
    if (!root) {
      root = scene.add.container(0, 0)
      root.setDepth(999999) // Very high depth to be above normal content

      // Set very high mountRootId so GestureManager prioritizes portals over normal UI
      // This ensures portal events are processed first in event bubbling
      ;(root as unknown as { __mountRootId?: number }).__mountRootId = 999999

      this.portalRoots.set(scene, root)
    }
    return root
  }

  /**
   * Register a new portal tree
   * @param id - Portal ID
   * @param depth - Z-depth (higher = foreground)
   * @param scene - Phaser scene
   * @param vnode - Root VNode
   * @param mountedNode - Mounted GameObject
   * @returns Portal container
   */
  register(
    id: string,
    depth: number,
    scene: Phaser.Scene,
    vnode: VNode,
    mountedNode: Phaser.GameObjects.GameObject
  ): Phaser.GameObjects.Container {
    // Get portal root container for this scene
    const portalRoot = this.getOrCreatePortalRoot(scene)

    // Create container for this portal as child of portal root
    const container = scene.add.container(0, 0)
    container.setDepth(depth)
    portalRoot.add(container)

    // Store portal tree
    const portal: PortalTree = {
      id,
      depth,
      container,
      vnode,
      scene,
      mountedNode,
    }

    this.portals.set(id, portal)

    // Re-sort all portals in scene by depth to maintain input priority
    this.sortPortalsByDepth(scene)

    return container
  }

  /**
   * Sort portals in scene by depth (highest to lowest)
   * Ensures correct input event order within portal root
   * Phaser processes input from LAST to FIRST child in DisplayList
   * So highest depth should be LAST in the list to receive events first
   * @param scene - Phaser scene
   */
  private sortPortalsByDepth(scene: Phaser.Scene): void {
    const portalRoot = this.portalRoots.get(scene)
    if (!portalRoot) return

    const scenePortals = this.getByScene(scene)
    // Sort by depth DESCENDING - highest depth should be last in DisplayList
    scenePortals.sort((a, b) => b.depth - a.depth)

    // Remove all from portal root
    portalRoot.removeAll(false)

    // Add back in reverse order: lowest depth first, highest depth last
    for (let i = scenePortals.length - 1; i >= 0; i--) {
      const portal = scenePortals[i]
      if (portal) {
        portalRoot.add(portal.container)
      }
    }
  }

  /**
   * Unregister and cleanup portal
   * @param id - Portal ID
   */
  unregister(id: string): void {
    const portal = this.portals.get(id)
    if (!portal) return

    // Cleanup container and mounted node
    portal.container.destroy()

    this.portals.delete(id)

    // Cleanup portal root if no more portals in scene
    const scenePortals = this.getByScene(portal.scene)
    if (scenePortals.length === 0) {
      const root = this.portalRoots.get(portal.scene)
      if (root) {
        root.destroy()
        this.portalRoots.delete(portal.scene)
      }
    }
  }

  /**
   * Get portal by ID
   * @param id - Portal ID
   * @returns Portal tree or undefined
   */
  get(id: string): PortalTree | undefined {
    return this.portals.get(id)
  }

  /**
   * Get all portals sorted by depth (ascending)
   * @returns Sorted portal trees
   */
  getByDepth(): PortalTree[] {
    return Array.from(this.portals.values()).sort((a, b) => a.depth - b.depth)
  }

  /**
   * Get all portals for a specific scene
   * @param scene - Phaser scene
   * @returns Portal trees in scene
   */
  getByScene(scene: Phaser.Scene): PortalTree[] {
    return Array.from(this.portals.values()).filter((p) => p.scene === scene)
  }

  /**
   * Clear all portals
   */
  clear(): void {
    for (const portal of this.portals.values()) {
      portal.container.destroy()
    }
    this.portals.clear()
  }

  /**
   * Get portal count
   * @returns Number of registered portals
   */
  get size(): number {
    return this.portals.size
  }
}

/**
 * Global portal registry instance
 */
export const portalRegistry = new PortalRegistry()
