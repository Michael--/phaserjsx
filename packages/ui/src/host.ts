/**
 * Host layer - Generic bridge between VDOM and Phaser GameObjects
 * Provides type-safe creator/patcher pattern for extensible node types
 */
import type * as Phaser from 'phaser'
import type { NodeInstance, NodeProps, NodeType } from './core-types'
import { isPhaserContainer, isPhaserScene } from './utils/phaser-guards'

/**
 * Host creator function type - creates a node instance from props
 */
export type HostCreator<T extends NodeType> = (
  scene: Phaser.Scene,
  props: NodeProps<T>
) => NodeInstance<T>

/**
 * Host patcher function type - updates node properties
 */
export type HostPatcher<T extends NodeType> = (
  node: NodeInstance<T>,
  prev: NodeProps<T>,
  next: NodeProps<T>
) => void

/**
 * Node descriptor combining creator and patcher
 */
export interface NodeDescriptor<T extends NodeType> {
  create: HostCreator<T>
  patch: HostPatcher<T>
}

/**
 * Internal registry of node descriptors
 */
type NodeRegistry = {
  [K in NodeType]: NodeDescriptor<K>
}

/**
 * Node registry - maps node types to their descriptors
 * Exported for external registration of custom node types
 */
export const nodeRegistry: Partial<NodeRegistry> = {}

/**
 * Registers a node descriptor (creator + patcher) for a custom node type
 * @param type - Node type name
 * @param descriptor - Node descriptor with create and patch functions
 */
export function register<T extends NodeType>(type: T, descriptor: NodeDescriptor<T>): void {
  nodeRegistry[type] = descriptor as NodeRegistry[T]
}

/**
 * Host API - Generic interface for VDOM to manage Phaser nodes
 */
export const host = {
  /**
   * Creates a node instance using the registered creator for the given type
   * @param type - Node type name
   * @param props - Node properties
   * @param scene - Phaser scene
   * @returns Created node instance
   * @throws Error if no creator registered for the type
   */
  create<T extends NodeType>(type: T, props: NodeProps<T>, scene: Phaser.Scene): NodeInstance<T> {
    const descriptor = nodeRegistry[type] as NodeDescriptor<T> | undefined
    if (!descriptor) {
      throw new Error(`No host descriptor registered for node type "${String(type)}"`)
    }
    return descriptor.create(scene, props)
  },

  /**
   * Patches node properties with updates using the registered patcher
   * @param type - Node type name
   * @param node - Node to patch
   * @param prev - Previous props
   * @param next - New props
   */
  patch<T extends NodeType>(
    type: T,
    node: NodeInstance<T>,
    prev: NodeProps<T>,
    next: NodeProps<T>
  ): void {
    const descriptor = nodeRegistry[type] as NodeDescriptor<T> | undefined
    if (!descriptor) {
      throw new Error(`No host descriptor registered for node type "${String(type)}"`)
    }
    descriptor.patch(node, prev, next)
  },

  /**
   * Appends child node to parent container
   * @param parent - Parent container or scene
   * @param child - Child node to append
   */
  append(parent: unknown, child: unknown) {
    // Parent is a Container
    if (isPhaserContainer(parent)) {
      parent.add(child as Phaser.GameObjects.GameObject)
    }
    // Parent is a Scene
    else if (isPhaserScene(parent)) {
      const scene = parent as Phaser.Scene
      scene.add.existing(child as Phaser.GameObjects.GameObject)
    }
    // Fallback: try to add to display list
    else if (parent && typeof parent === 'object' && 'scene' in parent) {
      const gameObject = parent as Phaser.GameObjects.GameObject
      if (gameObject.scene?.children) {
        gameObject.scene.children.add(child as Phaser.GameObjects.GameObject)
      }
    }
  },

  /**
   * Removes child node from parent and destroys it
   * @param parent - Parent container
   * @param child - Child node to remove
   */
  remove(parent: unknown, child: unknown) {
    const childObj = child as Phaser.GameObjects.GameObject & { scene?: Phaser.Scene | null }

    // Check if child still has a scene (not already destroyed)
    if (!childObj.scene) return

    // Remove from parent container first
    if (isPhaserContainer(parent)) {
      parent.remove(childObj, false)
    }

    // Destroy the child WITHOUT destroying its children (VDOM handles that)
    if (childObj.destroy) {
      childObj.destroy(false)
    }
  },

  /**
   * Performs layout update on container (no-op for native Phaser)
   */
  layout() {
    // Native Phaser containers don't have automatic layout
    // This is a no-op but kept for API compatibility
  },
}
