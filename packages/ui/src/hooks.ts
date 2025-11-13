/**
 * Tiny hook runtime to enable function components with local subtree re-render.
 * It is independent from React/Preact renderers.
 */
import type { ParentType } from './types'
import { patchVNode } from './vdom'

type Cleanup = void | (() => void)

export type Ctx = {
  index: number
  slots: unknown[]
  effects: (() => Cleanup)[]
  cleanups: Cleanup[]
  vnode: VNode // The rendered VNode (output of component function)
  componentVNode: VNode // The component VNode itself (with type = function)
  parent: ParentType
  function: (props: unknown) => VNode
  updater?: (() => void) | undefined
  isFactory: boolean
}

let CURRENT: Ctx | null = null

export type VNode = {
  type: unknown
  props?: Record<string, unknown> | undefined
  children?: VNode[]
  __node?: unknown
  __ctx?: Ctx
}

/**
 * Executes a render function with hooks context
 * @param ctx - The context to use for hooks
 * @param render - The render function to execute
 * @returns The result of the render function
 */
export function withHooks<T>(ctx: Ctx, render: () => T): T {
  const prev = CURRENT
  CURRENT = ctx
  ctx.index = 0
  ctx.effects = []
  const out = render()
  CURRENT = prev
  return out
}

/**
 * State hook for managing component state
 * @param initial - Initial state value or initializer function
 * @returns Tuple of current state and setter function
 */
export function useState<T>(initial: T): [T, (v: T | ((p: T) => T)) => void] {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const c = CURRENT!
  const i = c.index++
  if (i >= c.slots.length)
    c.slots[i] = typeof initial === 'function' ? (initial as () => T)() : initial
  const value = c.slots[i] as T
  const set = (v: T | ((p: T) => T)) => {
    const next = typeof v === 'function' ? (v as (p: T) => T)(c.slots[i] as T) : v
    if (Object.is(next, c.slots[i])) return
    c.slots[i] = next
    scheduleUpdate(c)
  }
  return [value, set]
}

/**
 * Ref hook for storing mutable values
 * @param val - Initial ref value
 * @returns Ref object with current property
 */
export function useRef<T>(val: T): { current: T } {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const c = CURRENT!
  const i = c.index++
  if (i >= c.slots.length) c.slots[i] = { current: val }
  return c.slots[i] as { current: T }
}

/**
 * Memoization hook for expensive computations
 * @param fn - Function to memoize
 * @param deps - Dependency array
 * @returns Memoized value
 */
export function useMemo<T>(fn: () => T, deps: readonly unknown[]): T {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const c = CURRENT!
  const i = c.index++
  const slot = (c.slots[i] ?? (c.slots[i] = { deps: undefined, value: undefined as T })) as {
    deps?: readonly unknown[]
    value: T
  }
  if (!depsChanged(slot.deps, deps)) return slot.value
  slot.value = fn()
  slot.deps = deps
  return slot.value
}

/**
 * Effect hook for side effects with cleanup
 * @param fn - Effect function that optionally returns cleanup
 * @param deps - Optional dependency array
 */
export function useEffect(fn: () => Cleanup, deps?: readonly unknown[] | undefined) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const c = CURRENT!
  const i = c.index++
  const slot = (c.slots[i] ??
    (c.slots[i] = { deps: undefined, cleanup: undefined as Cleanup })) as {
    deps?: readonly unknown[] | undefined
    cleanup: Cleanup
  }
  c.effects.push(() => {
    if (!depsChanged(slot.deps, deps)) return
    if (typeof slot.cleanup === 'function') slot.cleanup()
    slot.cleanup = fn()
    if (deps !== undefined) {
      slot.deps = deps
    }
  })
}

/**
 * Checks if dependency arrays have changed
 * @param a - Previous dependencies
 * @param b - Current dependencies
 * @returns true if changed, false otherwise
 */
function depsChanged(a?: readonly unknown[], b?: readonly unknown[]) {
  if (!a || !b) return true
  if (a.length !== b.length) return true
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return true
  }
  return false
}

/**
 * Schedules a component update on next microtask
 * @param c - Component context to update
 */
function scheduleUpdate(c: Ctx) {
  if (c.updater) return
  c.updater = () => {
    c.updater = undefined
    // Use component VNode props, merging with children
    const componentProps = c.componentVNode.props ?? {}
    const propsWithChildren = c.componentVNode.children?.length
      ? { ...componentProps, children: c.componentVNode.children }
      : componentProps

    // Render the component to get the new VNode
    const nextVNode = withHooks(c, () => c.function(propsWithChildren))

    // Patch the existing rendered tree
    patchVNode(c.parent, c.vnode, nextVNode)

    c.vnode = nextVNode

    // Run effects after patching
    for (const run of c.effects) run()
  }
  queueMicrotask(c.updater)
} /**
 * Disposes component context and runs cleanups
 * @param c - Context to dispose
 */
export function disposeCtx(c: Ctx) {
  for (const cl of c.cleanups) {
    if (typeof cl === 'function') cl()
  }
}
