import type * as PhaserJSX from '@phaserjsx/ui'
import {
  DOMInputElement,
  getThemedProps,
  Text,
  useEffect,
  useRef,
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
  const textRef = useRef<Phaser.GameObjects.Text | null>(null)
  const cursorTweenRef = useRef<Phaser.Tweens.Tween | null>(null)

  const width = props.width ?? 200
  const height = props.height ?? 40

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
        paddingLeft: '12px',
        paddingRight: '12px',
      } as Partial<CSSStyleDeclaration>,
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

  // Setup cursor and sync cursor position
  useEffect(() => {
    if (!containerRef.current || !containerRef.current.scene) return

    const scene = containerRef.current.scene

    // Create blinking cursor
    const paddingVertical =
      (0.8 * (height - (themed.textStyle?.fontSize ? parseInt(themed.textStyle.fontSize) : 16))) / 2
    const cursor = scene.add.rectangle(
      12, // Initial x (padding)
      paddingVertical,
      2,
      height - paddingVertical * 2, // Cursor height (slightly smaller than container)
      0xffffff
    )
    cursor.setOrigin(0, 0)
    cursor.setAlpha(1)
    containerRef.current.add(cursor)
    cursorRef.current = cursor

    // Blinking animation
    const tween = scene.tweens.add({
      targets: cursor,
      alpha: { from: 1, to: 0 },
      duration: 530,
      yoyo: true,
      repeat: -1,
    })
    cursorTweenRef.current = tween

    // Sync cursor position on input/selection change
    const updateCursorPosition = () => {
      const input = inputRef.current?.getElement()
      const text = textRef.current
      if (!input || !text || !cursor) return

      const cursorIndex = input.selectionStart ?? 0
      const textBeforeCursor = (props.value ?? '').substring(0, cursorIndex)

      // Calculate text width up to cursor position
      const tempText = scene.add.text(0, 0, textBeforeCursor, {
        fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
        fontSize: themed.textStyle?.fontSize ?? '16px',
      })
      const textWidth = tempText.width
      tempText.destroy()

      // Position cursor (12px is left padding)
      cursor.x = 12 + textWidth

      // Reset blink animation
      cursor.setAlpha(1)
      if (tween.isPlaying() || tween.isPaused()) {
        tween.restart()
      }
    }

    // Update cursor on input events
    const input = inputRef.current?.getElement()
    if (input) {
      input.addEventListener('input', updateCursorPosition)
      input.addEventListener('keydown', updateCursorPosition)
      input.addEventListener('keyup', updateCursorPosition)
      input.addEventListener('click', updateCursorPosition)
      input.addEventListener('focus', () => {
        cursor.setVisible(true)
        if (tween.isPlaying() || tween.isPaused()) {
          tween.restart()
        }
      })
      input.addEventListener('blur', () => {
        cursor.setVisible(false)
        if (tween.isPlaying()) {
          tween.pause()
        }
      })
    }

    // Initial position
    updateCursorPosition()

    return () => {
      tween.stop()
      cursor.destroy()
      cursorRef.current = null
      cursorTweenRef.current = null
    }
  }, [
    containerRef.current,
    textRef.current,
    inputRef.current,
    props.value,
    height,
    themed.textStyle?.fontFamily,
    themed.textStyle?.fontSize,
  ])

  // get the text to display, text when existing (length > 0), otherwise placeholder
  const text = props.value && props.value.length > 0 ? props.value : props.placeholder

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
      padding={{ left: 12, right: 12 }}
    >
      <Text
        ref={textRef}
        text={text ?? ''}
        style={{
          fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
          fontSize: themed.textStyle?.fontSize ?? '16px',
          color: themed.textStyle?.color ?? '#ffffff',
        }}
      />
    </View>
  )
}
