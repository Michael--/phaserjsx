/**
 * DOM input element manager for text input overlay
 * Handles creation, positioning, and lifecycle of DOM input elements
 */
import type Phaser from 'phaser'

/**
 * Configuration for DOM input element
 */
export interface DOMInputConfig {
  /** Input type (text, password, email, etc.) */
  type?: string
  /** Placeholder text */
  placeholder?: string
  /** Initial value */
  value?: string
  /** Whether input is disabled */
  disabled?: boolean
  /** Maximum length of input */
  maxLength?: number
  /** Autocomplete behavior */
  autocomplete?: string
  /** Autocorrect behavior (Safari) */
  autocorrect?: string
  /** Autocapitalize behavior (mobile) */
  autocapitalize?: string
  /** Spellcheck behavior */
  spellcheck?: boolean
  /** CSS styles to apply */
  styles?: Partial<CSSStyleDeclaration>
  /** Input event callback */
  onInput?: (value: string, event: Event) => void
  /** Keyboard event callbacks */
  onKeyDown?: (event: KeyboardEvent) => void
  onKeyUp?: (event: KeyboardEvent) => void
  /** Focus event callbacks */
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

/**
 * DOM input element wrapper with automatic positioning
 */
export class DOMInputElement {
  private input: HTMLInputElement
  private container: Phaser.GameObjects.Container
  private scene: Phaser.Scene
  private scrollHandler: () => void
  private resizeHandler: () => void
  private throttledScrollHandler: () => void
  private throttledResizeHandler: () => void
  private intersectionObserver: IntersectionObserver | null = null
  private isDestroyed = false
  private lastValues = { left: 0, top: 0, width: 0, height: 0 }
  private counter = 0
  private scrollThrottleTimeout: number | null = null
  private resizeThrottleTimeout: number | null = null

  constructor(container: Phaser.GameObjects.Container, config: DOMInputConfig = {}) {
    this.container = container
    this.scene = container.scene

    // Create input element
    this.input = document.createElement('input')
    this.input.type = config.type ?? 'text'
    if (config.placeholder) this.input.placeholder = config.placeholder
    if (config.value) this.input.value = config.value
    if (config.disabled) this.input.disabled = config.disabled
    if (config.maxLength) this.input.maxLength = config.maxLength
    if (config.autocomplete) this.input.setAttribute('autocomplete', config.autocomplete)
    if (config.autocorrect) this.input.setAttribute('autocorrect', config.autocorrect)
    if (config.autocapitalize) this.input.setAttribute('autocapitalize', config.autocapitalize)
    if (config.spellcheck !== undefined)
      this.input.setAttribute('spellcheck', config.spellcheck.toString())

    // Apply default styles
    this.applyDefaultStyles()

    // Apply custom styles
    if (config.styles) {
      Object.assign(this.input.style, config.styles)
    }

    // Add to DOM - use document.body for absolute positioning
    document.body.appendChild(this.input)

    // Setup event listeners
    if (config.onInput) {
      this.input.addEventListener('input', (e) => {
        config.onInput?.(this.input.value, e)
      })
    }

    if (config.onKeyDown) {
      this.input.addEventListener('keydown', config.onKeyDown)
    }

    if (config.onKeyUp) {
      this.input.addEventListener('keyup', config.onKeyUp)
    }

    if (config.onFocus) {
      this.input.addEventListener('focus', (e) => {
        config.onFocus?.(e)
      })
    }

    if (config.onBlur) {
      this.input.addEventListener('blur', (e) => {
        config.onBlur?.(e)
      })
    }

    // Initial position update
    this.updatePosition()

    // Bind handlers for page scrolling and resizing
    this.scrollHandler = this.updatePosition.bind(this)
    this.resizeHandler = this.updatePosition.bind(this)

    // Throttled handlers to limit update frequency
    this.throttledScrollHandler = this.throttle(this.scrollHandler, 20) // ~50fps max
    this.throttledResizeHandler = this.throttle(this.resizeHandler, 20) // ~50fps max

    // Setup event listeners immediately (always active)
    // Use capture phase to catch scroll events from any scrollable ancestor
    document.addEventListener('scroll', this.throttledScrollHandler, {
      passive: true,
      capture: true,
    })
    window.addEventListener('resize', this.throttledResizeHandler, { passive: true })

    // Setup IntersectionObserver to detect when canvas moves in viewport
    this.setupIntersectionObserver()

    // Cleanup on container destroy
    this.container.once('destroy', () => {
      this.destroy()
    })

    // Cleanup on scene shutdown
    this.scene.events.once('shutdown', () => {
      this.destroy()
    })
  }

  /**
   * Setup IntersectionObserver to detect canvas position changes
   */
  private setupIntersectionObserver(): void {
    const canvas = this.scene.game.canvas

    this.intersectionObserver = new IntersectionObserver(
      () => {
        // Canvas moved in viewport, update position
        this.updatePosition()
      },
      {
        threshold: [0, 0.1, 0.5, 0.9, 1.0], // Trigger on various visibility changes
      }
    )

    this.intersectionObserver.observe(canvas)
  }

