/**
 * Tooltip applier for component patching
 * Manages native Phaser text tooltip rendering with animations
 */
import Phaser from 'phaser'
import type { HoverEventData } from '../../gestures/gesture-types'
import { themeRegistry } from '../../theme'
import type { TooltipCallback, TooltipConfig } from '../../tooltip/tooltip-types'

/**
 * Internal state for tooltip management per container
 */
interface TooltipState {
  isVisible: boolean
  tooltip: Phaser.GameObjects.Container | null
  activeTweens: Phaser.Tweens.Tween[]
  showTimer: NodeJS.Timeout | null
  hideTimer: NodeJS.Timeout | null
  autoDismissTimer: NodeJS.Timeout | null
  currentConfig: TooltipConfig | null
}

// Map to store tooltip state for each container
const tooltipStates = new Map<Phaser.GameObjects.Container, TooltipState>()

/**
 * Calculate tooltip position based on target bounds and preferred position
 * Auto-adjusts if tooltip would go out of viewport bounds
 */
function calculateTooltipPosition(
  targetBounds: Phaser.Geom.Rectangle,
  position: 'top' | 'bottom' | 'left' | 'right',
  offset: number,
  tooltipWidth: number,
  tooltipHeight: number
): { x: number; y: number } {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  let x = 0
  let y = 0

  switch (position) {
    case 'top':
      x = targetBounds.centerX - tooltipWidth / 2
      y = targetBounds.top - tooltipHeight - offset
      break
    case 'bottom':
      x = targetBounds.centerX - tooltipWidth / 2
      y = targetBounds.bottom + offset
      break
    case 'left':
      x = targetBounds.left - tooltipWidth - offset
      y = targetBounds.centerY - tooltipHeight / 2
      break
    case 'right':
      x = targetBounds.right + offset
      y = targetBounds.centerY - tooltipHeight / 2
      break
  }

  // Clamp to viewport bounds (with small padding)
  x = Math.max(8, Math.min(x, viewport.width - tooltipWidth - 8))
  y = Math.max(8, Math.min(y, viewport.height - tooltipHeight - 8))

  return { x, y }
}

/**
 * Show native Phaser text tooltip with animations
 */
function showTooltip(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  config: TooltipConfig
): void {
  const state = tooltipStates.get(container)
  if (!state || state.isVisible) return

  state.isVisible = true
  state.currentConfig = config

  const theme = themeRegistry.getGlobalTheme()
  const tooltipTheme = theme.Tooltip || {}

  const position = config.position ?? tooltipTheme.position ?? 'top'
  const offset = config.offset ?? tooltipTheme.offset ?? 8

  const content = config.content

  // Get target bounds
  const targetBounds = container.getBounds()

  // Create text without background first to measure
  const textStyle: Phaser.Types.GameObjects.Text.TextStyle = tooltipTheme.textStyle ?? {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#ffffff',
    padding: { x: 8, y: 4 },
  }

  // Remove backgroundColor from textStyle, we'll draw it manually
  const { backgroundColor: bgColor, ...styleWithoutBg } = textStyle

  const text = scene.add.text(0, 0, content, styleWithoutBg)
  text.setOrigin(0.5)

  // Measure text with padding
  const padding = textStyle.padding ?? { x: 8, y: 4 }
  const paddingX = typeof padding === 'number' ? padding : (padding.x ?? 8)
  const paddingY = typeof padding === 'number' ? padding : (padding.y ?? 4)
  const textWidth = text.width
  const textHeight = text.height
  const bgWidth = textWidth + paddingX * 2
  const bgHeight = textHeight + paddingY * 2

  // Create rounded background
  const cornerRadius = tooltipTheme.cornerRadius ?? 6
  const graphics = scene.add.graphics()

  // Parse background color
  const bg = bgColor ?? '#000000dd'
  let fillColor = 0x000000
  let fillAlpha = 0.87

  if (typeof bg === 'string') {
    if (bg.startsWith('#')) {
      // Handle hex with optional alpha
      const hex = bg.slice(1)
      if (hex.length === 8) {
        fillColor = parseInt(hex.slice(0, 6), 16)
        fillAlpha = parseInt(hex.slice(6, 8), 16) / 255
      } else if (hex.length === 6) {
        fillColor = parseInt(hex, 16)
        fillAlpha = 1
      }
    }
  }

  graphics.fillStyle(fillColor, fillAlpha)
  graphics.fillRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, cornerRadius)

  // Create container for background + text
  const tooltipContainer = scene.add.container(0, 0, [graphics, text])
  tooltipContainer.setDepth(10000)

  // Measure container bounds
  const textBounds = tooltipContainer.getBounds()

  // Calculate position
  const pos = calculateTooltipPosition(
    targetBounds,
    position,
    offset,
    textBounds.width,
    textBounds.height
  )

  // Animation config - merge config with theme defaults
  const themeAnim = tooltipTheme.animation || {}
  const anim = config.animation || {}
  const fadeInDuration = anim.fadeIn ?? themeAnim.fadeIn ?? 200
  const moveOffset = {
    dx: anim.move?.dx ?? themeAnim.move?.dx ?? 0,
    dy: anim.move?.dy ?? themeAnim.move?.dy ?? 0,
  }
  const pulse = anim.pulse ?? themeAnim.pulse ?? false
  const pulseScale = anim.pulseScale ?? [0.75, 1.25]

  // Set initial position (with move offset if enabled)
  tooltipContainer.setPosition(
    pos.x + textBounds.width / 2 - moveOffset.dx,
    pos.y + textBounds.height / 2 - moveOffset.dy
  )
  tooltipContainer.setAlpha(0)

  state.tooltip = tooltipContainer

  // Fade in animation
  const fadeTween = scene.tweens.add({
    targets: tooltipContainer,
    alpha: 1,
    x: pos.x + textBounds.width / 2,
    y: pos.y + textBounds.height / 2,
    duration: fadeInDuration,
    ease: 'Cubic.Out',
  })
  state.activeTweens.push(fadeTween)

  // Pulse animation
  if (pulse) {
    const pulseTween = scene.tweens.add({
      targets: tooltipContainer,
      scale: { from: pulseScale[0], to: pulseScale[1] },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    })
    state.activeTweens.push(pulseTween)
  }

  // Auto-dismiss timer if configured
  if (config.autoDismiss && config.autoDismiss > 0) {
    state.autoDismissTimer = setTimeout(() => {
      hideTooltip(container)
    }, config.autoDismiss)
  }
}

