/**
 * Layout applier for text components
 */
import type Phaser from 'phaser'
import type { LayoutSize } from '../../layout/index'
import type { TextBaseProps } from '../text'

/**
 * Applies layout properties for text components
 * Updates layout props and size provider when text or style changes
 * @param text - Phaser text object
 * @param prev - Previous props
 * @param next - New props
 */
export function applyTextLayout(
  text: Phaser.GameObjects.Text & {
    __layoutProps?: TextBaseProps
    __getLayoutSize?: () => LayoutSize
  },
  prev: Partial<TextBaseProps>,
  next: Partial<TextBaseProps>
): void {
  // Update layout props to trigger parent layout recalculation
  text.__layoutProps = next as TextBaseProps

  // Update size provider if text content or style changed
  if (prev.text !== next.text || prev.style !== next.style) {
    text.__getLayoutSize = () => {
      return {
        width: text.width,
        height: text.height,
      }
    }
  }
}
