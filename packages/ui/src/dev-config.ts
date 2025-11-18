/**
 * Development and debugging configuration
 * Runtime-configurable settings for debugging and development
 */

/**
 * Development configuration object
 * Can be modified at runtime from user code for debugging
 *
 * @example
 * ```typescript
 * import { DevConfig } from '@phaserjsx/ui'
 *
 * // Enable specific debug categories
 * DevConfig.debug.enabled = true
 * DevConfig.debug.layout = true
 *
 * // Customize visual debugging
 * DevConfig.visual.maskFillColor = 0xff00ff  // Pink
 * DevConfig.visual.maskAlpha = 0.3           // Semi-transparent
 * ```
 */
export const DevConfig = {
  /**
   * Debug logging configuration
   * Controls console output for different subsystems
   */
  debug: {
    /**
     * Master switch - disables all debug output when false
     * @default false
     */
    enabled: false,

    /**
     * Detailed layout calculation logs
     * Shows container sizing, positioning, and flex distribution
     * @default false
     */
    layout: false,

    /**
     * Overflow mask positioning logs
     * Shows world coordinate calculations and mask updates
     * @default false
     */
    overflowMask: false,

    /**
     * Flex distribution calculations
     * Shows flex space allocation across children
     * @default false
     */
    flex: false,

    /**
     * Child sizing and positioning
     * Shows individual child dimension calculations
     * @default false
     */
    positioning: false,

    /**
     * VDOM mount/patch/unmount operations
     * Shows virtual DOM updates and reconciliation
     * @default false
     */
    vdom: false,

    /**
     * Performance timing measurements
     * Shows execution time for layout operations
     * @default false
     */
    performance: false,
  },

  /**
   * Visual debugging aids
   * Runtime-configurable visual settings
   */
  visual: {
    /**
     * Show overflow mask areas
     * When true, masks are visible (alpha > 0) for debugging
     * @default false
     */
    showOverflowMasks: false,

    /**
     * Mask fill color
     * @default 0xffffff (white, invisible with alpha=0)
     * @example 0xff00ff (pink for debugging)
     */
    maskFillColor: 0xffffff,

    /**
     * Mask alpha transparency
     * @default 0.0 (invisible)
     * @example 0.3 (semi-transparent for debugging)
     */
    maskAlpha: 0.0,
  },

  /**
   * Performance tuning
   */
  performance: {
    /**
     * Enable deferred layout queue batching
     * When false, deferred updates execute immediately (not batched)
     * @default true
     */
    useDeferredQueue: true,

    /**
     * Log deferred queue statistics
     * Shows number of batched callbacks per frame
     * @default false
     */
    logQueueStats: false,
  },
}

/**
 * Debug logger with category support
 * Only logs when global debug is enabled AND category is enabled
 *
 * @example
 * ```typescript
 * DebugLogger.log('layout', 'Container size:', { width: 100, height: 200 })
 * // Only logs if DevConfig.debug.enabled && DevConfig.debug.layout
 * ```
 */
export class DebugLogger {
  /**
   * Log a message with category filtering
   * @param category - Debug category to check
   * @param message - Message to log
   * @param args - Additional arguments to log
   */
  static log(category: keyof typeof DevConfig.debug, message: string, ...args: unknown[]): void {
    if (!DevConfig.debug.enabled) return
    if (category !== 'enabled' && !DevConfig.debug[category]) return

    // console.log(`[${category}] ${message}`, ...args)
    console.log(`[${category}] ${message}`)
  }

  /**
   * Log a warning message (always shown, even if debug disabled)
   * @param category - Category for context
   * @param message - Warning message
   * @param args - Additional arguments
   */
  static warn(category: string, message: string, ...args: unknown[]): void {
    console.warn(`[${category}] ${message}`, ...args)
  }

  /**
   * Log an error message (always shown, even if debug disabled)
   * @param category - Category for context
   * @param message - Error message
   * @param args - Additional arguments
   */
  static error(category: string, message: string, ...args: unknown[]): void {
    console.error(`[${category}] ${message}`, ...args)
  }

  /**
   * Start a collapsed console group
   * @param category - Debug category to check
   * @param label - Group label
   */
  static group(category: keyof typeof DevConfig.debug, label: string): void {
    if (!DevConfig.debug.enabled) return
    if (category !== 'enabled' && !DevConfig.debug[category]) return

    console.group(`[${category}] ${label}`)
  }

