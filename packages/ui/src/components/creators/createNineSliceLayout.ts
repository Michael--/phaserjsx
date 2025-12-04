/**
 * Layout creator for NineSlice components
 */
import type Phaser from 'phaser'
import type { LayoutSize } from '../../layout/index'
import type { NineSliceBaseProps } from '../primitives/nineslice'

/**
 * Creates layout infrastructure for a NineSlice component
 * Attaches layout props and dynamic size provider
 * @param nineSlice - Phaser NineSlice object
 * @param props - NineSlice props including layout
 */
export function createNineSliceLayout(
  nineSlice: Phaser.GameObjects.NineSlice & {
    __layoutProps?: NineSliceBaseProps
    __getLayoutSize?: () => LayoutSize
  },
  props: Partial<NineSliceBaseProps>
): void {
  // Attach layout props for layout calculations
  nineSlice.__layoutProps = props as NineSliceBaseProps

  // Attach dynamic size provider using NineSlice dimensions
  nineSlice.__getLayoutSize = () => {
    return {
      width: nineSlice.width,
      height: nineSlice.height,
    }
  }
}
