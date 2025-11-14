/**
 * Built-in component implementations
 * Exports creators, patchers and registration function for View and Text components
 */
import { register } from '../host'
import { textCreator, textPatcher } from './text'
import { viewCreator, viewPatcher } from './view'

/**
 * Registers all built-in components (View, Text) with the host
 * This should be called during library initialization
 */
export function registerBuiltins() {
  register('View', { create: viewCreator, patch: viewPatcher })
  register('Text', { create: textCreator, patch: textPatcher })
}
