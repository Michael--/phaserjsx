/**
 * VNode factories for JSX usage. They do NOT create Phaser objects directly.
 */

/**
 * RexSizer layout container component
 * @param props - Sizer properties
 * @returns VNode object
 */
export function RexSizer(props: Record<string, unknown>) {
  return { type: 'RexSizer', props, children: (props?.children ?? []) as unknown[] }
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
