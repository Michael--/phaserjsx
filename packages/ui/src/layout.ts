/**
 * Layout system for positioning children within containers
 * Re-exports from modular layout system
 * @deprecated Import from './layout' instead for better tree-shaking
 */

// Re-export main layout function
export { calculateLayout } from './layout/layout-engine'

// Re-export types
export type { GameObjectWithLayout, LayoutSize } from './layout/types'

// Re-export utilities (for backward compatibility)
export { getChildSize, getMargin } from './layout/utils/child-utils'
