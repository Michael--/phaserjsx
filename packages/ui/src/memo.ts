/**
 * Component memoization utilities
 * Similar to React.memo() - prevents re-renders when props haven't changed
 */
import type { VNode } from './hooks'

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
 * @returns Same VNode with memoization disabled
 */
export function noMemo<T extends VNode>(vnode: T): T {
  vnode.__memo = false
  return vnode
}

/**
 * Explicitly enable memoization for a component (default behavior)
 * This is the default - you don't need to call this unless you want to be explicit
 *
 * @param vnode - VNode to mark
 * @returns Same VNode with memoization enabled
 */
export function memo<T extends VNode>(vnode: T): T {
  vnode.__memo = true
  return vnode
}
