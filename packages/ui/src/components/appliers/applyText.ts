/**
 * Shared property appliers for component patching
 * These functions avoid code duplication when updating node properties
 */
import equal from 'fast-deep-equal'
import type { TextSpecificProps } from '../../core-props'

/**
 * Generic node type with text capabilities
 */
type TextNode = {
  setText: (text: string) => void
  setStyle: (style: object) => void
  setWordWrapWidth: (width: number, useAdvancedWrap: boolean) => void
  updateText?: () => void // Force Phaser to recalculate text metrics immediately
  active?: boolean // Check if GameObject is still active
  scene?: Phaser.Scene // Access to scene for texture checks
}

/**
 * Applies text-specific properties (text content, color, font, alignment)
 * @param node - Phaser Text GameObject
 * @param prev - Previous props
 * @param next - New props
 */
export function applyTextProps<T extends TextNode>(
  node: T,
  prev: Partial<
    TextSpecificProps & { style?: Phaser.Types.GameObjects.Text.TextStyle | undefined }
  >,
  next: Partial<TextSpecificProps & { style?: Phaser.Types.GameObjects.Text.TextStyle | undefined }>
): void {
  // Safety check: Ensure node is still active and scene is available
  if (node.active === false || (node.scene && !node.scene.sys.game)) {
    return
  }

  let needsUpdate = false

  // Text content
  if (prev.text !== next.text && typeof next.text === 'string') {
    node.setText(next.text)
    needsUpdate = true
  }

  // Apply style changes if the style object changed
  if (next.style !== undefined && !equal(next.style, prev.style || {})) {
    // Guard against Phaser canvas context errors during theme updates
    try {
      node.setStyle(next.style)
      needsUpdate = true
    } catch (error) {
      console.warn('Failed to apply text style (scene may be transitioning):', error)
    }
  }

  // Word wrap width
  if (next.maxWidth !== prev.maxWidth && typeof next.maxWidth === 'number') {
    node.setWordWrapWidth(next.maxWidth, true)
    needsUpdate = true
  }

  // Legacy: Support direct Phaser style object
  if (prev.style !== next.style && next.style !== undefined) {
    try {
      node.setStyle(next.style)
      needsUpdate = true
    } catch (error) {
      console.warn('Failed to apply text style (scene may be transitioning):', error)
    }
  }

  // Force Phaser to recalculate text metrics immediately
  // This ensures getBounds() returns updated dimensions for layout calculations
  if (needsUpdate && node.updateText) {
    node.updateText()
  }
}
