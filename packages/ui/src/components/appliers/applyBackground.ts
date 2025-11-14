/**
 * Shared property appliers for component patching
 * These functions avoid code duplication when updating node properties
 */

/**
 * Applies background properties (color, alpha, corner radius)
 * Currently checks for changes only - actual rendering is component-specific
 * @param _node - Node with potential background
 * @param prev - Previous props
 * @param next - New props
 */
export function applyBackgroundProps(
  _node: unknown,
  prev: Record<string, unknown>,
  next: Record<string, unknown>
): void {
  // Check if background props changed
  if (
    prev.backgroundColor === next.backgroundColor &&
    prev.backgroundAlpha === next.backgroundAlpha &&
    prev.cornerRadius === next.cornerRadius
  ) {
    return
  }

  // Background rendering is component-specific and handled in component patchers
  // This function serves as a placeholder for future unified background system
}
