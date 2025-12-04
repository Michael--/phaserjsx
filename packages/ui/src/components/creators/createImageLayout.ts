/**
 * Layout creator for Image components
 */
import type Phaser from 'phaser'
import type { LayoutSize } from '../../layout/index'
import type { ImageBaseProps } from '../primitives/image'

/**
 * Creates layout infrastructure for an Image component
 * Attaches layout props and dynamic size provider
 * @param image - Phaser Image object
 * @param props - Image props including layout
 */
export function createImageLayout(
  image: Phaser.GameObjects.Image & {
    __layoutProps?: ImageBaseProps
    __getLayoutSize?: () => LayoutSize
  },
  props: Partial<ImageBaseProps>
): void {
  // Attach layout props for layout calculations
  image.__layoutProps = props as ImageBaseProps

  // Attach dynamic size provider
  // Headless images return minimal size 0.01x0.01 (participates in alignment, not spacing)
  // Layout-aware images return actual display dimensions
  image.__getLayoutSize = () => {
    if (image.__layoutProps?.headless) {
      return { width: 0.01, height: 0.01 }
    }
    return {
      width: image.displayWidth,
      height: image.displayHeight,
    }
  }
}
