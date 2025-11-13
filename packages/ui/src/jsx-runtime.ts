/**
 * Minimal JSX runtime for the TS "react-jsx" automatic runtime.
 * This builds plain VNode objects consumed by our custom mount/patch.
 */
import type { VNode } from './hooks'
import type { VNodeLike } from './vdom'

export const Fragment = (props: { children?: VNode | VNode[] | null }): VNodeLike =>
  props?.children ?? null

/**
 * JSX factory for automatic runtime
 * @param type - Element type (string or component function)
 * @param props - Props including children
 * @param key - Optional key for identity tracking
 * @returns VNode object
 */
export function jsx(
  type: unknown,
  props: Record<string, unknown> | null,
  key?: unknown
): VNodeLike {
  const { children, ...rest } = props ?? {}
  const kids = children == null ? [] : Array.isArray(children) ? children : [children]
  const vnode: VNode = { type, props: rest, children: kids }
  if (key !== undefined && key !== null) {
    vnode.__key = typeof key === 'string' || typeof key === 'number' ? key : String(key)
  }
  return vnode
}
export const jsxs = jsx
