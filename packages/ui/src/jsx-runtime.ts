/**
 * Minimal JSX runtime for the TS "react-jsx" automatic runtime.
 * This builds plain VNode objects consumed by our custom mount/patch.
 */
import type { VNode } from './hooks'
import type { VNodeLike } from './types'

export const Fragment = (props: { children?: VNodeLike }): VNodeLike => props?.children ?? null

/**
 * Safely sets a property on a VNode, handling frozen/sealed objects from bundlers
 * @param vnode - VNode to set property on
 * @param key - Property key
 * @param value - Value to set
 * @returns Original VNode if extensible, or shallow copy with property
 */
function setVNodeProp<T extends VNode, K extends keyof VNode>(
  vnode: T,
  key: K,
  value: VNode[K]
): T {
  if (Object.isExtensible(vnode)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(vnode as any)[key] = value
    return vnode
  }
  // VNode is frozen - create shallow copy
  return { ...vnode, [key]: value } as T
}

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
  let vnode: VNode = { type, props: rest, children: kids }

  // Extract key
  if (key !== undefined && key !== null) {
    vnode = setVNodeProp(
      vnode,
      '__key',
      typeof key === 'string' || typeof key === 'number' ? key : String(key)
    )
  }

  // Extract theme and store separately (removed from props)
  if (theme !== undefined) {
    vnode = setVNodeProp(vnode, '__theme', theme as NonNullable<VNode['__theme']>)
  }

  // Extract UI add() config and store separately (removed from props)
  if (expand !== undefined || proportion !== undefined) {
    const addConfig: NonNullable<VNode['__addConfig']> = {}
    if (expand !== undefined) addConfig.expand = expand as boolean
    if (proportion !== undefined) addConfig.proportion = proportion as number
    vnode = setVNodeProp(vnode, '__addConfig', addConfig)
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
  let vnode = jsx(type, props, key) as VNode
  // Mark as static children - no key warnings needed
  if (vnode && typeof vnode === 'object' && 'type' in vnode) {
    vnode = setVNodeProp(vnode, '__staticChildren', true)
  }
  return vnode
}
