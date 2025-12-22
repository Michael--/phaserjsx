/**
 * PhaserJSX Plugin for automatic JSX mounting
 * Enables declarative initialization via Phaser game config
 */
import Phaser from 'phaser'
import type { VNodeLike } from './types'
import { mountJSX, type MountHandle, type MountProps } from './vdom'

/**
 * Plugin configuration
 */
export interface PhaserJSXPluginConfig<P = Record<string, unknown>> {
  /** Component to mount */
  component?: ((props: P & MountProps) => VNodeLike) | string
  /** Props for component (width and height are auto-injected from game size) */
  props?: P
  /** Container configuration */
  container?: {
    x?: number
    y?: number
    depth?: number
  }
  /** Auto-mount on scene create (default: true) */
  autoMount?: boolean
  /** Auto-resize on scale events (default: true) */
  autoResize?: boolean
}

/**
 * Extracts custom props from component function (excluding MountProps)
 */
type InferCustomProps<C> = C extends (props: infer P) => VNodeLike
  ? Omit<P, keyof MountProps>
  : never

/**
 * Type-safe plugin entry for PhaserJSX Plugin
 * Use this in game config for proper TypeScript support
 *
 * @example
 * ```typescript
 * const config: Phaser.Types.Core.GameConfig = {
 *   plugins: {
 *     global: [
 *       createPhaserJSXPlugin({
 *         component: App,
 *         props: { title: 'My App' },
 *         autoResize: true
 *       })
 *     ]
 *   }
 * }
 * ```
 */
export interface PhaserJSXPluginEntry<P = Record<string, unknown>> {
  key: string
  plugin: typeof PhaserJSXPlugin
  start: boolean
  data: PhaserJSXPluginConfig<P>
}

/**
 * Creates a type-safe PhaserJSX plugin entry for game config
 * Provides full IDE autocomplete and type checking for plugin configuration
 * Automatically infers component props for full type safety
 *
 * @param config - Plugin configuration with component and props
 * @returns Type-safe plugin entry for Phaser game config
 *
 * @example
 * ```typescript
 * // Full type safety - TypeScript infers AppProps from component
 * createPhaserJSXPlugin({
 *   component: App,
 *   props: { title: 'My App' },  // Only valid AppProps allowed!
 *   autoResize: true
 * })
 * ```
 */
export function createPhaserJSXPlugin<C extends (props: any) => VNodeLike>(config: {
  component: C
  props?: InferCustomProps<C>
  autoMount?: boolean
  autoResize?: boolean
  container?: { x?: number; y?: number; depth?: number }
}): PhaserJSXPluginEntry<InferCustomProps<C>>

/**
 * Creates a PhaserJSX plugin entry (string component variant)
 */
export function createPhaserJSXPlugin<P = Record<string, unknown>>(
  config: PhaserJSXPluginConfig<P>
): PhaserJSXPluginEntry<P>

/**
 * Implementation
 */
export function createPhaserJSXPlugin<P = Record<string, unknown>>(
  config: PhaserJSXPluginConfig<P>
): PhaserJSXPluginEntry<P> {
  return {
    key: 'PhaserJSX',
    plugin: PhaserJSXPlugin,
    start: true,
    data: config,
  }
}

/**
 * PhaserJSX Plugin
 * Provides automatic JSX mounting through Phaser plugin system
 *
 * @example
 * ```typescript
 * // In game config
 * plugins: {
 *   global: [{
 *     key: 'PhaserJSX',
 *     plugin: PhaserJSXPlugin,
 *     start: true,
 *     data: {
 *       component: App,
 *       props: { width: '100%', height: '100%' }
 *     }
 *   }]
 * }
 * ```
 */
export class PhaserJSXPlugin extends Phaser.Plugins.BasePlugin {
  private config: PhaserJSXPluginConfig | undefined
  private mountHandle: MountHandle | undefined
  private container: Phaser.GameObjects.Container | undefined
  private targetScene: Phaser.Scene | undefined

  /**
   * Constructor - receives plugin manager and optional mapping
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager)
  }

  /**
   * Init lifecycle - called first with config data
   */
  override init(data?: PhaserJSXPluginConfig): void {
    if (data) {
      this.config = { ...data }
    }
  }

