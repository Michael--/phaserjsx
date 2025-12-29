/**
 * Type definitions for the layout system
 */
import type * as Phaser from 'phaser'
import type { BackgroundProps, EdgeInsets, LayoutProps, TransformProps } from '../core-props'

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
  __layoutProps?: LayoutProps & BackgroundProps & TransformProps
  __isBackground?: boolean
  __background?: Phaser.GameObjects.Graphics
  __getLayoutSize?: () => LayoutSize
  __cachedLayoutSize?: LayoutSize
  __originalGetLayoutSize?: () => LayoutSize
  visible?: boolean
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
 * A line of children in a wrapped flex layout
 */
export interface LayoutLine {
  children: LayoutChild[]
  mainAxisSize: number
  crossAxisSize: number
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
 * Parsed size representation
 */
export interface ParsedSize {
  /** Size type: fixed pixels, percentage of parent, viewport units (vw/vh), auto (content-based), calc expression, or fill (parent content-area) */
  type: 'fixed' | 'percent' | 'vw' | 'vh' | 'auto' | 'calc' | 'fill'
  /** Numeric value - pixels for fixed, 0-100 for percent, 0-100 for vw/vh, undefined for auto/calc/fill */
  value?: number
  /** Calc expression data (only for type='calc') */
  calc?: CalcExpression
}

/**
 * Calc expression representation
 * Supports: calc(50% - 20px), calc(100vw - 40px), calc(100vh + 10px), calc((50% + 10px) * 2), etc.
 */
export interface CalcExpression {
  /** Left operand or sub-expression */
  left: CalcOperand | CalcExpression
  /** Operator: +, -, *, / */
  operator: '+' | '-' | '*' | '/'
  /** Right operand or sub-expression */
  right: CalcOperand | CalcExpression
}

/**
 * Calc operand - can be fixed pixels, percentage, or viewport units
 */
export interface CalcOperand {
  /** Operand type */
  type: 'fixed' | 'percent' | 'vw' | 'vh'
  /** Numeric value */
  value: number
}

/**
 * Computed metrics from children analysis
 * Note: maxWidth/maxHeight here are resolved pixel values, not SizeValue types
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
  gap: {
    horizontal: number
    vertical: number
  }
  children: LayoutChild[]
  /** Parent dimensions for percentage resolution */
  parentSize?: {
    width: number
    height: number
  }
}
