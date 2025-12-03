/** @jsxImportSource ../.. */
/**
 * Portal component - renders children into a separate tree at specified depth
 * Enables overlays, modals, tooltips without affecting parent tree layout
 */
import { getGestureManager } from '../../gestures/gesture-manager'
import { useEffect, useMemo, useScene } from '../../hooks'
import { DeferredLayoutQueue } from '../../layout/layout-engine'
import type { LayoutSize } from '../../layout/types'
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
}

/**
 * Portal component
 * Renders child VNode into a separate container tree at specified depth.
 * Automatically injects event blockers to prevent click-through and scrolling.
 *
 * @example
 * ```tsx
 * // Basic portal (automatically blocks events in content area)
 * <Portal depth={1000}>
 *   <View>Overlay content</View>
 * </Portal>
 *
 * // Non-blocking portal (allows click-through)
 * <Portal depth={500} blockEvents={false}>
 *   <View>Info overlay - clickable background</View>
 * </Portal>
 *
 * // Portal with custom event handling (original handlers are preserved)
 * <Portal depth={1000}>
 *   <View onTouch={(e) => console.log('clicked')}>
 *     Content
 *   </View>
 * </Portal>
 * ```
 */
export function Portal(props: PortalProps) {
  const portalId = useMemo(() => props.id ?? portalRegistry.generateId(), [props.id])
  const depth = props.depth ?? 1000
  const scene = useScene()
  const blockEvents = props.blockEvents ?? true

  useEffect(() => {
    // Register portal with depth-based container first
    const portalContainer = portalRegistry.register(
      portalId,
      depth,
      scene,
      { type: 'View', props: {}, children: [] },
      scene.add.container(0, 0)
    )

    // Create invisible blocker container if blockEvents enabled
    let blockerContainer: Phaser.GameObjects.Container | null = null
    if (blockEvents) {
      blockerContainer = scene.add.container(0, 0)
      portalContainer.add(blockerContainer)
      // Set depth to be behind content (will be adjusted after mount)
      blockerContainer.setDepth(-1)
    }

    // Mount children directly (preserves absolute positioning)
    const children = Array.isArray(props.children) ? props.children : [props.children]
    for (const child of children) {
      if (child) {
        const mountedNode = mount(portalContainer, child)
        if (mountedNode) {
          portalContainer.add(mountedNode)
        }
      }
    }

    // Register event blocker on invisible container AFTER layout completes
    const gestureManager = getGestureManager(scene)
    if (blockEvents && blockerContainer) {
      const blocker = blockerContainer
      DeferredLayoutQueue.defer(() => {
        // Get layout dimensions from first mounted child (content)
        const firstChild = portalContainer.getAt(1) as Phaser.GameObjects.Container & {
          __cachedLayoutSize?: LayoutSize
          __getLayoutSize?: () => LayoutSize
        }

        if (!firstChild) return

        // Get dimensions from layout system
        let width = 0
        let height = 0
        let x = 0
        let y = 0

        if (firstChild.__cachedLayoutSize) {
          width = firstChild.__cachedLayoutSize.width
          height = firstChild.__cachedLayoutSize.height
        } else if (firstChild.__getLayoutSize) {
          const size = firstChild.__getLayoutSize()
          width = size.width
          height = size.height
        } else {
          const bounds = firstChild.getBounds()
          width = bounds.width
          height = bounds.height
        }

        // Position blocker at same location as content
        x = firstChild.x
        y = firstChild.y
        blocker.setPosition(x, y)

        // Register blocker container (not content!) with event blockers
        const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)

        gestureManager.registerContainer(
          blocker,
          {
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
      if (blockEvents && blockerContainer) {
        gestureManager.unregisterContainer(blockerContainer)
      }
      portalRegistry.unregister(portalId)
    }
  }, [portalId, depth, scene, props.children, blockEvents])

  // Portal renders nothing in parent tree
  return null
}
