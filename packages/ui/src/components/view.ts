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
 * Normalize background props - apply auto-defaults for alpha and border width
 * @param props - Original props
 * @returns Normalized props with auto-defaults applied
 */
function normalizeBackgroundProps<T>(props: T): T {
  // Only process if props contain background/border properties
  const bgProps = props as unknown as Partial<BackgroundProps>
  const hasBackground = bgProps.backgroundColor !== undefined
  const hasBorder = bgProps.borderColor !== undefined

  // If no background/border props, return as-is
  if (!hasBackground && !hasBorder) {
    return props
  }

  // Only apply defaults if the prop is explicitly undefined or 0 (theme default)
  // This allows users to override with explicit values
  const normalized = { ...props } as T & Partial<BackgroundProps>

  if (hasBackground && (bgProps.backgroundAlpha === undefined || bgProps.backgroundAlpha === 0)) {
    normalized.backgroundAlpha = 1
  }

  if (hasBorder) {
    if (bgProps.borderWidth === undefined || bgProps.borderWidth === 0) {
      normalized.borderWidth = 1
    }
    if (bgProps.borderAlpha === undefined || bgProps.borderAlpha === 0) {
      normalized.borderAlpha = 1
    }
  }

  return normalized as T
}

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

  // Normalize props early - apply auto-defaults for background/border
  const normalizedProps = normalizeBackgroundProps(props)

  const container = scene.add.container(normalizedProps.x ?? 0, normalizedProps.y ?? 0)

  // Apply transform props (visible, depth, alpha, scale, rotation)
  createTransform(container, normalizedProps)

  // Add background if backgroundColor is provided
  createBackground(
    scene,
    container as typeof container & { __background?: Phaser.GameObjects.Graphics },
    normalizedProps
  )

  // Setup layout system (props and size provider)
  // Must be before createGestures so __getLayoutSize is available
  createLayout(container, normalizedProps)

  // Setup gesture system (high-level touch/mouse gestures)
  createGestures(scene, container, normalizedProps)

  // Debug: Log layout props storage
  DebugLogger.log(
    'layout',
    'View creator storing __layoutProps with padding:',
    normalizedProps.padding
  )

  return container
}

/**
 * View patcher - updates View properties
 */
export const viewPatcher: HostPatcher<'View'> = (node, prev, next) => {
  // Normalize props early - apply auto-defaults for background/border
  const normalizedPrev = normalizeBackgroundProps(prev)
  const normalizedNext = normalizeBackgroundProps(next)

  // Apply transform props (position, rotation, scale, alpha, depth, visibility)
  applyTransformProps(node, normalizedPrev, normalizedNext)

  // Background updates
  const container = node as Phaser.GameObjects.Container & {
    __background?: Phaser.GameObjects.Graphics
  }

  applyBackgroundProps(container, normalizedPrev, normalizedNext)

  // Gesture event handlers (high-level touch/mouse gestures)
  applyGesturesProps(container.scene, container, normalizedPrev, normalizedNext)

  // Apply layout props and recalculate if needed
  applyLayoutProps(container, normalizedPrev, normalizedNext)
}
