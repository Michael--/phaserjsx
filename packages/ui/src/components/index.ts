/**
 * Built-in component implementations
 * Exports creators, patchers, props and registration function for View and Text components
 */
import { register } from '../host'
import { nineSliceCreator, nineSlicePatcher } from './nineslice'
import { textCreator, textPatcher } from './text'
import { viewCreator, viewPatcher } from './view'

/**
 * Component type constants for JSX usage
 */
export const View = 'View' as const
export const Text = 'Text' as const
export const NineSlice = 'NineSlice' as const

/**
 * Registers all built-in components (View, Text, NineSlice) with the host
 * This should be called during library initialization
 */
export function registerBuiltins() {
  register('View', { create: viewCreator, patch: viewPatcher })
  register('Text', { create: textCreator, patch: textPatcher })
  register('NineSlice', { create: nineSliceCreator, patch: nineSlicePatcher })
}

// Re-export View component
export { viewCreator, viewPatcher, type ViewBaseProps, type ViewProps } from './view'

// Re-export Text component
export { textCreator, textPatcher, type TextBaseProps, type TextProps } from './text'

// Re-export NineSlice component
export {
  createNineSliceRef,
  nineSliceCreator,
  nineSlicePatcher,
  useNineSliceRef,
  type NineSliceBaseProps,
  type NineSliceInnerBounds,
  type NineSliceProps,
  type NineSliceRef,
} from './nineslice'
