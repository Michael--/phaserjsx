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

  // Apply style changes if the style object changed
  if (next.style !== undefined && !deepEqual(next.style, prev.style || {})) {
    node.setStyle(next.style)
    needsUpdate = true
  }

  // Word wrap width
  if (next.maxWidth !== prev.maxWidth && typeof next.maxWidth === 'number') {
    node.setWordWrapWidth(next.maxWidth, true)
    needsUpdate = true
  }

  // Legacy: Support direct Phaser style object
  if (prev.style !== next.style && next.style !== undefined) {
    node.setStyle(next.style)
    needsUpdate = true
  }

  // Force Phaser to recalculate text metrics immediately
  // This ensures getBounds() returns updated dimensions for layout calculations
  if (needsUpdate && node.updateText) {
    node.updateText()
  }
}

/**
 * Simple deep equality check for objects (shallow for nested objects)
 * @param a - First object
 * @param b - Second object
 * @returns True if objects are deeply equal
 */
function deepEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (!(key in b)) return false
    const valA = a[key]
    const valB = b[key]
    if (valA === valB) continue
    if (typeof valA === 'object' && typeof valB === 'object' && valA !== null && valB !== null) {
      if (!deepEqual(valA as Record<string, unknown>, valB as Record<string, unknown>)) return false
    } else if (valA !== valB) {
      return false
    }
  }
  return true
}
