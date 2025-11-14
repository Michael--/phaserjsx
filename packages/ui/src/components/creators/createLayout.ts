/**
 * Layout creator for initializing container layout system
 */
import type { LayoutProps } from '../../core-props'
import type { LayoutSize } from '../../layout'

/**
 * Creates layout infrastructure for a container
 * Attaches layout props and dynamic size provider
 * @param container - Phaser container
 * @param props - Layout props
 */
export function createLayout(
  container: Phaser.GameObjects.Container & {
    __layoutProps?: LayoutProps
    __getLayoutSize?: () => LayoutSize
  },
  props: Partial<LayoutProps>
): void {
  // Attach layout props for layout calculations
  container.__layoutProps = props as LayoutProps

  // Attach dynamic size provider
  container.__getLayoutSize = () => {
    const children = container.list as Array<
      Phaser.GameObjects.GameObject & {
        __isBackground?: boolean
        __layoutProps?: LayoutProps
        __getLayoutSize?: () => LayoutSize
        width?: number
        height?: number
      }
    >

    const direction = props.direction ?? 'column'
    const padding = props.padding ?? {}
    const paddingLeft = padding.left ?? 0
    const paddingTop = padding.top ?? 0
    const paddingRight = padding.right ?? 0
    const paddingBottom = padding.bottom ?? 0

    let maxWidth = 0
    let maxHeight = 0
    let totalWidth = paddingLeft
    let totalHeight = paddingTop

    for (const child of children) {
      if (child.__isBackground) {
        continue
      }

      const margin = child.__layoutProps?.margin ?? {}
      const marginTop = margin.top ?? 0
      const marginBottom = margin.bottom ?? 0
      const marginLeft = margin.left ?? 0
      const marginRight = margin.right ?? 0

      let childSize: LayoutSize
      if (child.__getLayoutSize) {
        childSize = child.__getLayoutSize()
      } else {
        const layoutWidth = child.__layoutProps?.width
        const layoutHeight = child.__layoutProps?.height
        childSize = {
          width: layoutWidth ?? child.width ?? 100,
          height: layoutHeight ?? child.height ?? 20,
        }
      }

      if (direction === 'row') {
        // Horizontal layout
        totalWidth += marginLeft + childSize.width + marginRight
        const childTotalHeight = marginTop + childSize.height + marginBottom
        maxHeight = Math.max(maxHeight, childTotalHeight)
      } else {
        // Vertical layout (column)
        const childTotalWidth = marginLeft + childSize.width + marginRight
        maxWidth = Math.max(maxWidth, childTotalWidth)
        totalHeight += marginTop + childSize.height + marginBottom
      }
    }

    const finalWidth =
      props.width ??
      (direction === 'row' ? totalWidth + paddingRight : maxWidth + paddingLeft + paddingRight)
    const finalHeight =
      props.height ??
      (direction === 'row' ? maxHeight + paddingTop + paddingBottom : totalHeight + paddingBottom)

    return {
      width: finalWidth,
      height: finalHeight,
    }
  }
}