  /**
   * Start lifecycle - called when plugin should start
   */
  override start(): void {
    // Listen for scene being added to the scene manager
    this.game.events.on('ready', this.onGameReady, this)
  }

  /**
   * Game ready handler - scene system is now initialized
   */
  private onGameReady(): void {
    // Get first scene
    const scenes = this.game.scene.scenes

    if (scenes.length > 0) {
      const targetScene = scenes[0]
      if (!targetScene) return

      this.targetScene = targetScene

      // Listen to scene events
      targetScene.events.once('create', this.onSceneCreate, this)

      // If scene is already created, mount immediately
      if (targetScene.scene.isActive()) {
        this.onSceneCreate()
      }
    } else {
      console.warn('[PhaserJSX Plugin] No scenes found to mount JSX')
    }
  }

  /**
   * Scene create handler - auto-mount JSX
   */
  private onSceneCreate(): void {
    // Auto-mount if enabled and component is configured
    const shouldAutoMount = this.config?.autoMount !== false
    if (shouldAutoMount && this.config?.component) {
      this.mount()
      // Setup resize handler if auto-resize is enabled (default: true)
      if (this.config?.autoResize !== false) {
        this.setupResizeHandler()
      }
    } else {
      console.warn('[PhaserJSX Plugin] Auto-mount disabled or no component configured')
    }
  }

  /**
   * Setup resize event handler
   */
  private setupResizeHandler(): void {
    if (!this.targetScene) return

    // Listen to scale resize events
    this.targetScene.scale.on('resize', this.onResize, this)
  }

  /**
   * Handle scene resize - update component props
   */
  private onResize(gameSize: Phaser.Structs.Size): void {
    if (!this.mountHandle || !this.config?.component || !this.container) return

    // Get current props
    const props = this.config.props || {}
    const width = (props as { width?: unknown }).width ?? gameSize.width
    const height = (props as { height?: unknown }).height ?? gameSize.height

    // Call mountJSX again with same container and component
    // This will trigger a patch since mount already exists for this container
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.mountHandle = mountJSX(this.container, this.config.component as any, {
      ...props,
      width,
      height,
    })
  }

  /**
   * Configure plugin
   * Can be called from scene to set up component dynamically
   */
  configure(
    component: ((props: unknown) => VNodeLike) | string,
    props?: MountProps & Record<string, unknown>
  ): void {
    const newConfig: PhaserJSXPluginConfig = {
      component,
    }
    if (props !== undefined) {
      newConfig.props = props
    }
    this.config = {
      ...this.config,
      ...newConfig,
    }
  }

  /**
   * Mount JSX component
   */
  mount(): void {
    if (!this.targetScene) {
      console.warn('[PhaserJSX Plugin] No scene available for mounting')
      return
    }

    if (!this.config?.component) {
      console.warn('[PhaserJSX Plugin] No component configured for mounting')
      return
    }

    // Create container if not exists
    if (!this.container) {
      const containerConfig = this.config.container || {}
      this.container = this.targetScene.add.container(
        containerConfig.x ?? 0,
        containerConfig.y ?? 0
      )
      this.container.setDepth(containerConfig.depth ?? 100)
    }

    // Get dimensions from config or use scene dimensions
    const props = this.config.props || {}
    const width = (props as { width?: unknown }).width ?? this.targetScene.scale.width
    const height = (props as { height?: unknown }).height ?? this.targetScene.scale.height

    // Mount JSX
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.mountHandle = mountJSX(this.container, this.config.component as any, {
      ...props,
      width,
      height,
    })
  }

  /**
   * Unmount JSX component
   */
  unmount(): void {
    if (this.mountHandle) {
      this.mountHandle.unmount()
      this.mountHandle = undefined
    }
  }

  /**
   * Destroy lifecycle - cleanup
   */
  override destroy(): void {
    // Unmount JSX
    this.unmount()

    // Remove container
    if (this.container) {
      this.container.destroy()
      this.container = undefined
    }

    // Remove listeners
    this.game.events.off('ready', this.onGameReady, this)
    if (this.targetScene) {
      this.targetScene.events.off('create', this.onSceneCreate, this)
      this.targetScene.scale.off('resize', this.onResize, this)
    }

    // Clear references
    this.targetScene = undefined
    this.config = undefined

    super.destroy()
  }
}
