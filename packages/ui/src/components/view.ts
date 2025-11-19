/**
 * View component implementation - native Phaser Container with background and interaction support
 */
import Phaser from 'phaser'
import type { BackgroundProps, GestureProps, LayoutProps, TransformProps } from '../core-props'
import { DebugLogger } from '../dev-config'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsContainerExtension, PropsDefaultExtension } from '../types'
import { applyBackgroundProps } from './appliers/applyBackground'
import { applyGesturesProps } from './appliers/applyGestures'
import { applyLayoutProps } from './appliers/applyLayout'
import { applyTransformProps } from './appliers/applyTransform'
import { createBackground } from './creators/createBackground'
import { createGestures } from './creators/createGestures'
import { createLayout } from './creators/createLayout'
import { createTransform } from './creators/createTransform'

/**
 * Base props for View - composing shared prop groups
 */
export interface ViewBaseProps extends TransformProps, LayoutProps, BackgroundProps, GestureProps {}

/**
 * Props for View (Container) component - extends base props with JSX-specific props
 */
export interface ViewProps
  extends ViewBaseProps,
    PropsDefaultExtension<Phaser.GameObjects.Container>,
    PropsContainerExtension {}

/**
 * View creator - creates a Phaser Container with optional background and interaction
 */
export const viewCreator: HostCreator<'View'> = (scene, props) => {
  // Debug: Log props to verify theme values
  if (props.backgroundColor !== undefined || props.cornerRadius !== undefined) {
    DebugLogger.log('theme', 'View Creator - Props received:', {
      backgroundColor: props.backgroundColor,
      cornerRadius: props.cornerRadius,
      width: props.width,
      height: props.height,
    })
  }

  const container = scene.add.container(props.x ?? 0, props.y ?? 0)

  // Apply transform props (visible, depth, alpha, scale, rotation)
  createTransform(container, props)

  // Add background if backgroundColor is provided
  createBackground(
    scene,
    container as typeof container & { __background?: Phaser.GameObjects.Graphics },
    props
  )

  // Setup layout system (props and size provider)
  // Must be before createGestures so __getLayoutSize is available
  createLayout(container, props)

  // Setup gesture system (high-level touch/mouse gestures)
  createGestures(scene, container, props)

  // Debug: Log layout props storage
  DebugLogger.log('layout', 'View creator storing __layoutProps with padding:', props.padding)

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
    __background?: Phaser.GameObjects.Graphics
  }

  applyBackgroundProps(container, prev, next)

  // Gesture event handlers (high-level touch/mouse gestures)
  applyGesturesProps(container.scene, container, prev, next)

  // Apply layout props and recalculate if needed
  applyLayoutProps(container, prev, next)
}
