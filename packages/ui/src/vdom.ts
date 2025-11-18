/**
 * VDOM + mount/patch/unmount and host integration.
 * This file glues JSX VNodes to Phaser GameObjects using the host bridge.
 */
import equal from 'fast-deep-equal'
import Phaser from 'phaser'
import type { NodeProps, NodeType } from './core-types'
import { DebugLogger } from './dev-config'
import { disposeCtx, shouldComponentUpdate, withHooks, type Ctx, type VNode } from './hooks'
import { host } from './host'
import { Fragment } from './jsx-runtime'
import { calculateLayout } from './layout/index'
import { getThemedProps } from './theme'
import type { ParentType, Ref } from './types'

export type VNodeLike = VNode | VNode[] | null

/**
 * Layout-relevant props that trigger layout recalculation when changed
 * These are the props that affect container/child sizing and positioning
 */
const LAYOUT_PROPS = [
  'width',
  'height',
  'flex',
  'margin',
  'padding',
  'gap',
  'direction',
  'justifyContent',
  'alignItems',
  'overflow',
] as const

/**
 * Object props that need deep comparison
 * These props are objects and should be compared by value, not by reference
 */
const DEEP_COMPARE_PROPS = new Set(['margin', 'padding'])

/**
 * Check if layout-relevant props changed between two VNodes
 * Uses shallow equality for primitives and deep equality for objects
 * @param oldV - Previous VNode
 * @param newV - New VNode
 * @returns True if any layout prop changed
 */
function hasLayoutPropsChanged(oldV: VNode, newV: VNode): boolean {
  const oldProps = oldV.props ?? {}
  const newProps = newV.props ?? {}

  // Check each layout-relevant prop
  for (const prop of LAYOUT_PROPS) {
    const oldVal = oldProps[prop]
    const newVal = newProps[prop]

    // Use deep comparison for object props (margin, padding)
    if (DEEP_COMPARE_PROPS.has(prop)) {
      if (!equal(oldVal, newVal)) {
        // Debug: Log what changed
        DebugLogger.log('vdom', 'hasLayoutPropsChanged', prop, 'changed:', oldVal, '→', newVal)
        return true
      }
    } else {
      // Shallow comparison for primitives
      if (oldVal !== newVal) {
        // Debug: Log what changed
        DebugLogger.log('vdom', 'hasLayoutPropsChanged', prop, 'changed:', oldVal, '→', newVal)
        return true
      }
    }
  }

  return false
}

/**
 * Attaches or detaches a ref to a node
 * @param ref - Ref callback or object
 * @param value - Value to set (null for detach)
 */
function attachRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
  } else {
    ref.current = value
  }
}

/**
 * Creates a VNode element (alternative to JSX)
 * @param type - Element type (string or component)
 * @param props - Element props
 * @param children - Child elements
 * @returns VNode object
 */
export function createElement(
  type: string | ((props: Record<string, unknown>) => VNode),
  props: Record<string, unknown> | null,
  ...children: VNode[]
): VNode {
  const flat = ([] as unknown[]).concat(...children).filter((c) => c != null)
  return { type, props: props ?? {}, children: flat as VNode[] }
}

/**
 * Mounts a VNode into a Phaser scene or parent container
 * @param parentOrScene - Phaser scene or parent container
 * @param vnode - VNode to mount
 * @returns Created Phaser GameObject
 */
