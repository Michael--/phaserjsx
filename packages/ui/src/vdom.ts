/**
 * VDOM + mount/patch/unmount and host integration.
 * This file glues JSX VNodes to Phaser GameObjects using the host bridge.
 */
import equal from 'fast-deep-equal'
import Phaser from 'phaser'
import { SceneWrapper } from './components/internal/SceneWrapper'
import type { NodeProps, NodeType } from './core-types'
import { DebugLogger, DevConfig } from './dev-config'
import { generateMountRootId, getGestureManager } from './gestures/gesture-manager'
import { disposeCtx, shouldComponentUpdate, withHooks, type Ctx, type VNode } from './hooks'
import { host } from './host'
import { Fragment } from './jsx-runtime'
import { calculateLayout, type LayoutSize } from './layout/index'
import { portalRegistry } from './portal'
import { getRenderContext } from './render-context'
import { getThemedProps } from './theme'
import type { ParentType, Ref } from './types'

export type VNodeLike = VNode | VNode[] | null

/**
 * Registry for active mountJSX instances to enable complete remounting
 * Stores parent, type, and props for each mount to enable theme-triggered remounts
 */
interface MountRegistryEntry {
  id: number
  parent: ParentType
  type: NodeType | ((props: unknown) => VNode)
  props: MountProps & Record<string, unknown>
  rootNode: Phaser.GameObjects.GameObject
  vnode: VNode
}

class MountRegistry {
  private entries: Map<number, MountRegistryEntry> = new Map()
  private nextId = 1

  /**
   * Register a new mountJSX instance
   * @param parent - Parent container or scene
   * @param type - Component type or node type
   * @param props - Mount props
   * @param rootNode - Root game object
   * @returns Registry ID for this mount
   */
  register(
    parent: ParentType,
    type: NodeType | ((props: unknown) => VNode),
    props: MountProps & Record<string, unknown>,
    rootNode: Phaser.GameObjects.GameObject,
    vnode: VNode
  ): number {
    const id = this.nextId++
    this.entries.set(id, { id, parent, type, props, rootNode, vnode })
    DebugLogger.log('vdom', `Registered mount ${id}`)
    return id
  }

  /**
   * Unregister a mountJSX instance
   * @param id - Registry ID
   */
  unregister(id: number): void {
    const entry = this.entries.get(id)
    if (entry) {
      DebugLogger.log('vdom', `Unregistered mount ${id}`)
      this.entries.delete(id)
    }
  }

  /**
   * Get a specific mount entry by registry ID
   * @param id - Registry ID
   * @returns Mount entry or undefined if not found
   */
  getEntry(id: number): MountRegistryEntry | undefined {
    return this.entries.get(id)
  }

  /**
   * Find a mount entry by parent
   * @param parent - Parent container or scene
   * @returns Mount entry or undefined if not found
   */
  findByParent(parent: ParentType): MountRegistryEntry | undefined {
    for (const entry of this.entries.values()) {
      if (entry.parent === parent) {
        return entry
      }
    }
    return undefined
  }

  /**
   * Get all active mount entries
   * @returns Array of mount entries
   */
  getAllEntries(): MountRegistryEntry[] {
    return Array.from(this.entries.values())
  }

  /**
   * Clear all entries (for testing)
   */
  clear(): void {
    this.entries.clear()
    this.nextId = 1
  }
}

/**
 * Global mount registry instance
 */
const mountRegistry = new MountRegistry()

/**
 * Remount all active mountJSX instances
 * Completely unmounts and remounts every registered root
 * Used when theme changes require full VDOM rebuild
 */
export function remountAll(): void {
  const entries = mountRegistry.getAllEntries()

  if (entries.length === 0) {
    DebugLogger.log('vdom', 'No mounts to remount')
    return
  }

  console.log(`[REMOUNT] Starting remount of ${entries.length} root(s)`)

  entries.forEach((entry) => {
    try {
      // Find the current VNode stored in the scene
      const scene =
        entry.parent instanceof Phaser.Scene
          ? entry.parent
          : (entry.parent as Phaser.GameObjects.GameObject).scene

      if (!scene || !scene.sys) {
        console.warn('[REMOUNT] Scene is invalid, skipping remount')
        return
      }

      const currentVNode = (scene as unknown as { __rootVNode?: VNode }).__rootVNode

      // Clear all children from the root container first
      if (entry.rootNode instanceof Phaser.GameObjects.Container) {
        // Remove all children from container
        const children = entry.rootNode.getAll()
        children.forEach((child) => {
          ;(entry.rootNode as Phaser.GameObjects.Container).remove(child, true) // true = destroy child
        })
      }

      // Unmount the VDOM tree (this cleans up hooks, contexts, etc.)
      if (currentVNode) {
        // Recursively unmount children but skip the final host.remove
        // since we already cleared the container above
        const flatChildren = flattenChildren(currentVNode.children)
        flatChildren.forEach(unmount)

        // Clean up component context if it exists
        if (currentVNode.__ctx) {
          disposeCtx(currentVNode.__ctx)
          delete currentVNode.__ctx
        }
      }

      // Create and mount a fresh VDOM tree
      const { width, height, disableAutoSize = false, ...componentProps } = entry.props

      // Update viewport dimensions
      const renderContext = getRenderContext(entry.parent)
      renderContext.setViewport(width, height, scene)
      portalRegistry.setViewportSize(scene, width, height)

      // Create VNode with or without SceneWrapper
      let vnode: VNode

      if (disableAutoSize) {
        vnode = { type: entry.type, props: { ...componentProps, width, height }, children: [] }
      } else {
        const componentVNode: VNode = {
          type: entry.type,
          props: componentProps,
          children: [],
        }

        vnode = {
          type: SceneWrapper,
          props: {
            width,
            height,
            children: componentVNode,
          },
          children: [],
        }
      }

      // Store new root VNode on the scene
      ;(scene as unknown as { __rootVNode?: VNode }).__rootVNode = vnode

      // Mount the new VDOM tree into the EXISTING parent container
      const rootNode = mount(entry.parent, vnode)

      if (rootNode instanceof Phaser.GameObjects.Container) {
        ;(rootNode as unknown as { __mountRootId?: number }).__mountRootId = generateMountRootId()
      }

      // Update registry with new root node and restore registry ID
      entry.rootNode = rootNode
      entry.vnode = vnode
      ;(rootNode as unknown as { __registryId?: number }).__registryId = entry.id
      ;(rootNode as unknown as { __rootVNode?: VNode }).__rootVNode = vnode

      console.log('[REMOUNT] Successfully remounted entry', entry.id)
    } catch (error) {
      console.error('[REMOUNT] Failed to remount entry', entry.id, error)
    }
  })

  console.log('[REMOUNT] Remount complete')
}

