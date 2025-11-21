/**
 * Viewport context - provides screen/canvas dimensions to all components
 * Enables viewport-relative units (vw, vh) in layout calculations
 */
import type { ParentType } from './types'

/**
 * Viewport dimensions
 */
export interface ViewportSize {
  width: number
  height: number
}

/**
 * Viewport registry - stores current viewport dimensions
 * Similar to themeRegistry pattern
 */
class ViewportRegistry {
  private viewport: ViewportSize = { width: 800, height: 600 }
  private parent: ParentType | undefined

  /**
   * Update viewport dimensions
   * @param width - Viewport width in pixels
   * @param height - Viewport height in pixels
   * @param parent - Optional Phaser scene reference
   */
  setViewport(width: number, height: number, parent?: ParentType): void {
    this.viewport = { width, height }
    this.parent = parent
  }

  /**
   * Get current viewport dimensions
   * @returns Current viewport size
   */
  getViewport(): ViewportSize {
    return this.viewport
  }

  /**
   * Get Phaser scene reference
   * @returns Scene or undefined
   */
  getParent(): ParentType | undefined {
    return this.parent
  }
}

/**
 * Global viewport registry instance
 */
export const viewportRegistry = new ViewportRegistry()
