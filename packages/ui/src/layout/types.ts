/**
 * Type definitions for the layout system
 */
import type Phaser from 'phaser'
import type { EdgeInsets, LayoutProps } from '../core-props'

/**
 * Size information for layout calculations
 */
export interface LayoutSize {
  width: number
  height: number
}

/**
 * Interface for nodes that can provide their layout dimensions dynamically
 */
export interface LayoutSizeProvider {
  /**
   * Get the layout size of this node
   * This can be computed dynamically (e.g., from text bounds, children, etc.)
   * or return fixed dimensions
   * @returns Width and height for layout calculations
   */
  __getLayoutSize: () => LayoutSize
}

/**
 * Extended GameObject with layout metadata
 */
export type GameObjectWithLayout = Phaser.GameObjects.GameObject & {
  __layoutProps?: LayoutProps
  __isBackground?: boolean
  __background?: Phaser.GameObjects.Rectangle
  __getLayoutSize?: () => LayoutSize
  x?: number
  y?: number
  width?: number
  height?: number
  setPosition?: (x: number, y: number) => void
}

/**
 * Prepared child data for layout calculations
 */
export interface LayoutChild {
  child: GameObjectWithLayout
  size: LayoutSize
  margin: EdgeInsets
}

/**
 * Computed padding values
 */
export interface PaddingValues {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * Position for a child element
 */
export interface Position {
  x: number
  y: number
}

/**
 * Content area dimensions (container minus padding)
 */
export interface ContentArea {
  width: number
  height: number
}

/**
 * Computed metrics from children analysis
 */
export interface ContentMetrics {
  maxWidth: number
  maxHeight: number
  totalMainSize: number
}

/**
 * Complete layout context passed to strategies
 */
export interface LayoutContext {
  containerProps: LayoutProps
  padding: PaddingValues
  contentArea: ContentArea
  gap: number
  children: LayoutChild[]
}
