/**
 * View component implementation - native Phaser Container with background and interaction support
 */
import Phaser from 'phaser'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsExtension } from '../types'

/**
 * Base props for View (Container) - without JSX-specific props
 */
export interface ViewBaseProps {
  x?: number
  y?: number
  visible?: boolean
  depth?: number
  alpha?: number
  scaleX?: number
  scaleY?: number
  rotation?: number
  width?: number
  height?: number
  backgroundColor?: number
  backgroundAlpha?: number
  onPointerDown?: (pointer: Phaser.Input.Pointer) => void
  onPointerUp?: (pointer: Phaser.Input.Pointer) => void
  onPointerOver?: (pointer: Phaser.Input.Pointer) => void
  onPointerOut?: (pointer: Phaser.Input.Pointer) => void
}

/**
 * Props for View (Container) component - extends base props with JSX-specific props
 */
export interface ViewProps extends ViewBaseProps, PropsExtension {}

/**
 * View creator - creates a Phaser Container with optional background and interaction
 */
export const viewCreator: HostCreator<'View'> = (scene, props) => {
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
export const viewPatcher: HostPatcher<'View'> = (node, prev, next) => {
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
