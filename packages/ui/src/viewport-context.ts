/**
 * Viewport context - provides screen/canvas dimensions to all components
 * Enables viewport-relative units (vw, vh) in layout calculations
 */
import type Phaser from 'phaser'

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
  private scene: Phaser.Scene | undefined

  /**
   * Update viewport dimensions
   * @param width - Viewport width in pixels
   * @param height - Viewport height in pixels
   * @param scene - Optional Phaser scene reference
   */
  setViewport(width: number, height: number, scene?: Phaser.Scene): void {
    this.viewport = { width, height }
    this.scene = scene
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
  getScene(): Phaser.Scene | undefined {
    return this.scene
  }
}

/**
 * Global viewport registry instance
 */
export const viewportRegistry = new ViewportRegistry()
