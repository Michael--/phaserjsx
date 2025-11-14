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

  console.log('[Layout] Container with', children?.length ?? 0, 'children, props:', containerProps)

  if (!children || !Array.isArray(children)) return

  const padding = containerProps.padding ?? {}
  const paddingLeft = padding.left ?? 0
  const paddingTop = padding.top ?? 0

  console.log('  Padding:', { top: paddingTop, left: paddingLeft })

  let currentY = paddingTop

  for (const child of children) {
    // Skip background rectangles
    if (child.__isBackground) {
      console.log('  Skipping background')
      continue
    }

    // Get child margin
    const margin = getMargin(child)
    const marginTop = margin.top ?? 0
    const marginBottom = margin.bottom ?? 0
    const marginLeft = margin.left ?? 0

    console.log('  Child margin:', { top: marginTop, bottom: marginBottom, left: marginLeft })

    // Position child
    currentY += marginTop

    if (child.setPosition) {
      const x = paddingLeft + marginLeft
      console.log(`  Setting child position: (${x}, ${currentY})`)
      child.setPosition(x, currentY)
    }

    // If child is also a container, recursively calculate its layout
    if ('list' in child && Array.isArray((child as Phaser.GameObjects.Container).list)) {
      const childContainer = child as Phaser.GameObjects.Container
      const childLayoutProps = (child as GameObjectWithLayout).__layoutProps ?? {}
      console.log('  -> Child is a container, calculating nested layout')
      calculateLayout(childContainer, childLayoutProps)
    }

    // Move to next position
    const size = getChildSize(child)
    console.log('  Child size:', size)
    currentY += size.height + marginBottom
    console.log('  Next Y position:', currentY)
  }
}
