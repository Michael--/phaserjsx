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
 * Internal registry of creators for each node type
 */
type CreatorRegistry = {
  [K in NodeType]: HostCreator<K>
}

/**
 * Creator registry - maps node types to their factory functions
 */
const creators: Partial<CreatorRegistry> = {}

/**
 * Creates a View (Phaser Container) node
 * @param scene - Phaser scene
 * @param props - View properties
 * @returns Container instance
 */
function createView(scene: Phaser.Scene, props: NodeProps<'View'>): NodeInstance<'View'> {
  const container = scene.add.container(props.x ?? 0, props.y ?? 0)
  if (props.visible !== undefined) container.visible = props.visible
  if (props.depth !== undefined) container.setDepth(props.depth)
  if (props.alpha !== undefined) container.setAlpha(props.alpha)
  if (props.scaleX !== undefined || props.scaleY !== undefined) {
    container.setScale(props.scaleX ?? 1, props.scaleY ?? 1)
  }
  if (props.rotation !== undefined) container.setRotation(props.rotation)

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
 * Creates a Text (Phaser Text) node
 * @param scene - Phaser scene
 * @param props - Text properties
 * @returns Text instance
 */
function createText(scene: Phaser.Scene, props: NodeProps<'Text'>): NodeInstance<'Text'> {
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

// Initialize creator registry with native Phaser primitives
creators.View = createView
creators.Text = createText

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
    const creator = creators[type] as HostCreator<T> | undefined
    if (!creator) {
      throw new Error(`No host creator registered for node type "${String(type)}"`)
    }
    return creator(scene, props)
  },

  /**
   * Registers a creator function for a custom node type
   * @param type - Node type name
   * @param creator - Creator function
   */
  register<T extends NodeType>(type: T, creator: HostCreator<T>): void {
    creators[type] = creator as CreatorRegistry[T]
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
   * Patches node properties with updates
   * @param node - Node to patch
   * @param prev - Previous props
   * @param next - New props
   */
  patch(node: unknown, prev: Record<string, unknown>, next: Record<string, unknown>) {
    const gameObject = node as {
      x?: number
      y?: number
      visible?: boolean
      scaleX?: number
      scaleY?: number
      input?: { cursor?: string; hitArea?: Phaser.Geom.Rectangle }
      setDepth?: (depth: number) => void
      setAlpha?: (alpha: number) => void
      setScale?: (x: number, y: number) => void
      setRotation?: (rotation: number) => void
      setText?: (text: string) => void
      setStyle?: (style: Phaser.Types.GameObjects.Text.TextStyle) => void
      setInteractive?: (
        hitArea?: Phaser.Geom.Rectangle,
        callback?: Phaser.Types.Input.HitAreaCallback
      ) => void
      removeInteractive?: () => void
      off?: (event: string, fn?: unknown) => void
      on?: (event: string, fn: unknown) => void
    }

    // Common transform props
    if (prev.x !== next.x && typeof next.x === 'number') gameObject.x = next.x
    if (prev.y !== next.y && typeof next.y === 'number') gameObject.y = next.y
    if (prev.visible !== next.visible && typeof next.visible === 'boolean') {
      gameObject.visible = next.visible
    }
    if (prev.depth !== next.depth && typeof next.depth === 'number') {
      gameObject.setDepth?.(next.depth)
    }
    if (prev.alpha !== next.alpha && typeof next.alpha === 'number') {
      gameObject.setAlpha?.(next.alpha)
    }
    if (
      (prev.scaleX !== next.scaleX && typeof next.scaleX === 'number') ||
      (prev.scaleY !== next.scaleY && typeof next.scaleY === 'number')
    ) {
      const scaleX = typeof next.scaleX === 'number' ? next.scaleX : (gameObject.scaleX ?? 1)
      const scaleY = typeof next.scaleY === 'number' ? next.scaleY : (gameObject.scaleY ?? 1)
      gameObject.setScale?.(scaleX, scaleY)
    }
    if (prev.rotation !== next.rotation && typeof next.rotation === 'number') {
      gameObject.setRotation?.(next.rotation)
    }

    // Text-specific props
    if ('text' in next && prev.text !== next.text && typeof next.text === 'string') {
      gameObject.setText?.(next.text)
    }
    if (
      'style' in next &&
      next.style &&
      JSON.stringify(prev.style) !== JSON.stringify(next.style)
    ) {
      gameObject.setStyle?.(next.style as Phaser.Types.GameObjects.Text.TextStyle)
    }

    // Pointer event handlers for View (Container)
    const prevDown = prev.onPointerDown as ((pointer: Phaser.Input.Pointer) => void) | undefined
    const nextDown = next.onPointerDown as ((pointer: Phaser.Input.Pointer) => void) | undefined
    const prevUp = prev.onPointerUp as ((pointer: Phaser.Input.Pointer) => void) | undefined
    const nextUp = next.onPointerUp as ((pointer: Phaser.Input.Pointer) => void) | undefined
    const prevOver = prev.onPointerOver as ((pointer: Phaser.Input.Pointer) => void) | undefined
    const nextOver = next.onPointerOver as ((pointer: Phaser.Input.Pointer) => void) | undefined
    const prevOut = prev.onPointerOut as ((pointer: Phaser.Input.Pointer) => void) | undefined
    const nextOut = next.onPointerOut as ((pointer: Phaser.Input.Pointer) => void) | undefined

    const hadAnyEvent = !!(prevDown || prevUp || prevOver || prevOut)
    const hasAnyEvent = !!(nextDown || nextUp || nextOver || nextOut)

    // Update interactive state if needed
    if (!hadAnyEvent && hasAnyEvent) {
      // Enable interaction
      const width = (next.width as number | undefined) ?? 100
      const height = (next.height as number | undefined) ?? 100
      const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)
      gameObject.setInteractive?.(hitArea, Phaser.Geom.Rectangle.Contains)
      if (gameObject.input) gameObject.input.cursor = 'pointer'
    } else if (hadAnyEvent && !hasAnyEvent) {
      // Disable interaction
      gameObject.removeInteractive?.()
    } else if (hasAnyEvent) {
      // Update hit area size if width/height changed
      if (
        (prev.width !== next.width || prev.height !== next.height) &&
        gameObject.input?.hitArea instanceof Phaser.Geom.Rectangle
      ) {
        const width = (next.width as number | undefined) ?? 100
        const height = (next.height as number | undefined) ?? 100
        gameObject.input.hitArea.setTo(0, 0, width, height)
      }
    }

    // Update event listeners
    if (prevDown !== nextDown) {
      if (prevDown) gameObject.off?.('pointerdown', prevDown)
      if (nextDown) gameObject.on?.('pointerdown', nextDown)
    }
    if (prevUp !== nextUp) {
      if (prevUp) gameObject.off?.('pointerup', prevUp)
      if (nextUp) gameObject.on?.('pointerup', nextUp)
    }
    if (prevOver !== nextOver) {
      if (prevOver) gameObject.off?.('pointerover', prevOver)
      if (nextOver) gameObject.on?.('pointerover', nextOver)
    }
    if (prevOut !== nextOut) {
      if (prevOut) gameObject.off?.('pointerout', prevOut)
      if (nextOut) gameObject.on?.('pointerout', nextOut)
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
