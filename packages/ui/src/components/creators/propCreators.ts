/**
 * Shared property creators for component initialization
 * These functions avoid code duplication when creating nodes with initial properties
 */
import type Phaser from 'phaser'
import type { BackgroundProps, TransformProps } from '../../core-props'

/**
 * Apply transform properties during node creation
 * @param node - Node with transform capabilities
 * @param props - Initial props
 */
export function applyTransformPropsOnCreate<
  T extends {
    visible: boolean
    setDepth: (depth: number) => void
    setAlpha: (alpha: number) => void
    setScale: (x: number, y: number) => void
    setRotation: (rotation: number) => void
  },
>(node: T, props: Partial<TransformProps>): void {
  if (props.visible !== undefined) {
    node.visible = props.visible as boolean
  }
  if (props.depth !== undefined) {
    node.setDepth(props.depth as number)
  }
  if (props.alpha !== undefined) {
    node.setAlpha(props.alpha as number)
  }
  if (props.scaleX !== undefined || props.scaleY !== undefined) {
    node.setScale(
      (props.scaleX as number | undefined) ?? 1,
      (props.scaleY as number | undefined) ?? 1
    )
  }
  if (props.rotation !== undefined) {
    node.setRotation(props.rotation as number)
  }
}

/**
 * Create background rectangle for container-based components
 * @param scene - Phaser scene
 * @param container - Container to add background to
 * @param props - Props with background settings
 */
export function createBackground(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container & { __background?: Phaser.GameObjects.Rectangle },
  props: Partial<BackgroundProps & { width?: number; height?: number }>
): void {
  if (props.backgroundColor !== undefined) {
    const width = (props.width as number | undefined) ?? 100
    const height = (props.height as number | undefined) ?? 100
    const bgAlpha = (props.backgroundAlpha as number | undefined) ?? 1
    const background = scene.add.rectangle(
      0,
      0,
      width,
      height,
      props.backgroundColor as number,
      bgAlpha
    )
    background.setOrigin(0, 0)
    container.add(background)
    container.__background = background
  }
}
