import Phaser from 'phaser'
import type { NodeInstance, NodeProps, NodeType } from './core-types'

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
 */
const nodeRegistry: Partial<NodeRegistry> = {}

/**
 * View creator - creates a Phaser Container with optional background and interaction
 */
const viewCreator: HostCreator<'View'> = (scene, props) => {
  const container = scene.add.container(props.x ?? 0, props.y ?? 0)
  if (props.visible !== undefined) container.visible = props.visible
  if (props.depth !== undefined) container.setDepth(props.depth)
  if (props.alpha !== undefined) container.setAlpha(props.alpha)
  if (props.scaleX !== undefined || props.scaleY !== undefined) {
    container.setScale(props.scaleX ?? 1, props.scaleY ?? 1)
  }
  if (props.rotation !== undefined) container.setRotation(props.rotation)

  // Add background if backgroundColor is provided
  if (props.backgroundColor !== undefined) {
    const width = props.width ?? 100
    const height = props.height ?? 100
    const bgAlpha = props.backgroundAlpha ?? 1
    const background = scene.add.rectangle(0, 0, width, height, props.backgroundColor, bgAlpha)
    background.setOrigin(0, 0)
    container.add(background)
    // Store reference for later updates
    ;(container as unknown as { __background?: Phaser.GameObjects.Rectangle }).__background =
      background
  }

  // Setup pointer interaction if any event handlers are provided
  if (props.onPointerDown || props.onPointerUp || props.onPointerOver || props.onPointerOut) {
    // Create an invisible interactive zone that covers the container size
    const hitArea = new Phaser.Geom.Rectangle(0, 0, props.width ?? 100, props.height ?? 100)
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
    if (container.input) container.input.cursor = 'pointer'

    if (props.onPointerDown) container.on('pointerdown', props.onPointerDown)
    if (props.onPointerUp) container.on('pointerup', props.onPointerUp)
    if (props.onPointerOver) container.on('pointerover', props.onPointerOver)
    if (props.onPointerOut) container.on('pointerout', props.onPointerOut)
  }

  return container
}

/**
 * View patcher - updates View properties
 */
const viewPatcher: HostPatcher<'View'> = (node, prev, next) => {
  // Common transform props
  if (prev.x !== next.x && next.x !== undefined) node.x = next.x
  if (prev.y !== next.y && next.y !== undefined) node.y = next.y
  if (prev.visible !== next.visible && next.visible !== undefined) node.visible = next.visible
  if (prev.depth !== next.depth && next.depth !== undefined) node.setDepth(next.depth)
  if (prev.alpha !== next.alpha && next.alpha !== undefined) node.setAlpha(next.alpha)
  if (
    (prev.scaleX !== next.scaleX && next.scaleX !== undefined) ||
    (prev.scaleY !== next.scaleY && next.scaleY !== undefined)
  ) {
    node.setScale(next.scaleX ?? node.scaleX, next.scaleY ?? node.scaleY)
  }
  if (prev.rotation !== next.rotation && next.rotation !== undefined) {
    node.setRotation(next.rotation)
  }

  // Background updates
  const container = node as Phaser.GameObjects.Container & {
    __background?: Phaser.GameObjects.Rectangle
  }

  const prevBgColor = prev.backgroundColor
  const nextBgColor = next.backgroundColor
  const prevBgAlpha = prev.backgroundAlpha ?? 1
  const nextBgAlpha = next.backgroundAlpha ?? 1
  const prevWidth = prev.width ?? 100
  const nextWidth = next.width ?? 100
  const prevHeight = prev.height ?? 100
  const nextHeight = next.height ?? 100

  if (prevBgColor !== undefined && nextBgColor === undefined) {
    // Remove background
    if (container.__background) {
      container.__background.destroy()
      delete container.__background
    }
  } else if (prevBgColor === undefined && nextBgColor !== undefined) {
    // Add background
    if (container.scene) {
      const background = container.scene.add.rectangle(
        0,
        0,
        nextWidth,
        nextHeight,
        nextBgColor,
        nextBgAlpha
      )
      background.setOrigin(0, 0)
      container.add(background)
      container.__background = background
    }
  } else if (container.__background && nextBgColor !== undefined) {
    // Update existing background
    if (prevBgColor !== nextBgColor) {
      container.__background.setFillStyle(nextBgColor, nextBgAlpha)
    }
    if (prevBgAlpha !== nextBgAlpha) {
      container.__background.setAlpha(nextBgAlpha)
    }
    if (prevWidth !== nextWidth || prevHeight !== nextHeight) {
      container.__background.setSize(nextWidth, nextHeight)
    }
  }

  // Pointer event handlers
  const prevDown = prev.onPointerDown
  const nextDown = next.onPointerDown
  const prevUp = prev.onPointerUp
  const nextUp = next.onPointerUp
  const prevOver = prev.onPointerOver
  const nextOver = next.onPointerOver
  const prevOut = prev.onPointerOut
  const nextOut = next.onPointerOut

  const hadAnyEvent = !!(prevDown || prevUp || prevOver || prevOut)
  const hasAnyEvent = !!(nextDown || nextUp || nextOver || nextOut)

  // Update interactive state if needed
  if (!hadAnyEvent && hasAnyEvent) {
    // Enable interaction
    const width = next.width ?? 100
    const height = next.height ?? 100
    const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
    if (container.input) container.input.cursor = 'pointer'
  } else if (hadAnyEvent && !hasAnyEvent) {
    // Disable interaction
    container.removeInteractive()
  } else if (hasAnyEvent) {
    // Update hit area size if width/height changed
    if (
      (prev.width !== next.width || prev.height !== next.height) &&
      container.input?.hitArea instanceof Phaser.Geom.Rectangle
    ) {
      const width = next.width ?? 100
      const height = next.height ?? 100
      container.input.hitArea.setTo(0, 0, width, height)
    }
  }

  // Update event listeners
  if (prevDown !== nextDown) {
    if (prevDown) container.off('pointerdown', prevDown)
    if (nextDown) container.on('pointerdown', nextDown)
  }
  if (prevUp !== nextUp) {
    if (prevUp) container.off('pointerup', prevUp)
    if (nextUp) container.on('pointerup', nextUp)
  }
  if (prevOver !== nextOver) {
    if (prevOver) container.off('pointerover', prevOver)
    if (nextOver) container.on('pointerover', nextOver)
  }
  if (prevOut !== nextOut) {
    if (prevOut) container.off('pointerout', prevOut)
    if (nextOut) container.on('pointerout', nextOut)
  }
}

