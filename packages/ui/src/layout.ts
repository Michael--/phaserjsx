/**
 * Layout system for positioning children within containers
 * Implements vertical stacking with margins and padding support
 */
import type Phaser from 'phaser'
import type { EdgeInsets, LayoutProps } from './core-props'

/**
 * Extended GameObject with layout metadata
 */
type GameObjectWithLayout = Phaser.GameObjects.GameObject & {
  __layoutProps?: LayoutProps
  __isBackground?: boolean
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
 * @param child - Child game object
 * @returns Width and height
 */
function getChildSize(child: GameObjectWithLayout): { width: number; height: number } {
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

  // console.log('Calculating layout for container with children:', children?.length ?? 0)

  if (!children || !Array.isArray(children)) return

  const padding = containerProps.padding ?? {}
  const paddingLeft = padding.left ?? 0
  const paddingTop = padding.top ?? 0

  let currentY = paddingTop

  for (const child of children) {
    // Skip background rectangles
    if (child.__isBackground) continue

    // Get child margin
    const margin = getMargin(child)
    const marginTop = margin.top ?? 0
    const marginBottom = margin.bottom ?? 0
    const marginLeft = margin.left ?? 0

    // Position child
    currentY += marginTop

    if (child.setPosition) {
      const x = paddingLeft + marginLeft
      child.setPosition(x, currentY)
    }

    // Move to next position
    const size = getChildSize(child)
    currentY += size.height + marginBottom
  }
}
