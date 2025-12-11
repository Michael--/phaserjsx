/**
 * Component memoization utilities
 * Similar to React.memo() - prevents re-renders when props haven't changed
 */
import type { VNode } from './hooks'

/**
 * Safely sets __memo on a VNode, handling frozen/sealed objects from bundlers
 * @param vnode - VNode to set __memo on
 * @param value - Memoization value
 * @returns Original VNode if extensible, or shallow copy with __memo
 */
function setMemoSafe<T extends VNode>(vnode: T, value: boolean): T {
  if (Object.isExtensible(vnode)) {
    vnode.__memo = value
    return vnode
  }
  // VNode is frozen - create shallow copy
  return { ...vnode, __memo: value } as T
}

/**
 * Marks a component to skip memoization (always re-render on prop changes)
 * Use when component has side effects or needs to re-render every time
 *
 * @example
 * ```tsx
 * function AlwaysUpdate({ value }) {
 *   console.log('Rendering with:', value)
 *   return <Text text={value} />
 * }
 *
 * // Disable memoization
 * <AlwaysUpdate value={counter} __memo={false} />
 * ```
 *
 * @param vnode - VNode to mark
 * @returns Same VNode with memoization disabled (may be a copy if frozen)
 */
export function noMemo<T extends VNode>(vnode: T): T {
  return setMemoSafe(vnode, false)
}

/**
 * Explicitly enable memoization for a component (default behavior)
 * This is the default - you don't need to call this unless you want to be explicit
 *
 * @param vnode - VNode to mark
 * @returns Same VNode with memoization enabled (may be a copy if frozen)
 */
export function memo<T extends VNode>(vnode: T): T {
  return setMemoSafe(vnode, true)
}
