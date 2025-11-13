/**
 * VNode factories for JSX usage. They do NOT create Phaser objects directly.
 */

/**
 * RexSizer layout container component
 * @param props - Sizer properties including children
 * @returns VNode object
 */
export function RexSizer(props: { children?: unknown; [key: string]: unknown }) {
  console.log('RexSizer called with props:', props)
  const { children, ...rest } = props
  console.log('RexSizer children:', children)
  const kids = children == null ? [] : Array.isArray(children) ? children : [children]
  console.log('RexSizer kids:', kids)
  return { type: 'RexSizer', props: rest, children: kids as unknown[] }
}

/**
 * RexLabel widget component (text with optional background)
 * @param props - Label properties
 * @returns VNode object
 */
export function RexLabel(props: Record<string, unknown>) {
  return { type: 'RexLabel', props, children: [] }
}

/**
 * Phaser Text game object component
 * @param props - Text properties
 * @returns VNode object
 */
export function Text(props: Record<string, unknown>) {
  return { type: 'Text', props, children: [] }
}
