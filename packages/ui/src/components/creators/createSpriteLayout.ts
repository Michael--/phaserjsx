/**
 * Layout creator for Sprite components
 */
import type Phaser from 'phaser'
import type { LayoutSize } from '../../layout/index'
import type { SpriteBaseProps } from '../sprite'

/**
 * Creates layout infrastructure for a Sprite component
 * Attaches layout props and size provider
 * Sprites are always headless (minimal size)
 * @param sprite - Phaser Sprite object
 * @param props - Sprite props including layout
 */
export function createSpriteLayout(
  sprite: Phaser.GameObjects.Sprite & {
    __layoutProps?: SpriteBaseProps
    __getLayoutSize?: () => LayoutSize
  },
  props: Partial<SpriteBaseProps>
): void {
  // Attach layout props for layout calculations
  sprite.__layoutProps = props as SpriteBaseProps

  // Attach size provider
  // Sprites are always headless - return minimal size (0.01x0.01)
  // This allows them to participate in alignment but not affect layout dimensions
  sprite.__getLayoutSize = () => {
    return { width: 0.01, height: 0.01 }
  }
}