/**
 * Base props that mountJSX requires for scene dimensions
 * Provides viewport size for percentage-based sizing
 */
export interface MountProps {
  /** Scene/container width in pixels */
  width: number
  /** Scene/container height in pixels */
  height: number
  /** Disable automatic SceneWrapper (default: false) */
  disableAutoSize?: boolean
}

/**
 * Combined props type: MountProps + Component-specific props
 * Use this for type-safe mountJSX calls
 */
export type MountComponentProps<P = Record<string, never>> = MountProps & P

/**
 * Returned handle from mountJSX
 * Extends the root GameObject with a typed unmount helper
 */
export interface MountHandle extends Phaser.GameObjects.GameObject {
  unmount: () => void
}

/**
 * Flattens nested arrays iteratively (performance optimized)
 * Handles arrays that weren't flattened by jsx-runtime (e.g., from Fragment)
 * @param children - Array that may contain nested arrays
 * @returns Flattened array
 */
function flattenChildren(
  children: (VNode | null | false | undefined)[] | undefined
): (VNode | null | false | undefined)[] {
  if (!children) return []
  return children.flat(Infinity) as (VNode | null | false | undefined)[]
}

/**
 * Checks if a child should be skipped during mounting
 * Filters out falsy values, empty strings, and whitespace-only strings
 * @param child - Child to check
 * @returns true if child should be skipped
 */
function shouldSkipChild(child: unknown): boolean {
  if (child == null || child === false) return true
  if (typeof child === 'string') {
    const trimmed = child.trim()
    if (trimmed === '') {
      if (child !== '') {
        console.warn('JSX: Ignoring whitespace-only string in component children')
      }
      return true
    }
  }
  return false
}

/**
 * Checks if a set of VNode siblings are likely list items that need keys
 * Heuristics: multiple siblings of same type, or array index patterns
 * Static children (from jsxs()) are already excluded before this check
 * @param children - Array of child VNodes
 * @returns true if children look like a list that should have keys
 */
function looksLikeList(children: (VNode | null | false | undefined)[]): boolean {
  const validChildren = children.filter((c) => c != null && c !== false) as VNode[]

  // Require at least 5+ children of same type to reduce false positives
  // 2-4 items are often static JSX siblings, not dynamic lists
  if (validChildren.length < 5) return false

  // Check if all children have the same type (strong indicator of list)
  const types = new Set(validChildren.map((c) => c.type))
  if (types.size === 1) return true

  // Check if many children are missing keys (50%+ threshold)
  const missingKeys = validChildren.filter((c) => !c.__key).length
  return missingKeys / validChildren.length >= 0.5
}

/**
 * Warns about missing key props in list-like children
 * Helps detect performance issues from VDOM reconciliation problems
 * @param parent - Parent VNode
 * @param children - Child VNodes to check
 */
function warnMissingKeys(parent: VNode, children: (VNode | null | false | undefined)[]): void {
  if (!DevConfig.warnings.missingKeys) return

  // Skip warning if children are marked as static (from jsxs())
  if (parent.__staticChildren) return

  if (!looksLikeList(children)) return

  const validChildren = children.filter((c) => c != null && c !== false) as VNode[]
  const withoutKeys = validChildren.filter((c) => !c.__key)

  if (withoutKeys.length === 0) return

  const parentPath = buildComponentPath(parent)
  const firstChild = withoutKeys[0]
  if (!firstChild) return

  const childType =
    typeof firstChild.type === 'string'
      ? firstChild.type
      : (firstChild.type as { name?: string })?.name || 'Component'

  console.warn(
    `[PhaserJSX] Missing key props: ${withoutKeys.length}/${validChildren.length} <${childType}> children in <${parentPath}> don't have keys.`
    /*
 +    `\nThis can cause:
` +
      `  • Unnecessary component recreation instead of updates
` +
      `  • State loss in conditional rendering
` +
      `  • Performance degradation with lists
` +
      `\nAdd unique key props to each child, e.g.:\n` +
      `  <${childType} key="unique-id" />\n` +
      `\nTo disable this warning: DevConfig.warnings.missingKeys = false`
*/
  )
}

/**
 * Warns when a component remounts unnecessarily due to key/type mismatch
 * Helps detect inline JSX creation or callback recreation issues
 * @param oldV - Previous VNode
 * @param newV - New VNode
 */
function warnUnnecessaryRemount(oldV: VNode, newV: VNode): void {
  if (!DevConfig.warnings.unnecessaryRemounts) return

  // Only warn for components (not primitives)
  if (typeof oldV.type !== 'function' && typeof newV.type !== 'function') return

  const oldPath = buildComponentPath(oldV)
  const reason = oldV.__key !== newV.__key ? 'key changed' : 'type changed'

  console.warn(
    `[PhaserJSX] Unnecessary remount: <${oldPath}> remounted because ${reason}.\n` +
      `This often happens when:
` +
      `  • JSX elements are created inline: prefix={<Icon />} (create new object every render)
` +
      `  • Callbacks are not memoized: onClick={() => handler()} (new function every render)
` +
      `\nSolutions:
` +
      `  • Memoize JSX: const icon = useMemo(() => <Icon />, [])
` +
      `  • Memoize callbacks: const handleClick = useCallback(() => handler(), [])
` +
      `  • Add stable key props: key="my-component"
` +
      `\nTo disable this warning: DevConfig.warnings.unnecessaryRemounts = false`
  )
}

