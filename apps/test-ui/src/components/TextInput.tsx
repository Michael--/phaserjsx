import type * as PhaserJSX from '@phaserjsx/ui'
import {
  DOMInputElement,
  getThemedProps,
  Text,
  useEffect,
  useRef,
  useState,
  View,
  type DOMInputConfig,
  type InputEventData,
  type KeyboardEventData,
} from '@phaserjsx/ui'

/**
 * TextInput theme configuration
 */
type TextInputTheme = PhaserJSX.ViewTheme & {
  textStyle?: {
    fontFamily?: string
    fontSize?: string
    color?: string
  }
  focusedBorderColor?: number
  disabledColor?: number
}

// Module augmentation to add TextInput theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    TextInput: TextInputTheme
  }
}

/**
 * Props for TextInput component
 */
export interface TextInputProps {
  /** Input value (controlled) */
  value?: string
  /** Placeholder text */
  placeholder?: string
  /** Input type (text, password, email, etc.) */
  type?: string
  /** Whether input is disabled */
  disabled?: boolean
  /** Maximum length of input */
  maxLength?: number
  /** Width of input */
  width?: number
  /** Height of input */
  height?: number
  /** Called when input value changes */
  onChange?: (event: InputEventData) => void
  /** Called when key is pressed */
  onKeyDown?: (event: KeyboardEventData) => void
  /** Called when key is released */
  onKeyUp?: (event: KeyboardEventData) => void
  /** Called when input receives focus */
  onFocus?: () => void
  /** Called when input loses focus */
  onBlur?: () => void
  /** Called when Enter key is pressed */
  onSubmit?: (value: string) => void
}

/**
 * TextInput component with DOM overlay for native keyboard support
 * @param props - TextInput properties
 * @returns TextInput JSX element
 */