export function mount(parentOrScene: ParentType, vnode: VNode): Phaser.GameObjects.GameObject {
  // Fragment - mount children directly without creating a container
  if (vnode.type === Fragment) {
    // Mount all children directly to parent
    let firstNode: Phaser.GameObjects.GameObject | undefined
    vnode.children?.forEach((c) => {
      if (c != null && c !== false) {
        // Propagate theme to children
        if (!c.__theme && vnode.__theme) {
          c.__theme = vnode.__theme
        }
        const childNode = mount(parentOrScene, c)
        if (!firstNode) firstNode = childNode
      }
    })
    // Store a marker so we know this is a fragment during unmount/patch
    vnode.__node = firstNode
    vnode.__parent = parentOrScene
    // Fragment must have at least one child to work properly
    if (!firstNode) {
      throw new Error('Fragment must have at least one child element')
    }
    return firstNode
  }

  // Function component
  if (typeof vnode.type === 'function') {
    const ctx: Ctx = {
      index: 0,
      slots: [],
      effects: [],
      cleanups: [],
      vnode, // Will be updated to rendered VNode below
      componentVNode: vnode, // Keep reference to component VNode
      parent: parentOrScene,
      function: vnode.type as (props: unknown) => VNode,
      isFactory: false,
      theme: vnode.__theme, // Inherit theme from parent or use vnode's theme
    }
    // Store context on the component vnode for patching
    ;(vnode as VNode & { __ctx?: Ctx }).__ctx = ctx
    // Pass children to the component via props
    const propsWithChildren = vnode.children?.length
      ? { ...(vnode.props ?? {}), children: vnode.children }
      : vnode.props
    const rendered = withHooks(ctx, () =>
      (vnode.type as (props: unknown) => VNode)(propsWithChildren)
    )

    // Propagate theme to rendered VNode
    if (ctx.theme && !rendered.__theme) {
      rendered.__theme = ctx.theme
    }

    // Check if this is a VNode factory (renders immediately without using hooks)
    if (ctx.slots.length === 0 && ctx.effects.length === 0) {
      // This is a simple factory function, not a real component
      ctx.isFactory = true
      // Keep reference to the rendered output so unmounting works without recursion
      ctx.vnode = rendered
      // Copy __addConfig from component VNode to rendered VNode
      if (vnode.__addConfig) {
        rendered.__addConfig = vnode.__addConfig
      }
      // Mount the rendered VNode directly without creating a component context
      return mount(parentOrScene, rendered)
    }

    // Copy __addConfig from component VNode to rendered VNode
    if (vnode.__addConfig) {
      rendered.__addConfig = vnode.__addConfig
    }
    const node = mount(parentOrScene, rendered)
    ctx.cleanups.push(() => unmount(rendered))
    ctx.vnode = rendered
    for (const run of ctx.effects) run()
    return node
  }
  // Host node
  // Check if parentOrScene is already a Phaser.Scene
  const scene = (parentOrScene as { sys?: unknown }).sys
    ? (parentOrScene as Phaser.Scene) // It's a Scene
    : ((parentOrScene as { scene?: unknown }).scene as Phaser.Scene) // It's a game object with .scene

  // Apply theme to props
  const nodeType = vnode.type as NodeType
  const themedProps = getThemedProps(nodeType, vnode.__theme, vnode.props ?? {})

  // Debug: Log themed props for View
  if (
    nodeType === 'View' &&
    (themedProps.backgroundColor !== undefined || themedProps.cornerRadius !== undefined)
  ) {
    console.log('[VDOM Mount] Themed props for View:', {
      backgroundColor: themedProps.backgroundColor,
      cornerRadius: themedProps.cornerRadius,
      hasTheme: !!vnode.__theme,
      originalProps: vnode.props,
    })
  }

  const node = host.create(nodeType, themedProps as NodeProps, scene)
  vnode.__node = node
  vnode.__parent = parentOrScene // Store parent for unmounting

  // Attach ref after node creation
  const ref = vnode.props?.ref as Ref<Phaser.GameObjects.GameObject> | undefined
  attachRef(ref, node)

  host.append(parentOrScene, node)
  vnode.children?.forEach((c) => {
    if (c != null && c !== false) {
      // Propagate theme to children (inherit parent's theme if child doesn't have one)
      if (!c.__theme && vnode.__theme) {
        c.__theme = vnode.__theme
      }
      mount(node as ParentType, c)
    }
  })

  // Calculate layout after all children are mounted
  // Check if this is a Container (has list property)
  if (node && 'list' in node && Array.isArray((node as Phaser.GameObjects.Container).list)) {
    const container = node as Phaser.GameObjects.Container & {
      __layoutProps?: Record<string, unknown>
    }
    DebugLogger.log('vdom', 'About to calculate layout, __layoutProps:', container.__layoutProps)

    // Get parent size for percentage/fill resolution
    let parentSize: { width: number; height: number } | undefined
    if (parentOrScene instanceof Phaser.GameObjects.Container) {
      const parentContainer = parentOrScene as Phaser.GameObjects.Container & {
        __layoutProps?: Record<string, unknown>
      }
      // Get parent's resolved size if available
      if (parentContainer.width > 0 && parentContainer.height > 0) {
        parentSize = { width: parentContainer.width, height: parentContainer.height }
      }
    }

    calculateLayout(container, container.__layoutProps ?? {}, parentSize)
  }

  return node
}

