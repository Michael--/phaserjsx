/**
 * Layout creator for initializing container layout system
 */
import type { BackgroundProps, LayoutProps, TransformProps } from '../../core-props'
import {
  getChildSize,
  parseSize,
  resolveSize,
  type GameObjectWithLayout,
  type LayoutSize,
} from '../../layout/index'

/**
 * Creates layout infrastructure for a container
 * Attaches layout props and dynamic size provider
 * @param container - Phaser container
 * @param props - Layout props
 */
export function createLayout(
  container: Phaser.GameObjects.Container & {
    __layoutProps?: LayoutProps & BackgroundProps & TransformProps
    __getLayoutSize?: () => LayoutSize
    width?: number | string
    height?: number | string
  },
  props: Partial<LayoutProps & BackgroundProps & TransformProps>
): void {
  // Attach layout props for layout calculations
  container.__layoutProps = props as LayoutProps & BackgroundProps & TransformProps

  // Attach dynamic size provider
  // This returns the calculated dimensions after layout
  container.__getLayoutSize = () => {
    const children = container.list as GameObjectWithLayout[]

    const direction = props.direction ?? 'column'
    const padding = props.padding ?? {}
    const paddingLeft = padding.left ?? 0
    const paddingTop = padding.top ?? 0
    const paddingRight = padding.right ?? 0
    const paddingBottom = padding.bottom ?? 0
    const gap = props.gap ?? 0

    let maxWidth = 0
    let maxHeight = 0
    let totalMainSize = 0

    // Count non-background children
    let childCount = 0

    for (const child of children) {
      if (child.__isBackground) {
        continue
      }

      childCount++

      const margin = child.__layoutProps?.margin ?? {}
      const marginTop = margin.top ?? 0
      const marginBottom = margin.bottom ?? 0
      const marginLeft = margin.left ?? 0
      const marginRight = margin.right ?? 0

      const childSize = getChildSize(child)

      if (direction === 'row') {
        // Horizontal layout
        totalMainSize += marginLeft + childSize.width + marginRight
        const childTotalHeight = marginTop + childSize.height + marginBottom
        maxHeight = Math.max(maxHeight, childTotalHeight)
      } else {
        // Vertical layout (column)
        const childTotalWidth = marginLeft + childSize.width + marginRight
        maxWidth = Math.max(maxWidth, childTotalWidth)
        totalMainSize += marginTop + childSize.height + marginBottom
      }
    }

    // Add gaps to total main size
    if (childCount > 1) {
      totalMainSize += gap * (childCount - 1)
    }

    const defaultWidth =
      direction === 'row'
        ? totalMainSize + paddingLeft + paddingRight
        : maxWidth + paddingLeft + paddingRight
    const defaultHeight =
      direction === 'row'
        ? maxHeight + paddingTop + paddingBottom
        : totalMainSize + paddingTop + paddingBottom

    // Resolve width (handle percentage and auto)
    const parsedWidth = parseSize(props.width)
    const finalWidth = resolveSize(parsedWidth, undefined, defaultWidth)

    // Resolve height (handle percentage and auto)
    const parsedHeight = parseSize(props.height)
    const finalHeight = resolveSize(parsedHeight, undefined, defaultHeight)

    return {
      width: finalWidth,
      height: finalHeight,
    }
  }
}
