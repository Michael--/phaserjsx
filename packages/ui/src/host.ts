import Phaser from 'phaser'
import type {
  ParentType,
  RexLabelProps,
  RexLabelType,
  RexSizerProps,
  RexSizerType,
  Size,
  TextProps,
} from './types'
import { RexLabel, RexSizer, Text } from './widgets'

/**
 * Get font size based on size enum
 * @param s - Size enum
 * @returns Font size in pixels
 */
function fontSize(s: Size | undefined): number {
  const base = 24 // Base font size
  switch (s) {
    case 'xsmall':
      return base * 0.5
    case 'small':
      return base * 0.75
    default:
    case 'medium':
      return base * 1.0
    case 'large':
      return base * 1.5
    case 'xlarge':
      return base * 2.5
    case 'xxlarge':
      return base * 3.5
  }
}

type ComponentType = typeof RexSizer | typeof RexLabel | typeof Text
type ComponentProps = RexSizerProps | RexLabelProps | TextProps

function isRexContainer(n: unknown): n is RexSizerType {
  return !!(
    (n as RexSizerType | null)?.layout &&
    (n as RexSizerType | null)?.add &&
    (n as RexSizerType | null)?.remove
  )
}

/**
 * Checks if props affect layout and require re-layout
 * @param prev - Previous props
 * @param next - New props
 * @returns true if layout-affecting props changed
 */
function affectsLayout(prev: ComponentProps, next: ComponentProps) {
  if ('space' in prev && 'space' in next && prev.space !== next.space) return true
  if ('align' in prev && 'align' in next && prev.align !== next.align) return true
  if ('orientation' in prev && 'orientation' in next && prev.orientation !== next.orientation)
    return true
  if ('width' in prev && 'width' in next && prev.width !== next.width) return true
  if ('height' in prev && 'height' in next && prev.height !== next.height) return true
  return false
}

// Set to track nodes that need layout in current frame
const layoutQueue = new Set<RexSizerType>()
let layoutScheduled = false

/**
 * Schedules layout update on next tick/frame
 * @param node - Node to layout
 */
function scheduleLayout(node: RexSizerType) {
  layoutQueue.add(node)
  if (layoutScheduled) return
  layoutScheduled = true
  queueMicrotask(() => {
    layoutScheduled = false
    const nodes = Array.from(layoutQueue)
    layoutQueue.clear()
    // Process from leaf to root to avoid redundant layouts
    for (const n of nodes) {
      if (!n.scene) continue // Skip if destroyed
      n.layout()
    }
  })
}