/**
 * Unmounts a VNode and cleans up resources
 * @param vnode - VNode to unmount
 */
export function unmount(vnode: VNode | null | undefined | false): void {
  if (!vnode || (vnode as unknown) === false) return

  // Fragment - just unmount children
  if (vnode.type === Fragment) {
    vnode.children?.forEach(unmount)
    return
  }

  if (typeof vnode.type === 'function') {
    const ctx = (vnode as VNode & { __ctx?: Ctx }).__ctx
    if (ctx) disposeCtx(ctx)
    if (ctx?.vnode) unmount(ctx.vnode)
    return
  }

  // Detach ref before cleanup
  const ref = vnode.props?.ref as Ref<Phaser.GameObjects.GameObject> | undefined
  attachRef(ref, null)

  // Clean up children FIRST (before removing from parent)
  vnode.children?.forEach(unmount)
  // Then remove from parent/scene
  const parent = vnode.__parent
  if (parent) host.remove(parent as ParentType, vnode.__node as Phaser.GameObjects.GameObject)
}

/**
 * Patches VNode tree with updates
 * @param parent - Parent container or scene
 * @param oldV - Previous VNode
 * @param newV - New VNode
 */
export function patchVNode(parent: ParentType, oldV: VNode, newV: VNode) {
  // Check if keys differ - if so, unmount old and mount new
  if (oldV.__key !== newV.__key) {
    unmount(oldV)
    mount(parent, newV)
    return
  }

  // Fragment - patch children directly
  if (oldV.type === Fragment && newV.type === Fragment) {
    const a = oldV.children ?? []
    const b = newV.children ?? []
    const len = Math.max(a.length, b.length)
    for (let i = 0; i < len; i++) {
      const c1 = a[i]
      const c2 = b[i]
      const isValidC1 = c1 != null && c1 !== false
      const isValidC2 = c2 != null && c2 !== false
      if (!isValidC1 && isValidC2) {
        mount(parent, c2)
      } else if (isValidC1 && !isValidC2) {
        unmount(c1)
      } else if (isValidC1 && isValidC2) {
        patchVNode(parent, c1, c2)
      }
    }
    return
  }

  // Function components
  if (typeof oldV.type === 'function' || typeof newV.type === 'function') {
    if (oldV.type === newV.type) {
      const ctx = (oldV as VNode & { __ctx?: Ctx }).__ctx
      if (!ctx) {
        // No context means this is a VNode factory (like RexSizer), not a real component
        // Render both and patch the results
        const propsWithChildren = newV.children?.length
          ? { ...(newV.props ?? {}), children: newV.children }
          : newV.props
        const oldRendered = (oldV.type as (props: unknown) => VNode)(
          oldV.children?.length ? { ...(oldV.props ?? {}), children: oldV.children } : oldV.props
        )
        const newRendered = (newV.type as (props: unknown) => VNode)(propsWithChildren)
        patchVNode(parent, oldRendered, newRendered)
        return
      }
      // Real component with context - update component VNode props if changed
      if (newV.props !== undefined) {
        ctx.componentVNode.props = newV.props
      }
      if (newV.children !== undefined) {
        ctx.componentVNode.children = newV.children
      }
      // Transfer context to newV so future patches work
      ;(newV as VNode & { __ctx?: Ctx }).__ctx = ctx

      // Build props for comparison (merge props + children)
      const propsWithChildren = ctx.componentVNode.children?.length
        ? { ...(ctx.componentVNode.props ?? {}), children: ctx.componentVNode.children }
        : ctx.componentVNode.props

      // Check if component should update (memoization)
      if (!shouldComponentUpdate(ctx, propsWithChildren)) {
        // Props haven't changed - skip re-render
        return
      }

      // Re-render with updated props
      const renderedNext = withHooks(ctx, () =>
        (newV.type as (props: unknown) => VNode)(propsWithChildren)
      )
      patchVNode(parent, ctx.vnode, renderedNext)
      ctx.vnode = renderedNext
      for (const run of ctx.effects) run()

      return
    }
    unmount(oldV)
    mount(parent, newV)
    return
  }
  // Host nodes
  if (oldV.type !== newV.type) {
    unmount(oldV)
    mount(parent, newV)
    return
  }
  const nodeType = oldV.type as NodeType
  newV.__node = oldV.__node

  // Update ref if it changed
  const oldRef = oldV.props?.ref as Ref<Phaser.GameObjects.GameObject> | undefined
  const newRef = newV.props?.ref as Ref<Phaser.GameObjects.GameObject> | undefined
  if (oldRef !== newRef) {
    attachRef(oldRef, null)
    attachRef(newRef, oldV.__node as Phaser.GameObjects.GameObject)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  host.patch(nodeType, oldV.__node as any, oldV.props ?? {}, newV.props ?? {})

  const a = oldV.children ?? []
  const b = newV.children ?? []
  const len = Math.max(a.length, b.length)
  let childrenChanged = false

  // Check if the container's own layout props changed
  const containerLayoutChanged = hasLayoutPropsChanged(oldV, newV)

  // Debug: Track excessive patching
  // DebugLogger.log('vdom', 'Patching:', { type: oldV.type, children: len, containerLayoutChanged })

  for (let i = 0; i < len; i++) {
    const c1 = a[i],
      c2 = b[i]
    // Filter out false/null/undefined children
    const isValidC1 = c1 != null && c1 !== false
    const isValidC2 = c2 != null && c2 !== false
    if (!isValidC1 && isValidC2) {
      mount(oldV.__node as ParentType, c2)
      childrenChanged = true
    } else if (isValidC1 && !isValidC2) {
      unmount(c1)
      childrenChanged = true
    } else if (isValidC1 && isValidC2) {
      // Check if this child has layout-relevant changes
      const childLayoutChanged = hasLayoutPropsChanged(c1, c2)

      // Recursively patch the child
      patchVNode(oldV.__node as ParentType, c1, c2)

      // Mark as changed if:
      // 1. Layout props changed, OR
      // 2. Child has dynamic sizing (__getLayoutSize) - content might have changed
      if (childLayoutChanged) {
        childrenChanged = true
      } else if (c1.__node && typeof c1.__node === 'object' && '__getLayoutSize' in c1.__node) {
        // Child has dynamic sizing (e.g., text), assume size might have changed
        childrenChanged = true
      }
    }
  }

  // Recalculate layout if:
  // 1. Container's own layout props changed, OR
  // 2. Children structurally changed or have layout-relevant changes
  const shouldRecalculateLayout = containerLayoutChanged || childrenChanged

  if (
    shouldRecalculateLayout &&
    oldV.__node &&
    typeof oldV.__node === 'object' &&
    'list' in oldV.__node
  ) {
    const container = oldV.__node as Phaser.GameObjects.Container & {
      __layoutProps?: Record<string, unknown>
    }
    if (container.__layoutProps) {
      // Get parent size for percentage/fill resolution
      let parentSize: { width: number; height: number } | undefined
      if (parent instanceof Phaser.GameObjects.Container) {
        const parentContainer = parent as Phaser.GameObjects.Container & {
          __layoutProps?: Record<string, unknown>
        }
        if (parentContainer.width > 0 && parentContainer.height > 0) {
          parentSize = { width: parentContainer.width, height: parentContainer.height }
        }
      }

      calculateLayout(container, container.__layoutProps, parentSize)
    }
  }
}

/**
 * Mounts a component by type and props (convenience wrapper around mount)
 * @param parentOrScene - Phaser scene or parent container
 * @param type - Component type (function or string)
 * @param props - Component props
 * @returns Created Phaser GameObject
 */
/* eslint-disable no-redeclare */
export function mountJSX<T extends NodeType>(
  parentOrScene: ParentType,
  type: T,
  props: NodeProps<T>
): Phaser.GameObjects.GameObject

export function mountJSX<P>(
  parentOrScene: ParentType,
  type: (props: P) => VNode,
  props: P
): Phaser.GameObjects.GameObject

export function mountJSX(
  parentOrScene: ParentType,
  type: NodeType | ((props: unknown) => VNode),
  props: Record<string, unknown> = {}
): Phaser.GameObjects.GameObject {
  const vnode: VNode = { type, props, children: [] }
  return mount(parentOrScene, vnode)
}
/* eslint-enable no-redeclare */
