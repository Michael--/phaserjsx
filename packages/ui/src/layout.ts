/**
 * Layout system for positioning children within containers
 * Implements vertical stacking with margins and padding support
 */
import Phaser from 'phaser'
import type { EdgeInsets, LayoutProps } from './core-props'

const debug = false

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
export type GameObjectWithLayout = Phaser.GameObjects.GameObject & {
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
export function getMargin(child: GameObjectWithLayout): EdgeInsets {
  return child.__layoutProps?.margin ?? {}
}

/**
 * Get effective size of a child
 * Calls __getLayoutSize if available, otherwise falls back to layoutProps or default
 * @param child - Child game object
 * @returns Width and height
 */
export function getChildSize(child: GameObjectWithLayout): { width: number; height: number } {
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
 * Supports both vertical (column) and horizontal (row) stacking
 * with flexbox-style alignment and distribution
 * @param container - Phaser container with children
 * @param containerProps - Layout props of the container
 */
export function calculateLayout(
  container: Phaser.GameObjects.Container,
  containerProps: LayoutProps
): void {
  const children = container.list as GameObjectWithLayout[]

  if (debug)
    console.log(
      '[Layout] Container with',
      children?.length ?? 0,
      'children, props:',
      containerProps
    )

  if (!children || !Array.isArray(children)) return

  const direction = containerProps.direction ?? 'column'
  const padding = containerProps.padding ?? {}
  const paddingLeft = padding.left ?? 0
  const paddingTop = padding.top ?? 0
  const paddingRight = padding.right ?? 0
  const paddingBottom = padding.bottom ?? 0
  const gap = containerProps.gap ?? 0
  const justifyContent = containerProps.justifyContent ?? 'start'
  const alignItems = containerProps.alignItems ?? 'start'

  if (debug)
    console.log('  Direction:', direction, 'Padding:', {
      top: paddingTop,
      left: paddingLeft,
      right: paddingRight,
      bottom: paddingBottom,
    })

  // Filter out background children and prepare size data
  const layoutChildren: Array<{
    child: GameObjectWithLayout
    size: { width: number; height: number }
    margin: EdgeInsets
  }> = []

  let maxWidth = 0
  let maxHeight = 0
  let totalMainSize = 0

  for (const child of children) {
    // Skip background rectangles
    if (child.__isBackground) {
      if (debug) console.log('  Skipping background')
      continue
    }

    // If child is a container, recursively calculate its layout first
    if ('list' in child && Array.isArray((child as Phaser.GameObjects.Container).list)) {
      const childContainer = child as Phaser.GameObjects.Container
      const childLayoutProps = (child as GameObjectWithLayout).__layoutProps ?? {}
      if (debug) console.log('  -> Child is a container, calculating nested layout first')
      calculateLayout(childContainer, childLayoutProps)
    }

    const size = getChildSize(child)
    const margin = getMargin(child)
    const marginTop = margin.top ?? 0
    const marginBottom = margin.bottom ?? 0
    const marginLeft = margin.left ?? 0
    const marginRight = margin.right ?? 0

    layoutChildren.push({ child, size, margin })

    if (direction === 'row') {
      totalMainSize += marginLeft + size.width + marginRight
      const childTotalHeight = marginTop + size.height + marginBottom
      maxHeight = Math.max(maxHeight, childTotalHeight)
    } else {
      const childTotalWidth = marginLeft + size.width + marginRight
      maxWidth = Math.max(maxWidth, childTotalWidth)
      totalMainSize += marginTop + size.height + marginBottom
    }
  }

  // Add gaps to total main size
  if (layoutChildren.length > 1) {
    totalMainSize += gap * (layoutChildren.length - 1)
  }

  // Calculate container dimensions
  const containerWidth =
    containerProps.width ??
    (direction === 'row'
      ? totalMainSize + paddingLeft + paddingRight
      : maxWidth + paddingLeft + paddingRight)
  const containerHeight =
    containerProps.height ??
    (direction === 'row'
      ? maxHeight + paddingTop + paddingBottom
      : totalMainSize + paddingTop + paddingBottom)

  // Calculate available space for justifyContent
  const contentAreaWidth = containerWidth - paddingLeft - paddingRight
  const contentAreaHeight = containerHeight - paddingTop - paddingBottom
  const availableMainSpace = direction === 'row' ? contentAreaWidth : contentAreaHeight
  const remainingSpace = availableMainSpace - totalMainSize

  // Calculate starting position and spacing based on justifyContent
  let mainStart = 0
  let spaceBetween = 0

  switch (justifyContent) {
    case 'start':
      mainStart = 0
      break
    case 'center':
      mainStart = Math.max(0, remainingSpace / 2)
      break
    case 'end':
      mainStart = Math.max(0, remainingSpace)
      break
    case 'space-between':
      mainStart = 0
      spaceBetween = layoutChildren.length > 1 ? remainingSpace / (layoutChildren.length - 1) : 0
      break
    case 'space-around':
      spaceBetween = layoutChildren.length > 0 ? remainingSpace / layoutChildren.length : 0
      mainStart = spaceBetween / 2
      break
    case 'space-evenly':
      spaceBetween = layoutChildren.length > 0 ? remainingSpace / (layoutChildren.length + 1) : 0
      mainStart = spaceBetween
      break
  }

  // Position children
  let currentMain = mainStart
  let childIndex = 0
  for (const item of layoutChildren) {
    const { child, size, margin } = item
    const marginTop = margin.top ?? 0
    const marginBottom = margin.bottom ?? 0
    const marginLeft = margin.left ?? 0
    const marginRight = margin.right ?? 0

    let x = 0
    let y = 0

    if (direction === 'row') {
      // Main axis (horizontal)
      currentMain += marginLeft
      x = paddingLeft + currentMain

      // Cross axis (vertical) - alignItems
      switch (alignItems) {
        case 'start':
          y = paddingTop + marginTop
          break
        case 'center':
          y = paddingTop + (contentAreaHeight - size.height) / 2
          break
        case 'end':
          y = paddingTop + contentAreaHeight - size.height - marginBottom
          break
        case 'stretch':
          y = paddingTop + marginTop
          // TODO: Stretch height if possible
          break
      }

      currentMain += size.width + marginRight
    } else {
      // Main axis (vertical)
      currentMain += marginTop
      y = paddingTop + currentMain

      // Cross axis (horizontal) - alignItems
      switch (alignItems) {
        case 'start':
          x = paddingLeft + marginLeft
          break
        case 'center':
          x = paddingLeft + (contentAreaWidth - size.width) / 2
          break
        case 'end':
          x = paddingLeft + contentAreaWidth - size.width - marginRight
          break
        case 'stretch':
          x = paddingLeft + marginLeft
          // TODO: Stretch width if possible
          break
      }

      currentMain += size.height + marginBottom
    }

    // Add gap and space-between spacing
    if (childIndex < layoutChildren.length - 1) {
      currentMain += gap + spaceBetween
    }

    if (child.setPosition) {
      if (debug) console.log(`  Setting child ${childIndex} position: (${x}, ${y})`)
      child.setPosition(x, y)
    }

    childIndex++
  }

  // Set container dimensions
  ;(container as GameObjectWithLayout).width = containerWidth
  ;(container as GameObjectWithLayout).height = containerHeight

  if (debug)
    console.log('  Container dimensions set to:', {
      width: containerWidth,
      height: containerHeight,
    })

  // Update background size if present
  const background = (container as GameObjectWithLayout).__background
  if (background) {
    background.setSize(containerWidth, containerHeight)
    if (debug)
      console.log('  Background resized to:', { width: containerWidth, height: containerHeight })
  }

  // Update hit area if container is interactive
  if (container.input?.hitArea && 'setSize' in container.input.hitArea) {
    const hitArea = container.input.hitArea as Phaser.Geom.Rectangle
    const oldWidth = hitArea.width
    const oldHeight = hitArea.height

    // Only update if dimensions actually changed
    if (oldWidth !== containerWidth || oldHeight !== containerHeight) {
      // Position hit area centered around origin (container's local 0,0)
      // This is needed because Phaser containers treat hit areas relative to their center
      hitArea.setPosition(containerWidth / 2, containerHeight / 2)
      hitArea.setSize(containerWidth, containerHeight)
      if (debug) {
        console.log('  Hit area resized:', {
          from: { x: hitArea.x, y: hitArea.y, width: oldWidth, height: oldHeight },
          to: {
            x: containerWidth / 2,
            y: containerHeight / 2,
            width: containerWidth,
            height: containerHeight,
          },
        })
      }
    }
  }
}