export const host = {
  /**
   * Creates a Phaser/rexUI object from node type and props
   * @param type - Node type (RexSizer, RexLabel, Text)
   * @param props - Node properties
   * @param scene - Phaser scene
   * @returns Created Phaser/rexUI object
   * @throws Error if node type is unknown
   */
  create(
    type: ComponentType,
    props: ComponentProps,
    scene: Phaser.Scene
  ): Phaser.GameObjects.GameObject | RexSizerType | RexLabelType {
    const phaserScene = scene as Phaser.Scene & {
      rexUI?: {
        add: {
          sizer: (config: unknown) => unknown
          roundRectangle: (
            x: number,
            y: number,
            w: number,
            h: number,
            r: number,
            color: number
          ) => unknown
          label: (config: unknown) => unknown
        }
      }
    }

    if (!phaserScene.rexUI) {
      console.error('rexUI plugin not found on scene!', phaserScene)
      throw new Error('rexUI plugin not installed. Make sure the scene has rexUI plugin.')
    }

    switch (type) {
      case 'RexSizer': {
        const p = props as RexSizerProps
        // rexUI scene plugin must be installed in the Scene as "rexUI"
        const sizer = phaserScene.rexUI.add.sizer({
          x: p.x,
          y: p.y,
          width: p.width,
          height: p.height,
          orientation: p.orientation ?? 'x',
          rtl: p.rtl ?? false,
          space: p.space,
          align: p.align,
        }) as RexSizerType
        const background = p.background
          ? (phaserScene.rexUI?.add.roundRectangle(
              0,
              0,
              p.width ?? 0,
              p.height ?? 0,
              p.background.radius ?? 6,
              p.background.color ?? 0x2a2a2a
            ) as Phaser.GameObjects.GameObject)
          : undefined
        if (background) {
          const sizerWithBg = sizer as RexSizerType & { addBackground?: (bg: unknown) => void }
          sizerWithBg.addBackground?.(background)
        }
        if (p.onPointerdown) {
          const interactiveLabel = sizer as {
            setInteractive?: () => void
            // input?: { cursor?: string }
          }
          interactiveLabel.setInteractive?.()
          // if (interactiveLabel.input) interactiveLabel.input.cursor = 'pointer'
          sizer.on('pointerdown', p.onPointerdown)
        }
        return sizer
      }
      case 'RexLabel': {
        const p = props as RexLabelProps
        const fs = fontSize(p.size)
        const weight = p.weight ? { fontStyle: p.weight } : {}
        const shadow = p.shadow
          ? {
              shadow: {
                offsetX: fs * 0.08,
                offsetY: fs * 0.08,
                blur: fs * 0.1,
                fill: true,
              },
            }
          : {}
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
          ...p.textStyle,
          ...weight,
          ...shadow,
          fontSize: fs,
          color: p.textColor ?? '#ffffff',
          ...(p.wordWrap && { wordWrap: p.wordWrap }),
          ...(p.backgroundColor && { backgroundColor: p.backgroundColor }),
        }
        const background = p.background
          ? phaserScene.rexUI?.add.roundRectangle(
              0,
              0,
              0,
              0,
              p.background.radius ?? 6,
              p.background.color ?? 0x2a2a2a
            )
          : undefined
        const textObject = phaserScene.add.text(0, 0, p.text ?? '', textStyle)
        const label = phaserScene.rexUI?.add.label({
          x: p.x ?? 0,
          y: p.y ?? 0,
          text: textObject,
          background,
          space: p.space,
          align: p.align,
        }) as RexLabelType
        if (p.onPointerdown) {
          const interactiveLabel = label as {
            setInteractive?: () => void
            input?: { cursor?: string }
          }
          interactiveLabel.setInteractive?.()
          if (interactiveLabel.input) interactiveLabel.input.cursor = 'pointer'
          label.on('pointerdown', p.onPointerdown)
        }
        return label
      }
      case 'Text': {
        const textProps = props as {
          x?: number
          y?: number
          text?: string
          style?: Phaser.Types.GameObjects.Text.TextStyle
          onPointerdown?: () => void
        }
        const text = phaserScene.add.text(
          textProps.x ?? 0,
          textProps.y ?? 0,
          textProps.text ?? '',
          textProps.style
        )
        if (textProps.onPointerdown) {
          text.setInteractive()
          if (text.input) text.input.cursor = 'pointer'
          text.on('pointerdown', textProps.onPointerdown)
        }
        return text
      }
      default:
        throw new Error(`Unknown node type: ${type}`)
    }
  },

  /**
   * Appends child node to parent container
   * @param parent - Parent container or scene
   * @param child - Child node to append
   */
  append(parent: ParentType, child: Phaser.GameObjects.GameObject) {
    if (isRexContainer(parent)) {
      parent.add(child)
    } else {
      const parentObj = parent as {
        scene?: {
          sys?: { game?: { constructor?: unknown } }
          children?: { add?: (child: unknown) => void }
        }
        add?: { existing?: (child: unknown) => void }
      }
      const game = parentObj.scene?.sys?.game
      if (game && parent instanceof (game.constructor as { new (): unknown })) {
        parentObj.add?.existing?.(child)
      } else {
        parentObj.scene?.children?.add?.(child)
      }
    }
  },

  /**
   * Removes child node from parent and destroys it
   * @param parent - Parent container
   * @param child - Child node to remove
   */
  remove(parent: ParentType, child: Phaser.GameObjects.GameObject) {
    // Check if child still has a scene (not already destroyed)
    const childObj = child as {
      scene?: Phaser.Scene | null
      destroy?: (destroyChildren?: boolean) => void
    }

    if (!childObj.scene) return

    // Remove from parent container first
    if (isRexContainer(parent)) {
      parent.remove(child, false)
    }

    // Destroy the child WITHOUT destroying its children (we handle that separately in unmount)
    childObj.destroy?.(false)
  },

  /**
   * Patches node properties with updates
   * @param node - Node to patch
   * @param prev - Previous props
   * @param next - New props
   */
  patch(node: unknown, prev: Record<string, unknown>, next: Record<string, unknown>) {
    const nodeObj = node as {
      x?: number
      y?: number
      text?: Phaser.GameObjects.Text
      setText?: (text: string) => void
      setStyle?: (style: unknown) => void
      off?: (event: string, handler: unknown) => void
      on?: (event: string, handler: unknown) => void
      setInteractive?: () => void
    }
    if (prev.x !== next.x && typeof next.x === 'number') nodeObj.x = next.x
    if (prev.y !== next.y && typeof next.y === 'number') nodeObj.y = next.y

    // Text-like props
    if (
      'text' in next &&
      typeof next.text === 'string' &&
      (prev as Record<string, unknown>).text !== next.text
    ) {
      nodeObj.setText?.(next.text)
    }
    if (
      'textStyle' in next &&
      next.textStyle &&
      JSON.stringify((prev as Record<string, unknown>).textStyle) !== JSON.stringify(next.textStyle)
    ) {
      nodeObj.setStyle?.(next.textStyle)
    }

    // Pointer events
    const prevPointer = (prev as { onPointerdown?: () => void }).onPointerdown
    const nextPointer = (next as { onPointerdown?: () => void }).onPointerdown
    if (prevPointer !== nextPointer) {
      if (prevPointer) nodeObj.off?.('pointerdown', prevPointer)
      if (nextPointer) {
        nodeObj.setInteractive?.()
        const interactiveNode = node as { input?: { cursor?: string } }
        if (interactiveNode.input) interactiveNode.input.cursor = 'pointer'
        nodeObj.on?.('pointerdown', nextPointer)
      }
    }

    if (isRexContainer(node) && affectsLayout(prev, next)) scheduleLayout(node)
  },

  /**
   * Performs layout update on container
   * @param node - Node to layout
   */
  layout(node: unknown) {
    if (isRexContainer(node)) {
      scheduleLayout(node)
    }
  },
}
