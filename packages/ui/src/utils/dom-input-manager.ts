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
  private updateBound: () => void
  private isDestroyed = false

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

    // Apply default styles
    this.applyDefaultStyles()

    // Apply custom styles
    if (config.styles) {
      Object.assign(this.input.style, config.styles)
    }

    // Add to DOM
    const canvas = this.scene.game.canvas
    const parent = canvas.parentElement
    if (parent) {
      parent.appendChild(this.input)
    }

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
      this.input.addEventListener('focus', config.onFocus)
    }

    if (config.onBlur) {
      this.input.addEventListener('blur', config.onBlur)
    }

    // Initial position update
    this.updatePosition()

    // Bind update function for continuous positioning
    this.updateBound = this.updatePosition.bind(this)
    this.scene.events.on('postupdate', this.updateBound)

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
    const left = canvasRect.left + worldX * zoom * scale.displayScale.x
    const top = canvasRect.top + worldY * zoom * scale.displayScale.y
    const width = containerWidth * zoom * scale.displayScale.x
    const height = containerHeight * zoom * scale.displayScale.y

    // Apply position and size
    this.input.style.left = `${left}px`
    this.input.style.top = `${top}px`
    this.input.style.width = `${width}px`
    this.input.style.height = `${height}px`
    this.input.style.lineHeight = `${height}px`
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

    // Remove event listener
    this.scene.events.off('postupdate', this.updateBound)

    // Remove from DOM
    if (this.input.parentElement) {
      this.input.parentElement.removeChild(this.input)
    }
  }
}
