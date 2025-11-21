/**
 * Debug snapshot utilities for inspecting VDOM, theme registry, and system state
 * All functions are read-only and do not mutate the VDOM or registries
 */

import type { VNode } from '@phaserjsx/ui'
import { DevConfig, nodeRegistry, themeRegistry, viewportRegistry } from '@phaserjsx/ui'

/**
 * Simplified VNode structure for debugging
 */
export interface VNodeSnapshot {
  type: string
  key?: string | number
  props?: Record<string, unknown>
  children?: VNodeSnapshot[]
  hasNode: boolean
  nodeType?: string
  hasTheme: boolean
  hasContext: boolean
}

/**
 * Theme registry snapshot
 */
export interface ThemeSnapshot {
  colorMode: string
  currentPreset: string | undefined
  hasColorTokens: boolean
  customComponents: string[]
  listenerCount: number
}

/**
 * Complete debug snapshot
 */
export interface DebugSnapshot {
  timestamp: string
  vdom: VNodeSnapshot[]
  theme: ThemeSnapshot
  devConfig: typeof DevConfig
  registries: {
    viewport: {
      hasInstance: boolean
    }
    nodeRegistry: {
      registeredTypes: string[]
    }
  }
}

/**
 * Recursively converts VNode tree to simplified snapshot structure
 * Does not mutate the original VNode tree
 * @param vnode - VNode to snapshot
 * @returns Simplified snapshot
 */
function snapshotVNode(vnode: VNode): VNodeSnapshot {
  const vnodeType = vnode.type
  const typeName =
    typeof vnodeType === 'string'
      ? vnodeType
      : typeof vnodeType === 'function'
        ? (vnodeType as { name?: string }).name || 'Component'
        : 'Unknown'

  const snapshot: VNodeSnapshot = {
    type: typeName,
    hasNode: !!vnode.__node,
    hasTheme: !!vnode.__theme,
    hasContext: !!vnode.__ctx,
  }

  if (vnode.__key !== undefined && vnode.__key !== null) {
    snapshot.key = vnode.__key
  }

  if (vnode.__node) {
    const node = vnode.__node as unknown
    if (node && typeof node === 'object' && 'type' in node) {
      snapshot.nodeType = (node as { type: string }).type
    }
  }

  // Shallow copy of props (avoid deep cloning Phaser objects)
  if (vnode.props && Object.keys(vnode.props).length > 0) {
    snapshot.props = {}
    for (const [key, value] of Object.entries(vnode.props)) {
      // Skip complex objects like refs, functions
      if (
        key === 'ref' ||
        key === 'children' ||
        typeof value === 'function' ||
        (typeof value === 'object' && value !== null && 'scene' in value)
      ) {
        snapshot.props[key] = `[${typeof value}]`
      } else {
        snapshot.props[key] = value
      }
    }
  }

  // For function components, use the rendered VNode from context
  // This captures the actual rendered content, not just the component wrapper
  let childrenToSnapshot = vnode.children

  if (vnode.__ctx?.vnode && (!vnode.children || vnode.children.length === 0)) {
    // Function component with context - use the rendered VNode
    const renderedVNode = vnode.__ctx.vnode
    // Snapshot the rendered VNode's children directly as our children
    childrenToSnapshot = [renderedVNode]
  }

  // Recursively snapshot children
  if (childrenToSnapshot && childrenToSnapshot.length > 0) {
    snapshot.children = childrenToSnapshot
      .filter((child) => child != null && child !== false)
      .map((child) => snapshotVNode(child as VNode))
  }

  return snapshot
}

/**
 * Filters VNode snapshots by key patterns (supports wildcards)
 * @param snapshots - Array of VNode snapshots
 * @param patterns - Array of key patterns (supports * wildcard, empty array or ['*'] = show all)
 * @returns Filtered snapshots
 */
function filterByKeyPatterns(snapshots: VNodeSnapshot[], patterns: string[]): VNodeSnapshot[] {
  // No patterns or wildcard '*' = show everything
  if (patterns.length === 0 || patterns.includes('*')) return snapshots

  const matchesPattern = (key: string | number | undefined, pattern: string): boolean => {
    if (key === undefined) return false
    const keyStr = String(key)

    // Convert wildcard pattern to regex
    const regexPattern = pattern.replace(/\*/g, '.*')
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(keyStr)
  }

  const filterRecursive = (snapshot: VNodeSnapshot): VNodeSnapshot | null => {
    // Check if this node matches any pattern
    const matches = patterns.some((pattern) => matchesPattern(snapshot.key, pattern))

    // Filter children recursively
    const filteredChildren = snapshot.children
      ?.map((child) => filterRecursive(child))
      .filter((child) => child !== null) as VNodeSnapshot[] | undefined

    // Include node if it matches OR if any children match
    if (matches || (filteredChildren && filteredChildren.length > 0)) {
      const result: VNodeSnapshot = {
        ...snapshot,
      }
      if (filteredChildren) {
        result.children = filteredChildren
      }
      return result
    }

    return null
  }

  return snapshots.map((s) => filterRecursive(s)).filter((s) => s !== null) as VNodeSnapshot[]
}

/**
 * Captures theme registry state without mutation
 * @returns Theme snapshot
 */
