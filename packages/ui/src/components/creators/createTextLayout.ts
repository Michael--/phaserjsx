/**
 * Layout creator for text components
 */
import type * as Phaser from 'phaser'
import type { LayoutSize } from '../../layout/index'
import type { TextBaseProps } from '../primitives/text'

/**
 * Creates layout infrastructure for a text component
 * Attaches layout props and dynamic size provider
 * @param text - Phaser text object
 * @param props - Text props including layout
 */
export function createTextLayout(
  text: Phaser.GameObjects.Text & {
    __layoutProps?: TextBaseProps
    __getLayoutSize?: () => LayoutSize
  },
  props: Partial<TextBaseProps>
): void {
  // Attach layout props for layout calculations
  text.__layoutProps = props as TextBaseProps

  // Attach dynamic size provider
  // Headless text returns minimal size 1x1 (participates in alignment, not spacing)
  // Note: 0x0 causes issues with Phaser internals or layout optimizations
  // Layout-aware text returns actual dimensions (rotation ignored for layout)
  text.__getLayoutSize = () => {
    if (text.__layoutProps?.headless) {
      return { width: 0.01, height: 0.01 }
    }
    return {
      width: text.width,
      height: text.height,
    }
  }
}
