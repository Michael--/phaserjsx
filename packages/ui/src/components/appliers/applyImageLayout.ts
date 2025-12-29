/**
 * Layout applier for Image components
 */
import type * as Phaser from 'phaser'
import type { LayoutProps } from '../../core-props'
import type { LayoutSize } from '../../layout/index'
import type { ImageBaseProps } from '../primitives/image'

/**
 * Applies layout props and updates layout size provider
 * @param image - Phaser Image object
 * @param prev - Previous props
 * @param next - New props
 */
export function applyImageLayout(
  image: Phaser.GameObjects.Image & {
    __layoutProps?: ImageBaseProps
    __getLayoutSize?: () => LayoutSize
  },
  prev: Partial<ImageBaseProps & LayoutProps>,
  next: Partial<ImageBaseProps & LayoutProps>
): void {
  // Update layout props reference
  image.__layoutProps = next as ImageBaseProps

  // Update size provider if headless flag changed
  if (prev.headless !== next.headless) {
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
}
