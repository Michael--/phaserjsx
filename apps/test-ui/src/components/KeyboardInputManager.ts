import { DOMInputElement, type DOMInputConfig } from '@phaserjsx/ui'

/**
 * Manages hidden DOM input for keyboard events
 */
export class KeyboardInputManager {
  private domInput: DOMInputElement | null = null
  private container: Phaser.GameObjects.Container
  private config: {
    onInput?: (value: string, event: Event) => void
    onKeyDown?: (event: KeyboardEvent) => void
    onKeyUp?: (event: KeyboardEvent) => void
    onFocus?: () => void
    onBlur?: () => void
    maxLength?: number
    disabled?: boolean
    debug?: boolean | undefined
  }

  constructor(
    container: Phaser.GameObjects.Container,
    config: {
      onInput?: (value: string, event: Event) => void
      onKeyDown?: (event: KeyboardEvent) => void
      onKeyUp?: (event: KeyboardEvent) => void
      onFocus?: () => void
      onBlur?: () => void
      maxLength?: number
      disabled?: boolean
      debug?: boolean | undefined
    }
  ) {
    this.container = container
    this.config = config
    this.create()
  }

  /**
   * Create hidden DOM input element
   */
  private create(): void {
    const debugStyle: Partial<CSSStyleDeclaration> = this.config.debug
      ? {
          opacity: '0.3',
          backgroundColor: 'rgba(0,0,0,0.3)',
          border: '4px dashed red',
          color: 'white',
        }
      : {}

    const domConfig: DOMInputConfig = {
      type: 'text',
      value: '',
      ...(this.config.disabled !== undefined && { disabled: this.config.disabled }),
      ...(this.config.maxLength !== undefined && { maxLength: this.config.maxLength }),
      onInput: (value, event) => {
        this.config.onInput?.(value, event)
      },
      onKeyDown: (event) => {
        this.config.onKeyDown?.(event)
      },
      onKeyUp: (event) => {
        this.config.onKeyUp?.(event)
      },
      onFocus: () => {
        this.config.onFocus?.()
      },
      onBlur: () => {
        this.config.onBlur?.()
      },
      styles: {
        // need to debug until successful at all
        opacity: '0.0',
        // pointerEvents: 'none',
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        ...debugStyle,
      } as Partial<CSSStyleDeclaration>,
      autocomplete: 'off',
      autocorrect: 'off',
      autocapitalize: 'off',
      spellcheck: false,
    }

    this.domInput = new DOMInputElement(this.container, domConfig)
  }

  /**
   * Update DOM input value programmatically
   */
  setValue(value: string): void {
    const element = this.domInput?.getElement()
    if (element) {
      element.value = value
    }
  }

  /**
   * Focus the DOM input
   */
  focus(): void {
    const element = this.domInput?.getElement()
    if (element) {
      element.focus()
    }
  }

  /**
   * Blur the DOM input
   */
  blur(): void {
    const element = this.domInput?.getElement()
    if (element) {
      element.blur()
    }
  }

  /**
   * Check if DOM input is focused
   */
  isFocused(): boolean {
    const element = this.domInput?.getElement()
    return element === document.activeElement
  }

  /**
   * Set pointer events (auto when not focused, none when focused)
   */
  setPointerEvents(enabled: boolean): void {
    const element = this.domInput?.getElement()
    if (element) {
      element.style.pointerEvents = enabled ? 'auto' : 'none'
    }
  }

  /**
   * Destroy the DOM input
   */
  destroy(): void {
    this.domInput?.destroy()
    this.domInput = null
  }
}
