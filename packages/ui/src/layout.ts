/**
 * Basic layout system for positioning children within containers
 * Currently implements simple vertical stacking with margins
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
  const children = (
    container as Phaser.GameObjects.Container & { children: Phaser.GameObjects.GameObject[] }
  ).children

  // Ensure it's an array
  const childArray = Array.isArray(children) ? children : []

  const padding = containerProps.padding ?? {}
  const innerTop = padding.top ?? 0

  // Simple vertical stacking - accumulate Y positions
  let currentY = innerTop

  for (const child of childArray) {
    // Skip background rectangles
    if ((child as Phaser.GameObjects.Rectangle & { __isBackground?: boolean }).__isBackground) {
      continue
    }

    // For now, just stack vertically with some spacing
    // TODO: Use actual child layout props when available
    if ('setPosition' in child) {
      const x = 'x' in child ? (child as { x: number }).x : 0
      ;(
        child as Phaser.GameObjects.GameObject & {
          setPosition: (x: number, y: number) => void
        }
      ).setPosition(x, currentY)
    }

    // Estimate child height (very basic)
    const estimatedHeight = ('height' in child ? (child as { height: number }).height : 20) + 10
    currentY += estimatedHeight
  }
}
