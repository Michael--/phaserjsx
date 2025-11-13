/**
 * Minimal JSX runtime for the TS "react-jsx" automatic runtime.
 * This builds plain VNode objects consumed by our custom mount/patch.
 */
import type { VNodeLike } from './vdom'

export const Fragment = (props: { children?: unknown }): VNodeLike | null => props?.children ?? null

/**
 * JSX factory for automatic runtime
 * @param type - Element type (string or component function)
 * @param props - Props including children
 * @param _key - Optional key (unused)
 * @returns VNode object
 */
export function jsx(
  type: unknown,
  props: Record<string, unknown> | null,
  _key?: unknown
): VNodeLike {
  const { children, ...rest } = props ?? {}
  const kids = children == null ? [] : Array.isArray(children) ? children : [children]
  return { type, props: rest, children: kids }
}
export const jsxs = jsx
