/** @jsxImportSource ../.. */
/**
 * Portal component - renders children into a separate tree at specified depth
 * Enables overlays, modals, tooltips without affecting parent tree layout
 */
import { getGestureManager } from '../../gestures/gesture-manager'
import { useEffect, useMemo, useScene } from '../../hooks'
import { DeferredLayoutQueue } from '../../layout/layout-engine'
import { portalRegistry } from '../../portal'
import type { ChildrenType } from '../../types'
import { mount } from '../../vdom'

/**
 * Props for Portal component
 */
export interface PortalProps {
  /** Content to render in portal */
  children: ChildrenType
  /** Z-depth for portal (higher = foreground) */
  depth?: number
  /** Optional custom portal ID */
  id?: string
  /** Block events (click-through and scrolling) - default: true */
  blockEvents?: boolean
  /** Block events for entire screen instead of content bounds - default: false */
  blockFullScreen?: boolean
}

/**
 * Portal component
 * Renders children into a separate container tree at specified depth
 *
 * @example
 * ```tsx
 * // Basic portal (blocks events only in content area)
 * <Portal depth={1000}>
 *   <View>Overlay content</View>
 * </Portal>
 *
 * // Full-screen modal backdrop
 * <Portal depth={2000} blockFullScreen={true}>
 *   <View width="100vw" height="100vh" backgroundColor={0x000000} alpha={0.5} />
 * </Portal>
 *
 * // Non-blocking portal (allows click-through)
 * <Portal depth={500} blockEvents={false}>
 *   <View>Info overlay - clickable background</View>
 * </Portal>
 * ```
 */
export function Portal(props: PortalProps) {
  const portalId = useMemo(() => props.id ?? portalRegistry.generateId(), [props.id])
  const depth = props.depth ?? 1000
  const scene = useScene()
  const blockEvents = props.blockEvents ?? true
  const blockFullScreen = props.blockFullScreen ?? false

  useEffect(() => {
    // Register portal with depth-based container first
    const portalContainer = portalRegistry.register(
      portalId,
      depth,
      scene,
      { type: 'View', props: {}, children: [] },
      scene.add.container(0, 0)
    )

    // Mount children directly into portal container
    // props.children is already a VNode or array of VNodes
    const children = Array.isArray(props.children) ? props.children : [props.children]

    for (const child of children) {
      if (child) {
        const mountedNode = mount(portalContainer, child)
        if (mountedNode) {
          portalContainer.add(mountedNode)
        }
      }
    }

    // Register event blocker AFTER layout completes (if enabled)
    // This prevents click-through and scrolling below portal
    const gestureManager = getGestureManager(scene)
    if (blockEvents) {
      DeferredLayoutQueue.defer(() => {
        let hitArea: Phaser.Geom.Rectangle

        if (blockFullScreen) {
          // Full screen blocking (for modals)
          hitArea = new Phaser.Geom.Rectangle(0, 0, scene.scale.width, scene.scale.height)
        } else {
          // Content-based blocking - use layout system dimensions
          const containerWithLayout = portalContainer as {
            __cachedLayoutSize?: { width: number; height: number }
            __getLayoutSize?: () => { width: number; height: number }
          }

          // Priority: __cachedLayoutSize (most reliable) > __getLayoutSize() > getBounds()
          let width = 0
          let height = 0

          if (containerWithLayout.__cachedLayoutSize) {
            width = containerWithLayout.__cachedLayoutSize.width
            height = containerWithLayout.__cachedLayoutSize.height
          } else if (containerWithLayout.__getLayoutSize) {
            const size = containerWithLayout.__getLayoutSize()
            width = size.width
            height = size.height
          } else {
            const bounds = portalContainer.getBounds()
            width = bounds.width
            height = bounds.height
          }

          hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)
        }

        console.log(
          'Registering portal event blocker',
          portalId,
          hitArea,
          'at',
          portalContainer.x,
          portalContainer.y
        )

        gestureManager.registerContainer(
          portalContainer,
          {
            // Event blocker: stops propagation to prevent click-through and scrolling
            onTouch: (e) => {
              e.stopPropagation()
            },
            onTouchMove: (e) => {
              e.stopPropagation()
            },
          },
          hitArea
        )
      })
    }

    // Cleanup on unmount
    return () => {
      if (blockEvents) {
        gestureManager.unregisterContainer(portalContainer)
      }
      portalRegistry.unregister(portalId)
    }
  }, [portalId, depth, scene, props.children, blockEvents, blockFullScreen])

  // Portal renders nothing in parent tree
  return null
}
