import type * as PhaserJSX from '@phaserjsx/ui'
import {
  DOMInputElement,
  useEffect,
  useRef,
  useState,
  type DOMInputConfig,
  type ViewProps,
} from '@phaserjsx/ui'
import { CharText } from './CharText'

/**
 * Manages hidden DOM input for keyboard events
 */
class KeyboardInputManager {
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

/**
 * CharTextInput theme configuration
 */
type CharTextInputTheme = PhaserJSX.ViewTheme & {
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  charSpacing?: number
  cursorColor?: number
  cursorWidth?: number
  cursorBlinkSpeed?: number
  selectionColor?: number
  selectionAlpha?: number
  lineHeight?: number
  wordWrap?: boolean
  focusedBorderColor?: number
  disabledColor?: number
}

// Module augmentation
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    CharTextInput: CharTextInputTheme
  }
}

/**
 * Props for CharTextInput component
 */
export interface CharTextInputProps extends Omit<ViewProps, 'children'> {
  /** Input value (controlled) */
  value?: string

  /** Placeholder text when empty */
  placeholder?: string

  /** Whether input is disabled */
  disabled?: boolean

  /** Maximum length of input */
  maxLength?: number

  /** Enable multi-line text input */
  multiline?: boolean

  /** Text style for characters */
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle

  /** Spacing between characters */
  charSpacing?: number

  /** Line height multiplier for multi-line */
  lineHeight?: number

  /** Maximum number of lines (multi-line only) */
  maxLines?: number

  /** How to handle text overflow when maxLines is reached */
  textOverflow?: 'clip' | 'ellipsis'

  /** Word wrap behavior (default: true) */
  wordWrap?: boolean

  /** Cursor color */
  cursorColor?: number

  /** Cursor width in pixels */
  cursorWidth?: number

  /** Cursor blink speed in milliseconds */
  cursorBlinkSpeed?: number

  /** Selection background color */
  selectionColor?: number

  /** Selection background alpha */
  selectionAlpha?: number

  /** show html input area */
  debugHtmlInput?: boolean

  /** Called when input value changes */
  onChange?: (value: string) => void

  /** Called when input receives focus */
  onFocus?: () => void

  /** Called when input loses focus */
  onBlur?: () => void

  /** Called when Enter key is pressed */
  onSubmit?: (value: string) => void
}

/**
 * CharTextInput component - text input using CharText for rendering
 * @param props - CharTextInput properties
 * @returns CharTextInput JSX element
 */
