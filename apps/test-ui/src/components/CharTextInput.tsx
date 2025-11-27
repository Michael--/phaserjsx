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
        opacity: '0',
        pointerEvents: 'none',
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
  const [internalValue, setInternalValue] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [selectionStart, setSelectionStart] = useState(-1)
  const [selectionEnd, setSelectionEnd] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)

  // Use controlled value if provided
  const currentValue = props.value !== undefined ? props.value : internalValue
  const isControlled = props.value !== undefined

  /**
   * Setup keyboard input manager
   */
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    inputManagerRef.current = new KeyboardInputManager(container, {
      ...(props.maxLength !== undefined && { maxLength: props.maxLength }),
      ...(props.disabled !== undefined && { disabled: props.disabled }),
      onInput: (value, _event) => {
        // Handle input changes
        if (isControlled) {
          props.onChange?.(value)
        } else {
          setInternalValue(value)
          props.onChange?.(value)
        }

        // Move cursor to end
        setCursorPosition(value.length)
        setSelectionStart(-1)
        setSelectionEnd(-1)
      },
      onKeyDown: (event) => {
        // Handle special keys
        if (event.key === 'Enter') {
          if (!props.multiline) {
            event.preventDefault()
            props.onSubmit?.(currentValue)
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
        }
      },
      onFocus: () => {
        setIsFocused(true)
        props.onFocus?.()
      },
      onBlur: () => {
        setIsFocused(false)
        setSelectionStart(-1)
        setSelectionEnd(-1)
        props.onBlur?.()
      },
    })

    // Sync DOM input value with current value
    inputManagerRef.current.setValue(currentValue)

    return () => {
      inputManagerRef.current?.destroy()
      inputManagerRef.current = null
    }
  }, [
    containerRef.current,
    props.maxLength,
    props.disabled,
    props.multiline,
    isControlled,
    currentValue,
  ])

  /**
   * Handle backspace key
   */
  const handleBackspace = (event: KeyboardEvent) => {
    event.preventDefault()

    if (selectionStart >= 0 && selectionEnd > selectionStart) {
      // Delete selection
      const newValue = currentValue.slice(0, selectionStart) + currentValue.slice(selectionEnd)
      updateValue(newValue)
      setCursorPosition(selectionStart)
      setSelectionStart(-1)
      setSelectionEnd(-1)
    } else if (cursorPosition > 0) {
      // Delete character before cursor
      const newValue =
        currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition)
      updateValue(newValue)
      setCursorPosition(cursorPosition - 1)
    }
  }

  /**
   * Handle delete key
   */
  const handleDelete = (event: KeyboardEvent) => {
    event.preventDefault()

    if (selectionStart >= 0 && selectionEnd > selectionStart) {
      // Delete selection
      const newValue = currentValue.slice(0, selectionStart) + currentValue.slice(selectionEnd)
      updateValue(newValue)
      setCursorPosition(selectionStart)
      setSelectionStart(-1)
      setSelectionEnd(-1)
    } else if (cursorPosition < currentValue.length) {
      // Delete character after cursor
      const newValue =
        currentValue.slice(0, cursorPosition) + currentValue.slice(cursorPosition + 1)
      updateValue(newValue)
    }
  }

  /**
   * Handle arrow left key
   */
  const handleArrowLeft = (event: KeyboardEvent) => {
    event.preventDefault()

    if (event.shiftKey) {
      // Extend selection
      if (selectionStart < 0) {
        setSelectionStart(cursorPosition)
        setSelectionEnd(cursorPosition)
      }
      if (cursorPosition > 0) {
        setCursorPosition(cursorPosition - 1)
        if (cursorPosition - 1 < selectionStart) {
          setSelectionStart(cursorPosition - 1)
        } else {
          setSelectionEnd(cursorPosition - 1)
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
  }

  /**
   * Handle arrow right key
   */
  const handleArrowRight = (event: KeyboardEvent) => {
    event.preventDefault()

    if (event.shiftKey) {
      // Extend selection
      if (selectionStart < 0) {
        setSelectionStart(cursorPosition)
        setSelectionEnd(cursorPosition)
      }
      if (cursorPosition < currentValue.length) {
        setCursorPosition(cursorPosition + 1)
        if (cursorPosition + 1 > selectionEnd) {
          setSelectionEnd(cursorPosition + 1)
        } else {
          setSelectionStart(cursorPosition + 1)
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
    setSelectionStart(-1)
    setSelectionEnd(-1)
    setCursorPosition(currentValue.length)
  }

  /**
   * Handle select all (Ctrl+A / Cmd+A)
   */
  const handleSelectAll = (event: KeyboardEvent) => {
    event.preventDefault()
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

  return (
    <CharText
      ref={containerRef}
      {...viewProps}
      text={currentValue || props.placeholder || ''}
      showCursor={isFocused}
      cursorPosition={cursorPosition}
      selectionStart={selectionStart}
      selectionEnd={selectionEnd}
      onCursorPositionChange={handleCursorPositionChange}
      onSelectionChange={handleSelectionChange}
    />
  )
}
