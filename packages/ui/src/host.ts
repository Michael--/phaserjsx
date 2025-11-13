/**
 * Host bridge that maps declarative nodes to Phaser/rexUI objects.
 * Keep this small; extend gradually as needed.
 */
import type Phaser from 'phaser'
import type { ParentType, RexLabelProps, RexLabelType, RexSizerProps, RexSizerType } from './types'

type RexSizer = RexSizerType

function isRexContainer(n: unknown): n is RexSizer {
  return !!(
    (n as RexSizer | null)?.layout &&
    (n as RexSizer | null)?.add &&
    (n as RexSizer | null)?.remove
  )
}

/**
 * Checks if props affect layout and require re-layout
 * @param prev - Previous props
 * @param next - New props
 * @returns true if layout-affecting props changed
 */
function affectsLayout(prev: Record<string, unknown>, next: Record<string, unknown>) {
  return (
    prev.space !== next.space ||
    prev.align !== next.align ||
    prev.orientation !== next.orientation ||
    prev.width !== next.width ||
    prev.height !== next.height
  )
}

/**
 * Schedules layout update on next tick/frame
 * @param node - Node to layout
 */
function scheduleLayout(node: {
  scene?: { time?: { delayedCall?: (delay: number, callback: () => void) => void } }
  layout: () => void
}) {
  // Debounce to next tick/frame
  node.scene?.time?.delayedCall?.(0, () => node.layout())
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
    type: string,
    props: Record<string, unknown>,
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
          x: p.x ?? 0,
          y: p.y ?? 0,
          orientation: p.orientation ?? 'y',
          space: p.space,
          align: p.align,
        })
        return sizer as RexSizerType
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
        const textObject = phaserScene.add.text(0, 0, p.text ?? '', p.textStyle)
        const label = phaserScene.rexUI?.add.label({
          x: p.x ?? 0,
          y: p.y ?? 0,
          text: textObject,
          background,
          space: p.space,
          align: p.align,
        }) as RexLabelType
        if (p.onPointerdown) label.on('pointerdown', p.onPointerdown)
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
        if (textProps.onPointerdown) text.on('pointerdown', textProps.onPointerdown)
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
    if (isRexContainer(parent)) parent.add(child)
    else {
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
    if (isRexContainer(parent)) parent.remove(child, true)
    ;(child as { destroy?: (destroyChildren?: boolean) => void }).destroy?.(true)
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
      setText?: (text: string) => void
      setStyle?: (style: unknown) => void
      off?: (event: string, handler: unknown) => void
      on?: (event: string, handler: unknown) => void
      setInteractive?: () => void
    }
    if (prev.x !== next.x && typeof next.x === 'number') nodeObj.x = next.x
    if (prev.y !== next.y && typeof next.y === 'number') nodeObj.y = next.y

    // Text-like props
    if ('text' in next && prev.text !== next.text && typeof next.text === 'string')
      nodeObj.setText?.(next.text)
    if (next.textStyle && JSON.stringify(prev.textStyle) !== JSON.stringify(next.textStyle)) {
      nodeObj.setStyle?.(next.textStyle)
    }

    // Pointer events
    if (prev.onPointerDown !== next.onPointerDown) {
      if (prev.onPointerDown) nodeObj.off?.('pointerdown', prev.onPointerDown)
      if (next.onPointerDown) {
        nodeObj.setInteractive?.()
        nodeObj.on?.('pointerdown', next.onPointerDown)
      }
    }

    if (isRexContainer(node) && affectsLayout(prev, next)) scheduleLayout(node)
  },

  /**
   * Performs layout update on container
   * @param node - Node to layout
   */
  layout(node: unknown) {
    if (isRexContainer(node)) node.layout()
  },
}
