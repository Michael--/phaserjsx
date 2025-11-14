/**
 * View component implementation - native Phaser Container with background and interaction support
 */
import Phaser from 'phaser'
import type { BackgroundProps, InteractionProps, LayoutProps, TransformProps } from '../core-props'
import type { HostCreator, HostPatcher } from '../host'
import { calculateLayout, type LayoutSize } from '../layout'
import type { PropsExtension } from '../types'
import { applyBackgroundProps } from './appliers/applyBackground'
import { applyTransformProps } from './appliers/applyTransform'
import { createBackground } from './creators/createBackground'
import { createInteraction } from './creators/createInteraction'
import { createTransform } from './creators/createTransform'

/**
 * Base props for View - composing shared prop groups
 */
export interface ViewBaseProps
  extends TransformProps,
    LayoutProps,
    BackgroundProps,
    InteractionProps {}

/**
 * Props for View (Container) component - extends base props with JSX-specific props
 */
export interface ViewProps extends ViewBaseProps, PropsExtension {}

/**
 * View creator - creates a Phaser Container with optional background and interaction
 */
export const viewCreator: HostCreator<'View'> = (scene, props) => {
  const container = scene.add.container(props.x ?? 0, props.y ?? 0)

  // Apply transform props (visible, depth, alpha, scale, rotation)
  createTransform(container, props)

  // Add background if backgroundColor is provided
  createBackground(
    scene,
    container as typeof container & { __background?: Phaser.GameObjects.Rectangle },
    props
  )

  // Setup pointer interaction if any event handlers are provided
  createInteraction(container, props)

  // Attach layout props for layout calculations
  ;(container as Phaser.GameObjects.Container & { __layoutProps?: ViewProps }).__layoutProps = props

  // Attach dynamic size provider
  ;(
    container as Phaser.GameObjects.Container & { __getLayoutSize?: () => LayoutSize }
  ).__getLayoutSize = () => {
    // If explicit dimensions are provided, use them
    if (props.width !== undefined && props.height !== undefined) {
      return {
        width: props.width,
        height: props.height,
      }
    }

    // Otherwise, compute from children
    const children = container.list as Array<
      Phaser.GameObjects.GameObject & {
        __isBackground?: boolean
        __layoutProps?: LayoutProps
        __getLayoutSize?: () => LayoutSize
        width?: number
        height?: number
      }
    >

    const padding = props.padding ?? {}
    const paddingLeft = padding.left ?? 0
    const paddingTop = padding.top ?? 0
    const paddingRight = padding.right ?? 0
    const paddingBottom = padding.bottom ?? 0

    let maxWidth = 0
    let totalHeight = paddingTop

    for (const child of children) {
      if (child.__isBackground) continue

      const margin = child.__layoutProps?.margin ?? {}
      const marginTop = margin.top ?? 0
      const marginBottom = margin.bottom ?? 0

      let childSize: LayoutSize
      if (child.__getLayoutSize) {
        childSize = child.__getLayoutSize()
      } else {
        const layoutWidth = child.__layoutProps?.width
        const layoutHeight = child.__layoutProps?.height
        childSize = {
          width: layoutWidth ?? child.width ?? 100,
          height: layoutHeight ?? child.height ?? 20,
        }
      }

      maxWidth = Math.max(maxWidth, childSize.width)
      totalHeight += marginTop + childSize.height + marginBottom
    }

    return {
      width: props.width ?? maxWidth + paddingLeft + paddingRight,
      height: props.height ?? totalHeight + paddingBottom,
    }
  }

  // Debug: Log what we're storing
  if (props.padding) {
    console.log('[View Creator] Storing __layoutProps with padding:', props.padding)
  }

  return container
}

/**
 * View patcher - updates View properties
 */
export const viewPatcher: HostPatcher<'View'> = (node, prev, next) => {
  // Apply transform props (position, rotation, scale, alpha, depth, visibility)
  applyTransformProps(node, prev, next)

  // Background updates
  const container = node as Phaser.GameObjects.Container & {
    __background?: Phaser.GameObjects.Rectangle
  }

  applyBackgroundProps(container, prev, next)

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
      ;(background as Phaser.GameObjects.Rectangle & { __isBackground?: boolean }).__isBackground =
        true
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

  // Recalculate layout after any changes
  calculateLayout(container, next)

  // Update size provider if children or dimensions changed
  ;(
    container as Phaser.GameObjects.Container & { __getLayoutSize?: () => LayoutSize }
  ).__getLayoutSize = () => {
    // If explicit dimensions are provided, use them
    if (next.width !== undefined && next.height !== undefined) {
      return {
        width: next.width,
        height: next.height,
      }
    }

    // Otherwise, compute from children
    const children = container.list as Array<
      Phaser.GameObjects.GameObject & {
        __isBackground?: boolean
        __layoutProps?: LayoutProps
        __getLayoutSize?: () => LayoutSize
        width?: number
        height?: number
      }
    >

    const padding = next.padding ?? {}
    const paddingLeft = padding.left ?? 0
    const paddingTop = padding.top ?? 0
    const paddingRight = padding.right ?? 0
    const paddingBottom = padding.bottom ?? 0

    let maxWidth = 0
    let totalHeight = paddingTop

    for (const child of children) {
      if (child.__isBackground) continue

      const margin = child.__layoutProps?.margin ?? {}
      const marginTop = margin.top ?? 0
      const marginBottom = margin.bottom ?? 0

      let childSize: LayoutSize
      if (child.__getLayoutSize) {
        childSize = child.__getLayoutSize()
      } else {
        const layoutWidth = child.__layoutProps?.width
        const layoutHeight = child.__layoutProps?.height
        childSize = {
          width: layoutWidth ?? child.width ?? 100,
          height: layoutHeight ?? child.height ?? 20,
        }
      }

      maxWidth = Math.max(maxWidth, childSize.width)
      totalHeight += marginTop + childSize.height + marginBottom
    }

    return {
      width: next.width ?? maxWidth + paddingLeft + paddingRight,
      height: next.height ?? totalHeight + paddingBottom,
    }
  }
}
