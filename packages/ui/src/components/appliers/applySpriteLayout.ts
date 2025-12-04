/**
 * Layout applier for Sprite components
 */
import type Phaser from 'phaser'
import type { LayoutProps } from '../../core-props'
import type { SpriteBaseProps } from '../primitives/sprite'

/**
 * Applies layout props and updates layout size provider
 * Sprites are always headless (return minimal size)
 * @param sprite - Phaser Sprite object
 * @param _prev - Previous props (unused)
 * @param next - New props
 */
export function applySpriteLayout(
  sprite: Phaser.GameObjects.Sprite & {
    __layoutProps?: SpriteBaseProps
  },
  _prev: Partial<SpriteBaseProps & LayoutProps>,
  next: Partial<SpriteBaseProps & LayoutProps>
): void {
  // Update layout props reference
  sprite.__layoutProps = next as SpriteBaseProps

  // Note: __getLayoutSize is set once in creator and never changes
  // Sprites are always headless (0.01x0.01)
}
