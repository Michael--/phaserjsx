/**
 * Layout applier for text components
 */
import type Phaser from 'phaser'
import type { LayoutSize } from '../../layout/index'
import type { TextBaseProps } from '../primitives/text'

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
  _prev: Partial<TextBaseProps>,
  next: Partial<TextBaseProps>
): void {
  // Update layout props to trigger parent layout recalculation
  text.__layoutProps = next as TextBaseProps

  // ALWAYS recreate size provider to ensure VDOM detects size changes
  // Even if function reference changes, VDOM needs to know dimensions might have changed
  // Previously: Only updated if text/style changed - this caused layout not to recalculate
  // when text dimensions changed (e.g., "9 times" -> "10 times")
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