/**
 * Builds a component path string by walking up the VNode tree
 * Stops at the first parent with a key prop for easier debugging
 * @param vnode - VNode to start from
 * @returns Path string like "ParentWithKey[myKey] > Child > Grandchild"
 */
function buildComponentPath(vnode: VNode): string {
  const path: string[] = []
  let current: VNode | undefined = vnode

  while (current) {
    const typeName =
      typeof current.type === 'string'
        ? current.type
        : (current.type as { name?: string })?.name || 'Component'
    const key = current.props?.key

    if (key) {
      // Found a keyed parent - add it with key and stop
      path.unshift(`${typeName}[key="${key}"]`)
      break
    } else {
      path.unshift(typeName)
    }

    // Walk up to parent VNode (if stored)
    current = (current as VNode & { __parentVNode?: VNode }).__parentVNode
  }

  return path.join(' > ')
}

/**
 * Safely sets __theme on a VNode, handling frozen/sealed objects
 * Creates a shallow copy if the object is not extensible
 * @param vnode - VNode to set theme on
 * @param theme - Theme object to set
 * @returns Original VNode if extensible, or shallow copy with theme
 */
function setThemeSafe<T extends VNode>(vnode: T, theme: Record<string, unknown>): T {
  // Check if object can be modified
  if (Object.isExtensible(vnode)) {
    vnode.__theme = theme
    return vnode
  }

  // Object is frozen/sealed - create shallow copy with theme
  if (DevConfig.warnings.frozenVNodes) {
    const componentPath = buildComponentPath(vnode)
    console.warn(
      `[PhaserJSX] Frozen VNode detected at <${componentPath}>. ` +
        `Creating shallow copy to apply theme. ` +
        `This may happen in production builds or with certain bundler optimizations.`
    )
  }

  // Create shallow copy with theme
  return { ...vnode, __theme: theme }
}

/**
 * Safely sets a property on a VNode, handling frozen/sealed objects
 * Creates a shallow copy if the object is not extensible
 * @param vnode - VNode to set property on
 * @param key - Property key to set
 * @param value - Value to set
 * @returns Original VNode if extensible, or shallow copy with property
 */
function setVNodePropSafe<T extends VNode, K extends string>(vnode: T, key: K, value: unknown): T {
  // Check if object can be modified
  if (Object.isExtensible(vnode)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(vnode as any)[key] = value
    return vnode
  }

  // Object is frozen/sealed - create shallow copy with property
  if (DevConfig.warnings.frozenVNodes) {
    const componentPath = buildComponentPath(vnode)
    console.warn(
      `[PhaserJSX] Frozen VNode detected at <${componentPath}>. ` +
        `Creating shallow copy to set property '${key}'. ` +
        `This may happen in production builds or with certain bundler optimizations.`
    )
  }

  // Create shallow copy with property
  return { ...vnode, [key]: value } as T
}

/**
 * Updates gesture hit area based on current layout size
 * Called after layout recalculation to sync hit area with actual container size
 * @param container - Container with potential gesture registration
 */
function updateGestureHitAreaAfterLayout(container: Phaser.GameObjects.Container): void {
  const containerWithLayout = container as typeof container & {
    __getLayoutSize?: () => LayoutSize
  }

  // Only update if container has gesture system enabled and layout size available
  if (!containerWithLayout.__getLayoutSize) return

  try {
    const manager = getGestureManager(container.scene)

    // Check if container is actually registered with gesture manager
    // If not, skip the update - this prevents overwriting hit areas of other containers
    if (!manager.hasContainer(container)) return

    // Use actual container dimensions after layout, not __getLayoutSize
    // __getLayoutSize may return 0x0 for containers with fill sizing before parent is laid out
    const width = container.width
    const height = container.height
    const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)
    manager.updateHitArea(container, hitArea)
  } catch {
    // Gesture manager or container not registered, ignore
  }
}

/**
 * Layout-relevant props that trigger layout recalculation when changed
 * These are the props that affect container/child sizing and positioning
 */
