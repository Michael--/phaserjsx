/**
 * VNode factories for JSX usage. They do NOT create Phaser objects directly.
 */
import type { VNode } from './hooks'

// Use strings as types to avoid function component mounting
export const RexSizer = 'RexSizer' as const
export const RexLabel = 'RexLabel' as const
export const Text = 'Text' as const

// Helper types for TypeScript
export type RexSizerElement = VNode & { type: typeof RexSizer }
export type RexLabelElement = VNode & { type: typeof RexLabel }
export type TextElement = VNode & { type: typeof Text }
