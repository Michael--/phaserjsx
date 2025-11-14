/**
 * Layout system for positioning children within containers
 * Implements vertical stacking with margins and padding support
 */
import type Phaser from 'phaser'
import type { EdgeInsets, LayoutProps } from './core-props'

/**
 * Size information for layout calculations
 */
export interface LayoutSize {
  width: number
  height: number
}

/**
 * Interface for nodes that can provide their layout dimensions dynamically
 */
export interface LayoutSizeProvider {
  /**
   * Get the layout size of this node
   * This can be computed dynamically (e.g., from text bounds, children, etc.)
   * or return fixed dimensions
   * @returns Width and height for layout calculations
   */
  __getLayoutSize: () => LayoutSize
}

/**
 * Extended GameObject with layout metadata
 */
type GameObjectWithLayout = Phaser.GameObjects.GameObject & {
  __layoutProps?: LayoutProps
  __isBackground?: boolean
  __background?: Phaser.GameObjects.Rectangle
  __getLayoutSize?: () => LayoutSize
  x?: number
  y?: number
  width?: number
  height?: number
  setPosition?: (x: number, y: number) => void
}

/**
 * Get effective margin for a child
 * @param child - Child game object
 * @returns Edge insets
 */
function getMargin(child: GameObjectWithLayout): EdgeInsets {
  return child.__layoutProps?.margin ?? {}
}

/**
 * Get effective size of a child
 * Calls __getLayoutSize if available, otherwise falls back to layoutProps or default
 * @param child - Child game object
 * @returns Width and height
 */
function getChildSize(child: GameObjectWithLayout): { width: number; height: number } {
  // Use dynamic size provider if available
  if (child.__getLayoutSize) {
    return child.__getLayoutSize()
  }

  // Fallback to layout props or dimensions
  const layoutWidth = child.__layoutProps?.width
  const layoutHeight = child.__layoutProps?.height

  return {
    width: layoutWidth ?? child.width ?? 100,
    height: layoutHeight ?? child.height ?? 20,
  }
}

/**
 * Calculate layout for a container and its children
 * Uses vertical stacking with margin support
 * @param container - Phaser container with children
 * @param containerProps - Layout props of the container
 */
export function calculateLayout(
  container: Phaser.GameObjects.Container,
  containerProps: LayoutProps
): void {
  const children = container.list as GameObjectWithLayout[]

  console.log('[Layout] Container with', children?.length ?? 0, 'children, props:', containerProps)

  if (!children || !Array.isArray(children)) return

  const padding = containerProps.padding ?? {}
  const paddingLeft = padding.left ?? 0
  const paddingTop = padding.top ?? 0
  const paddingRight = padding.right ?? 0
  const paddingBottom = padding.bottom ?? 0

  console.log('  Padding:', {
    top: paddingTop,
    left: paddingLeft,
    right: paddingRight,
    bottom: paddingBottom,
  })

  let currentY = paddingTop
  let maxWidth = 0

  for (const child of children) {
    // Skip background rectangles
    if (child.__isBackground) {
      console.log('  Skipping background')
      continue
    }

    // If child is a container, recursively calculate its layout first to get its size
    if ('list' in child && Array.isArray((child as Phaser.GameObjects.Container).list)) {
      const childContainer = child as Phaser.GameObjects.Container
      const childLayoutProps = (child as GameObjectWithLayout).__layoutProps ?? {}
      console.log('  -> Child is a container, calculating nested layout first')
      calculateLayout(childContainer, childLayoutProps)
    }

    // Get child size after potential recursive layout
    const size = getChildSize(child)
    console.log('  Child size:', size)

    // Get child margin
    const margin = getMargin(child)
    const marginTop = margin.top ?? 0
    const marginBottom = margin.bottom ?? 0
    const marginLeft = margin.left ?? 0
    const marginRight = margin.right ?? 0

    console.log('  Child margin:', {
      top: marginTop,
      bottom: marginBottom,
      left: marginLeft,
      right: marginRight,
    })

    // Update max width including margins
    const childTotalWidth = marginLeft + size.width + marginRight
    maxWidth = Math.max(maxWidth, childTotalWidth)

    // Position child
    currentY += marginTop

    if (child.setPosition) {
      const x = paddingLeft + marginLeft
      console.log(`  Setting child position: (${x}, ${currentY})`)
      child.setPosition(x, currentY)
    }

    // Move to next position
    currentY += size.height + marginBottom
    console.log('  Next Y position:', currentY)
  }

  // Calculate container dimensions if not explicitly set
  const containerWidth = containerProps.width ?? maxWidth + paddingLeft + paddingRight
  const containerHeight = containerProps.height ?? currentY - paddingTop + paddingBottom

  // Set container dimensions
  ;(container as GameObjectWithLayout).width = containerWidth
  ;(container as GameObjectWithLayout).height = containerHeight

  console.log('  Container dimensions set to:', { width: containerWidth, height: containerHeight })

  // Update background size if present
  const background = (container as GameObjectWithLayout).__background
  if (background) {
    background.setSize(containerWidth, containerHeight)
    console.log('  Background resized to:', { width: containerWidth, height: containerHeight })
  }
}