/**
 * Text creator - creates a Phaser Text object
 */
const textCreator: HostCreator<'Text'> = (scene, props) => {
  const text = scene.add.text(props.x ?? 0, props.y ?? 0, props.text, props.style)
  if (props.visible !== undefined) text.visible = props.visible
  if (props.depth !== undefined) text.setDepth(props.depth)
  if (props.alpha !== undefined) text.setAlpha(props.alpha)
  if (props.scaleX !== undefined || props.scaleY !== undefined) {
    text.setScale(props.scaleX ?? 1, props.scaleY ?? 1)
  }
  if (props.rotation !== undefined) text.setRotation(props.rotation)
  return text
}

/**
 * Text patcher - updates Text properties
 */
const textPatcher: HostPatcher<'Text'> = (node, prev, next) => {
  // Common transform props
  if (prev.x !== next.x && next.x !== undefined) node.x = next.x
  if (prev.y !== next.y && next.y !== undefined) node.y = next.y
  if (prev.visible !== next.visible && next.visible !== undefined) node.visible = next.visible
  if (prev.depth !== next.depth && next.depth !== undefined) node.setDepth(next.depth)
  if (prev.alpha !== next.alpha && next.alpha !== undefined) node.setAlpha(next.alpha)
  if (
    (prev.scaleX !== next.scaleX && next.scaleX !== undefined) ||
    (prev.scaleY !== next.scaleY && next.scaleY !== undefined)
  ) {
    node.setScale(next.scaleX ?? node.scaleX, next.scaleY ?? node.scaleY)
  }
  if (prev.rotation !== next.rotation && next.rotation !== undefined) {
    node.setRotation(next.rotation)
  }

  // Text-specific props
  if (prev.text !== next.text) {
    node.setText(next.text)
  }
  if (prev.style !== next.style && next.style !== undefined) {
    node.setStyle(next.style)
  }
}

// Register built-in node types
nodeRegistry.View = { create: viewCreator, patch: viewPatcher }
nodeRegistry.Text = { create: textCreator, patch: textPatcher }

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
   * Registers a node descriptor (creator + patcher) for a custom node type
   * @param type - Node type name
   * @param descriptor - Node descriptor with create and patch functions
   */
  register<T extends NodeType>(type: T, descriptor: NodeDescriptor<T>): void {
    nodeRegistry[type] = descriptor as NodeRegistry[T]
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
    if (parent instanceof Phaser.GameObjects.Container) {
      parent.add(child as Phaser.GameObjects.GameObject)
    }
    // Parent is a Scene
    else if (parent && typeof parent === 'object' && 'sys' in parent) {
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
    if (parent instanceof Phaser.GameObjects.Container) {
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
