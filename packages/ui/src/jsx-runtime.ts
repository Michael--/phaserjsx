/**
 * Minimal JSX runtime for the TS "react-jsx" automatic runtime.
 * This builds plain VNode objects consumed by our custom mount/patch.
 */
import type { VNode } from './hooks'
import type { VNodeLike } from './vdom'

export const Fragment = (props: { children?: VNode | VNode[] | null }): VNodeLike =>
  props?.children ?? null

/**
 * JSX factory for automatic runtime (dynamic children)
 * Used by TypeScript for expressions like {items.map(...)}
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
  const { children, expand, proportion, theme, ...rest } = props ?? {}
  // Flatten children arrays deeply to support {arrayVariable} in JSX
  const kids =
    children == null ? [] : Array.isArray(children) ? children.flat(Infinity) : [children]
  const vnode: VNode = { type, props: rest, children: kids }

  // Extract key
  if (key !== undefined && key !== null) {
    vnode.__key = typeof key === 'string' || typeof key === 'number' ? key : String(key)
  }

  // Extract theme and store separately (removed from props)
  if (theme !== undefined) {
    vnode.__theme = theme as NonNullable<VNode['__theme']>
  }

  // Extract RexUI add() config and store separately (removed from props)
  if (expand !== undefined || proportion !== undefined) {
    vnode.__addConfig = {}
    if (expand !== undefined) vnode.__addConfig.expand = expand as boolean
    if (proportion !== undefined) vnode.__addConfig.proportion = proportion as number
  }

  return vnode
}

/**
 * JSX factory for static children arrays
 * Used by TypeScript when children are directly listed in JSX (not via .map())
 * Marks children as static so VDOM doesn't warn about missing keys
 * @param type - Element type (string or component function)
 * @param props - Props including children
 * @param key - Optional key for identity tracking
 * @returns VNode object
 */
export function jsxs(
  type: unknown,
  props: Record<string, unknown> | null,
  key?: unknown
): VNodeLike {
  const vnode = jsx(type, props, key) as VNode
  // Mark as static children - no key warnings needed
  if (vnode && typeof vnode === 'object' && 'type' in vnode) {
    vnode.__staticChildren = true
  }
  return vnode
}
