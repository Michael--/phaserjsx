/**
 * Basic layout system for positioning children within containers
 */
import type Phaser from 'phaser'
import type { LayoutProps } from './core-props'

/**
 * Calculate layout for a container and its children
 * @param container - Phaser container with children
 * @param containerProps - Layout props of the container
 */
export function calculateLayout(
  container: Phaser.GameObjects.Container,
  containerProps: LayoutProps
): void {
  const children = container.getAll() as Phaser.GameObjects.GameObject[]

  const padding = containerProps.padding ?? {}
  const innerLeft = padding.left ?? 0
  const innerTop = padding.top ?? 0

  // For now: simple stacking layout (vertical)
  let currentY = innerTop

  for (const child of children) {
    // Skip background rectangles
    if ((child as Phaser.GameObjects.Rectangle & { __isBackground?: boolean }).__isBackground)
      continue

    // Get child layout props
    const childProps = (child as Phaser.GameObjects.GameObject & { __layoutProps?: LayoutProps })
      .__layoutProps

    // Calculate child position
    let childX = innerLeft
    let childY = currentY

    // Apply child margin
    const margin = childProps?.margin ?? {}
    childX += margin.left ?? 0
    childY += margin.top ?? 0

    // Position the child
    if ('setPosition' in child) {
      ;(
        child as Phaser.GameObjects.GameObject & { setPosition: (x: number, y: number) => void }
      ).setPosition(childX, childY)
    }

    // Move to next position (vertical stacking)
    const childHeight =
      childProps?.height ?? ('height' in child ? (child as { height: number }).height : 20)
    currentY = childY + childHeight + (margin.bottom ?? 0)
  }
}