  /**
   * End a console group
   * @param category - Debug category to check
   */
  static groupEnd(category: keyof typeof DevConfig.debug): void {
    if (!DevConfig.debug.enabled) return
    if (category !== 'enabled' && !DevConfig.debug[category]) return

    console.groupEnd()
  }

  /**
   * Start a performance timer
   * @param category - Debug category to check
   * @param label - Timer label
   */
  static time(category: keyof typeof DevConfig.debug, label: string): void {
    if (!DevConfig.debug.enabled) return
    if (category !== 'enabled' && !DevConfig.debug[category]) return

    console.time(`[${category}] ${label}`)
  }

  /**
   * End a performance timer
   * @param category - Debug category to check
   * @param label - Timer label
   */
  static timeEnd(category: keyof typeof DevConfig.debug, label: string): void {
    if (!DevConfig.debug.enabled) return
    if (category !== 'enabled' && !DevConfig.debug[category]) return

    console.timeEnd(`[${category}] ${label}`)
  }
}

/**
 * Predefined configuration presets for common debugging scenarios
 *
 * @example
 * ```typescript
 * import { DevPresets } from '@phaserjsx/ui'
 *
 * // Quick activation of overflow debugging
 * DevPresets.debugOverflow()
 *
 * // Revert to production settings
 * DevPresets.production()
 * ```
 */
export const DevPresets = {
  /**
   * Production configuration
   * All debugging disabled, optimal performance
   */
  production: (): void => {
    DevConfig.debug.enabled = false
    DevConfig.visual.showOverflowMasks = false
    DevConfig.visual.maskAlpha = 0.0
    DevConfig.visual.maskFillColor = 0xffffff
    DevConfig.performance.logQueueStats = false
  },

  /**
   * Debug layout issues
   * Enables layout, positioning, and flex logs
   */
  debugLayout: (): void => {
    DevConfig.debug.enabled = true
    DevConfig.debug.layout = true
    DevConfig.debug.positioning = true
    DevConfig.debug.flex = true
    // Keep other categories off
    DevConfig.debug.overflowMask = false
    DevConfig.debug.vdom = false
    DevConfig.debug.performance = false
  },

  /**
   * Debug overflow masking
   * Enables overflow logs and makes masks visible
   */
  debugOverflow: (): void => {
    DevConfig.debug.enabled = true
    DevConfig.debug.overflowMask = true
    DevConfig.visual.showOverflowMasks = true
    DevConfig.visual.maskFillColor = 0xff00ff // Pink
    DevConfig.visual.maskAlpha = 0.3 // Semi-transparent
    // Keep other categories off
    DevConfig.debug.layout = false
    DevConfig.debug.positioning = false
    DevConfig.debug.flex = false
    DevConfig.debug.vdom = false
    DevConfig.debug.performance = false
  },

  /**
   * Performance profiling
   * Enables performance timing and queue statistics
   */
  profilePerformance: (): void => {
    DevConfig.debug.enabled = true
    DevConfig.debug.performance = true
    DevConfig.performance.logQueueStats = true
    // Keep other categories off
    DevConfig.debug.layout = false
    DevConfig.debug.overflowMask = false
    DevConfig.debug.positioning = false
    DevConfig.debug.flex = false
    DevConfig.debug.vdom = false
  },

  /**
   * Debug VDOM operations
   * Enables virtual DOM mount/patch/unmount logs
   */
  debugVDOM: (): void => {
    DevConfig.debug.enabled = true
    DevConfig.debug.vdom = true
    // Keep other categories off
    DevConfig.debug.layout = false
    DevConfig.debug.overflowMask = false
    DevConfig.debug.positioning = false
    DevConfig.debug.flex = false
    DevConfig.debug.performance = false
  },

  /**
   * Enable all debug categories (verbose!)
   * Use with caution - produces lots of console output
   */
  debugAll: (): void => {
    DevConfig.debug.enabled = true
    DevConfig.debug.layout = true
    DevConfig.debug.overflowMask = true
    DevConfig.debug.flex = true
    DevConfig.debug.positioning = true
    DevConfig.debug.vdom = true
    DevConfig.debug.performance = true
    DevConfig.visual.showOverflowMasks = true
    DevConfig.visual.maskFillColor = 0xff00ff
    DevConfig.visual.maskAlpha = 0.3
    DevConfig.performance.logQueueStats = true
  },
}
