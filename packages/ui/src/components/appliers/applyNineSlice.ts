/**
 * Applier for NineSlice-specific properties
 */
import type * as Phaser from 'phaser'
import type { LayoutProps } from '../../core-props'
import type { NineSliceSpecificProps } from '../primitives/nineslice'

/**
 * Applies NineSlice-specific properties (texture, frame, slice dimensions)
 * @param nineSlice - Phaser NineSlice object
 * @param prev - Previous props
 * @param next - New props
 */
export function applyNineSliceProps(
  nineSlice: Phaser.GameObjects.NineSlice,
  prev: Partial<NineSliceSpecificProps & LayoutProps>,
  next: Partial<NineSliceSpecificProps & LayoutProps>
): void {
  // Check if texture or frame changed
  const textureChanged = prev.texture !== next.texture || prev.frame !== next.frame
  if (textureChanged && next.texture) {
    nineSlice.setTexture(next.texture, next.frame)
  }

  // Check if slice dimensions changed
  const sliceChanged =
    prev.leftWidth !== next.leftWidth ||
    prev.rightWidth !== next.rightWidth ||
    prev.topHeight !== next.topHeight ||
    prev.bottomHeight !== next.bottomHeight

  if (sliceChanged) {
    const width = typeof next.width === 'number' ? next.width : nineSlice.width
    const height = typeof next.height === 'number' ? next.height : nineSlice.height

    nineSlice.setSlices(
      width,
      height,
      next.leftWidth ?? prev.leftWidth ?? 0,
      next.rightWidth ?? prev.rightWidth ?? 0,
      next.topHeight ?? prev.topHeight,
      next.bottomHeight ?? prev.bottomHeight
    )
  }

  // Check if size changed (independent of slice changes)
  const prevWidth = typeof prev.width === 'number' ? prev.width : nineSlice.width
  const nextWidth = typeof next.width === 'number' ? next.width : nineSlice.width
  const prevHeight = typeof prev.height === 'number' ? prev.height : nineSlice.height
  const nextHeight = typeof next.height === 'number' ? next.height : nineSlice.height

  if (prevWidth !== nextWidth || prevHeight !== nextHeight) {
    nineSlice.setSize(nextWidth, nextHeight)
  }

  // Check if tint changed
  if (prev.tint !== next.tint) {
    if (next.tint !== undefined) {
      nineSlice.setTint(next.tint)
    } else {
      nineSlice.clearTint()
    }
  }
}
