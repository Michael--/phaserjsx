/**
 * Tiny hook runtime to enable function components with local subtree re-render.
 * It is independent from React/Preact renderers.
 */
import type { PartialTheme } from './theme'
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
  lastProps?: unknown // Store last props for memoization
  memoized?: boolean // Whether component uses memoization (default: true)
  theme?: PartialTheme | undefined // Theme context for this component
}

let CURRENT: Ctx | null = null

export type VNode = {
  type: unknown
  props?: Record<string, unknown> | undefined
  children?: (VNode | null | undefined | false)[]
  __node?: unknown
  __ctx?: Ctx
  __parent?: unknown
  __key?: string | number | null
  __addConfig?: {
    expand?: boolean
    proportion?: number
    align?: string
    padding?: number | { left?: number; right?: number; top?: number; bottom?: number }
  }
  __memo?: boolean // Opt-out of memoization (false = always re-render)
  __theme?: PartialTheme // Theme override for this VNode and its children
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
 * Hook to access current theme context
 * Returns the theme that was passed down through the VDOM tree
 * @returns Current theme context or undefined if no theme is set
 */
export function useTheme(): PartialTheme | undefined {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const c = CURRENT!
  return c.theme
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
 * Shallow comparison for props objects
 * Used for component memoization (React.memo equivalent)
 * @param a - Previous props
 * @param b - Current props
 * @returns true if props are shallowly equal
 */
export function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true

  // Handle null/undefined
  if (a == null || b == null) return false

  // Must both be objects
  if (typeof a !== 'object' || typeof b !== 'object') return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  // Different number of keys
  if (keysA.length !== keysB.length) return false

  // Check each key
  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    ) {
      return false
    }
  }

  return true
}

/**
 * Check if component should update based on props comparison
 * Similar to React.memo() - skips re-render if props haven't changed
 * @param ctx - Component context
 * @param newProps - New props to compare
 * @returns true if component should re-render
 */
export function shouldComponentUpdate(ctx: Ctx, newProps: unknown): boolean {
  // Always update if memoization disabled (ctx.memoized = false or __memo = false)
  if (ctx.memoized === false) return true

  // Check VNode-level opt-out
  if (ctx.componentVNode.__memo === false) return true

  // First render or no previous props
  if (ctx.lastProps === undefined) {
    ctx.lastProps = newProps
    return true
  }

  // Compare props (shallow)
  const hasChanged = !shallowEqual(ctx.lastProps, newProps)

  // Update stored props
  ctx.lastProps = newProps

  return hasChanged
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
