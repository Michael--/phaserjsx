/**
 * VDOM + mount/patch/unmount and host integration.
 * This file glues JSX VNodes to Phaser/rexUI objects using the host bridge.
 */
import { disposeCtx, withHooks, type Ctx, type VNode } from './hooks'
import { host } from './host'

export type VNodeLike = any

/**
 * Creates a VNode element (alternative to JSX)
 * @param type - Element type (string or component)
 * @param props - Element props
 * @param children - Child elements
 * @returns VNode object
 */
export function createElement(
  type: unknown,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): VNode {
  const flat = ([] as unknown[]).concat(...children).filter((c) => c != null)
  return { type, props: props ?? {}, children: flat as VNode[] }
}

/**
 * Mounts a VNode into a Phaser scene or parent container
 * @param parentOrScene - Phaser scene or parent container
 * @param vnode - VNode to mount
 * @returns Created Phaser/rexUI object
 */
export function mount(parentOrScene: unknown, vnode: VNode): unknown {
  // Function component
  if (typeof vnode.type === 'function') {
    const ctx: Ctx = {
      index: 0,
      slots: [],
      effects: [],
      cleanups: [],
      vnode,
      parent: parentOrScene,
    }
    const rendered = withHooks(ctx, () => (vnode.type as (props: unknown) => VNode)(vnode.props))
    ;(rendered as VNode & { __ctx?: Ctx }).__ctx = ctx
    const node = mount(parentOrScene, rendered)
    ctx.cleanups.push(() => unmount(rendered))
    ctx.vnode = rendered
    for (const run of ctx.effects) run()
    return node
  }
  // Host node
  const scene = (parentOrScene as { scene?: unknown }).scene ?? parentOrScene
  const node = host.create(String(vnode.type), vnode.props ?? {}, scene as Phaser.Scene)
  vnode.__node = node
  host.append(parentOrScene, node)
  vnode.children?.forEach((c) => mount(node, c))
  host.layout(node)
  return node
}

/**
 * Unmounts a VNode and cleans up resources
 * @param vnode - VNode to unmount
 */
export function unmount(vnode: VNode) {
  if (typeof vnode.type === 'function') {
    const ctx = (vnode as VNode & { __ctx?: Ctx }).__ctx
    if (ctx) disposeCtx(ctx)
    if (ctx?.vnode) unmount(ctx.vnode)
    return
  }
  vnode.children?.forEach(unmount)
  const parent =
    (vnode.__node as { parentContainer?: unknown; scene?: unknown } | undefined)?.parentContainer ??
    (vnode.__node as { scene?: unknown } | undefined)?.scene
  if (parent) host.remove(parent, vnode.__node)
}

/**
 * Patches VNode tree with updates
 * @param parent - Parent container or scene
 * @param oldV - Previous VNode
 * @param newV - New VNode
 */
export function patchVNode(parent: unknown, oldV: VNode, newV: VNode) {
  // Function components
  if (typeof oldV.type === 'function' || typeof newV.type === 'function') {
    if (oldV.type === newV.type) {
      const ctx = (oldV as VNode & { __ctx?: Ctx }).__ctx!
      if (newV.props !== undefined) {
        ctx.vnode.props = newV.props
      }
      const renderedNext = withHooks(ctx, () =>
        (newV.type as (props: unknown) => VNode)(newV.props)
      )
      ;(renderedNext as VNode & { __ctx?: Ctx }).__ctx = ctx
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
  newV.__node = oldV.__node
  host.patch(oldV.__node, oldV.props ?? {}, newV.props ?? {})
  const a = oldV.children ?? []
  const b = newV.children ?? []
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const c1 = a[i],
      c2 = b[i]
    if (!c1 && c2) mount(oldV.__node, c2)
    else if (c1 && !c2) unmount(c1)
    else if (c1 && c2) patchVNode(oldV.__node, c1, c2)
  }
  host.layout(oldV.__node)
}
