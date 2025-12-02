/** @jsxImportSource ../.. */
/**
 * Portal component - renders children into a separate tree at specified depth
 * Enables overlays, modals, tooltips without affecting parent tree layout
 */
import { getGestureManager } from '../../gestures/gesture-manager'
import { useEffect, useMemo, useScene } from '../../hooks'
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
}

/**
 * Portal component
 * Renders children into a separate container tree at specified depth
 *
 * @example
 * ```tsx
 * // Basic portal
 * <Portal depth={1000}>
 *   <View>Overlay content</View>
 * </Portal>
 *
 * // Modal backdrop
 * <Portal depth={2000}>
 *   <View width="100vw" height="100vh" backgroundColor={0x000000} alpha={0.5} />
 * </Portal>
 * ```
 */
export function Portal(props: PortalProps) {
  const portalId = useMemo(() => props.id ?? portalRegistry.generateId(), [props.id])
  const depth = props.depth ?? 1000
  const scene = useScene()

  useEffect(() => {
    // Register portal with depth-based container first
    const portalContainer = portalRegistry.register(
      portalId,
      depth,
      scene,
      { type: 'View', props: {}, children: [] },
      scene.add.container(0, 0)
    )

    // Register portal container as event blocker to prevent click-through and scrolling
    // Use full screen hit area to block all events below this portal
    const gestureManager = getGestureManager(scene)
    const hitArea = new Phaser.Geom.Rectangle(0, 0, scene.scale.width, scene.scale.height)
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

    // Cleanup on unmount
    return () => {
      gestureManager.unregisterContainer(portalContainer)
      portalRegistry.unregister(portalId)
    }
  }, [portalId, depth, scene, props.children])

  // Portal renders nothing in parent tree
  return null
}
