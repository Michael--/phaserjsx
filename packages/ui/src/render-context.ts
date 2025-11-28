/**
 * Render context - isolates global state per mount point
 * Stored in scene.data to ensure proper isolation between multiple mounts
 */
import Phaser from 'phaser'
import { DebugLogger } from './dev-config'
import type { Ctx } from './hooks'
import type { ParentType } from './types'

/**
 * Layout batch entry for deferred recalculation
 */
interface LayoutBatchEntry {
  container: Phaser.GameObjects.Container
  containerProps: unknown
  parentSize: { width: number; height: number } | undefined
  parentPadding: { horizontal: number; vertical: number } | undefined
}

/**
 * Render context - encapsulates all previously global state
 * Each mount point gets its own isolated context
 */
export class RenderContext {
  // Hook context stack (replaces global CURRENT)
  private currentCtx: Ctx | null = null

  // Texture management per mount
  private textureScene: Phaser.Scene | null = null
  private textures = new Map<
    string,
    { refCount: number; promise: Promise<void> | null; loaded: boolean }
  >()

  // Viewport dimensions per mount
  private viewport: { width: number; height: number } = { width: 800, height: 600 }
  private viewportParent: ParentType | undefined

  // Deferred layout callbacks per mount
  private deferredCallbacks: (() => void)[] = []
  private deferredScheduled = false

  // Layout batch queue per mount
  private layoutBatchMap = new Map<Phaser.GameObjects.Container, LayoutBatchEntry>()
  private batchScheduled = false

  // Track if context is shutting down
  private isShuttingDown = false

  constructor(public scene: Phaser.Scene) {
    this.textureScene = scene
  }

  /**
   * Check if context is shutting down
   */
  isShutdown(): boolean {
    return this.isShuttingDown
  }

  /**
   * Mark context as shutting down
   */
  shutdown(): void {
    this.isShuttingDown = true
    this.deferredCallbacks = []
    this.layoutBatchMap.clear()
  }

  /**
   * Get current hook context
   */
  getCurrent(): Ctx | null {
    return this.currentCtx
  }

  /**
   * Set current hook context
   */
  setCurrent(ctx: Ctx | null): void {
    this.currentCtx = ctx
  }

  /**
   * Get texture scene
   */
  getTextureScene(): Phaser.Scene | null {
    return this.textureScene
  }

  /**
   * Get textures map
   */
  getTextures(): Map<string, { refCount: number; promise: Promise<void> | null; loaded: boolean }> {
    return this.textures
  }

  /**
   * Set viewport dimensions
   */
  setViewport(width: number, height: number, parent?: ParentType): void {
    this.viewport = { width, height }
    this.viewportParent = parent
  }

  /**
   * Get viewport dimensions
   */
  getViewport(): { width: number; height: number } {
    return this.viewport
  }

  /**
   * Get viewport parent
   */
  getViewportParent(): ParentType | undefined {
    return this.viewportParent
  }

  /**
   * Defer a layout callback to next frame
   */
  deferLayout(callback: () => void): void {
    if (this.isShuttingDown) return
    this.deferredCallbacks.push(callback)
    if (!this.deferredScheduled) {
      this.deferredScheduled = true
      requestAnimationFrame(() => this.flushDeferred())
    }
  }

  /**
   * Flush all deferred layout callbacks
   */
  private flushDeferred(): void {
    if (this.isShuttingDown) return
    this.deferredScheduled = false
    const callbacks = [...this.deferredCallbacks]
    this.deferredCallbacks = []
    for (const callback of callbacks) {
      try {
        callback()
      } catch (error) {
        DebugLogger.error('RenderContext', 'Error in deferred callback:', error)
      }
    }
  }

  /**
   * Get layout batch map
   */
  getLayoutBatch(): Map<Phaser.GameObjects.Container, LayoutBatchEntry> {
    return this.layoutBatchMap
  }

  /**
   * Clear layout batch
   */
  clearLayoutBatch(): void {
    this.layoutBatchMap.clear()
  }

  /**
   * Check if batch is scheduled
   */
  isBatchScheduled(): boolean {
    return this.batchScheduled
  }

  /**
   * Set batch scheduled flag
   */
  setBatchScheduled(scheduled: boolean): void {
    this.batchScheduled = scheduled
  }
}

/**
 * Get or create RenderContext for a scene or container
 * Uses scene.data to store contexts, ensuring proper isolation
 * @param parentOrScene - Scene or Container to get context for
 * @returns RenderContext instance
 */
export function getRenderContext(
  parentOrScene: Phaser.Scene | Phaser.GameObjects.Container
): RenderContext {
  const scene = parentOrScene instanceof Phaser.Scene ? parentOrScene : parentOrScene.scene

  if (!scene || !scene.data || !scene.sys || !scene.sys.settings.active) {
    throw new Error('getRenderContext: Invalid scene or scene.data is undefined')
  }

  // Use unique key per container to support multiple mounts in same scene
  // For scene-level mounts, use a default key
  const containerKey =
    parentOrScene instanceof Phaser.GameObjects.Container
      ? `__renderContext_${parentOrScene.name || (parentOrScene as unknown as { id?: number }).id || 'container'}__`
      : '__renderContext_scene__'

  let context = scene.data.get(containerKey) as RenderContext | undefined

  if (!context) {
    context = new RenderContext(scene)
    scene.data.set(containerKey, context)

    // Cleanup on scene shutdown
    scene.events.once('shutdown', () => {
      if (context) {
        context.shutdown()
      }
      scene.data.remove(containerKey)
    })
  }

  return context
}

/**
 * Get RenderContext from a parent (used internally by hooks)
 * @param parent - Parent scene or container
 * @returns RenderContext instance
 */
export function getContextFromParent(parent: ParentType): RenderContext {
  if (!parent) {
    throw new Error('getContextFromParent: Parent is null or undefined')
  }
  return getRenderContext(parent as Phaser.Scene | Phaser.GameObjects.Container)
}