const LAYOUT_PROPS = [
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'flex',
  'margin',
  'padding',
  'gap',
  'direction',
  'justifyContent',
  'alignItems',
  'overflow',
  'visible', // visible="none" removes element from layout (like CSS display: none)
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
        return true
      }
    } else {
      // Shallow comparison for primitives
      if (oldVal !== newVal) {
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
 * Mounts a VNode to the scene or parent container
 * @param parentOrScene - Scene or parent container
 * @param vnode - Virtual node to mount
 * @returns Created Phaser GameObject
 */
export function mount(parentOrScene: ParentType, vnode: VNode): Phaser.GameObjects.GameObject {
  // Guard against invalid vnodes
  if (!vnode || typeof vnode !== 'object') {
    // Create a dummy invisible container to prevent crashes
    console.error(
      '❌ Invalid VNode (not an object):',
      vnode,
      '\n📍 This typically happens with raw text nodes in JSX.',
      '\n💡 Solution: Wrap in <Text> component or use {expression} syntax'
    )
    // Return a dummy container to prevent cascade failures
    const dummy = (parentOrScene as Phaser.Scene).add.container(0, 0)
    dummy.setVisible(false)
    return dummy as Phaser.GameObjects.GameObject
  }
  if (vnode.type === undefined || vnode.type === null) {
    const componentPath = buildComponentPath(vnode)
    console.error(
      '❌ VNode with undefined/null type',
      `\n📍 Component path: ${componentPath}`,
      '\n💡 Invalid value:',
      vnode,
      '\nℹ️  Check for empty JSX expressions {} or conditional renders returning undefined.',
      '\n💡 Solution: Use {condition && <Component />} or provide fallback'
    )
    // Return a dummy container to prevent cascade failures
    const dummy = (parentOrScene as Phaser.Scene).add.container(0, 0)
    dummy.setVisible(false)
    return dummy as Phaser.GameObjects.GameObject
  }

  // Fragment - mount children directly without creating a container
  if (vnode.type === Fragment) {
    // Mount all children directly to parent
    let firstNode: Phaser.GameObjects.GameObject | undefined
    const flatChildren = flattenChildren(vnode.children)
    flatChildren.forEach((c) => {
      if (!shouldSkipChild(c)) {
        // Type guard: c is VNode at this point
        let child = c as VNode
        // Track parent VNode for error messages
        child = setVNodePropSafe(child, '__parentVNode', vnode)
        // Propagate theme to children
        if (!child.__theme && vnode.__theme) {
          const themed = setThemeSafe(child, vnode.__theme)
          if (themed !== child) {
            // VNode was frozen, replace it in parent's children array
            flatChildren[flatChildren.indexOf(child)] = themed
          }
        }
        const childNode = mount(parentOrScene, child)
        if (!firstNode) firstNode = childNode
      }
    })
    // Store a marker so we know this is a fragment during unmount/patch
    vnode = setVNodePropSafe(vnode, '__node', firstNode)
    vnode = setVNodePropSafe(vnode, '__parent', parentOrScene)
    // Fragment must have at least one child to work properly
    if (!firstNode) {
      throw new Error('Fragment must have at least one child element')
    }
    return firstNode
  }

  // Function component
  if (typeof vnode.type === 'function') {
    // Debug log for theme
    if (vnode.__theme) {
      DebugLogger.log(
        'vdom',
        `Function component ${vnode.type.name} mounting with __theme:`,
        vnode.__theme
      )
    }

    // Extract scene early for potential null-return handling
    const scene =
      parentOrScene instanceof Phaser.Scene
        ? parentOrScene
        : (parentOrScene as Phaser.GameObjects.GameObject).scene

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
    vnode = setVNodePropSafe(vnode, '__ctx', ctx)
    // Pass children to the component via props
    const propsWithChildren = vnode.children?.length
      ? { ...(vnode.props ?? {}), children: vnode.children }
      : vnode.props
    let rendered = withHooks(ctx, () =>
      (vnode.type as (props: unknown) => VNode)(propsWithChildren)
    )

    // Handle null/undefined returns (e.g., from Portal component)
    if (!rendered) {
      // Component returned null - this is valid (e.g., Portal)
      ctx.vnode = rendered
      // IMPORTANT: Run effects even if component returns null (e.g., Portal needs useEffect)
      for (const run of ctx.effects) run()
      // Return a dummy container that won't be used
      const dummyContainer = scene.add.container(0, 0)
      dummyContainer.visible = false
      return dummyContainer
    }

    // Propagate theme to rendered VNode
    if (ctx.theme && !rendered.__theme) {
      const themed = setThemeSafe(rendered, ctx.theme)
      if (themed !== rendered) {
        // VNode was frozen, use the copy
        return mount(parentOrScene, themed)
      }
    }

    // Check if this is a VNode factory (renders immediately without using hooks)
    if (ctx.slots.length === 0 && ctx.effects.length === 0) {
      // This is a simple factory function, not a real component
      ctx.isFactory = true
      // Keep reference to the rendered output so unmounting works without recursion
      ctx.vnode = rendered
      // Copy __addConfig from component VNode to rendered VNode
      if (vnode.__addConfig) {
        rendered = setVNodePropSafe(rendered, '__addConfig', vnode.__addConfig)
      }
      // Mount the rendered VNode directly without creating a component context
      return mount(parentOrScene, rendered)
    }

    // Copy __addConfig from component VNode to rendered VNode
    if (vnode.__addConfig) {
      rendered = setVNodePropSafe(rendered, '__addConfig', vnode.__addConfig)
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

  // Apply theme to props and extract nested themes for children
  const nodeType = vnode.type as NodeType
  const { props: themedProps, nestedTheme } = getThemedProps(
    nodeType,
    vnode.__theme,
    vnode.props ?? {}
  )

  // Debug: Log themed props for View
  if (
    nodeType === 'View' &&
    (themedProps.backgroundColor !== undefined || themedProps.cornerRadius !== undefined)
  ) {
    DebugLogger.log('theme', 'VDOM Mount - Themed props for View:', {
      backgroundColor: themedProps.backgroundColor,
      cornerRadius: themedProps.cornerRadius,
      hasTheme: !!vnode.__theme,
      originalProps: vnode.props,
    })
  }

  const node = host.create(nodeType, themedProps as NodeProps, scene)
  vnode = setVNodePropSafe(vnode, '__node', node)
  vnode = setVNodePropSafe(vnode, '__parent', parentOrScene) // Store parent for unmounting

  // Attach ref after node creation
  const ref = vnode.props?.ref as Ref<Phaser.GameObjects.GameObject> | undefined
  attachRef(ref, node)

  host.append(parentOrScene, node)

  // Flatten children to support nested arrays
  const flatChildren = flattenChildren(vnode.children)

  // Warn about missing keys during initial mount
  if (flatChildren.length > 0) {
    warnMissingKeys(vnode, flatChildren)
  }

  flatChildren.forEach((c, index) => {
    if (!shouldSkipChild(c)) {
      // Type guard: c is VNode at this point
      let child = c as VNode

      // Additional validation: check if child is actually a VNode object
      if (!child || typeof child !== 'object' || !child.type) {
        const componentPath = buildComponentPath(vnode)
        console.warn(
          `❌ Invalid child at index ${index}`,
          `\n📍 Component path: ${componentPath}`,
          `\n💡 Invalid value:`,
          child,
          '\nℹ️  This child will be skipped. Use {expression} or <Text> for text content.'
        )
        return // Skip this child instead of throwing
      }

      // Track parent VNode for error messages
      child = setVNodePropSafe(child, '__parentVNode', vnode)

      // Skip theme propagation for primitives (strings, numbers, booleans)
      if (typeof child === 'object') {
        // Merge parent's nested theme with child's existing theme
        if (Object.keys(nestedTheme).length > 0) {
          const mergedTheme = child.__theme ? { ...nestedTheme, ...child.__theme } : nestedTheme
          const themed = setThemeSafe(child, mergedTheme)
          if (themed !== child) {
            flatChildren[flatChildren.indexOf(child)] = themed
          }
        } else if (!child.__theme && vnode.__theme) {
          // Fallback: Propagate theme to children (inherit parent's theme if child doesn't have one)
          const themed = setThemeSafe(child, vnode.__theme)
          if (themed !== child) {
            flatChildren[flatChildren.indexOf(child)] = themed
          }
        }
      }
      mount(node as ParentType, child)
    }
  })

  // Calculate layout after all children are mounted
  // Check if this is a Container (has list property)
  if (node && 'list' in node && Array.isArray((node as Phaser.GameObjects.Container).list)) {
    const container = node as Phaser.GameObjects.Container & {
      __layoutProps?: Record<string, unknown>
    }

    // Get parent size for percentage/fill resolution
    let parentSize: { width: number; height: number } | undefined
    if (parentOrScene instanceof Phaser.GameObjects.Container) {
      const parentContainer = parentOrScene as Phaser.GameObjects.Container & {
        __layoutProps?: Record<string, unknown>
        __getLayoutSize?: () => { width: number; height: number }
      }
      // Get parent's content-area (size minus padding) for percentage resolution
      if (parentContainer.__getLayoutSize) {
        const parentTotalSize = parentContainer.__getLayoutSize()
        const padding = (parentContainer.__layoutProps?.padding ?? 0) as
          | number
          | { left?: number; right?: number; top?: number; bottom?: number }
        const normPadding =
          typeof padding === 'number'
            ? { left: padding, right: padding, top: padding, bottom: padding }
            : {
                left: padding.left ?? 0,
                right: padding.right ?? 0,
                top: padding.top ?? 0,
                bottom: padding.bottom ?? 0,
              }
        parentSize = {
          width: parentTotalSize.width - normPadding.left - normPadding.right,
          height: parentTotalSize.height - normPadding.top - normPadding.bottom,
        }
      }
    }

    calculateLayout(container, container.__layoutProps ?? {}, parentSize)

    // Defer gesture hit area update to next frame after layout completes
    // This ensures __getLayoutSize() returns correct dimensions (not 0x0)
    const renderContext = getRenderContext(parentOrScene)
    renderContext.deferLayout(() => updateGestureHitAreaAfterLayout(container))
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
    const flatChildren = flattenChildren(vnode.children)
    flatChildren.forEach(unmount)
    return
  }

  if (typeof vnode.type === 'function') {
    const ctx = (vnode as VNode & { __ctx?: Ctx }).__ctx
    if (ctx) {
      disposeCtx(ctx)
      // Clear context reference to prevent memory leak
      delete (vnode as VNode & { __ctx?: Ctx }).__ctx
    }
    if (ctx?.vnode) unmount(ctx.vnode)
    return
  }

  // Detach ref before cleanup
  const ref = vnode.props?.ref as Ref<Phaser.GameObjects.GameObject> | undefined
  attachRef(ref, null)

  // Clean up children FIRST (before removing from parent)
  const flatChildren = flattenChildren(vnode.children)
  flatChildren.forEach(unmount)

  // Unregister from mount registry if this is a root node
  const node = vnode.__node as Phaser.GameObjects.GameObject & { __registryId?: number }
  if (node?.__registryId !== undefined) {
    mountRegistry.unregister(node.__registryId)
    delete node.__registryId
  }

  // Then remove from parent/scene
  const parent = vnode.__parent
  if (parent) host.remove(parent as ParentType, vnode.__node as Phaser.GameObjects.GameObject)

  // NOTE: We intentionally do NOT delete __node, __parent, __theme here
  // because these VNodes might still be referenced elsewhere (e.g., in closures)
  // The Phaser GameObject is destroyed by host.remove(), so the memory will be freed
  // The VNode references will be garbage collected when all references are gone
}

/**
 * Patches VNode tree with updates
 * @param parent - Parent container or scene
 * @param oldV - Previous VNode (can be null if previous render returned null)
 * @param newV - New VNode (can be null if new render returns null)
 */
export function patchVNode(parent: ParentType, oldV: VNode | null, newV: VNode | null) {
  // Handle null cases (e.g., Modal closing/opening)
  if (!oldV && !newV) return
  if (!oldV && newV) {
    mount(parent, newV)
    return
  }
  if (oldV && !newV) {
    unmount(oldV)
    return
  }

  // Both non-null from here on (TypeScript guard)
  if (!oldV || !newV) return

  // Check if keys differ - if so, unmount old and mount new
  if (oldV.__key !== newV.__key) {
    warnUnnecessaryRemount(oldV, newV)
    unmount(oldV)
    mount(parent, newV)

    // CRITICAL: Recalculate parent layout after key change
    // Key change means complete element replacement - parent dimensions may have changed
    if (parent && typeof parent === 'object' && 'list' in parent) {
      const parentContainer = parent as Phaser.GameObjects.Container & {
        __layoutProps?: Record<string, unknown>
        __getLayoutSize?: () => { width: number; height: number }
      }
      if (parentContainer.__layoutProps) {
        // Get grandparent size for percentage/fill resolution
        let grandparentSize: { width: number; height: number } | undefined
        const grandparent = parentContainer.parentContainer as
          | (Phaser.GameObjects.Container & {
              __layoutProps?: Record<string, unknown>
              __getLayoutSize?: () => { width: number; height: number }
            })
          | undefined

        if (grandparent && grandparent.__layoutProps && grandparent.__getLayoutSize) {
          const gpSize = grandparent.__getLayoutSize()
          const gpPadding = (grandparent.__layoutProps.padding ?? 0) as
            | number
            | { left?: number; right?: number; top?: number; bottom?: number }
          const normGpPadding =
            typeof gpPadding === 'number'
              ? { left: gpPadding, right: gpPadding, top: gpPadding, bottom: gpPadding }
              : {
                  left: gpPadding.left ?? 0,
                  right: gpPadding.right ?? 0,
                  top: gpPadding.top ?? 0,
                  bottom: gpPadding.bottom ?? 0,
                }
          grandparentSize = {
            width: gpSize.width - normGpPadding.left - normGpPadding.right,
            height: gpSize.height - normGpPadding.top - normGpPadding.bottom,
          }
        }

        calculateLayout(parentContainer, parentContainer.__layoutProps, grandparentSize)

        // Defer gesture hit area update
        const renderContext = getRenderContext(parent)
        renderContext.deferLayout(() => updateGestureHitAreaAfterLayout(parentContainer))
      }
    }

    return
  }

  // Fragment - patch children directly
  if (oldV.type === Fragment && newV.type === Fragment) {
    // Transfer theme from newV to oldV
    if (newV.__theme !== undefined) {
      const themed = setThemeSafe(oldV, newV.__theme)
      if (themed !== oldV) {
        // oldV was frozen - this shouldn't happen in normal operation
        console.error('[PhaserJSX] Cannot patch frozen Fragment VNode')
      }
    }

    const a = flattenChildren(oldV.children)
    const b = flattenChildren(newV.children)
    const len = Math.max(a.length, b.length)
    for (let i = 0; i < len; i++) {
      const c1 = a[i]
      const c2 = b[i]
      const isValidC1 = c1 != null && c1 !== false
      const isValidC2 = c2 != null && c2 !== false
      if (!isValidC1 && isValidC2) {
        // Propagate theme to new child (only for objects)
        if (typeof c2 === 'object' && newV.__theme && !c2.__theme) {
          const themed = setThemeSafe(c2, newV.__theme)
          if (themed !== c2) {
            b[i] = themed
          }
        }
        mount(parent, c2)
      } else if (isValidC1 && !isValidC2) {
        unmount(c1)
      } else if (isValidC1 && isValidC2) {
        // Propagate theme to both children (only for objects)
        if (typeof c1 === 'object' && typeof c2 === 'object' && newV.__theme) {
          let themed1 = setThemeSafe(c1, newV.__theme)
          let themed2 = setThemeSafe(c2, newV.__theme)
          if (themed1 !== c1) a[i] = themed1
          if (themed2 !== c2) b[i] = themed2
        }
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
        // Type guard: both oldV and newV are non-null and have same type
        if (!newV || !oldV) return
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
      // Update theme in context if it changed
      if (newV.__theme !== undefined) {
        ctx.theme = newV.__theme
      }
      // Transfer context to newV so future patches work
      const newVWithCtx = setVNodePropSafe(newV, '__ctx', ctx)

      // Build props for comparison (merge props + children)
      const propsWithChildren = ctx.componentVNode.children?.length
        ? { ...(ctx.componentVNode.props ?? {}), children: ctx.componentVNode.children }
        : ctx.componentVNode.props

      // Check if component should update (memoization)
      if (!shouldComponentUpdate(ctx, propsWithChildren)) {
        // Props haven't changed - skip re-render
        return
      }

      // Re-render with updated props (use newVWithCtx for type safety)
      const renderedNext = withHooks(ctx, () =>
        (newVWithCtx.type as (props: unknown) => VNode)(propsWithChildren)
      )

      // Handle null returns (e.g., from Portal component)
      if (!renderedNext) {
        ctx.vnode = renderedNext
        for (const run of ctx.effects) run()
        return
      }

      // Propagate theme to rendered VNode if not already set
      if (ctx.theme && !renderedNext.__theme) {
        const themed = setThemeSafe(renderedNext, ctx.theme)
        if (themed !== renderedNext) {
          // Update context to use themed copy
          patchVNode(parent, ctx.vnode, themed)
          ctx.vnode = themed
          for (const run of ctx.effects) run()
          return
        }
      }

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
  newV = setVNodePropSafe(newV, '__node', oldV.__node)

  // Transfer theme from newV to oldV (theme may have changed)
  // Transfer theme from newV to oldV, or inherit from oldV if newV has no theme
  // This ensures theme updates are properly applied during patching
  if (newV.__theme !== undefined) {
    const themed = setThemeSafe(oldV, newV.__theme)
    if (themed !== oldV) {
      // oldV was frozen - this shouldn't happen during patch
      console.error('[PhaserJSX] Cannot patch frozen VNode in host node')
    }
  } else if (oldV.__theme !== undefined) {
    // IMPORTANT: If newV doesn't have a theme, inherit from oldV
    // This happens when a function component re-renders and creates new VNodes
    // without explicitly propagating the theme
    const themed = setThemeSafe(newV, oldV.__theme)
    if (themed !== newV) {
      // newV was frozen - we need to use the copy
      // This is a problem because we can't replace newV in the parent
      console.error('[PhaserJSX] Cannot inherit theme to frozen VNode')
    }
  }

  // Update ref if it changed
  const oldRef = oldV.props?.ref as Ref<Phaser.GameObjects.GameObject> | undefined
  const newRef = newV.props?.ref as Ref<Phaser.GameObjects.GameObject> | undefined
  if (oldRef !== newRef) {
    attachRef(oldRef, null)
    attachRef(newRef, oldV.__node as Phaser.GameObjects.GameObject)
  }

  // Apply theme to props before patching (merge explicit props with theme)
  DebugLogger.log(
    'vdom',
    `Patching ${nodeType}: oldV.__theme:`,
    oldV.__theme,
    'newV.__theme:',
    newV.__theme
  )
  const { props: oldThemedProps } = getThemedProps(nodeType, oldV.__theme, oldV.props ?? {})
  const { props: newThemedProps, nestedTheme: newNestedTheme } = getThemedProps(
    nodeType,
    newV.__theme,
    newV.props ?? {}
  )
  DebugLogger.log(
    'vdom',
    `Patching ${nodeType}: oldThemedProps.gap:`,
    (oldThemedProps as { gap?: number }).gap
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  host.patch(nodeType, oldV.__node as any, oldThemedProps, newThemedProps)

  const a = flattenChildren(oldV.children)
  const b = flattenChildren(newV.children)
  const len = Math.max(a.length, b.length)
  let childrenChanged = false

  // Warn about missing keys in list-like children
  if (b.length > 0) {
    warnMissingKeys(newV, b)
  }

  // Check if the container's own layout props changed
  const containerLayoutChanged = hasLayoutPropsChanged(oldV, newV)

  // CRITICAL: If number of valid children changed, trigger layout recalc
  // This catches cases where children are added/removed without layout prop changes
  const oldValidChildCount = a.filter((c) => c != null && c !== false).length
  const newValidChildCount = b.filter((c) => c != null && c !== false).length
  if (oldValidChildCount !== newValidChildCount) {
    childrenChanged = true
  }

  for (let i = 0; i < len; i++) {
    const c1 = a[i],
      c2 = b[i]
    // Filter out false/null/undefined children
    const isValidC1 = c1 != null && c1 !== false
    const isValidC2 = c2 != null && c2 !== false
    if (!isValidC1 && isValidC2) {
      // Merge parent's nested theme for new child (only for objects)
      if (typeof c2 === 'object') {
        if (Object.keys(newNestedTheme).length > 0) {
          const mergedTheme = c2.__theme ? { ...newNestedTheme, ...c2.__theme } : newNestedTheme
          const themed = setThemeSafe(c2, mergedTheme)
          if (themed !== c2) {
            b[i] = themed
          }
        } else if (!c2.__theme && newV.__theme) {
          const themed = setThemeSafe(c2, newV.__theme)
          if (themed !== c2) {
            b[i] = themed
          }
        }
      }
      mount(oldV.__node as ParentType, c2)
      childrenChanged = true
    } else if (isValidC1 && !isValidC2) {
      unmount(c1)
      childrenChanged = true
    } else if (isValidC1 && isValidC2) {
      // Merge parent's nested theme with child's theme (only for objects)
      // IMPORTANT: Update both c1 (for patch comparison) and c2 (for future renders)
      if (typeof c1 === 'object' && typeof c2 === 'object') {
        if (Object.keys(newNestedTheme).length > 0) {
          const mergedTheme = c2.__theme ? { ...newNestedTheme, ...c2.__theme } : newNestedTheme
          let themed1 = setThemeSafe(c1, mergedTheme)
          let themed2 = setThemeSafe(c2, mergedTheme)
          if (themed1 !== c1) a[i] = themed1
          if (themed2 !== c2) b[i] = themed2
        } else if (newV.__theme) {
          // Fallback: Propagate theme to child (inherit parent's theme)
          // IMPORTANT: Always propagate, even if child has theme, because parent theme might have changed
          let themed1 = setThemeSafe(c1, newV.__theme)
          let themed2 = setThemeSafe(c2, newV.__theme)
          if (themed1 !== c1) a[i] = themed1
          if (themed2 !== c2) b[i] = themed2
        }
      }

      // Check if this child has layout-relevant changes
      const childLayoutChanged = hasLayoutPropsChanged(c1, c2)

      // Check if text content changed (text nodes have dynamic sizing)
      const textContentChanged =
        c1.props?.text !== c2.props?.text || !equal(c1.props?.style, c2.props?.style)

      // Recursively patch the child
      patchVNode(oldV.__node as ParentType, c1, c2)

      // Mark as changed if:
      // 1. Layout props changed, OR
      // 2. Text content changed (affects text dimensions), OR
      // 3. Child has dynamic sizing (__getLayoutSize) and might have changed
      if (childLayoutChanged) {
        childrenChanged = true
      } else if (textContentChanged) {
        // Text content changed - dimensions likely changed
        childrenChanged = true
      } else if (c1.__node && typeof c1.__node === 'object' && '__getLayoutSize' in c1.__node) {
        // Child has dynamic sizing (e.g., text), assume size might have changed
        // Note: This is a fallback - should be caught by textContentChanged
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
      // Get parent content-area (size minus padding) for percentage/fill resolution
      let parentSize: { width: number; height: number } | undefined
      if (parent instanceof Phaser.GameObjects.Container) {
        const parentContainer = parent as Phaser.GameObjects.Container & {
          __layoutProps?: Record<string, unknown>
          __getLayoutSize?: () => { width: number; height: number }
        }
        // Use parent's layout size minus padding (content-area)
        if (parentContainer.__getLayoutSize) {
          const parentTotalSize = parentContainer.__getLayoutSize()
          const padding = (parentContainer.__layoutProps?.padding ?? 0) as
            | number
            | { left?: number; right?: number; top?: number; bottom?: number }
          const normPadding =
            typeof padding === 'number'
              ? { left: padding, right: padding, top: padding, bottom: padding }
              : {
                  left: padding.left ?? 0,
                  right: padding.right ?? 0,
                  top: padding.top ?? 0,
                  bottom: padding.bottom ?? 0,
                }
          parentSize = {
            width: parentTotalSize.width - normPadding.left - normPadding.right,
            height: parentTotalSize.height - normPadding.top - normPadding.bottom,
          }
        }
      }

      calculateLayout(container, container.__layoutProps, parentSize)

      // Defer gesture hit area update to next frame after layout completes
      const renderContext = getRenderContext(parent)
      renderContext.deferLayout(() => updateGestureHitAreaAfterLayout(container))
    }
  }
}

/**
 * Mounts a component by type and props
 * Automatically wraps component in SceneWrapper unless disableAutoSize is true
 * @param parentOrScene - Phaser scene or parent container
 * @param type - Component type (function or string)
 * @param props - Component props including width and height
 * @returns Created Phaser GameObject
 */

export function mountJSX<T extends NodeType>(
  parentOrScene: ParentType,
  type: T,
  props: MountComponentProps<NodeProps<T>>
): MountHandle

export function mountJSX<P = Record<string, never>>(
  parentOrScene: ParentType,
  type: (props: P & MountProps) => VNode,
  props: MountComponentProps<P>
): MountHandle

export function mountJSX(
  parentOrScene: ParentType,
  type: NodeType | ((props: unknown) => VNode),
  props: MountProps & Record<string, unknown> = { width: 0, height: 0 }
): MountHandle {
  // Check if a mount already exists for this parent
  const existingMount = mountRegistry.findByParent(parentOrScene)

  if (existingMount) {
    // Patch existing mount with new props
    // MountProps (width, height, disableAutoSize) are ignored - only first call matters
    const { width: _w, height: _h, disableAutoSize: _d, ...componentProps } = props

    // Update stored props in registry (for future remounts)
    existingMount.props = { ...existingMount.props, ...componentProps }

    // Create new VNode with updated props for patching
    let newVNode: VNode

    if ((existingMount.props as MountProps).disableAutoSize) {
      // Without wrapper
      newVNode = {
        type: existingMount.type,
        props: {
          ...componentProps,
          width: existingMount.props.width,
          height: existingMount.props.height,
        },
        children: [],
      }
    } else {
      // With SceneWrapper
      const componentVNode: VNode = {
        type: existingMount.type,
        props: componentProps,
        children: [],
      }

      newVNode = {
        type: SceneWrapper,
        props: {
          width: existingMount.props.width,
          height: existingMount.props.height,
          children: componentVNode,
        },
        children: [],
      }
    }

    // Patch existing VNode
    patchVNode(parentOrScene, existingMount.vnode, newVNode)

    // Update stored VNode
    existingMount.vnode = newVNode

    const handle = existingMount.rootNode as MountHandle
    handle.unmount = () => unmountJSX(handle)

    DebugLogger.log('vdom', `Patched existing mount ${existingMount.id} on same parent`)
    return handle
  }

  // Extract MountProps and component props
  const { width, height, disableAutoSize = false, ...componentProps } = props

  // Extract scene and set viewport dimensions
  const scene =
    parentOrScene instanceof Phaser.Scene
      ? parentOrScene
      : (parentOrScene as Phaser.GameObjects.GameObject).scene

  if (scene) {
    const renderContext = getRenderContext(parentOrScene)
    renderContext.setViewport(width, height, scene)

    // Also set viewport for portal system (for Modal centering, etc.)
    portalRegistry.setViewportSize(scene, width, height)
  }

  // Create VNode with or without SceneWrapper
  let vnode: VNode

  if (disableAutoSize) {
    // Without wrapper: mount component directly (legacy behavior)
    vnode = { type, props: { ...componentProps, width, height }, children: [] }
  } else {
    // With wrapper (DEFAULT): use SceneWrapper for percentage-based sizing
    const componentVNode: VNode = {
      type,
      props: componentProps,
      children: [],
    }

    vnode = {
      type: SceneWrapper,
      props: {
        width,
        height,
        children: componentVNode,
      },
      children: [],
    }
  }

  // Store root VNode on the scene for debug access (non-intrusive)
  if (scene) {
    ;(scene as unknown as { __rootVNode?: VNode }).__rootVNode = vnode
  }

  // Mark root container with unique mount ID for gesture isolation
  // This ensures different mountJSX calls create separate gesture trees
  const rootNode = mount(parentOrScene, vnode)
  if (rootNode instanceof Phaser.GameObjects.Container) {
    ;(rootNode as unknown as { __mountRootId?: number }).__mountRootId = generateMountRootId()
  }

  // Store root VNode on the mounted node to allow typed unmounting later
  ;(rootNode as unknown as { __rootVNode?: VNode }).__rootVNode = vnode

  // Register this mount in the registry for theme-triggered remounts
  const registryId = mountRegistry.register(parentOrScene, type, props, rootNode, vnode)

  // Store registry ID on root node for cleanup
  ;(rootNode as unknown as { __registryId?: number }).__registryId = registryId

  const handle = rootNode as MountHandle
  handle.unmount = () => unmountJSX(handle)

  return handle
}

/**
 * Convenience helper to unmount a tree created via mountJSX without manual casting
 * Accepts either the root GameObject returned from mountJSX or the owning scene
 * @param target - Root GameObject or Phaser scene that holds the mounted JSX tree
 */
export function unmountJSX(target: Phaser.Scene | Phaser.GameObjects.GameObject): void {
  const scene = target instanceof Phaser.Scene ? target : target.scene
  const targetWithVNode = target as unknown as { __rootVNode?: VNode; __registryId?: number }
  const sceneWithVNode = scene as unknown as { __rootVNode?: VNode }

  // Prefer VNode stored directly on the root node (supports multiple mounts per scene)
  const rootVNode = targetWithVNode.__rootVNode ?? sceneWithVNode?.__rootVNode

  if (rootVNode) {
    unmount(rootVNode)

    // Clear stored references to avoid reusing a stale VNode after unmount
    if (targetWithVNode.__rootVNode === rootVNode) {
      delete targetWithVNode.__rootVNode
    }
    if (sceneWithVNode?.__rootVNode === rootVNode) {
      delete sceneWithVNode.__rootVNode
    }
    return
  }

  // Fallback: use registry entry if available (in case __rootVNode was cleared)
  if (targetWithVNode.__registryId !== undefined) {
    const entry = mountRegistry.getEntry(targetWithVNode.__registryId)
    if (entry?.vnode) {
      unmount(entry.vnode)
      return
    }
  }

  DebugLogger.log('vdom', 'unmountJSX called but no root VNode found on target')
}