/**
 * Hide tooltip for a container
 */
function hideTooltip(container: Phaser.GameObjects.Container): void {
  const state = tooltipStates.get(container)
  if (!state || !state.isVisible) return

  state.isVisible = false
  const config = state.currentConfig
  state.currentConfig = null

  // Clear auto-dismiss timer
  if (state.autoDismissTimer) {
    clearTimeout(state.autoDismissTimer)
    state.autoDismissTimer = null
  }

  if (!state.tooltip) return

  const tooltip = state.tooltip
  const scene = tooltip.scene

  // Get theme defaults for fade out
  const theme = themeRegistry.getGlobalTheme()
  const tooltipTheme = theme.Tooltip || {}
  const themeAnim = tooltipTheme.animation || {}
  const anim = config?.animation || {}
  const fadeOutDuration = anim.fadeOut ?? themeAnim.fadeOut ?? 200

  // Stop all existing tweens
  state.activeTweens.forEach((tween) => tween.stop())
  state.activeTweens = []

  // Fade out animation
  scene.tweens.add({
    targets: tooltip,
    alpha: 0,
    duration: fadeOutDuration,
    ease: 'Cubic.In',
    onComplete: () => {
      tooltip.destroy()
    },
  })

  state.tooltip = null
}

/**
 * Apply tooltip functionality to a container
 * Sets up hover handlers and manages tooltip lifecycle
 */
export function applyTooltip(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  nextCallback: TooltipCallback | undefined,
  existingOnHoverStart?: (data: HoverEventData) => void,
  existingOnHoverEnd?: (data: HoverEventData) => void
): {
  onHoverStart: (data: HoverEventData) => void
  onHoverEnd: (data: HoverEventData) => void
} {
  // Initialize state if needed
  if (!tooltipStates.has(container)) {
    tooltipStates.set(container, {
      isVisible: false,
      tooltip: null,
      activeTweens: [],
      showTimer: null,
      hideTimer: null,
      autoDismissTimer: null,
      currentConfig: null,
    })

    // Cleanup on container destroy
    container.once('destroy', () => {
      const state = tooltipStates.get(container)
      if (state) {
        if (state.showTimer) clearTimeout(state.showTimer)
        if (state.hideTimer) clearTimeout(state.hideTimer)
        if (state.autoDismissTimer) clearTimeout(state.autoDismissTimer)
        state.activeTweens.forEach((tween) => tween.stop())
        hideTooltip(container)
        tooltipStates.delete(container)
      }
    })
  }

  const state = tooltipStates.get(container)
  if (!state) {
    throw new Error('applyTooltip: state not initialized')
  }

  const theme = themeRegistry.getGlobalTheme()
  const tooltipTheme = theme.Tooltip || {}

  // Create hover handlers
  const onHoverStart = (data: HoverEventData) => {
    // Call existing handler if present
    if (existingOnHoverStart) existingOnHoverStart(data)

    // Get tooltip config
    if (!nextCallback) return

    const result = nextCallback()
    if (!result) return // null/undefined = no tooltip

    const config: TooltipConfig = typeof result === 'string' ? { content: result } : result

    if (config.disabled) return

    // Clear any pending hide/auto-dismiss timers
    if (state.hideTimer) {
      clearTimeout(state.hideTimer)
      state.hideTimer = null
    }
    if (state.autoDismissTimer) {
      clearTimeout(state.autoDismissTimer)
      state.autoDismissTimer = null
    }

    // Start show timer
    const showDelay = config.showDelay ?? tooltipTheme.showDelay ?? 500
    state.showTimer = setTimeout(() => {
      showTooltip(scene, container, config)
    }, showDelay)
  }

  const onHoverEnd = (data: HoverEventData) => {
    // Call existing handler if present
    if (existingOnHoverEnd) existingOnHoverEnd(data)

    // Clear any pending show timer
    if (state.showTimer) {
      clearTimeout(state.showTimer)
      state.showTimer = null
    }

    // Start hide timer
    const hideDelay = state.currentConfig?.hideDelay ?? tooltipTheme.hideDelay ?? 0
    if (hideDelay > 0) {
      state.hideTimer = setTimeout(() => {
        hideTooltip(container)
      }, hideDelay)
    } else {
      hideTooltip(container)
    }
  }

  return { onHoverStart, onHoverEnd }
}
