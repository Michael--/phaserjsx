/**
 * VNode factories for JSX usage. They do NOT create Phaser objects directly.
 */
import type { VNode } from './hooks'
import type { RexLabelProps, RexSizerProps, TextProps } from './types'

/**
 * RexSizer layout container component
 * @param props - Sizer properties including children
 * @returns VNode object
 */
export function RexSizer(props: RexSizerProps & { children?: VNode[] }) {
  const { children, ...rest } = props
  const kids = children == null ? [] : Array.isArray(children) ? children : [children]
  return { type: 'RexSizer', props: rest, children: kids }
}

/**
 * RexLabel widget component (text with optional background)
 * @param props - Label properties
 * @returns VNode object
 */
export function RexLabel(props: RexLabelProps) {
  return { type: 'RexLabel', props, children: [] }
}

/**
 * Phaser Text game object component
 * @param props - Text properties
 * @returns VNode object
 */
export function Text(props: TextProps) {
  return { type: 'Text', props, children: [] }
}
