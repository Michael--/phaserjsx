/**
 * View component implementation - native Phaser Container with background and interaction support
 */
import Phaser from 'phaser'
import type { BackgroundProps, InteractionProps, LayoutProps, TransformProps } from '../core-props'
import { DebugLogger } from '../dev-config'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsContainerExtension, PropsDefaultExtension } from '../types'
import { applyBackgroundProps } from './appliers/applyBackground'
import { applyInteractionProps } from './appliers/applyInteraction'
import { applyLayoutProps } from './appliers/applyLayout'
import { applyTransformProps } from './appliers/applyTransform'
import { createBackground } from './creators/createBackground'
import { createInteraction } from './creators/createInteraction'
import { createLayout } from './creators/createLayout'
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
    console.log('[View Creator] Props received:', {
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

  // Setup pointer interaction if any event handlers are provided
  createInteraction(container, props)

  // Setup layout system (props and size provider)
  createLayout(container, props)

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

  // Pointer event handlers
  applyInteractionProps(container, prev, next)

  // Apply layout props and recalculate if needed
  applyLayoutProps(container, prev, next)
}
