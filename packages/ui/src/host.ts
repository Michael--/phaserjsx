import Phaser from 'phaser'
import type { ParentType, RexLabelProps, RexLabelType, RexSizerProps, RexSizerType } from './types'
import { RexLabel, RexSizer } from './widgets'

type ComponentType = typeof RexSizer | typeof RexLabel | typeof Text
type ComponentProps = RexSizerProps | RexLabelProps

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
          orientation: p.orientation ?? 'x',
          align: p.align,
        }) as RexSizerType
        return sizer
      }
      case 'RexLabel': {
        const p = props as RexLabelProps
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
        const textObject = phaserScene.add.text(0, 0, p.text ?? '')
        const label = phaserScene.rexUI?.add.label({
          text: textObject,
          background,
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
      default:
        throw new Error(`Unknown node type: ${type}`)
    }
  },

  /**
   * Appends child node to parent container
   * @param parent - Parent container or scene
   * @param child - Child node to append
   * @param addConfig - Optional RexUI add() configuration (expand, proportion, etc.)
   */
  append(
    parent: ParentType,
    child: Phaser.GameObjects.GameObject,
    addConfig?: {
      expand?: boolean
      proportion?: number
      align?: string
      padding?: number | { left?: number; right?: number; top?: number; bottom?: number }
    }
  ) {
    if (isRexContainer(parent)) {
      // RexUI containers accept add config
      ;(parent as { add: (child: unknown, config?: unknown) => void }).add(child, addConfig)
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

    // Background color changes for RexUI containers
    if (isRexContainer(node)) {
      const prevBg = (prev as { background?: { color?: number } }).background
      const nextBg = (next as { background?: { color?: number } }).background
      if (prevBg?.color !== nextBg?.color && nextBg?.color !== undefined) {
        const rexNode = node as {
          backgroundChildren?: Phaser.GameObjects.GameObject[]
        }
        // RexUI Sizer stores background as first child in backgroundChildren array
        const bgShape = rexNode.backgroundChildren?.[0] as
          | {
              setFillStyle?: (color: number, alpha?: number) => void
            }
          | undefined
        if (bgShape?.setFillStyle) {
          bgShape.setFillStyle(nextBg.color)
        }
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
