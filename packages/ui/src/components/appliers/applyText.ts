/**
 * Shared property appliers for component patching
 * These functions avoid code duplication when updating node properties
 */
import type { TextSpecificProps } from '../../core-props'

/**
 * Generic node type with text capabilities
 */
type TextNode = {
  setText: (text: string) => void
  setStyle: (style: object) => void
  setWordWrapWidth: (width: number, useAdvancedWrap: boolean) => void
  updateText?: () => void // Force Phaser to recalculate text metrics immediately
}

/**
 * Applies text-specific properties (text content, color, font, alignment)
 * @param node - Phaser Text GameObject
 * @param prev - Previous props
 * @param next - New props
 */
export function applyTextProps<T extends TextNode>(
  node: T,
  prev: Partial<TextSpecificProps & { style?: Phaser.Types.GameObjects.Text.TextStyle }>,
  next: Partial<TextSpecificProps & { style?: Phaser.Types.GameObjects.Text.TextStyle }>
): void {
  let needsUpdate = false

  // Text content
  if (prev.text !== next.text && typeof next.text === 'string') {
    node.setText(next.text)
    needsUpdate = true
  }

  // Build style object for properties that changed
  const style: Phaser.Types.GameObjects.Text.TextStyle = {}

  if (next.color !== prev.color && next.color !== undefined) {
    style.color = toCssColor(next.color as string | number)
  }
  if (next.fontSize !== prev.fontSize && typeof next.fontSize === 'number') {
    style.fontSize = `${next.fontSize}px`
  }
  if (next.fontFamily !== prev.fontFamily && typeof next.fontFamily === 'string') {
    style.fontFamily = next.fontFamily
  }
  if (next.fontStyle !== prev.fontStyle && typeof next.fontStyle === 'string') {
    style.fontStyle = next.fontStyle
  }
  if (
    next.align !== prev.align &&
    (next.align === 'left' || next.align === 'center' || next.align === 'right')
  ) {
    style.align = next.align
  }

  // Apply style changes if any
  if (Object.keys(style).length > 0) {
    node.setStyle(style)
    needsUpdate = true
  }

  // Word wrap width
  if (next.maxWidth !== prev.maxWidth && typeof next.maxWidth === 'number') {
    node.setWordWrapWidth(next.maxWidth, true)
    needsUpdate = true
  }

  // Legacy: Support direct Phaser style object
  if (prev.style !== next.style && next.style !== undefined) {
    node.setStyle(next.style as Phaser.Types.GameObjects.Text.TextStyle)
    needsUpdate = true
  }

  // Force Phaser to recalculate text metrics immediately
  // This ensures getBounds() returns updated dimensions for layout calculations
  if (needsUpdate && node.updateText) {
    node.updateText()
  }
}

/**
 * Converts color value to CSS color string
 * @param c - Color as hex number or CSS string
 * @returns CSS color string
 */
function toCssColor(c: string | number): string {
  if (typeof c === 'string') return c
  const hex = c.toString(16).padStart(6, '0')
  return `#${hex}`
}
