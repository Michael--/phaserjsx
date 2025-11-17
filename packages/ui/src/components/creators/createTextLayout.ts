/**
 * Layout creator for text components
 */
import type Phaser from 'phaser'
import type { LayoutSize } from '../../layout/index'
import type { TextBaseProps } from '../text'

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

  // Attach dynamic size provider using direct dimensions (not getBounds to avoid rotation issues)
  text.__getLayoutSize = () => {
    return {
      width: text.width,
      height: text.height,
    }
  }
}
