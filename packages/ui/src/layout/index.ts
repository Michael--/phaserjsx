/**
 * Layout system - public API
 * For positioning children within containers with flexbox-style layout
 */

// Main layout engine
export { calculateLayout } from './layout-engine'

// Types
export type {
  ContentArea,
  GameObjectWithLayout,
  LayoutChild,
  LayoutContext,
  LayoutSize,
  LayoutSizeProvider,
  PaddingValues,
  Position,
} from './types'

// Utilities
export { getChildSize, getMargin } from './utils/child-utils'
export {
  clearSizeCaches,
  isExplicit,
  parseSize,
  requiresParent,
  resolveSize,
} from './utils/size-resolver'
export type { ParsedSize } from './utils/size-resolver'

// Calculators (for advanced use cases)
export {
  calculateContainerSize,
  calculateContentDimensions,
  normalizePadding,
} from './utils/dimension-calculator'
export type { ContentMetrics } from './utils/dimension-calculator'

export { calculateAlignItems, calculateJustifyContent } from './utils/spacing-calculator'
export type { JustifyResult } from './utils/spacing-calculator'

// Strategies (for extending layout system)
export { BaseLayoutStrategy } from './strategies/base-strategy'
export type { LayoutStrategy } from './strategies/base-strategy'
export { ColumnLayoutStrategy } from './strategies/column-layout'
export { RowLayoutStrategy } from './strategies/row-layout'
export { StackLayoutStrategy } from './strategies/stack-layout'

// Appliers (for custom layout engines)
export { updateBackground, updateHitArea } from './appliers/background-applier'
export { applyContainerDimensions } from './appliers/container-applier'
export { applyChildPositions } from './appliers/position-applier'