  /**
   * Throttle function to limit call frequency
   * @param func - Function to throttle
   * @param delay - Minimum delay between calls in ms
   * @returns Throttled function
   */
  private throttle(func: () => void, delay: number): () => void {
    let timeoutId: number | null = null
    return () => {
      if (timeoutId !== null) return
      timeoutId = window.setTimeout(() => {
        func()
        timeoutId = null
      }, delay)
    }
  }

  /**
   * Apply default styles to input element
   */
  private applyDefaultStyles(): void {
    Object.assign(this.input.style, {
      position: 'absolute',
      pointerEvents: 'auto',
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      padding: '0px',
      margin: '0px',
      border: 'none',
      borderRadius: '0px',
      backgroundColor: 'transparent',
      color: 'transparent',
      outline: 'none',
      caretColor: 'transparent',
    } as Partial<CSSStyleDeclaration>)

    // Inject CSS to disable selection highlighting
    const styleId = 'phaserjsx-input-no-selection'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        input[type="text"]::selection,
        input[type="password"]::selection,
        input[type="email"]::selection {
          background: transparent !important;
          color: transparent !important;
        }
      `
      document.head.appendChild(style)
    }
  }

  /**
   * Update input element position to match Phaser container
   */
  private updatePosition(): void {
    if (this.isDestroyed || !this.container.scene) return

    const canvas = this.scene.game.canvas
    const canvasRect = canvas.getBoundingClientRect()

    // Get container world position
    const worldTransform = this.container.getWorldTransformMatrix()
    const worldX = worldTransform.tx
    const worldY = worldTransform.ty

    // Get fixed container dimensions from layout props instead of bounds
    // This prevents size from changing based on content
    const layoutProps = (
      this.container as typeof this.container & {
        __layoutProps?: { width?: number; height?: number }
      }
    ).__layoutProps
    const containerWidth = layoutProps?.width ?? 200
    const containerHeight = layoutProps?.height ?? 40

    // Calculate position relative to canvas
    const scale = this.scene.game.scale
    const zoom = this.scene.cameras.main.zoom

    // Calculate position and size with proper scaling
    const left = Math.round(canvasRect.left + worldX * zoom * scale.displayScale.x)
    const top = Math.round(canvasRect.top + worldY * zoom * scale.displayScale.y)
    const width = Math.round(containerWidth * zoom * scale.displayScale.x)
    const height = Math.round(containerHeight * zoom * scale.displayScale.y)
    this.counter++

    // apply only if changed to minimize layout thrashing
    if (
      this.lastValues.left === left &&
      this.lastValues.top === top &&
      this.lastValues.width === width &&
      this.lastValues.height === height
    ) {
      return
    }
    this.lastValues = { left, top, width, height }

    /* // Debug output for testing purposes
    console.log('[DOMInputElement] Updating position', {
      counter: this.counter,
      left,
      top,
      width,
      height,
    })
    */

    // Apply position and size
    this.input.style.left = `${left}px`
    this.input.style.top = `${top}px`
    this.input.style.width = `${width}px`
    this.input.style.height = `${height}px`
  }

  /**
   * Get the DOM input element
   */
  getElement(): HTMLInputElement {
    return this.input
  }

  /**
   * Set input value
   */
  setValue(value: string): void {
    if (!this.isDestroyed) {
      this.input.value = value
    }
  }

  /**
   * Get input value
   */
  getValue(): string {
    return this.isDestroyed ? '' : this.input.value
  }

  /**
   * Focus the input
   */
  focus(): void {
    if (!this.isDestroyed) {
      this.input.focus()
    }
  }

  /**
   * Blur the input
   */
  blur(): void {
    if (!this.isDestroyed) {
      this.input.blur()
    }
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    if (!this.isDestroyed) {
      this.input.disabled = disabled
    }
  }

  /**
   * Set placeholder
   */
  setPlaceholder(placeholder: string): void {
    if (!this.isDestroyed) {
      this.input.placeholder = placeholder
    }
  }

  /**
   * Update styles
   */
  setStyles(styles: Partial<CSSStyleDeclaration>): void {
    if (!this.isDestroyed) {
      Object.assign(this.input.style, styles)
    }
  }

  /**
   * Destroy the input element and cleanup
   */
  destroy(): void {
    if (this.isDestroyed) return
    this.isDestroyed = true

    // Clear any pending throttle timeouts
    if (this.scrollThrottleTimeout !== null) {
      clearTimeout(this.scrollThrottleTimeout)
    }
    if (this.resizeThrottleTimeout !== null) {
      clearTimeout(this.resizeThrottleTimeout)
    }

    // Disconnect IntersectionObserver
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
      this.intersectionObserver = null
    }

    // Remove event listeners
    document.removeEventListener('scroll', this.throttledScrollHandler, { capture: true })
    window.removeEventListener('resize', this.throttledResizeHandler)

    // Remove from DOM
    if (this.input.parentElement) {
      this.input.parentElement.removeChild(this.input)
    }
  }
}