export function CharTextInput(props: CharTextInputProps) {
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const inputManagerRef = useRef<KeyboardInputManager | null>(null)

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(props.value ?? '')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [selectionStart, setSelectionStart] = useState(-1)
  const [selectionEnd, setSelectionEnd] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)

  // Refs for current values (used in event handlers to avoid stale closures)
  const refCurrentValue = useRef(props.value ?? '')
  const refCursorPosition = useRef(0)
  const refSelectionStart = useRef(-1)
  const refSelectionEnd = useRef(-1)

  // Use controlled value if provided
  const currentValue = props.value !== undefined ? props.value : internalValue
  const isControlled = props.value !== undefined

  // Sync refs with state
  refCurrentValue.current = currentValue
  refCursorPosition.current = cursorPosition
  refSelectionStart.current = selectionStart
  refSelectionEnd.current = selectionEnd

  /**
   * Setup keyboard input manager
   */
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    inputManagerRef.current = new KeyboardInputManager(container, {
      ...(props.maxLength !== undefined && { maxLength: props.maxLength }),
      ...(props.disabled !== undefined && { disabled: props.disabled }),
      debug: props.debugHtmlInput,
      onInput: (_value, _event) => {
        // Ignored - we handle all input via onKeyDown
      },
      onKeyDown: (event) => {
        // Handle special keys
        if (event.key === 'Enter') {
          if (!props.multiline) {
            event.preventDefault()
            props.onSubmit?.(refCurrentValue.current)
          } else {
            // TODO: handle multi-line enter
            event.preventDefault()
          }
        } else if (event.key === 'Backspace') {
          handleBackspace(event)
        } else if (event.key === 'Delete') {
          handleDelete(event)
        } else if (event.key === 'ArrowLeft') {
          handleArrowLeft(event)
        } else if (event.key === 'ArrowRight') {
          handleArrowRight(event)
        } else if (event.key === 'Home') {
          handleHome(event)
        } else if (event.key === 'End') {
          handleEnd(event)
        } else if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
          handleSelectAll(event)
        } else if (isPrintableKey(event)) {
          // Handle printable characters
          event.preventDefault()
          handleCharacterInput(event.key)
        }
        // TODO: Copy/Paste with Ctrl+C/V or Cmd+C/V
      },
      onFocus: () => {
        setIsFocused(true)
        inputManagerRef.current?.setPointerEvents(false)
        setCursorPosition(currentValue.length)
        props.onFocus?.()
      },
      onBlur: () => {
        setIsFocused(false)
        setSelectionStart(-1)
        setSelectionEnd(-1)
        inputManagerRef.current?.setPointerEvents(true)
        props.onBlur?.()
      },
    })

    // Sync DOM input value with current value
    inputManagerRef.current.setValue(currentValue)

    return () => {
      inputManagerRef.current?.destroy()
      inputManagerRef.current = null
    }
  }, [containerRef.current, props.maxLength, props.disabled, props.multiline, isControlled])

  /**
   * Sync DOM input value when currentValue changes
   */
  useEffect(() => {
    if (inputManagerRef.current) {
      inputManagerRef.current.setValue(currentValue)
    }
  }, [currentValue])

  /**
   * Check if key event represents a printable character
   */
  const isPrintableKey = (event: KeyboardEvent): boolean => {
    // Ignore if modifier keys are pressed (except Shift)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return false
    }

    // Single printable character
    if (event.key.length === 1) {
      return true
    }

    return false
  }

  /**
   * Handle printable character input
   */
  const handleCharacterInput = (char: string) => {
    const currentValue = refCurrentValue.current
    const cursorPosition = refCursorPosition.current
    const selStart = refSelectionStart.current
    const selEnd = refSelectionEnd.current

    let newValue: string
    let newCursorPos: number

    if (selStart >= 0 && selEnd > selStart) {
      // Replace selection with new character
      newValue = currentValue.slice(0, selStart) + char + currentValue.slice(selEnd)
      newCursorPos = selStart + char.length
    } else {
      // Insert at cursor position
      newValue = currentValue.slice(0, cursorPosition) + char + currentValue.slice(cursorPosition)
      newCursorPos = cursorPosition + char.length
    }

    updateValue(newValue)
    setCursorPosition(newCursorPos)
    setSelectionStart(-1)
    setSelectionEnd(-1)

    // Sync DOM input cursor
    setTimeout(() => {
      const element = inputManagerRef.current?.['domInput']?.getElement()
      if (element) {
        element.selectionStart = element.selectionEnd = newCursorPos
      }
    }, 0)
  }

  /**
   * Handle backspace key
   */
  const handleBackspace = (event: KeyboardEvent) => {
    event.preventDefault()

    const currentValue = refCurrentValue.current
    const cursorPosition = refCursorPosition.current
    const selStart = refSelectionStart.current
    const selEnd = refSelectionEnd.current

    if (selStart >= 0 && selEnd > selStart) {
      // Delete selection
      const newValue = currentValue.slice(0, selStart) + currentValue.slice(selEnd)
      updateValue(newValue)
      setCursorPosition(selStart)
      setSelectionStart(-1)
      setSelectionEnd(-1)

      // Sync DOM input cursor
      setTimeout(() => {
        const element = inputManagerRef.current?.['domInput']?.getElement()
        if (element) {
          element.selectionStart = element.selectionEnd = selStart
        }
      }, 0)
    } else if (cursorPosition > 0) {
      // Delete character before cursor
      const newValue =
        currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition)
      updateValue(newValue)
      const newPos = cursorPosition - 1
      setCursorPosition(newPos)

      // Sync DOM input cursor
      setTimeout(() => {
        const element = inputManagerRef.current?.['domInput']?.getElement()
        if (element) {
          element.selectionStart = element.selectionEnd = newPos
        }
      }, 0)
    }
  }

  /**
   * Handle delete key
   */
  const handleDelete = (event: KeyboardEvent) => {
    event.preventDefault()

    const currentValue = refCurrentValue.current
    const cursorPosition = refCursorPosition.current
    const selStart = refSelectionStart.current
    const selEnd = refSelectionEnd.current

    if (selStart >= 0 && selEnd > selStart) {
      // Delete selection
      const newValue = currentValue.slice(0, selStart) + currentValue.slice(selEnd)
      updateValue(newValue)
      setCursorPosition(selStart)
      setSelectionStart(-1)
      setSelectionEnd(-1)

      // Sync DOM input cursor
      setTimeout(() => {
        const element = inputManagerRef.current?.['domInput']?.getElement()
        if (element) {
          element.selectionStart = element.selectionEnd = selStart
        }
      }, 0)
    } else if (cursorPosition < currentValue.length) {
      // Delete character after cursor
      const newValue =
        currentValue.slice(0, cursorPosition) + currentValue.slice(cursorPosition + 1)
      updateValue(newValue)

      // Cursor stays at same position
      // Sync DOM input cursor
      setTimeout(() => {
        const element = inputManagerRef.current?.['domInput']?.getElement()
        if (element) {
          element.selectionStart = element.selectionEnd = cursorPosition
        }
      }, 0)
    }
  }

  /**
   * Handle arrow left key
   */
  const handleArrowLeft = (event: KeyboardEvent) => {
    event.preventDefault()

    const cursorPosition = refCursorPosition.current
    const selStart = refSelectionStart.current

    if (event.shiftKey) {
      // Extend selection
      if (selStart < 0) {
        setSelectionStart(cursorPosition)
        setSelectionEnd(cursorPosition)
      }
      if (cursorPosition > 0) {
        const newPos = cursorPosition - 1
        setCursorPosition(newPos)
        if (newPos < selStart) {
          setSelectionStart(newPos)
        } else {
          setSelectionEnd(newPos)
        }
      }
    } else {
      // Move cursor
      setSelectionStart(-1)
      setSelectionEnd(-1)
      if (cursorPosition > 0) {
        setCursorPosition(cursorPosition - 1)
      }
    }

    // Sync DOM input cursor position
    const element = inputManagerRef.current?.['domInput']?.getElement()
    if (element) {
      element.selectionStart = element.selectionEnd = Math.max(0, cursorPosition - 1)
    }
  }

  /**
   * Handle arrow right key
   */
  const handleArrowRight = (event: KeyboardEvent) => {
    event.preventDefault()

    const currentValue = refCurrentValue.current
    const cursorPosition = refCursorPosition.current
    const selStart = refSelectionStart.current
    const selEnd = refSelectionEnd.current

    if (event.shiftKey) {
      // Extend selection
      if (selStart < 0) {
        setSelectionStart(cursorPosition)
        setSelectionEnd(cursorPosition)
      }
      if (cursorPosition < currentValue.length) {
        const newPos = cursorPosition + 1
        setCursorPosition(newPos)
        if (newPos > selEnd) {
          setSelectionEnd(newPos)
        } else {
          setSelectionStart(newPos)
        }
      }
    } else {
      // Move cursor
      setSelectionStart(-1)
      setSelectionEnd(-1)
      if (cursorPosition < currentValue.length) {
        setCursorPosition(cursorPosition + 1)
      }
    }

    // Sync DOM input cursor position
    const element = inputManagerRef.current?.['domInput']?.getElement()
    if (element) {
      element.selectionStart = element.selectionEnd = Math.min(
        currentValue.length,
        cursorPosition + 1
      )
    }
  }

  /**
   * Handle home key
   */
  const handleHome = (event: KeyboardEvent) => {
    event.preventDefault()
    setSelectionStart(-1)
    setSelectionEnd(-1)
    setCursorPosition(0)
  }

  /**
   * Handle end key
   */
  const handleEnd = (event: KeyboardEvent) => {
    event.preventDefault()
    const currentValue = refCurrentValue.current
    setSelectionStart(-1)
    setSelectionEnd(-1)
    setCursorPosition(currentValue.length)
  }

  /**
   * Handle select all (Ctrl+A / Cmd+A)
   */
  const handleSelectAll = (event: KeyboardEvent) => {
    event.preventDefault()
    const currentValue = refCurrentValue.current
    setSelectionStart(0)
    setSelectionEnd(currentValue.length)
    setCursorPosition(currentValue.length)
  }

  /**
   * Update value (controlled or uncontrolled)
   */
  const updateValue = (newValue: string) => {
    if (isControlled) {
      props.onChange?.(newValue)
    } else {
      setInternalValue(newValue)
      props.onChange?.(newValue)
    }
    inputManagerRef.current?.setValue(newValue)
  }

  /**
   * Handle cursor position change from CharText click
   */
  const handleCursorPositionChange = (position: number) => {
    setCursorPosition(position)
    setSelectionStart(-1)
    setSelectionEnd(-1)

    // Focus DOM input
    inputManagerRef.current?.focus()
  }

  /**
   * Handle selection change from CharText drag
   */
  const handleSelectionChange = (start: number, end: number) => {
    if (start >= 0 && end > start) {
      setSelectionStart(start)
      setSelectionEnd(end)
      setCursorPosition(end)
    } else {
      setSelectionStart(-1)
      setSelectionEnd(-1)
    }

    // Focus DOM input
    inputManagerRef.current?.focus()
  }

  // Build CharText props - extract CharTextInput-specific props and pass rest to CharText
  const {
    value: _value,
    placeholder: _placeholder,
    onChange: _onChange,
    onFocus: _onFocus,
    onBlur: _onBlur,
    onSubmit: _onSubmit,
    ...viewProps
  } = props

  // Determine displayed text: actual value, or placeholder if empty and not focused
  const displayText = currentValue // ?? (props.placeholder && !isFocused ? props.placeholder : '')

  return (
    <CharText
      forwardRef={(r) => (containerRef.current = r)}
      {...viewProps}
      text={displayText}
      showCursor={isFocused}
      cursorPosition={cursorPosition}
      selectionStart={selectionStart}
      selectionEnd={selectionEnd}
      onCursorPositionChange={handleCursorPositionChange}
      onSelectionChange={handleSelectionChange}
    />
  )
}