export function TextInput(props: TextInputProps) {
  const { props: themed } = getThemedProps('TextInput', undefined, {})
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const inputRef = useRef<DOMInputElement | null>(null)
  const cursorRef = useRef<Phaser.GameObjects.Rectangle | null>(null)
  const selectionRef = useRef<Phaser.GameObjects.Rectangle | null>(null)
  const textRef = useRef<Phaser.GameObjects.Text | null>(null)
  const cursorTweenRef = useRef<Phaser.Tweens.Tween | null>(null)
  const [internalValue, setInternalValue] = useState('')
  const valueRef = useRef('')

  const width = props.width ?? 200
  const height = props.height ?? 40

  // Layout constants
  const horizontalPadding = 12
  const cursorWidth = 2
  const textBuffer = 10 // Buffer to prevent text from touching edges

  // Use controlled value if provided, otherwise use internal state
  const currentValue = props.value !== undefined ? props.value : internalValue

  // Keep valueRef in sync with currentValue
  valueRef.current = currentValue

  // Setup DOM input element
  useEffect(() => {
    if (!containerRef.current) return

    const config: DOMInputConfig = {
      type: props.type ?? 'text',
      // ...(props.placeholder !== undefined && { placeholder: props.placeholder }),
      value: props.value ?? '',
      ...(props.disabled !== undefined && { disabled: props.disabled }),
      ...(props.maxLength !== undefined && { maxLength: props.maxLength }),
      onInput: (value, event) => {
        // Get current value from ref (not from closure)
        const previousValue = valueRef.current

        // Check maxLength first (character limit)
        if (props.maxLength && value.length > props.maxLength) {
          // Silently reject input beyond maxLength - don't call onChange
          event.preventDefault()
          const input = inputRef.current?.getElement()
          if (input) {
            input.value = previousValue
          }
          return // Exit early, don't update state or call onChange
        }

        // Check if text would exceed visual width
        const scene = containerRef.current?.scene
        if (scene && textRef.current) {
          // Calculate display text (masked for password)
          let displayText = value
          if (props.type === 'password') {
            displayText = '\u2022'.repeat(value.length)
          }

          // Check visual width
          const tempText = scene.add.text(0, 0, displayText, {
            fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
            fontSize: themed.textStyle?.fontSize ?? '16px',
          })
          const textWidth = tempText.width
          tempText.destroy()

          // Max width = container width - left padding - right padding - cursor width - buffer
          const maxTextWidth =
            width - horizontalPadding - horizontalPadding - cursorWidth - textBuffer

          if (textWidth > maxTextWidth) {
            // Text is too wide, silently reject input - don't call onChange
            event.preventDefault()
            const input = inputRef.current?.getElement()
            if (input) {
              input.value = previousValue
            }
            return // Exit early, don't update state or call onChange
          }
        }

        // Accept the input - update internal state if uncontrolled
        if (props.value === undefined) {
          setInternalValue(value)
        }

        // Only call onChange if we accepted the input
        if (props.onChange) {
          const inputEventData: InputEventData = {
            value,
            event,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          }
          props.onChange(inputEventData)
        }
      },
      onKeyDown: (event) => {
        if (props.onKeyDown) {
          const keyboardEventData: KeyboardEventData = {
            event,
            key: event.key,
            code: event.code,
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            metaKey: event.metaKey,
            repeat: event.repeat,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          }
          props.onKeyDown(keyboardEventData)
        }

        // Handle Enter key for submit
        if (event.key === 'Enter' && props.onSubmit) {
          const input = inputRef.current?.getElement()
          if (input) {
            props.onSubmit(input.value)
          }
        }
      },
      onKeyUp: (event) => {
        if (props.onKeyUp) {
          const keyboardEventData: KeyboardEventData = {
            event,
            key: event.key,
            code: event.code,
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            metaKey: event.metaKey,
            repeat: event.repeat,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          }
          props.onKeyUp(keyboardEventData)
        }
      },
      onFocus: () => {
        props.onFocus?.()
      },
      onBlur: () => {
        props.onBlur?.()
      },
      styles: {
        fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
        fontSize: themed.textStyle?.fontSize ?? '16px',
        paddingLeft: `${horizontalPadding}px`,
        paddingRight: `${horizontalPadding}px`,
      } as Partial<CSSStyleDeclaration>,
      // Disable browser features
      autocomplete: 'off',
      autocorrect: 'off',
      autocapitalize: 'off',
      spellcheck: false,
    }

    inputRef.current = new DOMInputElement(containerRef.current, config)

    return () => {
      inputRef.current?.destroy()
      inputRef.current = null
    }
  }, [
    containerRef.current,
    props.type,
    props.placeholder,
    props.disabled,
    props.maxLength,
    themed.textStyle?.fontFamily,
    themed.textStyle?.fontSize,
    themed.textStyle?.color,
    themed.backgroundColor,
    themed.borderColor,
    themed.borderWidth,
    themed.cornerRadius,
    themed.disabledColor,
  ])

  // Update value when props change
  useEffect(() => {
    if (inputRef.current && props.value !== undefined) {
      inputRef.current.setValue(props.value)
    }
  }, [props.value])

  // Ensure text renders above selection highlight
  useEffect(() => {
    if (textRef.current) {
      textRef.current.setDepth(0) // Above selection (-1)
    }
  }, [textRef.current])

  // Setup cursor and sync cursor position
  useEffect(() => {
    if (!containerRef.current || !containerRef.current.scene) return

    const scene = containerRef.current.scene

    // Create blinking cursor (hidden initially until focus)
    const paddingVertical =
      (0.8 * (height - (themed.textStyle?.fontSize ? parseInt(themed.textStyle.fontSize) : 16))) / 2
    const cursor = scene.add.rectangle(
      horizontalPadding, // Initial x
      paddingVertical,
      cursorWidth,
      height - paddingVertical * 2, // Cursor height (slightly smaller than container)
      0xffffff
    )
    cursor.setOrigin(0, 0)
    cursor.setAlpha(1)
    cursor.setVisible(false) // Hidden initially
    containerRef.current.add(cursor)
    cursorRef.current = cursor

    // Create selection highlight rectangle (behind text)
    const selection = scene.add.rectangle(
      horizontalPadding,
      paddingVertical,
      0, // Width will be calculated dynamically
      height - paddingVertical * 2,
      0x4a9eff,
      0.3 // Semi-transparent
    )
    selection.setOrigin(0, 0)
    selection.setVisible(false)
    selection.setDepth(-1) // Behind text
    containerRef.current.add(selection)
    selectionRef.current = selection

    // Blinking animation
    const tween = scene.tweens.add({
      targets: cursor,
      alpha: { from: 1, to: 0 },
      duration: 530,
      yoyo: true,
      repeat: -1,
    })
    cursorTweenRef.current = tween

    // Sync cursor and selection position on input/selection change
    const updateCursorPosition = () => {
      const input = inputRef.current?.getElement()
      const text = textRef.current
      const selection = selectionRef.current
      if (!input || !text || !cursor || !selection) return

      const cursorIndex = input.selectionStart ?? 0
      const selectionEnd = input.selectionEnd ?? 0
      const hasSelection = cursorIndex !== selectionEnd

      // console.log('selection', { cursorIndex, selectionEnd })

      // Get displayed text (masked for password) up to cursor position
      let displayedTextBeforeCursor: string
      if (props.type === 'password') {
        displayedTextBeforeCursor = '•'.repeat(cursorIndex)
      } else {
        displayedTextBeforeCursor = currentValue.substring(0, cursorIndex)
      }

      // Calculate text width up to cursor position using DISPLAYED text
      const tempText = scene.add.text(0, 0, displayedTextBeforeCursor, {
        fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
        fontSize: themed.textStyle?.fontSize ?? '16px',
      })
      const textWidth = tempText.width
      tempText.destroy()

      // Position cursor
      cursor.x = horizontalPadding + textWidth

      // Check if cursor would exceed container width
      const maxCursorX = width - horizontalPadding - cursorWidth
      if (cursor.x > maxCursorX) {
        cursor.x = maxCursorX
      }

      // Handle selection highlight
      if (hasSelection) {
        const selectionStart = Math.min(cursorIndex, selectionEnd)
        const selectionEndPos = Math.max(cursorIndex, selectionEnd)

        // Calculate selection dimensions
        let displayedTextBeforeSelection: string
        let displayedSelectedText: string

        if (props.type === 'password') {
          displayedTextBeforeSelection = '\u2022'.repeat(selectionStart)
          displayedSelectedText = '\u2022'.repeat(selectionEndPos - selectionStart)
        } else {
          displayedTextBeforeSelection = currentValue.substring(0, selectionStart)
          displayedSelectedText = currentValue.substring(selectionStart, selectionEndPos)
        }

        const tempTextBefore = scene.add.text(0, 0, displayedTextBeforeSelection, {
          fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
          fontSize: themed.textStyle?.fontSize ?? '16px',
        })
        const widthBefore = tempTextBefore.width
        tempTextBefore.destroy()

        const tempTextSelected = scene.add.text(0, 0, displayedSelectedText, {
          fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
          fontSize: themed.textStyle?.fontSize ?? '16px',
        })
        const selectionWidth = tempTextSelected.width
        tempTextSelected.destroy()

        selection.x = horizontalPadding + widthBefore
        selection.width = selectionWidth
        selection.setVisible(true)
        cursor.setVisible(false) // Hide cursor when selecting
      } else {
        selection.setVisible(false)
        cursor.setVisible(input === document.activeElement) // Show cursor only if focused
      }

      // Reset blink animation (only if cursor is visible)
      if (!hasSelection) {
        cursor.setAlpha(1)
        if (tween.isPlaying() || tween.isPaused()) {
          tween.restart()
        }
      }
    }

    // Update cursor on input events
    const input = inputRef.current?.getElement()
    if (input) {
      input.addEventListener('input', updateCursorPosition)
      input.addEventListener('keydown', updateCursorPosition)
      input.addEventListener('keyup', updateCursorPosition)
      input.addEventListener('click', updateCursorPosition)
      input.addEventListener('mouseup', updateCursorPosition)
      input.addEventListener('select', updateCursorPosition)
      input.addEventListener('focus', () => {
        cursor.setVisible(true)
        if (tween.isPlaying() || tween.isPaused()) {
          tween.restart()
        }
      })
      input.addEventListener('blur', () => {
        cursor.setVisible(false)
        selection.setVisible(false)
        if (tween.isPlaying()) {
          tween.pause()
        }
      })
    }

    // Don't update position initially - cursor is hidden until focus
    // updateCursorPosition() is called on focus event

    return () => {
      tween.stop()
      cursor.destroy()
      selection.destroy()
      cursorRef.current = null
      selectionRef.current = null
      cursorTweenRef.current = null
    }
  }, [
    containerRef.current,
    textRef.current,
    inputRef.current,
    currentValue,
    props.type,
    props.maxLength,
    width,
    height,
    themed.textStyle?.fontFamily,
    themed.textStyle?.fontSize,
  ])

  // Get the text to display
  let displayText: string
  if (currentValue.length > 0) {
    // Mask password with bullets
    if (props.type === 'password') {
      displayText = '•'.repeat(currentValue.length)
    } else {
      displayText = currentValue
    }
  } else {
    displayText = props.placeholder ?? ''
  }

  return (
    <View
      ref={containerRef}
      width={width}
      height={height}
      backgroundColor={
        props.disabled
          ? (themed.disabledColor ?? themed.backgroundColor)
          : (themed.backgroundColor ?? 0x2a2a2a)
      }
      borderColor={themed.borderColor ?? 0x666666}
      borderWidth={themed.borderWidth ?? 2}
      cornerRadius={typeof themed.cornerRadius === 'number' ? themed.cornerRadius : 4}
      justifyContent={'center'}
      alignItems={'start'}
      padding={{ left: horizontalPadding, right: horizontalPadding }}
    >
      <Text
        ref={textRef}
        text={displayText}
        style={{
          fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
          fontSize: themed.textStyle?.fontSize ?? '16px',
          color: themed.textStyle?.color ?? '#ffffff',
        }}
      />
    </View>
  )
}