function snapshotTheme(): ThemeSnapshot {
  const presetName = themeRegistry.getCurrentPresetName()

  return {
    colorMode: themeRegistry.getColorMode(),
    currentPreset: presetName,
    hasColorTokens: !!themeRegistry.getColorTokens(),
    customComponents: Array.from(themeRegistry.getCustomComponentNames()),
    listenerCount: (themeRegistry as unknown as { listeners: Set<unknown> }).listeners.size,
  }
}

/**
 * Captures full debug snapshot
 * @param rootVNodes - Root VNodes to snapshot (typically from render root)
 * @param keyPatterns - Optional key patterns to filter by
 * @returns Complete debug snapshot
 */
export function captureSnapshot(rootVNodes: VNode[], keyPatterns?: string[]): DebugSnapshot {
  // Snapshot VDOM tree
  let vdomSnapshots = rootVNodes.map((vnode) => snapshotVNode(vnode))

  // Apply key filtering if patterns provided
  if (keyPatterns && keyPatterns.length > 0) {
    vdomSnapshots = filterByKeyPatterns(vdomSnapshots, keyPatterns)
  }

  return {
    timestamp: new Date().toISOString(),
    vdom: vdomSnapshots,
    theme: snapshotTheme(),
    devConfig: { ...DevConfig },
    registries: {
      viewport: {
        hasInstance: !!(viewportRegistry as unknown as { viewport?: unknown }).viewport,
      },
      nodeRegistry: {
        registeredTypes: Object.keys(nodeRegistry),
      },
    },
  }
}

/**
 * Counts total nodes in snapshot tree recursively
 */
function countNodes(snapshots: VNodeSnapshot[]): number {
  let count = 0
  const countRecursive = (snapshot: VNodeSnapshot): void => {
    count++
    if (snapshot.children) {
      snapshot.children.forEach(countRecursive)
    }
  }
  snapshots.forEach(countRecursive)
  return count
}

/**
 * Counts nodes with keys in snapshot tree
 */
function countNodesWithKeys(snapshots: VNodeSnapshot[]): number {
  let count = 0
  const countRecursive = (snapshot: VNodeSnapshot): void => {
    if (snapshot.key !== undefined) count++
    if (snapshot.children) {
      snapshot.children.forEach(countRecursive)
    }
  }
  snapshots.forEach(countRecursive)
  return count
}

/**
 * Analyzes node types in snapshot tree
 */
interface NodeTypeStats {
  type: string
  count: number
  withKeys: number
  withNodes: number
}

function analyzeNodeTypes(snapshots: VNodeSnapshot[]): Map<string, NodeTypeStats> {
  const stats = new Map<string, NodeTypeStats>()

  const analyze = (snapshot: VNodeSnapshot): void => {
    const existing = stats.get(snapshot.type)
    if (existing) {
      existing.count++
      if (snapshot.key !== undefined) existing.withKeys++
      if (snapshot.hasNode) existing.withNodes++
    } else {
      stats.set(snapshot.type, {
        type: snapshot.type,
        count: 1,
        withKeys: snapshot.key !== undefined ? 1 : 0,
        withNodes: snapshot.hasNode ? 1 : 0,
      })
    }

    if (snapshot.children) {
      snapshot.children.forEach(analyze)
    }
  }

  snapshots.forEach(analyze)
  return stats
}

/**
 * Analyzes tree depth
 */
function analyzeDepth(snapshots: VNodeSnapshot[]): { maxDepth: number; avgDepth: number } {
  const depths: number[] = []

  const traverse = (snapshot: VNodeSnapshot, depth: number): void => {
    depths.push(depth)
    if (snapshot.children) {
      snapshot.children.forEach((child) => traverse(child, depth + 1))
    }
  }

  snapshots.forEach((s) => traverse(s, 0))

  return {
    maxDepth: depths.length > 0 ? Math.max(...depths) : 0,
    avgDepth:
      depths.length > 0
        ? Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 10) / 10
        : 0,
  }
}

/**
 * Outputs snapshot to console with structured formatting
 * @param snapshot - Debug snapshot to output
 */
export function outputToConsole(snapshot: DebugSnapshot): void {
  const totalNodes = countNodes(snapshot.vdom)
  const nodesWithKeys = countNodesWithKeys(snapshot.vdom)
  const nodeTypeStats = analyzeNodeTypes(snapshot.vdom)
  const depthStats = analyzeDepth(snapshot.vdom)

  console.group('🔍 PhaserJSX Debug Snapshot')
  console.log('Timestamp:', snapshot.timestamp)

  console.group(
    `📦 VDOM Tree (${totalNodes} nodes, ${nodesWithKeys} with keys, max depth: ${depthStats.maxDepth})`
  )

  // Node type statistics
  const sortedStats = Array.from(nodeTypeStats.values()).sort((a, b) => b.count - a.count)
  console.group(`📊 Node Types (${nodeTypeStats.size} unique types)`)
  console.table(sortedStats)
  console.groupEnd()

  // Full tree
  console.group('🌳 Full Tree Structure')
  console.log(snapshot.vdom)
  console.groupEnd()

  console.groupEnd()

  console.group('🎨 Theme Registry')
  console.table(snapshot.theme)
  console.groupEnd()

  console.group('⚙️ Dev Config')
  console.log('Debug flags:', snapshot.devConfig.debug)
  console.log('Visual flags:', snapshot.devConfig.visual)
  console.groupEnd()

  console.group('📚 Registries')
  console.log('Viewport:', snapshot.registries.viewport)
  console.log('Node types:', snapshot.registries.nodeRegistry.registeredTypes)
  console.groupEnd()

  console.groupEnd()
}
