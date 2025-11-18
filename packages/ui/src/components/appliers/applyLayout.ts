/**
 * Layout property applier for updating container layout configuration
 */
import type { BackgroundProps, LayoutProps } from '../../core-props'
import { calculateLayout } from '../../layout/index'

/**
 * Layout-relevant props that trigger layout recalculation when changed
 */
const LAYOUT_RELEVANT_PROPS: (keyof LayoutProps)[] = [
  'width',
  'height',
  'flex',
  'margin',
  'padding',
  'gap',
  'direction',
  'justifyContent',
  'alignItems',
  'overflow',
]

/**
 * Check if any layout-relevant prop changed
 * @param prev - Previous props
 * @param next - New props
 * @returns True if any layout prop changed
 */
function hasLayoutPropsChanged(
  prev: Partial<LayoutProps & BackgroundProps>,
  next: Partial<LayoutProps & BackgroundProps>
): boolean {
  for (const prop of LAYOUT_RELEVANT_PROPS) {
    if (prev[prop] !== next[prop]) {
      return true
    }
  }
  return false
}

/**
 * Applies layout property changes to a container
 * Handles width, height, direction, padding, margin updates
 * Only triggers layout recalculation when layout-relevant props changed
 * @param node - Phaser container node
 * @param prev - Previous layout props
 * @param next - New layout props
 */
export function applyLayoutProps(
  node: Phaser.GameObjects.Container & { __layoutProps?: LayoutProps & BackgroundProps },
  prev: Partial<LayoutProps & BackgroundProps>,
  next: Partial<LayoutProps & BackgroundProps>
): void {
  // Update stored layout props
  node.__layoutProps = next as LayoutProps & BackgroundProps

  // Only recalculate layout if layout-relevant props changed
  // Non-layout props (x, y, backgroundColor, event handlers) don't need layout recalc
  if (hasLayoutPropsChanged(prev, next)) {
    calculateLayout(node, next)
  }
}
