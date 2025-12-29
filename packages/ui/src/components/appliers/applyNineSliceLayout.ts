/**
 * Layout applier for NineSlice components
 */
import type * as Phaser from 'phaser'
import type { LayoutSize } from '../../layout/index'
import type { NineSliceBaseProps } from '../primitives/nineslice'

/**
 * Applies layout properties for NineSlice components
 * Updates layout props when properties change
 * @param nineSlice - Phaser NineSlice object
 * @param prev - Previous props
 * @param next - New props
 */
export function applyNineSliceLayout(
  nineSlice: Phaser.GameObjects.NineSlice & {
    __layoutProps?: NineSliceBaseProps
    __getLayoutSize?: () => LayoutSize
  },
  prev: Partial<NineSliceBaseProps>,
  next: Partial<NineSliceBaseProps>
): void {
  // Update layout props to trigger parent layout recalculation
  nineSlice.__layoutProps = next as NineSliceBaseProps

  // Update size provider if dimensions changed
  if (prev.width !== next.width || prev.height !== next.height) {
    nineSlice.__getLayoutSize = () => {
      return {
        width: nineSlice.width,
        height: nineSlice.height,
      }
    }
  }
}
